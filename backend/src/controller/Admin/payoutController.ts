import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/payouts
 * ดึงรายการโอนเงินให้ร้านค้า (Shop Payouts)
 */
export const getPayouts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: payments, error } = await supabase
      .from("payment")
      .select(`
        *,
        order:order_id (
          id,
          order_no,
          total_price,
          total_amount,
          platform_fee,
          small_order_fee
        ),
        shop:receiver (
          id,
          shop_name,
          phone,
          bank_account (
            bank_name,
            account_number,
            account_name
          )
        )
      `)
      .order("payment_date", { ascending: false });

    if (error) {
      console.error("GetPayouts Supabase Error:", error.message);
      return res.status(200).json([]);
    }

    const formattedPayouts = (payments || [])
      .map((item: any) => {
        // หากสถานะ Payout เป็น REJECTED ให้กรองออก หรือแยกแท็บตามต้องการ
        if (item.status === "PAYOUT_REJECTED") return null;

        const amount = Number(item.amount || item.order?.total_amount || item.order?.total_price || 0);
        const dbSmallFee = Number(item.order?.small_order_fee || 0);
        const dbPlatformFee = Number(item.order?.platform_fee || 0);

        let platformFee = dbSmallFee + dbPlatformFee;
        if (platformFee === 0 && amount > 0) {
          platformFee = Number(item.platform_fee || Math.round(amount * 0.08 * 100) / 100);
        }

        const shopIncome = Number(item.shop_income || (amount - platformFee));
        const rawOrderNo = item.order?.order_no ? String(item.order.order_no) : null;

        return {
          ...item,
          amount,
          platform_fee: platformFee,
          shop_income: Math.max(0, shopIncome),
          order_no: rawOrderNo,
          payout_status: item.payout_slip_url || item.status === "PAID" || item.status === "completed" ? "PAID" : "PENDING",
          shop: item.shop || null,
        };
      })
      .filter(Boolean);

    return res.status(200).json(formattedPayouts);
  } catch (err: any) {
    console.error("GetPayouts Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/payouts/process
 * ยืนยันการโอนเงินให้ร้านค้า
 */
export const processPayout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { payout_id, payout_ids, payout_slip_url } = req.body;

    if (!payout_slip_url) return res.status(400).json({ error: "payout_slip_url is required" });

    const targetIds: string[] = Array.isArray(payout_ids) && payout_ids.length > 0
      ? payout_ids
      : payout_id ? [payout_id] : [];

    if (targetIds.length === 0) return res.status(400).json({ error: "payout_id or payout_ids is required" });

    const now = new Date().toISOString();

    const { data: updatedPayments, error } = await supabase
      .from("payment")
      .update({
        payout_slip_url: payout_slip_url,
        status: "PAID",
        payout_date: now,
        updated_at: now,
      })
      .in("id", targetIds)
      .select(`
        *,
        shop:receiver ( id, shop_name )
      `);

    if (error) return res.status(400).json({ error: error.message });

    if (updatedPayments && updatedPayments.length > 0) {
      const uniqueShops = Array.from(new Set(updatedPayments.map((p) => p.receiver).filter(Boolean)));
      for (const shopId of uniqueShops) {
        await supabase.from("notifications").insert({
          shop_id: shopId,
          title: "โอนเงินค่าบริการสำเร็จ",
          message: `ระบบได้โอนเงินค่าบริการรายการออเดอร์เข้าบัญชีของคุณเรียบร้อยแล้ว`,
          type: "PAYOUT_SUCCESS",
          is_read: false,
        });
      }
    }

    return res.status(200).json({ message: "Payout processed successfully", data: updatedPayments });
  } catch (err: any) {
    console.error("ProcessPayout Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/payouts/reject
 * ปฏิเสธการโอนเงินให้ร้านค้า (กรณีมี Report/ชะลอการโอนเงิน)
 */
export const rejectPayout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { payout_id, reason } = req.body;

    if (!payout_id) return res.status(400).json({ error: "payout_id is required" });

    const now = new Date().toISOString();

    const { data: updatedPayment, error } = await supabase
      .from("payment")
      .update({
        status: "PAYOUT_REJECTED",
        updated_at: now,
      })
      .eq("id", payout_id)
      .select("receiver, order_id")
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // ส่งการแจ้งเตือนหาร้านค้า
    if (updatedPayment?.receiver) {
      await supabase.from("notifications").insert({
        shop_id: updatedPayment.receiver,
        order_id: updatedPayment.order_id,
        title: "การโอนเงินค่าบริการถูกชะลอ/ปฏิเสธ",
        message: `รายการโอนเงินค่าบริการถูกระงับชั่วคราว เนื่องจาก: ${reason || "มีรายงานปัญหาเกี่ยวกับออเดอร์นี้ที่กำลังตรวจสอบ"}`,
        type: "PAYOUT_REJECTED",
        is_read: false,
      });
    }

    return res.status(200).json({ message: "Payout rejected successfully" });
  } catch (err: any) {
    console.error("RejectPayout Exception:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};