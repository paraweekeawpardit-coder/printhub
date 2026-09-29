import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * Helper Check สถานะการยืนยันตัวตนของร้าน
 */
const checkShopVerification = async (shop_id: string): Promise<boolean> => {
  const { data: shop } = await supabase
    .from("print_shop")
    .select("is_verify")
    .eq("id", shop_id)
    .maybeSingle();

  return Boolean(shop?.is_verify);
};

/**
 * GET /api/shop/profile/:shop_id
 */
export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.params.shop_id as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: shop, error } = await supabase
      .from("print_shop")
      .select(`
        *,
        address (*)
      `)
      .eq("id", shop_id)
      .maybeSingle();

    if (error) {
      console.error("GetProfile Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data: shop });
  } catch (err: any) {
    console.error("GetProfile Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PUT /api/shop/profile/:shop_id
 */
export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.params.shop_id as string;
    const { shop_name, owner_name, phone, open_time, close_time, address } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // 🔒 ตรวจสอบการอนุมัติร้านค้า
    const isVerified = await checkShopVerification(shop_id);
    if (!isVerified) {
      return res.status(403).json({ error: "ร้านค้าของคุณยังไม่ได้รับการอนุมัติ ไม่สามารถแก้ไขข้อมูลได้" });
    }

    // 1. อัปเดตข้อมูลร้านค้า
    const { error: shopError } = await supabase
      .from("print_shop")
      .update({
        shop_name,
        owner_name,
        phone,
        open_time,
        close_time,
      })
      .eq("id", shop_id);

    if (shopError) {
      return res.status(400).json({ error: shopError.message });
    }

    // 2. อัปเดตหรือเพิ่มที่อยู่
    if (address) {
      if (address.id) {
        const { error: addrError } = await supabase
          .from("address")
          .update({
            detail: address.detail,
            subdistrict: address.subdistrict,
            district: address.district,
            province: address.province,
            postcode: address.postcode,
          })
          .eq("id", address.id);

        if (addrError) {
          return res.status(400).json({ error: addrError.message });
        }
      } else {
        const { error: addrError } = await supabase.from("address").insert({
          shop_id,
          detail: address.detail,
          subdistrict: address.subdistrict,
          district: address.district,
          province: address.province,
          postcode: address.postcode,
        });

        if (addrError) {
          return res.status(400).json({ error: addrError.message });
        }
      }
    }

    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (err: any) {
    console.error("UpdateProfile Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/shop/bank-account/:shop_id
 */
export const getBankAccount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.params.shop_id as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: bankAccounts, error } = await supabase
      .from("bank_account")
      .select("*")
      .eq("shop_id", shop_id)
      .order("id", { ascending: false });

    if (error) {
      console.error("GetBankAccount Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!bankAccounts || bankAccounts.length === 0) {
      return res.status(200).json({ data: null });
    }

    const pendingAccount = bankAccounts.find((acc) => acc.status === "pending");
    if (pendingAccount) {
      return res.status(200).json({
        data: {
          ...pendingAccount,
          is_pending: true,
        },
      });
    }

    const approvedAccount = bankAccounts.find((acc) => acc.status === "approved");
    if (approvedAccount) {
      return res.status(200).json({
        data: {
          ...approvedAccount,
          is_pending: false,
        },
      });
    }

    return res.status(200).json({ data: null });
  } catch (err: any) {
    console.error("GetBankAccount Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PUT /api/shop/bank-account/:shop_id
 */
export const updateBankAccount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.params.shop_id as string;
    const { bank_name, account_name, accountNumber, account_number } = req.body;

    const targetAccountNumber = account_number || accountNumber;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // 🔒 ตรวจสอบการอนุมัติร้านค้า
    const isVerified = await checkShopVerification(shop_id);
    if (!isVerified) {
      return res.status(403).json({ error: "ร้านค้าของคุณยังไม่ได้รับการอนุมัติ ไม่สามารถยื่นเปลี่ยนบัญชีได้" });
    }

    if (!bank_name || !account_name || !targetAccountNumber) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลบัญชีธนาคารให้ครบถ้วน" });
    }

    const { data: existingPending } = await supabase
      .from("bank_account")
      .select("id")
      .eq("shop_id", shop_id)
      .eq("status", "pending")
      .maybeSingle();

    if (existingPending) {
      return res.status(400).json({
        error: "คุณมีคำขอเปลี่ยนบัญชีธนาคารที่กำลังรอดำเนินการอยู่ ไม่สามารถส่งคำขอเพิ่มได้ในขณะนี้",
      });
    }

    const { data: newBank, error } = await supabase
      .from("bank_account")
      .insert({
        shop_id,
        bank_name,
        account_name,
        account_number: targetAccountNumber,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("UpdateBankAccount Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "ยื่นคำขอเปลี่ยนบัญชีธนาคารเรียบร้อยแล้ว รอการอนุมัติจากผู้ดูแลระบบ",
      data: newBank,
    });
  } catch (err: any) {
    console.error("UpdateBankAccount Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/shop/open-status/:shop_id
 */
export const updateOpenStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.params.shop_id as string;
    const { is_open } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // 🔒 ตรวจสอบการอนุมัติร้านค้า
    const isVerified = await checkShopVerification(shop_id);
    if (!isVerified) {
      return res.status(403).json({ error: "ร้านค้าของคุณยังไม่ได้รับการอนุมัติ ไม่สามารถเปลี่ยนสถานะร้านได้" });
    }

    const { error } = await supabase
      .from("print_shop")
      .update({ is_open })
      .eq("id", shop_id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, is_open });
  } catch (err: any) {
    console.error("UpdateOpenStatus Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/shop/verify-status/:shop_id
 */
export const getVerifyStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.params.shop_id as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: shop, error } = await supabase
      .from("print_shop")
      .select("is_verify, status")
      .eq("id", shop_id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      data: {
        is_verify: shop?.is_verify ?? false,
        status: shop?.status ?? "pending",
      },
    });
  } catch (err: any) {
    console.error("GetVerifyStatus Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/shop/services/:shop_id
 */
export const getShopServices = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.params.shop_id as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: serviceTypes, error } = await supabase
      .from("service_type")
      .select(`
        id,
        type,
        service_detail (*)
      `)
      .eq("shop_id", shop_id);

    if (error) {
      console.error("GetShopServices Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data: serviceTypes ?? [] });
  } catch (err: any) {
    console.error("GetShopServices Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * POST /api/shop/services
 */
export const saveShopServices = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.headers.shop_id as string;
    const { services } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id header is required" });
    }

    // 🔒 ตรวจสอบการอนุมัติร้านค้า
    const isVerified = await checkShopVerification(shop_id);
    if (!isVerified) {
      return res.status(403).json({ error: "ร้านค้าของคุณยังไม่ได้รับการอนุมัติ ไม่สามารถแก้ไขบริการได้" });
    }

    if (!Array.isArray(services)) {
      return res.status(400).json({ error: "Invalid services payload" });
    }

    const { data: existingTypes } = await supabase
      .from("service_type")
      .select("id")
      .eq("shop_id", shop_id);

    if (existingTypes && existingTypes.length > 0) {
      const typeIds = existingTypes.map((t) => t.id);
      await supabase.from("service_detail").delete().in("service_type_id", typeIds);
      await supabase.from("service_type").delete().eq("shop_id", shop_id);
    }

    for (const group of services) {
      const { data: insertedType, error: typeError } = await supabase
        .from("service_type")
        .insert({
          shop_id,
          type: group.type,
        })
        .select()
        .single();

      if (typeError || !insertedType) {
        continue;
      }

      if (Array.isArray(group.service_detail) && group.service_detail.length > 0) {
        const detailsToInsert = group.service_detail.map((item: any) => ({
          service_type_id: insertedType.id,
          detail: item.detail,
          group_type: item.group_type,
          price: parseFloat(item.price) || 0,
        }));

        await supabase.from("service_detail").insert(detailsToInsert);
      }
    }

    return res.status(200).json({ success: true, message: "Services updated successfully" });
  } catch (err: any) {
    console.error("SaveShopServices Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};