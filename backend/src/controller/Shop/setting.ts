import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

// ==========================================
// Get Shop Profile
// ==========================================
export const getShopProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: shop, error } = await supabase
      .from("print_shop")
      .select(
        `
        id,
        shop_name,
        owner_name,
        email,
        phone,
        profile_image,
        open_time,
        close_time,
        is_verify,
        is_open,
        address:address_id (
          id,
          detail,
          subdistrict,
          district,
          province,
          postcode
        )
      `
      )
      .eq("id", shop_id)
      .single();

    if (error || !shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    return res.status(200).json({ data: shop });
  } catch (err) {
    console.error("Get Shop Profile Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Bank Account
// ==========================================
export const getBankAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: bankAccount, error } = await supabase
      .from("bank_account")
      .select("id, bank_name, account_name, account_number")
      .eq("shop_id", shop_id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data: bankAccount });
  } catch (err) {
    console.error("Get Bank Account Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Shop Services
// ==========================================
export const getShopServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: services, error } = await supabase
      .from("service_type")
      .select(
        `
        id,
        type,
        service_detail (
          id,
          detail,
          price,
          group_type
        )
      `
      )
      .eq("shop_id", shop_id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data: services ?? [] });
  } catch (err) {
    console.error("Get Shop Services Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Check Shop Verification Status
// ==========================================
export const checkShopVerified = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: shop, error } = await supabase
      .from("print_shop")
      .select("id, is_verify, verified_by")
      .eq("id", shop_id)
      .single();

    if (error || !shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    return res.status(200).json({
      data: {
        is_verify: Boolean(shop.is_verify),
        verified_by: shop.verified_by ?? null,
      },
    });
  } catch (err) {
    console.error("Check Shop Verified Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Toggle Open/Close Shop Status
// ==========================================
export const setShopOpenStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
    const { is_open } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (typeof is_open !== "boolean") {
      return res.status(400).json({ error: "is_open must be true or false" });
    }

    const { data: shop, error } = await supabase
      .from("print_shop")
      .update({ is_open })
      .eq("id", shop_id)
      .select("id, is_open")
      .single();

    if (error || !shop) {
      console.error("Set shop open status error:", error);
      return res.status(404).json({ error: "Shop not found" });
    }

    return res.status(200).json({ data: shop });
  } catch (err) {
    console.error("Set Shop Open Status Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Save/Update Shop Services
// ==========================================
export const saveShopServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id as string) || req.body.shop_id;
    const { services } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (!Array.isArray(services)) {
      return res.status(400).json({ error: "Invalid services format" });
    }

    // 1. ดึง service_type เก่าเพื่อลบรายละเอียดย่อย (service_detail) ออกก่อน
    const { data: oldTypes } = await supabase
      .from("service_type")
      .select("id")
      .eq("shop_id", shop_id);

    if (oldTypes && oldTypes.length > 0) {
      const typeIds = oldTypes.map((t) => t.id);
      await supabase.from("service_detail").delete().in("service_type_id", typeIds);
      await supabase.from("service_type").delete().eq("shop_id", shop_id);
    }

    // 2. บันทึกข้อมูล service_type และ service_detail ใหม่
    for (const service of services) {
      if (!service.type) continue;

      const { data: newType, error: typeErr } = await supabase
        .from("service_type")
        .insert({ shop_id, type: service.type })
        .select("id")
        .single();

      if (typeErr || !newType) {
        console.error("Insert service_type error:", typeErr);
        continue;
      }

      if (Array.isArray(service.service_detail) && service.service_detail.length > 0) {
        const detailsToInsert = service.service_detail
          .filter((d: any) => d.detail)
          .map((d: any) => ({
            service_type_id: newType.id,
            detail: d.detail,
            group_type: d.group_type || "ตัวเลือกทั่วไป",
            price: Number(d.price) || 0,
          }));

        if (detailsToInsert.length > 0) {
          const { error: detailErr } = await supabase
            .from("service_detail")
            .insert(detailsToInsert);

          if (detailErr) {
            console.error("Insert service_detail error:", detailErr);
          }
        }
      }
    }

    return res.status(200).json({ message: "Services saved successfully" });
  } catch (err) {
    console.error("Save Shop Services Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Update Shop Profile & Address
// ==========================================
export const updateShopProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
    const { shop_name, owner_name, phone, open_time, close_time, address } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    let address_id = address?.id;

    // 1. ถ้าส่งข้อมูล Address มา ให้ทำการ Insert หรือ Update ตาราง address
    if (address) {
      if (address_id) {
        const { error: updateAddrErr } = await supabase
          .from("address")
          .update({
            detail: address.detail,
            subdistrict: address.subdistrict,
            district: address.district,
            province: address.province,
            postcode: address.postcode,
          })
          .eq("id", address_id);

        if (updateAddrErr) {
          console.error("Update Address Error:", updateAddrErr);
        }
      } else {
        const { data: newAddr, error: addrErr } = await supabase
          .from("address")
          .insert({
            detail: address.detail,
            subdistrict: address.subdistrict,
            district: address.district,
            province: address.province,
            postcode: address.postcode,
          })
          .select("id")
          .single();

        if (!addrErr && newAddr) {
          address_id = newAddr.id;
        } else {
          console.error("Insert Address Error:", addrErr);
        }
      }
    }

    // 2. อัปเดตข้อมูลตาราง print_shop
    const updateData: Record<string, any> = {
      shop_name,
      owner_name,
      phone,
      open_time,
      close_time,
    };

    if (address_id) {
      updateData.address_id = address_id;
    }

    const { error: shopErr } = await supabase
      .from("print_shop")
      .update(updateData)
      .eq("id", shop_id);

    if (shopErr) {
      return res.status(400).json({ error: shopErr.message });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Shop Profile Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Update Bank Account
// ==========================================
export const updateBankAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
    const { id, bank_name, account_name, account_number } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (id) {
      // อัปเดตบัญชีเดิม
      const { error } = await supabase
        .from("bank_account")
        .update({ bank_name, account_name, account_number })
        .eq("id", id)
        .eq("shop_id", shop_id);

      if (error) return res.status(400).json({ error: error.message });
    } else {
      // เพิ่มบัญชีใหม่
      // NOTE: shop_id เป็น uuid (string) ไม่ใช่ number ห้าม Number(shop_id)
      // เพราะจะได้ NaN แล้ว insert พัง
      const { error } = await supabase
        .from("bank_account")
        .insert({ shop_id, bank_name, account_name, account_number });

      if (error) return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Bank account updated successfully" });
  } catch (err) {
    console.error("Update Bank Account Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};