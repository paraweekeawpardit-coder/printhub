import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

interface Review {
  score: number;
}

interface PaymentRow {
  amount: number | null;
  shop_income: number | null;
}


// ==========================================
// Sync สถานะอัตโนมัติลง DB (ให้ทุก endpoint เห็นตรงกัน)
//  - รอดำเนินงาน/กำลังพิมพ์ แล้วเลยเวลารับ        -> ยกเลิกการพิมพ์
//  - พิมพ์เสร็จสิ้น แล้วเลยเวลารับเกิน 24 ชม.      -> รายการเสร็จสิ้น
//  - หลังลูกค้าสั่ง 10 นาที ถ้าสถานะยังเป็น "รอการชำระเงิน" -> ยกเลิกการพิมพ์
// เรียกพร้อมกันหลาย endpoint ได้ (ใช้ promise ร่วมกันต่อร้าน)
// ==========================================
const PENDING_STATES = ["รอการดำเนินงาน", "รอการดำเนินการ", "กำลังพิมพ์"];

// กฎ: หลังลูกค้าสั่ง 10 นาที ถ้าสถานะยังเป็น "รอการชำระเงิน" -> ยกเลิกทันที
export const UNPAID_TIMEOUT_MS = 10 * 60 * 1000;
const inflightSync = new Map<string, Promise<void>>();

export function syncAutoStatuses(shop_id: string): Promise<void> {
  const existing = inflightSync.get(shop_id);
  if (existing) return existing;

  const p = runSyncAutoStatuses(shop_id)
    .catch((err) => console.error("syncAutoStatuses error:", err))
    .finally(() => inflightSync.delete(shop_id));

  inflightSync.set(shop_id, p);
  return p;
}

async function runSyncAutoStatuses(shop_id: string): Promise<void> {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const { data: statuses } = await supabase
    .from("status")
    .select("id, state")
    .in("state", ["ยกเลิกการพิมพ์", "รายการเสร็จสิ้น"]);

  const cancelledId = statuses?.find((s) => s.state === "ยกเลิกการพิมพ์")?.id;
  const completedId = statuses?.find((s) => s.state === "รายการเสร็จสิ้น")?.id;
  if (!cancelledId || !completedId) return;

  const { data: orders, error } = await supabase
    .from("print_order")
    .select(
      `id, order_date, appointment_time, receive_date,
       current_status:status!current_status_id (state)`
    )
    .eq("shop_id", shop_id);

  if (error || !orders) return;

  const toCancel: string[] = [];
  const toComplete: string[] = [];

  for (const o of orders as any[]) {
    const state: string = o.current_status?.state || "";

    // ครบ 10 นาทีหลังสั่ง แต่สถานะยังเป็น "รอการชำระเงิน" -> ยกเลิก
    if (state === "รอการชำระเงิน") {
      const orderT = new Date(o.order_date).getTime();
      if (!isNaN(orderT) && now > orderT + UNPAID_TIMEOUT_MS) {
        toCancel.push(o.id);
        continue;
      }
    }

    const timeStr = o.appointment_time || o.receive_date;
    if (!timeStr) continue;

    const t = new Date(timeStr).getTime();
    if (isNaN(t)) continue;

    if (PENDING_STATES.includes(state) && now > t) toCancel.push(o.id);
    else if (state === "พิมพ์เสร็จสิ้น" && now > t + ONE_DAY_MS)
      toComplete.push(o.id);
  }

  await applyAutoStatus(toCancel, cancelledId);
  await applyAutoStatus(toComplete, completedId);
}

// เปลี่ยนสถานะ + บันทึกประวัติลง work_status (เหมือน updateOrderStatus)
async function applyAutoStatus(orderIds: string[], statusId: string) {
  if (orderIds.length === 0) return;

  const nowIso = new Date().toISOString();
  const { data: rows } = await supabase
    .from("work_status")
    .insert(
      orderIds.map((id) => ({
        order_id: id,
        status_id: statusId,
        updated_at: nowIso,
      }))
    )
    .select("id, order_id");

  const workIdByOrder = new Map<string, string>(
    (rows || []).map((r: any) => [r.order_id, r.id])
  );

  await Promise.all(
    orderIds.map((id) =>
      supabase
        .from("print_order")
        .update({
          current_status_id: statusId,
          ...(workIdByOrder.get(id)
            ? { work_state_id: workIdByOrder.get(id) }
            : {}),
        })
        .eq("id", id)
    )
  );
}

// ==========================================
// Get Total Score & Review Count
// ==========================================
export const getTotalScore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: reviews, error: reviewError } = await supabase
      .from("review")
      .select("score")
      .eq("shop_id", shop_id);

    if (reviewError) {
      return res.status(400).json({ error: reviewError.message });
    }

    const reviewList = (reviews ?? []) as Review[];
    const count = reviewList.length;
    const avg =
      count > 0
        ? reviewList.reduce((sum, review) => sum + Number(review.score || 0), 0) / count
        : 0;

    return res.status(200).json({
      score: Number(avg.toFixed(1)),
      totalReviews: count,
    });
  } catch (err) {
    console.error("Error in getTotalScore:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Card 2: รายได้รวมที่หักค่าธรรมเนียมเรียบร้อยแล้ว (สุทธิ)
// ==========================================
export const getTodayInCome = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    await syncAutoStatuses(shop_id);

    // 1. ดึง id ของสถานะ "รายการเสร็จสิ้น"
    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", "รายการเสร็จสิ้น")
      .single();

    if (statusError || !statusData) {
      return res.status(200).json({ income: 0, orderCount: 0 });
    }

    // 2. ดึงคำสั่งซื้อที่เสร็จสิ้นแล้วทั้งหมดของร้าน
    const { data: orders, error: orderError } = await supabase
      .from("print_order")
      .select("total_price")
      .eq("shop_id", shop_id)
      .eq("current_status_id", statusData.id);

    if (orderError) {
      return res.status(400).json({ error: orderError.message });
    }

    const orderList = orders ?? [];
    const FEE_RATE = 0.05; // อัตราค่าธรรมเนียม 5%

    // คำนวณยอดเงินสุทธิหลังหักค่าธรรมเนียม
    const netIncome = orderList.reduce((sum, order) => {
      const gross = Number(order.total_price || 0);
      const fee = gross * FEE_RATE;
      return sum + (gross - fee);
    }, 0);

    return res.status(200).json({
      income: Number(netIncome.toFixed(2)),
      orderCount: orderList.length,
    });
  } catch (err) {
    console.error("Error in getTodayInCome:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Card 1: ออเดอร์ที่อยู่ในสถานะรอดำเนินการ (กำลังเตรียม / รอพิมพ์)
// ==========================================
export const getNumOrderUnAccept = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    await syncAutoStatuses(shop_id);

    // 1. ดึง ID ของสถานะ "รอการดำเนินงาน" (ใส่คำว่า "รอการดำเนินการ" สำรองไว้เผื่อใช้ใน db)
    const { data: statuses, error: statusError } = await supabase
      .from("status")
      .select("id")
      .in("state", ["รอการดำเนินงาน", "รอการดำเนินการ"]);

    if (statusError || !statuses || statuses.length === 0) {
      return res.status(200).json({ numWork: 0 });
    }

    const statusIds = statuses.map((s) => s.id);

    // 2. นับจำนวนออเดอร์ทั้งหมดที่อยู่ในสถานะรอการดำเนินงาน (ไม่จำกัดวัน)
    const { count, error } = await supabase
      .from("print_order")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", shop_id)
      .in("current_status_id", statusIds);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ numWork: count ?? 0 });
  } catch (err) {
    console.error("Error in getNumOrderUnAccept:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
// ==========================================
// Get Top Orders
// ==========================================
export const getTopOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    await syncAutoStatuses(shop_id);

    // ดึงออเดอร์ทั้งหมดของร้านค้า
    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        order_no,
        order_date,
        total_price,
        description,
        appointment_time,
        receive_date,
        shop_id,
        current_status_id,
        payment_id,
        customer (
          first_name,
          last_name,
          contact
        ),
        current_status:status!current_status_id (
          id,
          state
        ),
        payment:payment_id (
          id,
          slip_url,
          is_verified,
          amount
        ),
        print_order_item (
          *
        )
        `
      )
      .eq("shop_id", shop_id)
      .order("order_date", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    // Helper: แปลง Date/ISO String ให้เหลือแค่ "YYYY-MM-DD" ในโซนเวลาไทย
    const getThailandDateString = (dateInput?: string | Date | null) => {
      if (!dateInput) return "";
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" }); // ได้ผลลัพธ์เป็น "YYYY-MM-DD"
    };

    // วันนี้ในรูปแบบ "YYYY-MM-DD" ตามเวลาไทย
    const todayStr = getThailandDateString(new Date());

    // กรองเอาเฉพาะออเดอร์ที่สั่งซื้อใน "วันเดียวกัน" เท่านั้น
    const todayOrders = orders.filter((order: any) => {
      // 1. กรองสถานะ "รอการชำระเงิน" ออก
      const state = order.current_status?.state;
      if (state === "รอการชำระเงิน") return false;

      // 2. เช็คเฉพาะวันที่สั่งซื้อ (order_date) ตรงกับวันที่ปัจจุบันแบบเป๊ะๆ (ตัดเรื่องชั่วโมงออก)
      const orderDateStr = getThailandDateString(order.order_date);
      return orderDateStr === todayStr;
    });

    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const isPendingStatus = (state: string) =>
      state === "รอการดำเนินการ" ||
      state === "รอการดำเนินงาน" ||
      state === "กำลังพิมพ์";

    const processedOrders = todayOrders.map((order: any) => {
      let state = order.current_status?.state || "";
      const appointmentTimeStr = order.appointment_time || order.receive_date;

      if (appointmentTimeStr) {
        const appointmentTime = new Date(appointmentTimeStr).getTime();

        if (isPendingStatus(state) && now > appointmentTime) {
          state = "ยกเลิกการพิมพ์";
        }

        const isCompletedPrint = state === "พิมพ์เสร็จสิ้น";
        if (isCompletedPrint && now > appointmentTime + ONE_DAY_MS) {
          state = "รายการเสร็จสิ้น";
        }
      }

      return {
        ...order,
        latest_status: state || "ไม่ทราบสถานะ",
      };
    });

    // ลำดับการจัดเรียงสถานะ
    const STATUS_RANK: Record<string, number> = {
      "รอการดำเนินการ": 0,
      "รอการดำเนินงาน": 0,
      "กำลังพิมพ์": 1,
      "พิมพ์เสร็จสิ้น": 2,
      "รายการเสร็จสิ้น": 3,
      "ยกเลิกการพิมพ์": 4,
    };

    const getPickupTime = (o: any) => {
      const t = new Date(
        o.appointment_time || o.receive_date || o.order_date
      ).getTime();
      return isNaN(t) ? new Date(o.order_date).getTime() : t;
    };

    const sortedOrders = [...processedOrders].sort((a: any, b: any) => {
      const rankA = STATUS_RANK[a.latest_status] ?? 99;
      const rankB = STATUS_RANK[b.latest_status] ?? 99;

      if (rankA !== rankB) return rankA - rankB;

      return (
        Math.abs(getPickupTime(a) - now) - Math.abs(getPickupTime(b) - now)
      );
    });

    return res.status(200).json(sortedOrders);
  } catch (err) {
    console.error("Error in getTopOrder:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Financial Overview & Transactions
// ==========================================
export const getFinancialOverview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    await syncAutoStatuses(shop_id);

    // 1. ดึง id ของสถานะ "รายการเสร็จสิ้น" จากตาราง status
    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", "รายการเสร็จสิ้น")
      .single();

    if (statusError || !statusData) {
      // หากไม่พบสถานะ ให้คืนค่าเปล่าเป็น 0
      return res.status(200).json({
        totalGross: 0,
        totalFee: 0,
        totalNet: 0,
        transactions: [],
        financialTrend: {
          daily: [],
          weekly: [],
          monthly: [],
          yearly: [],
        },
      });
    }

    // 2. ดึงเฉพาะรายการสั่งซื้อที่มี current_status_id เป็น "รายการเสร็จสิ้น"
    const { data: orders, error } = await supabase
      .from("print_order")
      .select(`
        id,
        order_date,
        total_price,
        customer (first_name, last_name)
      `)
      .eq("shop_id", shop_id)
      .eq("current_status_id", statusData.id)
      .order("order_date", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const orderList = orders ?? [];
    
    // อัตราค่าธรรมเนียมแพลตฟอร์ม (เช่น 5%)
    const FEE_RATE = 0.05;

    let totalGross = 0;
    let totalFee = 0;
    let totalNet = 0;

    const transactions = orderList.map((o: any) => {
      const gross = Number(o.total_price || 0);
      const fee = gross * FEE_RATE;
      const net = gross - fee;

      totalGross += gross;
      totalFee += fee;
      totalNet += net;

      return {
        id: o.id,
        date: o.order_date,
        customer_name: `${o.customer?.first_name || ""} ${o.customer?.last_name || ""}`.trim() || "ลูกค้าทั่วไป",
        gross,
        fee,
        net,
      };
    });

    const now = new Date();
    const currentYear = now.getFullYear();

    const getYearFromOrder = (dateVal: any): number => {
      if (!dateVal) return 0;
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) {
        let y = d.getFullYear();
        if (y > 2400) y -= 543;
        return y;
      }
      const str = String(dateVal);
      if (str.includes("2569") || str.includes("2026")) return 2026;
      if (str.includes("2568") || str.includes("2025")) return 2025;
      if (str.includes("2567") || str.includes("2024")) return 2024;
      return 0;
    };

    const getMonthFromOrder = (dateVal: any): number => {
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? -1 : d.getMonth();
    };

    // 1. รายวัน (จ.-อา.)
    const daysName = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const currDay = now.getDay();
    const mondayOffset = currDay === 0 ? -6 : 1 - currDay;

    const dailyTrend = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + i);
      const targetDateStr = targetDate.toISOString().split("T")[0];

      const amount = transactions
        .filter((t: any) => String(t.date).includes(targetDateStr))
        .reduce((sum: number, t: any) => sum + t.net, 0);

      dailyTrend.push({ label: daysName[targetDate.getDay()], amount });
    }

    // 2. รายสัปดาห์
    const weeklyTrend = [];
    for (let w = 1; w <= 4; w++) {
      const startDay = (w - 1) * 7 + 1;
      const endDay = w === 4 ? 31 : w * 7;

      const amount = transactions
        .filter((t: any) => {
          const y = getYearFromOrder(t.date);
          const m = getMonthFromOrder(t.date);
          const d = new Date(t.date).getDate();
          return y === currentYear && m === now.getMonth() && d >= startDay && d <= endDay;
        })
        .reduce((sum: number, t: any) => sum + t.net, 0);

      weeklyTrend.push({ label: `สัปดาห์ ${w}`, amount });
    }

    // 3. รายเดือน
    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const monthlyTrend = monthNames.map((mName, mIdx) => {
      const amount = transactions
        .filter((t: any) => getYearFromOrder(t.date) === currentYear && getMonthFromOrder(t.date) === mIdx)
        .reduce((sum: number, t: any) => sum + t.net, 0);

      return { label: mName, amount };
    });

    // 4. รายปี (5 ย้อนหลัง)
    const yearlyTrend = [];
    for (let i = 4; i >= 0; i--) {
      const targetYear = currentYear - i;
      const amount = transactions
        .filter((t: any) => getYearFromOrder(t.date) === targetYear)
        .reduce((sum: number, t: any) => sum + t.net, 0);

      yearlyTrend.push({ label: `${targetYear + 543}`, amount });
    }

    return res.status(200).json({
      totalGross,
      totalFee,
      totalNet,
      transactions,
      financialTrend: {
        daily: dailyTrend,
        weekly: weeklyTrend,
        monthly: monthlyTrend,
        yearly: yearlyTrend,
      },
    });
  } catch (err) {
    console.error("Error in getFinancialOverview:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Order Status Breakdown & All Orders
// ==========================================
export const getOrderStatusBreakdown = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    await syncAutoStatuses(shop_id);

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        *,
        customer (first_name, last_name, contact),
        current_status:status!current_status_id (id, state)
        `
      )
      .eq("shop_id", shop_id)
      .order("order_date", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // ซ่อนออเดอร์ที่ยังรอชำระเงิน (ยังไม่ใช่งานของร้าน)
    const orderList = (orders ?? []).filter(
      (o: any) => o.current_status?.state !== "รอการชำระเงิน"
    );

    const counts: Record<string, number> = {
      "รอการดำเนินการ": 0,
      "กำลังพิมพ์": 0,
      "พิมพ์เสร็จสิ้น": 0,
      "รายการเสร็จสิ้น": 0,
      "ยกเลิกการพิมพ์": 0,
    };

    // Helper: แปลง และ Normalize ให้เป็น Date Object ใน ค.ศ. ชัวร์ 100%
    const parseSafeDate = (dateStr: any) => {
      if (!dateStr) return null;
      
      // กรณีเป็น String เช่น "2026-09-28" หรือ "2569-09-28"
      const cleanStr = String(dateStr).split("T")[0];
      const parts = cleanStr.split(/[-/]/);
      
      if (parts.length === 3) {
        let year = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10) - 1;
        let day = parseInt(parts[2], 10);

        // ถ้าเก็บปีเป็น พ.ศ. (เช่น > 2400) ให้แปลงเป็น ค.ศ.
        if (year > 2400) year -= 543;

        return new Date(year, month, day);
      }

      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      if (d.getFullYear() > 2400) d.setFullYear(d.getFullYear() - 543);
      return d;
    };

    orderList.forEach((o: any) => {
      const st = o.current_status?.state || "รอการดำเนินการ";
      counts[st] = (counts[st] || 0) + 1;
    });

    const now = new Date();
    const currentYear = now.getFullYear(); // เช่น 2026

    // 1. รายวัน (จันทร์ - อาทิตย์ ของสัปดาห์นี้)
    const daysName = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const currDay = now.getDay();
    const mondayOffset = currDay === 0 ? -6 : 1 - currDay;

    const dailyData: { label: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + i);

      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return (
          od.getFullYear() === targetDate.getFullYear() &&
          od.getMonth() === targetDate.getMonth() &&
          od.getDate() === targetDate.getDate()
        );
      }).length;

      dailyData.push({ label: daysName[targetDate.getDay()], count });
    }

    // 2. รายสัปดาห์ (สัปดาห์ 1 - 4 ของเดือนปัจจุบัน)
    const weeklyData: { label: string; count: number }[] = [];
    for (let w = 1; w <= 4; w++) {
      const startDay = (w - 1) * 7 + 1;
      const endDay = w === 4 ? 31 : w * 7;

      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return (
          od.getFullYear() === currentYear &&
          od.getMonth() === now.getMonth() &&
          od.getDate() >= startDay &&
          od.getDate() <= endDay
        );
      }).length;

      weeklyData.push({ label: `สัปดาห์ ${w}`, count });
    }

    // 3. รายเดือน (ม.ค. - ธ.ค. ของปีปัจจุบัน)
    const monthNames = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const monthlyData: { label: string; count: number }[] = monthNames.map((mName, mIdx) => {
      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return od.getFullYear() === currentYear && od.getMonth() === mIdx;
      }).length;
      return { label: mName, count };
    });

    // 4. รายปี (5 ปีย้อนหลังนับจากปีปัจจุบัน)
    const yearlyData: { label: string; count: number }[] = [];
    for (let i = 4; i >= 0; i--) {
      const yr = currentYear - i;
      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return od.getFullYear() === yr;
      }).length;
      
      yearlyData.push({ label: `${yr + 543}`, count }); // แสดงเป็น พ.ศ. บนแท่งกราฟ
    }

    return res.status(200).json({
      total: orderList.length,
      counts,
      trendData: {
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData,
        yearly: yearlyData,
      },
      orders: orderList.map((o: any) => ({
        ...o,
        latest_status: o.current_status?.state || "ไม่ทราบสถานะ",
      })),
    });
  } catch (err) {
    console.error("Error in getOrderStatusBreakdown:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
 

export const getComplaintsAndReviews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // 1. ดึงรีวิวทั้งหมด
    const { data: reviews, error: revErr } = await supabase
      .from("review")
      .select(
        `
        *,
        customer (first_name, last_name)
        `
      )
      .eq("shop_id", shop_id)
      .order("created_at", { ascending: false });

    if (revErr) return res.status(400).json({ error: revErr.message });

    // 2. ดึงรายการร้องเรียน
    const { data: reports, error: repErr } = await supabase
      .from("report")
      .select(
        `
        *,
        customer (first_name, last_name)
        `
      )
      .eq("shop_id", shop_id)
      .order("created_at", { ascending: false });

    if (repErr) console.error("Report Fetch Error:", repErr.message);

    const safeReviews = reviews ?? [];
    const safeReports = reports ?? [];

    // 3. คำนวณ สรุปผลรีวิว (Summary) สำหรับแสดงผลส่วนดาวบน UI
    const total_reviews = safeReviews.length;

    // นับจำนวนรีวิวแยกตามดาว (1-5 ดาว)
    const rating_counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumRating = 0;

    safeReviews.forEach((rev) => {
      const score = Number(rev.score || rev.rating || 0);
      sumRating += score;
      if (score >= 1 && score <= 5) {
        rating_counts[score] = (rating_counts[score] || 0) + 1;
      }
    });

    // คำนวณคะแนนเฉลี่ย
    const average_rating = total_reviews > 0 ? Number((sumRating / total_reviews).toFixed(1)) : 0;

    // สรุปสถิติเปอร์เซ็นต์แต่ละดาวสำหรับ Progress Bar
    const rating_breakdown = [5, 4, 3, 2, 1].map((stars) => {
      const count = rating_counts[stars] || 0;
      const percentage = total_reviews > 0 ? Number(((count / total_reviews) * 100).toFixed(1)) : 0;
      return {
        stars,
        count,
        percentage,
      };
    });

    return res.status(200).json({
      summary: {
        average_rating,
        total_reviews,
        rating_breakdown,
      },
      reviews: safeReviews,
      complaints: safeReports,
    });
  } catch (err) {
    console.error("Error in getComplaintsAndReviews:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
