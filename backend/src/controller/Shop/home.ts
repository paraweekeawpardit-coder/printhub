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
// Get Total Score
// ==========================================

export const getTotalScore = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = req.headers.shop_id as string;

    if (!shop_id) {
      return res.status(400).json({
        error: "shop_id is required",
      });
    }

    const {
      data: reviews,
      error: reviewError,
    } = await supabase
      .from("review")
      .select("score")
      .eq("shop_id", shop_id);

    if (reviewError) {
      return res.status(400).json({
        error: reviewError.message,
      });
    }

    const reviewList =
      (reviews ?? []) as Review[];

    const avg =
      reviewList.length > 0
        ? reviewList.reduce(
            (sum: number, review: Review) =>
              sum + review.score,
            0
          ) / reviewList.length
        : 0;

    return res.status(200).json({
      score: Number(avg.toFixed(2)),
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Server Error",
    });
  }
};

// ==========================================
// Get Today's Income
// ==========================================

export const getTodayInCome = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = req.headers.shop_id as string;

    if (!shop_id) {
      return res.status(400).json({
        error: "shop_id is required",
      });
    }

    const {
      data: orders,
      error: orderError,
    } = await supabase
      .from("print_order")
      .select("id")
      .eq("shop_id", shop_id);

    if (orderError) {
      return res.status(400).json({
        error: orderError.message,
      });
    }

    const orderIds =
      (orders ?? []).map(
        (order) => order.id
      );

    if (orderIds.length === 0) {
      return res.status(200).json({
        income: 0,
      });
    }

    const startOfDay = new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const {
      data: incomeRows,
      error: findError,
    } = await supabase
      .from("payment")
      .select(
        "amount, shop_income"
      )
      .in(
        "order_id",
        orderIds
      )
      .gte(
        "payment_date",
        startOfDay.toISOString()
      );

    if (findError) {
      return res.status(400).json({
        error: findError.message,
      });
    }

    const rows =
      (incomeRows ?? []) as PaymentRow[];

    const total = rows.reduce(
      (
        sum: number,
        row: PaymentRow
      ) =>
        sum +
        Number(
          row.shop_income ??
            row.amount ??
            0
        ),
      0
    );

    return res.status(200).json({
      income: Number(
        total.toFixed(2)
      ),
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Server Error",
    });
  }
};

// Get Number of Unaccepted Orders
export const getNumOrderUnAccept = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({
        error: "shop_id is required",
      });
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
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      numWork: count ?? 0,
    });

  } catch (err) {
    console.error("Error in getNumOrderUnAccept:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};


// Get Top Orders

export const getTopOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({
        error: "shop_id is required",
      });
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
      return res.status(400).json({
        error: error.message,
      });
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

    const topOrders = formattedOrders.slice(0, 5);

    return res.status(200).json(topOrders);

  } catch (err) {
    console.error("Error in getTopOrder:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};