import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/shops/pending
 */
export const getPendingShops = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*")
      .or("status.eq.PENDING,status.eq.pending") // 👈 กรองเฉพาะร้านที่รออนุมัติจริง
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
 * 🌟 เพิ่มใหม่: GET /api/admin/shops/all
 * ดึงข้อมูลร้านค้าทั้งหมดในระบบ
 */
export const getAllShops = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*")
      .or("status.eq.APPROVED,status.eq.ACTIVE,status.eq.approved,status.eq.active")
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
 */
export const verifyShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { shop_id, action } = req.body;

    if (!shop_id || !action) {
      return res.status(400).json({ error: "shop_id and action are required" });
    }

    const isApproved = action === "approve";
    const updateData: any = {
      is_verify: isApproved,
      status: isApproved ? "approved" : "rejected",
    };

    try {
      updateData.is_verified = isApproved;
    } catch (e) {}

    const { data: updatedShop, error } = await supabase
      .from("print_shop")
      .update(updateData)
      .eq("id", shop_id)
      .select()
      .single();

    if (error) {
      const { data: retryShop, error: retryError } = await supabase
        .from("print_shop")
        .update({ is_verify: isApproved })
        .eq("id", shop_id)
        .select()
        .single();

      if (retryError) {
        return res.status(400).json({ error: retryError.message });
      }

      return res.status(200).json({
        message: `Shop registration ${action}ed successfully`,
        data: retryShop,
      });
    }

    return res.status(200).json({
      message: `Shop registration ${action}ed successfully`,
      data: updatedShop,
    });
  } catch (err: any) {
    console.error("VerifyShop Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// 🌟 จัดการคำขออนุมัติบัญชีธนาคาร (ฝั่ง Admin)
// ==========================================

/**
 * GET /api/admin/bank-accounts/pending
 * ดึงรายการบัญชีธนาคารที่รออนุมัติทั้งหมด
 */
export const getPendingBankAccounts = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const { data, error } = await supabase
      .from("bank_account")
      .select(`
        *,
        print_shop:shop_id (
          id,
          shop_name,
          profile_image
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetPendingBankAccounts Error:", error.message);
      // คืนค่า [] เมื่อเกิด Error Table หาไม่เจอ เพื่อป้องกัน Frontend ขึ้น 400
      return res.status(200).json([]);
    }

    // 🛠️ ส่งเฉพาะ Array กลับไปโดยตรง เพื่อให้ตรงกับรูปแบบ Response ที่ Frontend คาดหวัง
    return res.status(200).json(data ?? []);
  } catch (err: any) {
    console.error("GetPendingBankAccounts Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/bank-accounts/verify
 * อนุมัติ (approve) หรือ ปฏิเสธ (reject) บัญชีธนาคาร
 */
export const approveOrRejectBankAccount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { bankAccountId, shopId, action } = req.body;

    if (!bankAccountId || !shopId || !action) {
      return res.status(400).json({ error: "bankAccountId, shopId, and action are required" });
    }

    if (action === "approve") {
      const { error: rejectOldError } = await supabase
        .from("bank_account")
        .update({ status: "rejected" })
        .eq("shop_id", shopId)
        .eq("status", "approved");

      if (rejectOldError) {
        console.error("Error setting old bank account to rejected:", rejectOldError.message);
      }

      const { data: approvedData, error: approveError } = await supabase
        .from("bank_account")
        .update({ status: "approved" })
        .eq("id", bankAccountId)
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
        .eq("id", bankAccountId)
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