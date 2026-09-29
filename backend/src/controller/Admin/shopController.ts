import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/shops/pending
 * ดึงรายการร้านค้าที่รออนุมัติ (is_verify = false) พร้อมข้อมูลที่อยู่ (address)
 */
export const getPendingShops = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*, address:address_id(*)")
      .eq("is_verify", false)
      .order("id", { ascending: false });

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
export const getAllShops = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*, address:address_id(*)")
      .eq("is_verify", true)
      .order("id", { ascending: false });

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
export const verifyShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { shop_id, action, admin_id, verified_by } = req.body;

    if (!shop_id || !action) {
      return res.status(400).json({ error: "shop_id and action are required" });
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
export const toggleSuspendShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.body.shop_id || req.body.shopId || req.body.id;
    const { suspend, reason } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const isSuspend = suspend === true || suspend === "true";
    const newStatus = isSuspend ? "suspended" : "approved";

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

    return res.status(200).json({
      success: true,
      message: isSuspend ? "ระงับการใช้งานร้านค้าสำเร็จ" : "ยกเลิกการระงับร้านค้าสำเร็จ",
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
export const getPendingBankAccounts = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const { data: pendingList, error: pendingError } = await supabase
      .from("bank_account")
      .select("*")
      .eq("status", "pending")
      .order("id", { ascending: false });

    if (pendingError) {
      console.error("Fetch pending bank_account error:", pendingError.message);
      return res.status(500).json({ error: pendingError.message });
    }

    if (!pendingList || pendingList.length === 0) {
      return res.status(200).json([]);
    }

    const shopIds = Array.from(new Set(pendingList.map((item) => item.shop_id)));

    const { data: shops } = await supabase
      .from("print_shop")
      .select("id, shop_name, profile_image")
      .in("id", shopIds);

    const { data: previousAccounts } = await supabase
      .from("bank_account")
      .select("*")
      .in("shop_id", shopIds)
      .eq("status", "approved")
      .order("id", { ascending: false });

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
export const approveOrRejectBankAccount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const targetBankId = req.body.bankAccountId || req.body.id || req.body.bank_account_id || req.body.request_id;
    let targetShopId = req.body.shopId || req.body.shop_id;
    const action = req.body.action;

    if (!targetBankId || !action) {
      return res.status(400).json({ error: "bankAccountId (or id) and action are required" });
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
      return res.status(400).json({ error: "Invalid action. Use 'approve' or 'reject'" });
    }

  } catch (err: any) {
    console.error("ApproveOrRejectBankAccount Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};