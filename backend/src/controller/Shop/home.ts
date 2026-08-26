import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

interface Review {
  score: number;
}

interface PaymentRow {
  amount: number | null;
  shop_income: number | null;
}

export const getTotalScore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.headers["shop_id"]) as string;

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

    const avg =
      reviewList.length > 0
        ? reviewList.reduce((sum: number, r: Review) => sum + r.score, 0) /
          reviewList.length
        : 0;

    return res.status(200).json({
      score: Number(avg.toFixed(2)),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getTodayInCome = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.headers["shop_id"]) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: orders, error: orderError } = await supabase
      .from("print_order")
      .select("id")
      .eq("shop_id", shop_id);

    if (orderError) return res.status(400).json({ error: orderError.message });

    const orderIds = (orders ?? []).map((o) => o.id);
    if (orderIds.length === 0) {
      return res.status(200).json({ income: 0 });
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
      (sum: number, row: PaymentRow) =>
        sum + Number(row.shop_income ?? row.amount ?? 0),
      0
    );

    return res.status(200).json({
      income: Number(total.toFixed(2)),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// สถานะที่ถือว่า "รอการดำเนินการ" — ใช้ค่าเดียวกับที่ getTopOrder ใช้เทียบ
// (ก่อนหน้านี้ฟังก์ชันนี้เทียบกับ "รอการดำเนินงาน" ซึ่งสะกดไม่ตรงกับที่อื่น
// ถ้า state จริงใน DB สะกดต่างจากนี้ ให้แก้ค่านี้ให้ตรงกับข้อมูลจริงในตาราง status)
const PENDING_STATE = "รอการดำเนินการ";

export const getNumOrderUnAccept = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.headers["shop_id"]) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // ดึงออเดอร์ของร้าน พร้อมประวัติ work_status ทั้งหมดของแต่ละออเดอร์
    // เพราะ work_status เป็นตารางประวัติ (insert แถวใหม่ทุกครั้งที่เปลี่ยนสถานะ
    // ไม่ได้ update แถวเดิม) จึงต้องดูว่า "สถานะล่าสุด" ของแต่ละออเดอร์คืออะไร
    // แทนที่จะนับทุกแถวที่เคยมีสถานะรอดำเนินการ (ซึ่งจะไม่มีวันลดลงเลย)
    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        work_status (
          updated_at,
          status (state)
        )
        `
      )
      .eq("shop_id", shop_id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const numWork = (orders ?? []).filter((order: any) => {
      const statuses = order.work_status || [];
      if (statuses.length === 0) return false;

      const latest = [...statuses].sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];

      return latest?.status?.state === PENDING_STATE;
    }).length;

    return res.status(200).json({ numWork });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getTopOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (
      req.headers.shop_id ||
      req.headers["shop_id"] ||
      req.query.shop_id
    ) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        *,
        customer (first_name, last_name),
        work_status (
          updated_at,
          status (state)
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

    const formattedOrders = orders.map((order: any) => {
      const statuses = order.work_status || [];

      statuses.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      const latestState = statuses[0]?.status?.state || "";

      return {
        ...order,
        latest_status: latestState,
      };
    });

    const pendingOrders = formattedOrders.filter(
      (order) => order.latest_status === PENDING_STATE
    );
    let resultOrders = [];
    if (pendingOrders.length < 3) {
      resultOrders = formattedOrders.slice(0, 3);
    } else {
      resultOrders = pendingOrders;
    }

    return res.status(200).json(resultOrders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { order_id, status_name } = req.body;

    if (!order_id || !status_name) {
      return res.status(400).json({
        error: "order_id and status_name are required",
      });
    }

    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", status_name)
      .single();

    if (statusError || !statusData) {
      return res.status(404).json({
        error: `Status '${status_name}' not found`,
      });
    }

    const { data: newWorkStatus, error: insertError } = await supabase
      .from("work_status")
      .insert([
        {
          order_id: order_id,
          status_id: statusData.id,
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (insertError) {
      return res.status(400).json({
        error: insertError.message,
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      data: newWorkStatus[0],
    });
  } catch (err) {
    console.error("Update Status Error:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};