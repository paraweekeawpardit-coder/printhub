import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/transactions
 * ดึงรายการธุรกรรมการชำระเงินทั้งหมด พร้อม Pagination
 */
export const getAllTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: transactions, error, count } = await supabase
      .from("payment")
      .select(`
        *,
        order:order_id (
          id,
          order_no,
          total_price,
          subtotal_price,
          platform_fee,
          small_order_fee,
          order_date,
          status:current_status_id (
            id,
            state
          )
        ),
        sender_customer:sender (
          id,
          first_name,
          last_name,
          contact
        ),
        receiver_shop:receiver (
          id,
          shop_name,
          owner_name,
          email,
          phone
        )
      `, { count: "exact" })
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

    const formattedTransactions = (transactions || []).map((tx: any) => {
      const amount = Number(tx.amount || tx.order?.total_price || 0);

      const dbSmallFee = Number(tx.order?.small_order_fee || 0);
      const dbPlatformFee = Number(tx.order?.platform_fee || 0);

      let platformFee = 0;

      if (dbSmallFee > 0) {
        platformFee = dbSmallFee;
      } else if (dbPlatformFee > 0) {
        platformFee = dbPlatformFee;
      } else {
        platformFee = amount < 50 ? 20 : Number((amount * 0.08).toFixed(2));
      }

      const shopIncome = Number((amount - platformFee).toFixed(2));

      return {
        ...tx,
        amount: amount,
        platform_fee: platformFee,
        shop_income: shopIncome,
        customer_name: tx.sender_customer 
          ? `${tx.sender_customer.first_name || ""} ${tx.sender_customer.last_name || ""}`.trim()
          : "-",
        shop_name: tx.receiver_shop?.shop_name || "-",
        order_no: tx.order?.order_no ? `#${tx.order.order_no}` : "-",
        order_id: tx.order?.order_no ? `#${tx.order.order_no}` : (tx.order_id || "-"),
      };
    });

    return res.status(200).json({
      data: formattedTransactions,
      currentPage: page,
      totalPages: count ? Math.ceil(count / limit) : 0,
      totalCount: count || 0,
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

/**
 * GET /api/admin/refunds
 * ดึงรายการออเดอร์ที่มีสถานะ "ยกเลิกการพิมพ์" เพื่อรอดำเนินการคืนเงิน
 */
export const getPendingRefunds = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: statusObj } = await supabase
      .from("status")
      .select("id")
      .eq("state", "ยกเลิกการพิมพ์")
      .maybeSingle();

    if (!statusObj) {
      return res.status(200).json([]);
    }

    const { data: refunds, error } = await supabase
      .from("print_order")
      .select(`
        *,
        status:current_status_id (
          id,
          state
        ),
        customer:customer_id (
          id,
          first_name,
          last_name,
          contact
        ),
        shop:shop_id (
          id,
          shop_name
        ),
        payment:payment!order_id (
          id,
          slip_url,
          amount,
          status,
          payment_date
        )
      `)
      .eq("current_status_id", statusObj.id)
      .order("order_date", { ascending: false });

    if (error) {
      console.error("GetPendingRefunds Error:", error.message);
      return res.status(200).json([]);
    }

    const pendingRefunds = (refunds || []).filter((item: any) => {
      const payList = Array.isArray(item.payment) ? item.payment : (item.payment ? [item.payment] : []);
      const isAlreadyRefunded = payList.some((p: any) => p.status === "REFUNDED");
      return !isAlreadyRefunded;
    });

    return res.status(200).json(pendingRefunds);
  } catch (err: any) {
    console.error("GetPendingRefunds Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/refunds/process
 * ยืนยันการโอนเงินคืนลูกค้า (พร้อมแนบสลิปคืนเงิน)
 */
export const processRefund = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { order_id, refund_slip_url, refund_amount } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: "order_id is required" });
    }

    const { data: existingPayment } = await supabase
      .from("payment")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    let updatedPayment;

    if (existingPayment) {
      const { data, error: payErr } = await supabase
        .from("payment")
        .update({
          status: "REFUNDED",
          slip_url: refund_slip_url || null,
        })
        .eq("order_id", order_id)
        .select()
        .single();

      if (payErr) return res.status(400).json({ error: payErr.message });
      updatedPayment = data;
    } else {
      const { data: orderData } = await supabase
        .from("print_order")
        .select("customer_id, shop_id, total_price")
        .eq("id", order_id)
        .single();

      if (!orderData) {
        return res.status(404).json({ error: "Order not found" });
      }

      const { data, error: insertErr } = await supabase
        .from("payment")
        .insert({
          order_id: order_id,
          amount: refund_amount || orderData.total_price || 0,
          sender: orderData.customer_id,
          receiver: orderData.shop_id,
          slip_url: refund_slip_url || null,
          status: "REFUNDED",
        })
        .select()
        .single();

      if (insertErr) return res.status(400).json({ error: insertErr.message });
      updatedPayment = data;

      await supabase
        .from("print_order")
        .update({ payment_id: data.id })
        .eq("id", order_id);
    }

    const { data: order } = await supabase
      .from("print_order")
      .select("customer_id, order_no")
      .eq("id", order_id)
      .single();

    if (order?.customer_id) {
      await supabase.from("notifications").insert({
        customer_id: order.customer_id,
        order_id: order_id,
        title: "โอนเงินคืนสำเร็จ",
        message: `รายการคำสั่งซื้อ #${order.order_no || order_id.slice(0, 8)} ได้รับการโอนเงินคืนเรียบร้อยแล้ว`,
        type: "REFUND_SUCCESS",
        is_read: false,
      });
    }

    return res.status(200).json({
      message: "Refund processed successfully",
      data: updatedPayment,
    });
  } catch (err: any) {
    console.error("ProcessRefund Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};