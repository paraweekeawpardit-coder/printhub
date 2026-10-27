import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import { fixPickupTime } from "./Pickuptime.js";

// ==========================================
// Thai time helpers (Asia/Bangkok, UTC+7)
// ==========================================
const TH_OFFSET_MS = 7 * 60 * 60 * 1000;

const parseDbDate = (v: any): Date | null => {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  let str = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) str += "T00:00:00+07:00";
  else if (!/(Z|[+-]\d{2}:?\d{2})$/.test(str)) str = str.replace(" ", "T") + "Z";
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const toThaiWall = (v: any): Date | null => {
  const d = parseDbDate(v);
  return d ? new Date(d.getTime() + TH_OFFSET_MS) : null;
};

const thaiDateKey = (v: any): string => toThaiWall(v)?.toISOString().slice(0, 10) ?? "";

interface Review {
  score: number;
  is_hidden?: boolean;
}

interface PaymentRow {
  amount: number | null;
  shop_income: number | null;
}

// ==========================================
// Sync สถานะอัตโนมัติลง DB
// ==========================================
const PENDING_STATES = ["รอการดำเนินงาน", "กำลังพิมพ์"];

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

    const timeStr = fixPickupTime(o.appointment_time) || o.receive_date;
    if (!timeStr) continue;

    const t = parseDbDate(timeStr)?.getTime() ?? NaN;
    if (isNaN(t)) continue;

    if (PENDING_STATES.includes(state) && now > t) toCancel.push(o.id);
    else if (state === "พิมพ์เสร็จสิ้น" && now > t + ONE_DAY_MS)
      toComplete.push(o.id);
  }

  await applyAutoStatus(toCancel, cancelledId);
  await applyAutoStatus(toComplete, completedId);
}

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
      .select("score, is_hidden")
      .eq("shop_id", shop_id)
      .or("is_hidden.is.null,is_hidden.eq.false");

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
// Card 2: รายได้รวมที่หักค่าธรรมเนียมเรียบร้อยแล้ว
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

    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", "รายการเสร็จสิ้น")
      .single();

    if (statusError || !statusData) {
      return res.status(200).json({ income: 0, orderCount: 0 });
    }

    const { data: orders, error: orderError } = await supabase
      .from("print_order")
      .select("total_price")
      .eq("shop_id", shop_id)
      .eq("current_status_id", statusData.id);

    if (orderError) {
      return res.status(400).json({ error: orderError.message });
    }

    const orderList = orders ?? [];
    const FEE_RATE = 0.05;

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
// Card 1: ออเดอร์ที่อยู่ในสถานะรอดำเนินการ
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

    const { data: statuses, error: statusError } = await supabase
      .from("status")
      .select("id")
      .in("state", ["รอการดำเนินงาน", "รอการดำเนินการ"]);

    if (statusError || !statuses || statuses.length === 0) {
      return res.status(200).json({ numWork: 0 });
    }

    const statusIds = statuses.map((s) => s.id);

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

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        order_no,
        order_date,
        total_price,
        description,
        reject_reason,
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

    const todayStr = thaiDateKey(new Date());

    const todayOrders = orders.filter((order: any) => {
      const state = order.current_status?.state;
      if (state === "รอการชำระเงิน") return false;

      const orderDateStr = thaiDateKey(order.order_date);
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
      const appointmentTimeStr = fixPickupTime(order.appointment_time) || order.receive_date;

      if (appointmentTimeStr) {
        const appointmentTime = parseDbDate(appointmentTimeStr)?.getTime() ?? NaN;

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
        appointment_time: fixPickupTime(order.appointment_time),
        reject_reason: order.reject_reason || null,
        latest_status: state || "ไม่ทราบสถานะ",
      };
    });

    const STATUS_RANK: Record<string, number> = {
      "รอการดำเนินการ": 0,
      "รอการดำเนินงาน": 0,
      "กำลังพิมพ์": 1,
      "พิมพ์เสร็จสิ้น": 2,
      "รายการเสร็จสิ้น": 3,
      "ยกเลิกการพิมพ์": 4,
    };

    const getPickupTime = (o: any) => {
      const t =
        parseDbDate(o.appointment_time || o.receive_date || o.order_date)?.getTime() ?? NaN;
      return isNaN(t) ? parseDbDate(o.order_date)?.getTime() ?? 0 : t;
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

    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", "รายการเสร็จสิ้น")
      .single();

    if (statusError || !statusData) {
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

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(`
        id,
        order_no,
        order_date,
        total_price,
        small_order_fee,
        payment:payment_id (payout_slip_url, payout_date)
      `)
      .eq("shop_id", shop_id)
      .eq("current_status_id", statusData.id)
      .order("order_date", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const orderList = orders ?? [];

    const FEE_RATE = 0.08;
    const round2 = (n: number) => Math.round(n * 100) / 100;

    let totalGross = 0;
    let totalFee = 0;
    let totalNet = 0;

    const transactions = orderList.map((o: any) => {
      const gross = Number(o.total_price ?? 0);

      const smallOrderFee = Number(o.small_order_fee ?? 0);
      const fee = round2(smallOrderFee > 0 ? smallOrderFee : gross * FEE_RATE);

      const net = round2(gross - fee);

      totalGross += gross;
      totalFee += fee;
      totalNet += net;

      const payment = Array.isArray(o.payment) ? o.payment[0] : o.payment;
      const payoutSlip = payment?.payout_slip_url?.trim() || null;

      return {
        id: o.id,
        order_no: o.order_no,
        date: o.order_date,
        gross,
        fee,
        net,
        payout_slip_url: payoutSlip,
        payout_date: payment?.payout_date ?? null,
      };
    });

    const now = toThaiWall(new Date())!;
    const currentYear = now.getUTCFullYear();

    const getYearFromOrder = (dateVal: any): number => {
      if (!dateVal) return 0;
      const d = toThaiWall(dateVal);
      if (d) {
        let y = d.getUTCFullYear();
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
      const d = toThaiWall(dateVal);
      return d ? d.getUTCMonth() : -1;
    };

    const daysName = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const currDay = now.getUTCDay();
    const mondayOffset = currDay === 0 ? -6 : 1 - currDay;

    const dailyTrend = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + mondayOffset + i));
      const targetDateStr = targetDate.toISOString().split("T")[0];

      const amount = transactions
        .filter((t: any) => thaiDateKey(t.date) === targetDateStr)
        .reduce((sum: number, t: any) => sum + t.net, 0);

      dailyTrend.push({ label: daysName[targetDate.getUTCDay()], amount });
    }

    const weeklyTrend = [];
    for (let w = 1; w <= 4; w++) {
      const startDay = (w - 1) * 7 + 1;
      const endDay = w === 4 ? 31 : w * 7;

      const amount = transactions
        .filter((t: any) => {
          const y = getYearFromOrder(t.date);
          const m = getMonthFromOrder(t.date);
          const d = toThaiWall(t.date)?.getUTCDate() ?? 0;
          return y === currentYear && m === now.getUTCMonth() && d >= startDay && d <= endDay;
        })
        .reduce((sum: number, t: any) => sum + t.net, 0);

      weeklyTrend.push({ label: `สัปดาห์ ${w}`, amount });
    }

    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const monthlyTrend = monthNames.map((mName, mIdx) => {
      const amount = transactions
        .filter((t: any) => getYearFromOrder(t.date) === currentYear && getMonthFromOrder(t.date) === mIdx)
        .reduce((sum: number, t: any) => sum + t.net, 0);

      return { label: mName, amount };
    });

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

    const orderList = (orders ?? []).filter(
      (o: any) => o.current_status?.state !== "รอการชำระเงิน"
    );

    const counts: Record<string, number> = {
      "รอการดำเนินงาน": 0,
      "กำลังพิมพ์": 0,
      "พิมพ์เสร็จสิ้น": 0,
      "รายการเสร็จสิ้น": 0,
      "ยกเลิกการพิมพ์": 0,
    };

    const parseSafeDate = (dateStr: any) => {
      const d = toThaiWall(dateStr);
      if (!d) return null;
      if (d.getUTCFullYear() > 2400) d.setUTCFullYear(d.getUTCFullYear() - 543);
      return d;
    };

    orderList.forEach((o: any) => {
      const st = o.current_status?.state || "รอการดำเนินการ";
      counts[st] = (counts[st] || 0) + 1;
    });

    const now = toThaiWall(new Date())!;
    const currentYear = now.getUTCFullYear();

    const daysName = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const currDay = now.getUTCDay();
    const mondayOffset = currDay === 0 ? -6 : 1 - currDay;

    const dailyData: { label: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + mondayOffset + i));

      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return (
          od.getUTCFullYear() === targetDate.getUTCFullYear() &&
          od.getUTCMonth() === targetDate.getUTCMonth() &&
          od.getUTCDate() === targetDate.getUTCDate()
        );
      }).length;

      dailyData.push({ label: daysName[targetDate.getUTCDay()], count });
    }

    const weeklyData: { label: string; count: number }[] = [];
    for (let w = 1; w <= 4; w++) {
      const startDay = (w - 1) * 7 + 1;
      const endDay = w === 4 ? 31 : w * 7;

      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return (
          od.getUTCFullYear() === currentYear &&
          od.getUTCMonth() === now.getUTCMonth() &&
          od.getUTCDate() >= startDay &&
          od.getUTCDate() <= endDay
        );
      }).length;

      weeklyData.push({ label: `สัปดาห์ ${w}`, count });
    }

    const monthNames = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const monthlyData: { label: string; count: number }[] = monthNames.map((mName, mIdx) => {
      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return od.getUTCFullYear() === currentYear && od.getUTCMonth() === mIdx;
      }).length;
      return { label: mName, count };
    });

    const yearlyData: { label: string; count: number }[] = [];
    for (let i = 4; i >= 0; i--) {
      const yr = currentYear - i;
      const count = orderList.filter((o: any) => {
        const od = parseSafeDate(o.order_date);
        if (!od) return false;
        return od.getUTCFullYear() === yr;
      }).length;

      yearlyData.push({ label: `${yr + 543}`, count });
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

// ==========================================
// Get Complaints & Reviews
// ==========================================
async function fetchOrderMap(orderIds: string[]) {
  const map = new Map<string, any>();
  if (orderIds.length === 0) return map;

  const [{ data: orders }, { data: items }] = await Promise.all([
    supabase
      .from("print_order")
      .select("id, order_no, description, total_price")
      .in("id", orderIds),
    supabase
      .from("print_order_item")
      .select("id, order_id, category, quantity, describe")
      .in("order_id", orderIds),
  ]);

  (orders ?? []).forEach((o) => map.set(o.id, { ...o, items: [] }));
  (items ?? []).forEach((it) => {
    map.get(it.order_id)?.items.push({
      id: it.id,
      category: it.category,
      quantity: it.quantity,
      describe: it.describe,
    });
  });

  return map;
}

const toGraphemes = (text: string): string[] => {
  try {
    const seg = new (Intl as any).Segmenter("th", { granularity: "grapheme" });
    return Array.from(seg.segment(text), (x: any) => x.segment as string);
  } catch {
    return Array.from(text);
  }
};

const maskName = (name?: string | null): string => {
  const chars = toGraphemes((name ?? "").trim());
  if (chars.length === 0) return "";
  if (chars.length <= 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
};

const maskCustomer = (c: any) =>
  c
    ? { first_name: maskName(c.first_name), last_name: maskName(c.last_name) }
    : null;

export const getComplaintsAndReviews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: reviews, error: revErr } = await supabase
      .from("review")
      .select(`*, customer (first_name, last_name)`)
      .eq("shop_id", shop_id)
      .or("is_hidden.is.null,is_hidden.eq.false")
      .order("created_at", { ascending: false });

    if (revErr) return res.status(400).json({ error: revErr.message });

    const { data: reports, error: repErr } = await supabase
      .from("report")
      .select(`*, customer (first_name, last_name)`)
      .eq("shop_id", shop_id)
      .order("created_at", { ascending: false });

    if (repErr) console.error("Report Fetch Error:", repErr.message);

    const visibleReports = (reports ?? []).map((r) => ({
      ...r,
      status: (r.status ?? "").toLowerCase().trim() || "pending",
    }));

    const rawReviews = reviews ?? [];

    const orderIds = [
      ...new Set(
        [...rawReviews, ...visibleReports]
          .map((x) => x.order_id)
          .filter(Boolean) as string[]
      ),
    ];
    const orderMap = await fetchOrderMap(orderIds);

    const safeReviews = rawReviews
      .filter((r) => !r.is_hidden && r.comment !== null)
      .map((r) => ({
        ...r,
        customer: maskCustomer(r.customer),
        print_order: r.order_id ? orderMap.get(r.order_id) ?? null : null,
      }));

    const safeReports = visibleReports.map((r) => ({
      ...r,
      customer: maskCustomer(r.customer),
      print_order: r.order_id ? orderMap.get(r.order_id) ?? null : null,
    }));

    const total_reviews = safeReviews.length;

    const rating_counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumRating = 0;

    safeReviews.forEach((rev) => {
      const score = Number(rev.score || rev.rating || 0);
      sumRating += score;
      if (score >= 1 && score <= 5) {
        rating_counts[score] = (rating_counts[score] || 0) + 1;
      }
    });

    const average_rating =
      total_reviews > 0 ? Number((sumRating / total_reviews).toFixed(1)) : 0;

    const rating_breakdown = [5, 4, 3, 2, 1].map((stars) => {
      const count = rating_counts[stars] || 0;
      const percentage =
        total_reviews > 0 ? Number(((count / total_reviews) * 100).toFixed(1)) : 0;
      return { stars, count, percentage };
    });

    return res.status(200).json({
      summary: { average_rating, total_reviews, rating_breakdown },
      reviews: safeReviews,
      complaints: safeReports,
    });
  } catch (err) {
    console.error("Error in getComplaintsAndReviews:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// ตอบกลับรีวิว (Reply Review)
// ==========================================
export const replyReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { reviewId } = req.params;
    const { reply_text } = req.body;
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (!reply_text || !reply_text.trim()) {
      return res.status(400).json({ error: "กรุณากรอกข้อความตอบกลับ" });
    }

    const { data, error } = await supabase
      .from("review")
      .update({
        shop_reply: reply_text.trim(),
        reply_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .eq("shop_id", shop_id)
      .select();

    if (error) {
      console.error("Reply Review Supabase Error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "ตอบกลับรีวิวเรียบร้อยแล้ว",
      data,
    });
  } catch (err: any) {
    console.error("Error in replyReview:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// รายงานรีวิวที่ไม่เหมาะสม (Report Review)
// ==========================================
export const reportReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "กรุณาระบุเหตุผลการรายงาน" });
    }

    const { data: targetReview, error: fetchErr } = await supabase
      .from("review")
      .select("customer_id, order_id")
      .eq("id", reviewId)
      .single();

    if (fetchErr || !targetReview) {
      return res.status(404).json({ error: "ไม่พบข้อมูลรีวิวที่ต้องการรายงาน" });
    }

    // 1. บันทึกลงตาราง report
    const { data, error } = await supabase
      .from("report")
      .insert([
        {
          shop_id: shop_id,
          customer_id: targetReview.customer_id,
          order_id: targetReview.order_id,
          review_id: reviewId,
          issue_type: "รายงานรีวิวที่ไม่เหมาะสม",
          description: reason.trim(),
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Report Review Supabase Error:", error);
      return res.status(400).json({ error: error.message });
    }

    // 🟢 2. ยิง Notification เข้าไปที่ Admin (ไม่ใส่ shop_id เพื่อไม่ให้โผล่ที่ฝั่งร้าน!)
    await supabase.from("notifications").insert([
      {
        admin_id: null, // 🟢 ตั้งเป็น null เพื่อให้แอดมินทุกคนเห็น
        order_id: targetReview.order_id || null,
        title: "มีรายงานรีวิวไม่เหมาะสมใหม่",
        message: `ร้านค้ายื่นรายงานรีวิวไม่เหมาะสม: ${reason.trim()}`,
        type: "report_issue",
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "ส่งรายงานรีวิวที่ไม่เหมาะสมเรียบร้อยแล้ว",
      data,
    });
  } catch (err: any) {
    console.error("Error in reportReview:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};