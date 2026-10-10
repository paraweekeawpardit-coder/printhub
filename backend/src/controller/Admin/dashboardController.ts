import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

interface PaymentRow {
  amount?: number;
  payment_date?: string;
  created_at?: string;
}

interface AppealRow {
  id: string;
  created_at: string;
  status: string;
}

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getPlatformStats = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1. ดึง status_id ของสถานะ "ยกเลิกการพิมพ์" จากตาราง status (แบบเดียวกับ refundController)
    const { data: cancelStatusObj } = await supabase
      .from("status")
      .select("id")
      .eq("state", "ยกเลิกการพิมพ์")
      .maybeSingle();

    const [
      customerRes,
      shopRes,
      reportRes,
      paymentRes,
      appealsRes,
    ] = await Promise.all([
      // (1) จำนวนลูกค้าทั้งหมด
      supabase.from("customer").select("*", { count: "exact", head: true }),

      // (2) ร้านค้าที่อนุมัติแล้ว
      supabase
        .from("print_shop")
        .select("*", { count: "exact", head: true })
        .eq("is_verify", true)
        .eq("status", "approved"),

      // (3) รายงานปัญหาค้างตรวจ (pending)
      supabase
        .from("report")
        .select("*", { count: "exact", head: true })
        .ilike("status", "pending"),

      // (4) Payment 7 วันย้อนหลัง
      supabase
        .from("payment")
        .select("amount, payment_date, created_at")
        .gte("payment_date", sevenDaysAgo.toISOString()),

      // (5) คำร้องขอปลดระงับร้านค้า (pending)
      supabase
        .from("shop_appeals")
        .select("id, created_at, status")
        .eq("status", "pending"),
    ]);

    // 2. 📌 คำนวณรายการรอโอนเงินคืนลูกค้า (Pending Refunds) ถอดแบบ logic จาก refundController
    let pendingRefunds = 0;
    if (cancelStatusObj) {
      const { data: cancelOrders } = await supabase
        .from("print_order")
        .select(`
          id,
          payment:payment!order_id ( id, status, refund_slip_url )
        `)
        .eq("current_status_id", cancelStatusObj.id);

      pendingRefunds = (cancelOrders || []).filter((item: any) => {
        const payList = Array.isArray(item.payment)
          ? item.payment
          : item.payment
          ? [item.payment]
          : [];

        // กรองรายการที่เป็น REJECTED หรือ REFUNDED ออก
        const isRejected = payList.some((p: any) => p.status === "REJECTED");
        const isRefunded = payList.some(
          (p: any) => p.status === "REFUNDED" || Boolean(p.refund_slip_url)
        );

        return !isRejected && !isRefunded;
      }).length;
    }

    // 3. 📌 คำนวณรายการรอโอนให้ร้านค้า (Pending Payouts) ถอดแบบ logic จาก payoutController
    let pendingPayouts = 0;
    const { data: allPayments } = await supabase
      .from("payment")
      .select("id, status, payout_slip_url");

    if (allPayments) {
      pendingPayouts = allPayments.filter((item: any) => {
        // กรองรายการ PAYOUT_REJECTED หรือ รายการที่ PAID / completed / มี payout_slip_url ออก
        if (item.status === "PAYOUT_REJECTED") return false;

        const isPaid =
          Boolean(item.payout_slip_url) ||
          item.status === "PAID" ||
          item.status === "completed";

        return !isPaid;
      }).length;
    }

    const customerCount = customerRes.count ?? 0;
    const shopCount = shopRes.count ?? 0;
    const pendingReports = reportRes.count ?? 0;

    // คำนวณคำร้องขอปลดระงับ เกิน 3 วัน
    const appealsData = (appealsRes.data as AppealRow[]) || [];
    const pendingAppeals = appealsData.length;
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const overdueAppeals = appealsData.filter((a) => {
      const createdAt = new Date(a.created_at).getTime();
      return now.getTime() - createdAt >= threeDaysInMs;
    }).length;

    // คำนวณรายได้ย้อนหลัง 7 วัน
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7DaysMap: Record<string, { name: string; income: number }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = formatDateKey(d);
      last7DaysMap[dateStr] = { name: daysOfWeek[d.getDay()], income: 0 };
    }

    let total7DaysIncome = 0;
    const payments = (paymentRes.data as PaymentRow[]) || [];

    payments.forEach((p) => {
      const rawDate = p.payment_date || p.created_at;
      if (rawDate) {
        const pDateKey = formatDateKey(new Date(rawDate));
        const platformFee = (p.amount || 0) * 0.05;

        if (last7DaysMap[pDateKey]) {
          last7DaysMap[pDateKey].income += platformFee;
          total7DaysIncome += platformFee;
        }
      }
    });

    const dailyIncome = Object.values(last7DaysMap).map((item) => ({
      name: item.name,
      income: Number(item.income.toFixed(2)),
    }));

    return res.status(200).json({
      totalCustomers: customerCount,
      totalActiveShops: shopCount,
      totalPlatformIncome: Number(total7DaysIncome.toFixed(2)),
      pendingReports,
      pendingAppeals,
      pendingRefunds,
      pendingPayouts,
      overdueAppeals,
      dailyIncome,
    });
  } catch (err: any) {
    console.error("Dashboard Stats Error:", err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};