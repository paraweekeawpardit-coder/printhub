import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

interface PaymentRow {
  amount?: number;
  payment_date?: string;
  created_at?: string;
}

/**
 * Helper ฟังก์ชันแปลง Date เป็น string รูปแบบ YYYY-MM-DD ตาม Local Time
 */
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * GET /api/admin/dashboard-stats
 */
export const getPlatformStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    // 1. คำนวณช่วงเวลาย้อนหลัง 7 วัน (นับรวมวันนี้)
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0); // ตั้งเวลาเริ่มต้นของวันแรก (00:00:00)

    // 2. ดึงข้อมูลแบบ Parallel ด้วย Promise.all เพื่อความเร็วสูงสุด
    const [customerRes, shopRes, reportRes, paymentRes] = await Promise.all([
      // (1) จำนวนลูกค้าทั้งหมด
      supabase
        .from("customer")
        .select("*", { count: "exact", head: true }),

      // (2) จำนวนร้านค้าที่ Active (ไม่ใช่ PENDING)
      supabase
        .from("print_shop")
        .select("*", { count: "exact", head: true })
        .not("status", "ilike", "PENDING"),

      // (3) จำนวนรายงานปัญหาที่รอตรวจสอบ
      supabase
        .from("report")
        .select("*", { count: "exact", head: true })
        .ilike("status", "PENDING"), // แนะนำให้กรองเฉพาะสถานะที่รอดำเนินการจริง (ถ้ามี column status)

      // (4) ดึงข้อมูล Payment เฉพาะช่วง 7 วันย้อนหลัง
      supabase
        .from("payment")
        .select("amount, payment_date, created_at")
        .gte("created_at", sevenDaysAgo.toISOString()), // หรือใช้ payment_date ขึ้นอยู่กับ schema
    ]);

    // สกัดค่า Count
    const customerCount = customerRes.count ?? 0;
    const shopCount = shopRes.count ?? 0;
    const pendingReports = reportRes.count ?? 0;

    // 3. เตรียม Map สำหรับ 7 วันย้อนหลัง
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7DaysMap: Record<string, { name: string; income: number }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = formatDateKey(d);
      last7DaysMap[dateStr] = { name: daysOfWeek[d.getDay()], income: 0 };
    }

    // 4. คำนวณรายได้ย้อนหลัง 7 วัน
    let total7DaysIncome = 0;
    const payments = (paymentRes.data as PaymentRow[]) || [];

    payments.forEach((p) => {
      const rawDate = p.payment_date || p.created_at;
      if (rawDate) {
        const pDateKey = formatDateKey(new Date(rawDate));
        const platformFee = (p.amount || 0) * 0.05; // ส่วนแบ่งแพลตฟอร์ม 5%

        if (last7DaysMap[pDateKey]) {
          last7DaysMap[pDateKey].income += platformFee;
          total7DaysIncome += platformFee;
        }
      }
    });

    // 5. แปลงข้อมูลกราฟให้อยู่ในรูปแบบ Array
    const dailyIncome = Object.values(last7DaysMap).map((item) => ({
      name: item.name,
      income: Number(item.income.toFixed(2)),
    }));

    return res.status(200).json({
      totalCustomers: customerCount,
      totalActiveShops: shopCount,
      totalPlatformIncome: Number(total7DaysIncome.toFixed(2)),
      pendingReports,
      dailyIncome,
    });
  } catch (err: any) {
    console.error("Dashboard Stats Error:", err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};