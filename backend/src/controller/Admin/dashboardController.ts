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
  res: Response
): Promise<Response> => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1. ดึง Master Data สถานะทั้งหมดจากตาราง status
    const { data: statusList } = await supabase
      .from("status")
      .select("id, state");

    const statusMap: Record<string, string> = {};
    if (statusList) {
      statusList.forEach((s) => {
        statusMap[s.state] = s.id;
      });
    }

    const cancelStatusId = statusMap["ยกเลิกการพิมพ์"];

    // 2. Query ข้อมูลพื้นฐานและ Order ทั้งหมดพร้อม Relation แบบครบถ้วน
    const [
      customerRes,
      shopRes,
      reportRes,
      paymentRes,
      appealsRes,
      ordersRes,
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

      // (6) 🟢 Query print_order ดึงทั้ง current_status และ work_status (ORDER BY updated_at DESC เพื่อเอาล่าสุด)
      supabase
        .from("print_order")
        .select(`
          id,
          current_status_id,
          work_state_id,
          current_status:status!fk_order_current_status(id, state),
          work_status:work_status!print_order_work_state_id_fkey(
            status:status!fk_work_status_status(id, state)
          )
        `),
    ]);

    // 3. 🟢 คำนวณสถิติออเดอร์เลียนแบบ Logic ฝั่งร้านค้า 100%
    const allOrders = ordersRes.data || [];

    let pendingActionCount = 0;
    let inProductionCount = 0;
    let completedOrdersCount = 0;
    let cancelledOrdersCount = 0;

    allOrders.forEach((o: any) => {
      const currentStatusName = o.current_status?.state || "";
      const workStatusName = o.work_status?.status?.state || "";
      const activeState = currentStatusName || workStatusName;

      // 1. ยกเลิกการพิมพ์
      if (
        activeState === "ยกเลิกการพิมพ์" ||
        o.current_status_id === statusMap["ยกเลิกการพิมพ์"]
      ) {
        cancelledOrdersCount++;
      }
      // 2. รายการเสร็จสิ้น / พิมพ์เสร็จสิ้น
      else if (
        activeState === "รายการเสร็จสิ้น" ||
        activeState === "พิมพ์เสร็จสิ้น" ||
        o.current_status_id === statusMap["รายการเสร็จสิ้น"] ||
        o.current_status_id === statusMap["พิมพ์เสร็จสิ้น"]
      ) {
        completedOrdersCount++;
      }
      // 3. กำลังพิมพ์ (เช็คเฉพาะสถานะที่กำลังพิมพ์จริงๆ)
      else if (
        activeState === "กำลังพิมพ์" ||
        o.current_status_id === statusMap["กำลังพิมพ์"]
      ) {
        inProductionCount++;
      }
      // 4. 🟢 รอดำเนินการ (กวาดรายการที่เหลือทั้งหมดที่ไม่ใช่อีก 3 สถานะข้างต้น)
      else {
        pendingActionCount++;
      }
    });

    // 4. 📌 คำนวณรายการรอโอนเงินคืนลูกค้า (Pending Refunds)
    let pendingRefunds = 0;
    if (cancelStatusId) {
      const { data: cancelOrders } = await supabase
        .from("print_order")
        .select(`
          id,
          payment:payment!order_id ( id, status, refund_slip_url )
        `)
        .eq("current_status_id", cancelStatusId);

      pendingRefunds = (cancelOrders || []).filter((item: any) => {
        const payList = Array.isArray(item.payment)
          ? item.payment
          : item.payment
          ? [item.payment]
          : [];

        const isRejected = payList.some((p: any) => p.status === "REJECTED");
        const isRefunded = payList.some(
          (p: any) => p.status === "REFUNDED" || Boolean(p.refund_slip_url)
        );

        return !isRejected && !isRefunded;
      }).length;
    }

    // 5. 📌 คำนวณรายการรอโอนให้ร้านค้า (Pending Payouts)
    let pendingPayouts = 0;
    const { data: allPayments } = await supabase
      .from("payment")
      .select("id, status, payout_slip_url");

    if (allPayments) {
      pendingPayouts = allPayments.filter((item: any) => {
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
      orderStats: {
        pendingAction: pendingActionCount,
        inProduction: inProductionCount,
        completed: completedOrdersCount,
        cancelled: cancelledOrdersCount,
      },
    });
  } catch (err: any) {
    console.error("Dashboard Stats Error:", err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};