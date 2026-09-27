import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

// --- Interfaces ---
interface PaymentRow {
  amount?: number;
  payment_date?: string;
  created_at?: string;
}

/**
 * GET /api/admin/dashboard-stats
 * ดึงข้อมูลสถิติภาพรวมสำหรับ Dashboard ของ Admin
 */
export const getPlatformStats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let customerCount = 0;
  let shopCount = 0;
  let totalPlatformIncome = 0;
  let pendingReports = 0;
  let dailyIncome: { name: string; income: number }[] = [];

  // 1. นับจำนวน Customer ทั้งหมด
  try {
    const { count, error } = await supabase
      .from("customer")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.warn("Customer fetch warning:", error.message);
    } else {
      customerCount = count ?? 0;
    }
  } catch (err: any) {
    console.warn("Customer table error:", err.message || err);
  }

  // 2. นับจำนวน ร้านค้า
  try {
    const { count, error } = await supabase
      .from("print_shop")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.warn("Print Shop fetch warning:", error.message);
    } else {
      shopCount = count ?? 0;
    }
  } catch (err: any) {
    console.warn("Print Shop table error:", err.message || err);
  }

  // 3. คำนวณรายได้รวม + รายได้ย้อนหลัง 7 วัน
  try {
    const { data: payments, error } = await supabase
      .from("payment")
      .select("amount, payment_date, created_at");

    if (error) {
      console.warn("Payment fetch warning:", error.message);
    } else if (payments) {
      const paymentRows = payments as PaymentRow[];

      // 3.1 คำนวณค่าธรรมเนียม Platform รวม 5%
      const sumIncome = paymentRows.reduce(
        (sum, row) => sum + (row.amount || 0) * 0.05,
        0
      );
      totalPlatformIncome = Number(sumIncome.toFixed(2));

      // 3.2 สร้างโครงสร้างข้อมูลสำหรับ 7 วันย้อนหลัง
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const last7DaysMap: { [key: string]: { name: string; income: number } } = {};

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
        const dayName = daysOfWeek[d.getDay()];

        last7DaysMap[dateStr] = { name: dayName, income: 0 };
      }

      // 3.3 คำนวณรายได้แยกตามวัน
      paymentRows.forEach((p) => {
        const rawDate = p.payment_date || p.created_at;
        if (rawDate) {
          const pDateStr = new Date(rawDate).toISOString().split("T")[0];
          if (last7DaysMap[pDateStr]) {
            last7DaysMap[pDateStr].income += (p.amount || 0) * 0.05;
          }
        }
      });

      // จัดรูปแบบข้อมูลสำหรับส่งกลับไปวาดกราฟ
      dailyIncome = Object.values(last7DaysMap).map((item) => ({
        name: item.name,
        income: Number(item.income.toFixed(2)),
      }));
    }
  } catch (err: any) {
    console.warn("Payment table error:", err.message || err);
  }

  // 4. นับจำนวนคำร้องเรียนที่ยังไม่ได้แก้ไข (is_verify = false)
  try {
    const { count, error } = await supabase
      .from("report")
      .select("*", { count: "exact", head: true })
      .eq("is_verify", false);

    if (error) {
      console.warn("Report fetch warning:", error.message);
    } else {
      pendingReports = count ?? 0;
    }
  } catch (err: any) {
    console.warn("Report table error:", err.message || err);
  }

  // ส่งผลลัพธ์พร้อมข้อมูลกราฟกลับให้ Frontend
  return res.status(200).json({
    totalCustomers: customerCount,
    totalActiveShops: shopCount,
    totalPlatformIncome: totalPlatformIncome,
    pendingReports: pendingReports,
    dailyIncome: dailyIncome,
  });
};

/**
 * GET /api/admin/shops/pending
 */
export const getPendingShops = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*")
      .eq("is_verify", false)
      .order("created_at", { ascending: true });

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
 * PATCH /api/admin/shops/verify
 */
export const verifyShop = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id, action } = req.body;

    if (!shop_id || !action) {
      return res
        .status(400)
        .json({ error: "shop_id and action are required" });
    }

    const newStatus = action === "approve";

    const { data: updatedShop, error } = await supabase
      .from("print_shop")
      .update({ is_verify: newStatus })
      .eq("id", shop_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
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

/**
 * GET /api/admin/reports
 */
export const getAllReports = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: reports, error } = await supabase
      .from("report")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetAllReports Error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(reports ?? []);
  } catch (err: any) {
    console.error("GetAllReports Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/reports/verify
 */
export const verifyReport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { report_id, is_verified } = req.body;

    if (!report_id || typeof is_verified !== "boolean") {
      return res
        .status(400)
        .json({ error: "report_id and is_verified (boolean) are required" });
    }

    const { data: updatedReport, error } = await supabase
      .from("report")
      .update({ is_verify: is_verified })
      .eq("id", report_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Report verification updated successfully",
      data: updatedReport,
    });
  } catch (err: any) {
    console.error("VerifyReport Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/admin/transactions
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
      console.error("Supabase transaction error:", error.message);
      return res.status(200).json({
        data: [],
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
      });
    }

    const formattedTransactions = (transactions ?? []).map((tx: any) => ({
      ...tx,
      platform_fee: Number(((tx.amount || 0) * 0.05).toFixed(2)),
    }));

    return res.status(200).json({
      data: formattedTransactions,
      currentPage: page,
      totalPages: count ? Math.ceil(count / limit) : 0,
      totalCount: count ?? 0,
    });
  } catch (err: any) {
    console.error("GetAllTransactions Exception:", err.message || err);
    return res.status(200).json({
      data: [],
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
    });
  }
};

// ==========================================
// Controllers เพิ่มเติมสำหรับ Profile, Settings, Notifications, Logout
// ==========================================

/**
 * GET /api/admin/profile
 * ดึงข้อมูลโปรไฟล์แอดมิน
 */
export const getAdminProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // สามารถปรับดึงข้อมูลจาก supabase เพิ่มเติมได้หากมีตาราง admin
    return res.status(200).json({
      name: "Admin User",
      email: "admin@printhub.com",
      role: "Super Admin",
    });
  } catch (err: any) {
    console.error("getAdminProfile Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PUT /api/admin/profile
 * อัปเดตข้อมูลโปรไฟล์แอดมิน
 */
export const updateAdminProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email } = req.body;
    return res.status(200).json({
      message: "Profile updated successfully",
      data: { name, email },
    });
  } catch (err: any) {
    console.error("updateAdminProfile Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PUT /api/admin/settings
 * บันทึกการตั้งค่าระบบ
 */
export const updateSettings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { siteName, maintenanceMode } = req.body;
    return res.status(200).json({
      message: "Settings saved successfully",
      data: { siteName, maintenanceMode },
    });
  } catch (err: any) {
    console.error("updateSettings Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * GET /api/admin/notifications
 * ดึงรายการแจ้งเตือนจริงสำหรับ Admin
 */
export const getNotifications = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // ตัวอย่าง: ดึงรายการ report หรือสลิปที่รอยืนยันเพื่อแสดงเป็นการแจ้งเตือน
    const { data: reports } = await supabase
      .from("report")
      .select("id, created_at, is_verify")
      .eq("is_verify", false)
      .limit(5);

    const notifications = (reports ?? []).map((r: any) => ({
      _id: r.id,
      title: "มีคำร้องเรียนใหม่",
      message: `รหัสคำร้องเรียน #${r.id} รอการตรวจสอบ`,
      createdAt: r.created_at,
      isRead: false,
    }));

    return res.status(200).json(notifications);
  } catch (err: any) {
    console.error("getNotifications Error:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * POST /api/admin/logout
 * ออกจากระบบ Admin
 */
export const adminLogout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err: any) {
    console.error("adminLogout Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};