// slip.ts  (โฟลเดอร์เดียวกับ home.ts / order.ts / detail.ts)
//
// ดึงข้อมูลการโอนจากฐานข้อมูลโดยตรง (ไม่ใช้ API ภายนอก ไม่ต้องมี key)
// แสดงอย่างเดียว ไม่ตัดสินถูก/ผิด — ร้านตรวจสลิปเอง
import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

export const getSlipInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id || req.params.order_id;
    const shop_id = (req.query.shop_id || req.headers.shop_id) as string | undefined;
    if (!id) return res.status(400).json({ error: "order id is required" });

    const { data: order } = await supabase
      .from("print_order")
      .select(
        `id, shop_id, order_no, payment_id,
         customer:customer_id ( first_name, last_name )`
      )
      .eq("id", id)
      .single();

    if (!order || (shop_id && order.shop_id !== shop_id)) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    const payQuery = supabase
      .from("payment")
      .select("id, amount, payment_date, slip_url, status");
    const { data: pay } = order.payment_id
      ? await payQuery.eq("id", order.payment_id).maybeSingle()
      : await payQuery.eq("order_id", id).maybeSingle();

    if (!pay?.slip_url) return res.status(200).json({ ok: false, error: "ยังไม่มีสลิป" });

    const customer: any = Array.isArray(order.customer) ? order.customer[0] : order.customer;
    const customerName =
      `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim() || "ลูกค้าทั่วไป";

    return res.status(200).json({
      ok: true,
      slip: {
        customer_name: customerName,
        uploaded_at: pay.payment_date ?? null,
        amount: pay.amount !== null && pay.amount !== undefined ? Number(pay.amount) : null,
        order_no: order.order_no ?? null,
        payment_ref: String(pay.id).slice(0, 8).toUpperCase(),
      },
    });
  } catch (err) {
    console.error("getSlipInfo error:", err);
    return res.status(200).json({ ok: false, error: "ดึงข้อมูลการโอนไม่สำเร็จ" });
  }
};