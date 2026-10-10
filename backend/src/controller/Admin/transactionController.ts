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
 * ดึงรายการออเดอร์ที่มีสถานะ "ยกเลิกการพิมพ์" ทั้งหมด
 */
export const getPendingRefunds = async (req: Request, res: Response): Promise<Response> => {
  try {
    // 1. ดึง ID ของสถานะ "ยกเลิกการพิมพ์"
    const { data: statusObj } = await supabase
      .from("status")
      .select("id")
      .eq("state", "ยกเลิกการพิมพ์")
      .maybeSingle();

    if (!statusObj) return res.status(200).json([]);

    // 2. ดึงข้อมูลออเดอร์ พร้อม Join ตาราง work_status เฉพาะอันที่เป็นสถานะ "ยกเลิกการพิมพ์"
    const { data: refunds, error } = await supabase
      .from("print_order")
      .select(`
        *,
        status:current_status_id ( id, state ),
        customer:customer_id ( id, first_name, last_name, contact ),
        shop:shop_id ( id, shop_name ),
        payment:payment!order_id ( id, slip_url, refund_slip_url, amount, status, payment_date ),
        cancel_history:work_status!order_id ( updated_at, status_id )
      `)
      .eq("current_status_id", statusObj.id);

    if (error) {
      console.error("GetPendingRefunds Error:", error.message);
      return res.status(200).json([]);
    }

    // 3. จัดกลุ่มข้อมูล หาประวัติการยกเลิก และดึงวันที่ยกเลิก (updated_at)
    const formattedRefunds = (refunds || []).map((item: any) => {
      const payList = Array.isArray(item.payment) ? item.payment : item.payment ? [item.payment] : [];
      const refundedPayment = payList.find((p: any) => p.status === "REFUNDED");
      const isRefunded = Boolean(refundedPayment);
      const refundSlip = refundedPayment?.refund_slip_url || payList[0]?.refund_slip_url || null;

      // ค้นหา record ใน work_status ที่ตรงกับสถานะยกเลิก
      const cancelHistoryList = Array.isArray(item.cancel_history) ? item.cancel_history : [];
      const cancelRecord = cancelHistoryList.find((ws: any) => ws.status_id === statusObj.id);

      // ถ้าระบบเคยลงบันทึกใน work_status ไว้ ให้ใช้วันนั้น ถ้าไม่มีให้ Fallback เป็น order_date
      const canceledAt = cancelRecord?.updated_at || item.order_date;

      return {
        ...item,
        canceled_at: canceledAt,
        refund_slip_url: refundSlip,
        is_refunded: isRefunded,
        payment_status: isRefunded ? "REFUNDED" : "PENDING",
      };
    });

    // 4. เรียงลำดับตามวันที่ยกเลิกล่าสุดขึ้นก่อน (Descending Order)
    formattedRefunds.sort((a, b) => new Date(b.canceled_at).getTime() - new Date(a.canceled_at).getTime());

    return res.status(200).json(formattedRefunds);
  } catch (err: any) {
    console.error("GetPendingRefunds Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/refunds/process
 * ยืนยันการโอนเงินคืนลูกค้า (แนบสลิปคืนเงินเข้า refund_slip_url)
 */
export const processRefund = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { order_id, refund_slip_url, refund_amount } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: "order_id is required" });
    }

    // 1. เช็ครายการ Payment เดิมเพื่อทำการอัปเดต
    const { data: existingPayment } = await supabase
      .from("payment")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    let updatedPayment;

    if (existingPayment) {
      // อัปเดต status และ refund_slip_url ในตาราง payment
      const { data, error: payErr } = await supabase
        .from("payment")
        .update({
          status: "REFUNDED",
          refund_slip_url: refund_slip_url || null,
        })
        .eq("order_id", order_id)
        .select()
        .single();

      if (payErr) return res.status(400).json({ error: payErr.message });
      updatedPayment = data;
    } else {
      // กรณีที่ไม่มี Record ใน payment ให้สร้างใหม่
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
          refund_slip_url: refund_slip_url || null,
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

    // 2. บันทึกการแจ้งเตือนไปยังลูกค้า
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