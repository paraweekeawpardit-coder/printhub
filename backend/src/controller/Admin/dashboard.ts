import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

// --- Interfaces สำหรับ Type Safety ---

interface PlatformIncomeRow {
  amount: number; // ยอดรวมที่ลูกค้าจ่าย
  net_amount: number; // ยอดที่ร้านค้าได้รับ
}

interface ShopRegistration {
  id: string;
  shop_name: string;
  created_at: string;
  status: string;
  owner_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

// --- Controller Functions ---

/**
 * GET /api/admin/dashboard-stats
 * ดึงข้อมูลสถิติภาพรวมสำหรับ Dashboard ของ Admin
 */
export const getPlatformStats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // 1. นับจำนวน Customer ทั้งหมด
    const { count: customerCount, error: customerError } = await supabase
      .from("customer")
      .select("*", { count: "exact", head: true })
      //.eq("role", "customer");

    if (customerError) throw customerError;

    // 2. นับจำนวน ร้านค้า ที่ Active ทั้งหมด
    const { count: shopCount, error: shopError } = await supabase
      .from("print_shop")
      .select("*", { count: "exact", head: true })
     // .eq("status", "active");

    if (shopError) throw shopError;

    // 3. คำนวณรายได้รวมของ Platform (ยอดสระ - ยอดที่ร้านได้)
    const { data: payments, error: paymentError } = await supabase
      .from("payment")
      .select("amount")
     // .eq("status", "completed"); // นับเฉพาะที่จ่ายสำเร็จ

    if (paymentError) throw paymentError;

    const paymentRows = (payments ?? []) as PlatformIncomeRow[];
    const totalPlatformIncome = paymentRows.reduce(
      (sum, row) => sum + (row.amount - row.net_amount),
      0
    );

    // 4. นับจำนวนคำร้องเรียนที่ยังไม่ได้แก้ไข (pending)
    const { count: pendingReports, error: reportError } = await supabase
      .from("report")
      .select("*", { count: "exact", head: true })
      //.eq("status", "pending");

    if (reportError) throw reportError;

    return res.status(200).json({
      totalCustomers: customerCount ?? 0,
      totalActiveShops: shopCount ?? 0,
      totalPlatformIncome: Number(totalPlatformIncome.toFixed(2)),
      pendingReports: pendingReports ?? 0,
    });
  } catch (err) {
    console.error("GetPlatformStats Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/admin/shops/pending
 * ดึงรายการร้านค้าที่รอการอนุมัติ (status = 'pending')
 */
export const getPendingShops = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select(
        `
        id,
        owner_name,
        shop_name,
        email,
        phone,
        profile_image,
        rating,
        is_verify,
        created_at,
        open_time,
        close_time,
        is_verify,
        verified_by
      `
      )
      .eq("is_verify", false)
      .order("created_at", { ascending: true }); // ร้านที่สมัครก่อนอยู่บน

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(shops ?? []);
  } catch (err) {
    console.error("GetPendingShops Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/shops/verify
 * อนุมัติหรือปฏิเสธการลงทะเบียนร้านค้า
 */
export const verifyShop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id, action } = req.body; // action: 'approve' หรือ 'reject'

    if (!shop_id || !action) {
      return res
        .status(400)
        .json({ error: "shop_id and action are required" });
    }

    let newStatus = false;
    if (action === "approve") {
      newStatus = true;
    } else if (action === "reject") {
      // ในความเป็นจริงอาจจะลบออก หรือเปลี่ยนสถานะเป็น rejected
      newStatus = false; 
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
    
    const { data: updatedShop, error } = await supabase
      .from("print_shop")
      .update({is_verify: newStatus })
      .eq("id", shop_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: `Shopregistration ${action}ed successfully`,
      data: updatedShop,
    });
  } catch (err) {
    console.error("VerifyShop Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/admin/reports
 * ดึงรายการคำร้องเรียน/ปัญหา ทั้งหมด
 */
export const getAllReports = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: reports, error } = await supabase
      .from("report")
      .select(
        `
        *
      `
      )
      .eq("is_verify", false)
      .order("created_at", { ascending: false });
      
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(reports ?? []);
  } catch (err) {
    console.error("GetAllReports Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/admin/transactions
 * ดึงรายการธุรกรรมการเงินทั้งหมดในระบบ
 */
export const getAllTransactions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: transactions, error, count } = await supabase
      .from("payment")
      .select("*", { count: "exact" })
      .order("payment_date", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase transaction error:", error);
      return res.status(400).json({
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }

    const formattedTransactions = (transactions ?? []).map((tx: any) => ({
      ...tx,
      platform_fee: Number(
        (tx.amount - tx.net_amount).toFixed(2)
      ),
    }));

    return res.status(200).json({
      data: formattedTransactions,
      currentPage: page,
      totalPages: count ? Math.ceil(count / limit) : 0,
      totalCount: count ?? 0,
    });
  } catch (err) {
    console.error("GetAllTransactions Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};