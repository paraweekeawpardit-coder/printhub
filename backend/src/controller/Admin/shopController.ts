import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/shops/pending
 * ดึงรายการร้านค้าที่รออนุมัติ (is_verify = false) พร้อมข้อมูลที่อยู่ (address)
 */
export const getPendingShops = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*, address:address_id(*)")
      .eq("is_verify", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetPendingShops Error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(shops ?? []);
  } catch (err: any) {
    console.error("GetPendingShops Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * GET /api/admin/shops/all
 * ดึงข้อมูลร้านค้าทั้งหมดในระบบที่อนุมัติแล้ว (is_verify = true) พร้อมข้อมูลที่อยู่ (address)
 */
export const getAllShops = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*, address:address_id(*)")
      .eq("is_verify", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetAllShops Error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(shops ?? []);
  } catch (err: any) {
    console.error("GetAllShops Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/shops/verify
 * อนุมัติหรือปฏิเสธคำขอเปิดร้านค้า
 */
export const verifyShop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id, action, admin_id, verified_by } = req.body;

    if (!shop_id || !action) {
      return res
        .status(400)
        .json({ error: "shop_id and action are required" });
    }

    const isApproved = action === "approve";

    // 📌 1. ดึง adminId จาก req.user หรือ req.body
    let adminId = (req as any).user?.id || admin_id || verified_by || null;

    // 📌 2. ป้องกัน NULL: หากยังไม่มี adminId ให้ดึง ID ของ Admin รายการแรกใน DB มาใช้แทน
    if (isApproved && !adminId) {
      const { data: adminData } = await supabase
        .from("admin")
        .select("id")
        .limit(1)
        .single();

      if (adminData) {
        adminId = adminData.id;
      }
    }

    // 📌 3. อัปเดตข้อมูลลงฐานข้อมูล
    const updatePayload = {
      is_verify: isApproved,
      status: isApproved ? "approved" : "rejected",
      verified_by: isApproved ? adminId : null,
    };

    const { data: updatedShop, error } = await supabase
      .from("print_shop")
      .update(updatePayload)
      .eq("id", shop_id)
      .select("*, address:address_id(*)")
      .single();

    if (error) {
      console.error("VerifyShop DB Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: `Shop registration ${action}ed successfully`,
      data: updatedShop,
    });
  } catch (err: any) {
    console.error("VerifyShop Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/shops/suspend
 * ระงับ หรือ ปลดการระงับร้านค้า พร้อมบันทึกเหตุผล
 */
export const toggleSuspendShop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = req.body.shop_id || req.body.shopId || req.body.id;
    const { suspend, reason } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const isSuspend = suspend === true || suspend === "true";
    const newStatus = isSuspend ? "suspended" : "approved";

    // 📌 อัปเดตสถานะร้านค้าในตาราง print_shop
    const { data: updatedShop, error } = await supabase
      .from("print_shop")
      .update({
        status: newStatus,
        suspend_reason: isSuspend ? reason : null,
      })
      .eq("id", shop_id)
      .select("*, address:address_id(*)")
      .single();

    if (error) {
      console.error("ToggleSuspendShop DB Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    // 📌 หากเป็นการปลดระงับ ให้ปรับสถานะคำร้องขอปลดระงับที่รอดำเนินการ (pending) ให้เป็น approved
    if (!isSuspend) {
      await supabase
        .from("shop_appeals")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("shop_id", shop_id)
        .eq("status", "pending");
    }

    return res.status(200).json({
      success: true,
      message: isSuspend
        ? "ระงับการใช้งานร้านค้าสำเร็จ"
        : "ปลดการระงับร้านค้าสำเร็จ",
      data: updatedShop,
    });
  } catch (err: any) {
    console.error("ToggleSuspendShop Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// จัดการคำขออนุมัติบัญชีธนาคาร (ฝั่ง Admin)
// ==========================================

/**
 * GET /api/admin/bank-accounts/pending
 * ดึงรายการบัญชีธนาคารที่รออนุมัติทั้งหมด
 */
export const getPendingBankAccounts = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: pendingList, error: pendingError } = await supabase
      .from("bank_account")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (pendingError) {
      console.error(
        "Fetch pending bank_account error:",
        pendingError.message
      );
      return res.status(500).json({ error: pendingError.message });
    }

    if (!pendingList || pendingList.length === 0) {
      return res.status(200).json([]);
    }

    const shopIds = Array.from(
      new Set(pendingList.map((item) => item.shop_id))
    );

    const { data: shops } = await supabase
      .from("print_shop")
      .select("id, shop_name, profile_image")
      .in("id", shopIds);

    const { data: previousAccounts } = await supabase
      .from("bank_account")
      .select("*")
      .in("shop_id", shopIds)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    const result = pendingList.map((pending) => {
      const shopInfo = shops?.find((s) => s.id === pending.shop_id);
      const oldAcc = previousAccounts?.find(
        (a) => a.shop_id === pending.shop_id && a.id !== pending.id
      );

      return {
        id: pending.id,
        shop_id: pending.shop_id,
        shop_name: shopInfo?.shop_name || "ไม่ระบุชื่อร้าน",
        logo_url: shopInfo?.profile_image || null,
        created_at: pending.created_at,
        old_account: oldAcc
          ? {
              bank_name: oldAcc.bank_name,
              account_number: oldAcc.account_number,
              account_name: oldAcc.account_name,
            }
          : null,
        new_account: {
          bank_name: pending.bank_name,
          account_number: pending.account_number,
          account_name: pending.account_name,
        },
      };
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("GetPendingBankAccounts Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/bank-accounts/verify
 * อนุมัติ (approve) หรือ ปฏิเสธ (reject) บัญชีธนาคาร
 */
export const approveOrRejectBankAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const targetBankId =
      req.body.bankAccountId ||
      req.body.id ||
      req.body.bank_account_id ||
      req.body.request_id;
    let targetShopId = req.body.shopId || req.body.shop_id;
    const action = req.body.action;

    if (!targetBankId || !action) {
      return res
        .status(400)
        .json({ error: "bankAccountId (or id) and action are required" });
    }

    if (!targetShopId) {
      const { data: bankRecord } = await supabase
        .from("bank_account")
        .select("shop_id")
        .eq("id", targetBankId)
        .single();

      if (bankRecord) {
        targetShopId = bankRecord.shop_id;
      }
    }

    if (action === "approve") {
      if (targetShopId) {
        await supabase
          .from("bank_account")
          .update({ status: "rejected" })
          .eq("shop_id", targetShopId)
          .eq("status", "approved");
      }

      const { data: approvedData, error: approveError } = await supabase
        .from("bank_account")
        .update({ status: "approved" })
        .eq("id", targetBankId)
        .select()
        .single();

      if (approveError) {
        return res.status(400).json({ error: approveError.message });
      }

      return res.status(200).json({
        success: true,
        message: "อนุมัติบัญชีธนาคารสำเร็จ",
        data: approvedData,
      });
    } else if (action === "reject") {
      const { data: rejectedData, error: rejectError } = await supabase
        .from("bank_account")
        .update({ status: "rejected" })
        .eq("id", targetBankId)
        .select()
        .single();

      if (rejectError) {
        return res.status(400).json({ error: rejectError.message });
      }

      return res.status(200).json({
        success: true,
        message: "ปฏิเสธคำขอเปิดบัญชีธนาคารเรียบร้อยแล้ว",
        data: rejectedData,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'approve' or 'reject'" });
    }
  } catch (err: any) {
    console.error("ApproveOrRejectBankAccount Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// ติดต่อแอดมิน / ยื่นเรื่องขอปลดระงับ (Contact Admin & Appeals)
// ==========================================

/**
 * POST /api/admin/contact-admin
 * บันทึกคำขอปลดการระงับ/ติดต่อ Admin ลงตาราง shop_appeals
 */
export const createContactAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id, subject, message } = req.body;

    if (!shop_id || !message) {
      return res
        .status(400)
        .json({ error: "shop_id and message are required" });
    }

    // 📌 เช็คว่ามีคำร้องที่รอตรวจสอบอยู่แล้วหรือไม่
    const { data: existingAppeal } = await supabase
      .from("shop_appeals")
      .select("id")
      .eq("shop_id", shop_id)
      .eq("status", "pending")
      .maybeSingle();

    if (existingAppeal) {
      return res.status(400).json({
        error: "คุณมีคำร้องขอปลดระงับที่อยู่ระหว่างรอการตรวจสอบอยู่แล้ว",
      });
    }

    const { data, error } = await supabase
      .from("shop_appeals")
      .insert([
        {
          shop_id,
          subject: subject || "ขอปลดการระงับใช้งานร้านค้า",
          message,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("CreateContactAdmin Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      success: true,
      message: "ส่งข้อความถึงผู้ดูแลระบบเรียบร้อยแล้ว",
      data,
    });
  } catch (err: any) {
    console.error("CreateContactAdmin Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/admin/shop-appeal/:shop_id
 * ดึงสถานะคำร้องล่าสุดของร้านค้า (ใช้สำหรับแสดงผลใน SuspendedBanner)
 */
export const getShopAppealStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: appeal, error } = await supabase
      .from("shop_appeals")
      .select("*")
      .eq("shop_id", shop_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("GetShopAppealStatus Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      appeal,
    });
  } catch (err: any) {
    console.error("GetShopAppealStatus Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/admin/appeals
 * ดึงรายการคำร้องขอปลดระงับทั้งหมด พร้อมข้อมูลร้านค้า
 */
export const getShopAppeals = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: appeals, error } = await supabase
      .from("shop_appeals")
      .select("*, shop:shop_id(shop_name, profile_image, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetShopAppeals Error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(appeals ?? []);
  } catch (err: any) {
    console.error("GetShopAppeals Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

export const nudgeShopAppeal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { appeal_id } = req.body;
    if (!appeal_id) {
      return res.status(400).json({ success: false, message: "Appeal ID is required" });
    }

    const { error } = await supabase
      .from("shop_appeals")
      .update({ is_nudge: true, updated_at: new Date().toISOString() })
      .eq("id", appeal_id);

    if (error) throw error;

    return res.status(200).json({ success: true, message: "Nudge updated successfully" });
  } catch (err: any) {
    console.error("Nudge Error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};