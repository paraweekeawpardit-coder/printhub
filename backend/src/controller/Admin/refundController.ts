import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/refunds
 * ดึงรายการออเดอร์ที่มีสถานะ "ยกเลิกการพิมพ์" ทั้งหมด
 */
export const getPendingRefunds = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: statusObj } = await supabase
      .from("status")
      .select("id")
      .eq("state", "ยกเลิกการพิมพ์")
      .maybeSingle();

    if (!statusObj) return res.status(200).json([]);

    const { data: refunds, error } = await supabase
      .from("print_order")
      .select(`
        *,
        status:current_status_id ( id, state ),
        customer:customer_id ( id, first_name, last_name, contact ),
        shop:shop_id ( id, shop_name ),
        payment:payment!order_id ( id, slip_url, refund_slip_url, amount, status, payment_date, payout_date, updated_at ),
        report:report!order_id ( bank_name, account_number, account_name, description, issue_type ),
        cancel_history:work_status!order_id ( updated_at, status_id )
      `)
      .eq("current_status_id", statusObj.id);

    if (error) {
      console.error("GetPendingRefunds Error:", error.message);
      return res.status(200).json([]);
    }

    const formattedRefunds = (refunds || [])
      .map((item: any) => {
        const payList = Array.isArray(item.payment) ? item.payment : item.payment ? [item.payment] : [];
        
        // หากถูกปฏิเสธแล้ว (REJECTED) ไม่ต้องโชว์ในตาราง PENDING
        const isRejected = payList.some((p: any) => p.status === "REJECTED");
        if (isRejected) return null;

        const refundedPayment = payList.find((p: any) => p.status === "REFUNDED");
        const isRefunded = Boolean(refundedPayment);
        
        const refundSlip = refundedPayment?.refund_slip_url || payList[0]?.refund_slip_url || null;
        const originalSlip = payList[0]?.slip_url || null;

        const cancelHistoryList = Array.isArray(item.cancel_history) ? item.cancel_history : [];
        const cancelRecord = cancelHistoryList.find((ws: any) => ws.status_id === statusObj.id);

        const canceledAt = cancelRecord?.updated_at || item.updated_at || item.order_date || item.created_at;
        const refundedAt = refundedPayment?.updated_at || refundedPayment?.payout_date || refundedPayment?.payment_date || canceledAt;

        const reportData = Array.isArray(item.report) ? item.report[0] : item.report;

        return {
          ...item,
          canceled_at: canceledAt,
          refunded_at: isRefunded ? refundedAt : null,
          refund_slip_url: refundSlip,
          original_slip_url: originalSlip,
          is_refunded: isRefunded,
          payment_status: isRefunded ? "REFUNDED" : "PENDING",
          bank_account_no: reportData?.account_number || null,
          bank_name: reportData?.bank_name || null,
          bank_account_name: reportData?.account_name || null,
        };
      })
      .filter(Boolean);

    formattedRefunds.sort((a, b) => new Date(b.canceled_at).getTime() - new Date(a.canceled_at).getTime());

    return res.status(200).json(formattedRefunds);
  } catch (err: any) {
    console.error("GetPendingRefunds Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/refunds/process
 * ยืนยันการโอนเงินคืนลูกค้า
 */
export const processRefund = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { order_id, refund_slip_url, refund_amount } = req.body;

    if (!order_id) return res.status(400).json({ error: "order_id is required" });

    const { data: existingPayment } = await supabase
      .from("payment")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    const nowIso = new Date().toISOString();
    let updatedPayment;

    if (existingPayment) {
      const { data, error: payErr } = await supabase
        .from("payment")
        .update({
          status: "REFUNDED",
          refund_slip_url: refund_slip_url || null,
          payout_date: nowIso,
          updated_at: nowIso,
        })
        .eq("order_id", order_id)
        .select()
        .single();

      if (payErr) return res.status(400).json({ error: payErr.message });
      updatedPayment = data;
    } else {
      const { data: orderData } = await supabase
        .from("print_order")
        .select("customer_id, shop_id, total_price, total_amount")
        .eq("id", order_id)
        .single();

      if (!orderData) return res.status(404).json({ error: "Order not found" });

      const { data, error: insertErr } = await supabase
        .from("payment")
        .insert({
          order_id: order_id,
          amount: refund_amount || orderData.total_amount || orderData.total_price || 0,
          sender: orderData.customer_id,
          receiver: orderData.shop_id,
          refund_slip_url: refund_slip_url || null,
          payout_date: nowIso,
          updated_at: nowIso,
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

    return res.status(200).json({ message: "Refund processed successfully", data: updatedPayment });
  } catch (err: any) {
    console.error("ProcessRefund Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/refunds/reject
 * ปฏิเสธคำขอคืนเงิน (เช่น กรณีไม่มีสลิปเดิม/สลิปปลอม)
 */
export const rejectRefund = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { order_id, reason } = req.body;

    if (!order_id) return res.status(400).json({ error: "order_id is required" });

    const { data: existingPayment } = await supabase
      .from("payment")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    const nowIso = new Date().toISOString();

    if (existingPayment) {
      const { error: payErr } = await supabase
        .from("payment")
        .update({
          status: "REJECTED",
          payout_date: nowIso,
          updated_at: nowIso,
        })
        .eq("order_id", order_id);

      if (payErr) return res.status(400).json({ error: payErr.message });
    } else {
      const { data: orderData } = await supabase
        .from("print_order")
        .select("customer_id, shop_id, total_price, total_amount")
        .eq("id", order_id)
        .single();

      if (orderData) {
        await supabase.from("payment").insert({
          order_id: order_id,
          amount: orderData.total_amount || orderData.total_price || 0,
          sender: orderData.customer_id,
          receiver: orderData.shop_id,
          payout_date: nowIso,
          updated_at: nowIso,
          status: "REJECTED",
        });
      }
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
        title: "การคืนเงินถูกปฏิเสธ",
        message: `รายการคำสั่งซื้อ #${order.order_no || order_id.slice(0, 8)} ถูกปฏิเสธการโอนเงินคืน เนื่องจาก: ${reason || "ไม่พบหลักฐานการชำระเงินเดิม"}`,
        type: "REFUND_REJECTED",
        is_read: false,
      });
    }

    return res.status(200).json({ message: "Refund rejected successfully" });
  } catch (err: any) {
    console.error("RejectRefund Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};