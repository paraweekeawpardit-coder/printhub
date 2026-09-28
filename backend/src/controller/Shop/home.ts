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
        ? reviewList.reduce((sum, review) => sum + review.score, 0) / count
        : 0;

    return res.status(200).json({
      score: Number(avg.toFixed(2)),
      totalReviews: count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Today's Income & Order Count
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

    const { data: orders, error: orderError } = await supabase
      .from("print_order")
      .select("id")
      .eq("shop_id", shop_id);

    if (orderError) {
      return res.status(400).json({ error: orderError.message });
    }

    const orderIds = (orders ?? []).map((order) => order.id);

    if (orderIds.length === 0) {
      return res.status(200).json({ income: 0, orderCount: 0 });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data: incomeRows, error: findError } = await supabase
      .from("payment")
      .select("amount, shop_income")
      .in("order_id", orderIds)
      .gte("payment_date", startOfDay.toISOString());

    if (findError) {
      return res.status(400).json({ error: findError.message });
    }

    const rows = (incomeRows ?? []) as PaymentRow[];
    const total = rows.reduce(
      (sum, row) => sum + Number(row.shop_income ?? row.amount ?? 0),
      0
    );

    return res.status(200).json({
      income: Number(total.toFixed(2)),
      orderCount: rows.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Number of Unaccepted Orders
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

    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", "รอการดำเนินการ")
      .single();

    if (statusError || !statusData) {
      return res.status(200).json({ numWork: 0 });
    }

    const { count, error } = await supabase
      .from("print_order")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", shop_id)
      .eq("current_status_id", statusData.id);

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

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        *,
        customer (
          first_name,
          last_name,
          contact
        ),
        current_status:status!current_status_id (
          id,
          state
        ),
        print_order_item (
          *
        )
        `
      )
      .eq("shop_id", shop_id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    const sortedOrders = orders.sort((a: any, b: any) => {
      const stateA = a.current_status?.state || "";
      const stateB = b.current_status?.state || "";

      const isPendingA = stateA === "รอการดำเนินการ" || stateA === "กำลังพิมพ์";
      const isPendingB = stateB === "รอการดำเนินการ" || stateB === "กำลังพิมพ์";

      if (isPendingA && !isPendingB) return -1;
      if (!isPendingA && isPendingB) return 1;

      if (isPendingA && isPendingB) {
        const timeA = new Date(a.appointment_time || a.receive_date || a.order_date).getTime();
        const timeB = new Date(b.appointment_time || b.receive_date || b.order_date).getTime();
        return timeA - timeB;
      }

      const dateA = new Date(a.order_date).getTime();
      const dateB = new Date(b.order_date).getTime();
      return dateB - dateA;
    });

    const formattedOrders = sortedOrders.map((order: any) => ({
      ...order,
      latest_status: order.current_status?.state || "ไม่ทราบสถานะ",
    }));

    return res.status(200).json(formattedOrders.slice(0, 5));
  } catch (err) {
    console.error("Error in getTopOrder:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Financial Overview & Transactions (ส่วนใหม่)
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

    // 1. ดึง order_ids ของร้านนี้
    const { data: orders, error: orderErr } = await supabase
      .from("print_order")
      .select("id, order_date, customer(first_name, last_name)")
      .eq("shop_id", shop_id);

    if (orderErr) return res.status(400).json({ error: orderErr.message });

    const orderMap = new Map(orders?.map((o: any) => [o.id, o]));
    const orderIds = Array.from(orderMap.keys());

    if (orderIds.length === 0) {
      return res.status(200).json({
        totalGross: 0,
        totalFee: 0,
        totalNet: 0,
        transactions: [],
      });
    }

    // 2. ดึงข้อมูล Payment
    const { data: payments, error: payErr } = await supabase
      .from("payment")
      .select("*")
      .in("order_id", orderIds)
      .order("payment_date", { ascending: false });

    if (payErr) return res.status(400).json({ error: payErr.message });

    let totalGross = 0;
    let totalFee = 0;
    let totalNet = 0;

    const transactions = (payments || []).map((p: any) => {
      const gross = Number(p.amount || 0);
      const net = Number(p.shop_income ?? gross);
      const fee = Number((gross - net).toFixed(2));

      totalGross += gross;
      totalFee += fee;
      totalNet += net;

      const orderInfo: any = orderMap.get(p.order_id);

      return {
        paymentId: p.id,
        orderId: p.order_id,
        customerName: orderInfo?.customer
          ? `${orderInfo.customer.first_name} ${orderInfo.customer.last_name}`
          : "ลูกค้าทั่วไป",
        paymentDate: p.payment_date || orderInfo?.order_date,
        grossAmount: gross,
        feeAmount: fee,
        netIncome: net,
        status: p.status || "ชำระเงินแล้ว",
      };
    });

    return res.status(200).json({
      totalGross: Number(totalGross.toFixed(2)),
      totalFee: Number(totalFee.toFixed(2)),
      totalNet: Number(totalNet.toFixed(2)),
      transactions,
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

    const orderList = orders ?? [];

    // นับสัดส่วนแต่ละสถานะ
    const counts: Record<string, number> = {
      "รอการดำเนินการ": 0,
      "กำลังพิมพ์": 0,
      "พิมพ์เสร็จสิ้น": 0,
      "ยกเลิก": 0,
    };

    orderList.forEach((o: any) => {
      const st = o.current_status?.state || "รอการดำเนินการ";
      counts[st] = (counts[st] || 0) + 1;
    });

    return res.status(200).json({
      total: orderList.length,
      counts,
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
// Get Complaints & Reviews (รายการร้องเรียนและรีวิว)
// ==========================================
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

    // 2. ดึงรายการร้องเรียน (ถ้ามีตาราง report หรือ complaint)
    const { data: reports } = await supabase
      .from("report")
      .select(
        `
        *,
        customer (first_name, last_name)
        `
      )
      .eq("shop_id", shop_id)
      .order("created_at", { ascending: false });

    return res.status(200).json({
      reviews: reviews ?? [],
      complaints: reports ?? [],
    });
  } catch (err) {
    console.error("Error in getComplaintsAndReviews:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
