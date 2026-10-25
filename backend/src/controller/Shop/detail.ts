import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

const ORDER_PENDING_STATE = "รอการดำเนินงาน";
const ORDER_CANCELLED_STATE = "ยกเลิกการพิมพ์";
const ORDER_PRINTING_STATE = "กำลังพิมพ์";
const REJECT_REASON_MAX_LENGTH = 500;

// Helper: ปรับเวลาให้อยู่ในกรอบ 00:00:00 - 23:59:59.999 ของวันนั้นๆ
export const getDayBounds = (dateInput: Date | string) => {
  const startOfDay = new Date(dateInput);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(dateInput);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
  };
};

// Helper: หาเวลานัดรับงาน
// - ถ้า receive_date เป็น date-only และ appointment_time เป็น time-only ให้รวมเป็นค่าเดียว
// - ถ้าไม่ใช่ ใช้ appointment_time ก่อน แล้วค่อย fallback ไปที่ receive_date
const resolveReceiveDate = (receiveDate?: string | null, appointmentTime?: string | null) => {
  const isDateOnly = (v?: string | null) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const isTimeOnly = (v?: string | null) => !!v && /^\d{2}:\d{2}(:\d{2})?$/.test(v);

  if (isDateOnly(receiveDate) && isTimeOnly(appointmentTime)) {
    return `${receiveDate}T${appointmentTime}`;
  }
  // appointment_time คือเวลานัดรับจริงที่ลูกค้าเลือก (ตรงกับหน้า list)
  // ส่วน receive_date อาจเก็บแค่วันที่ (เวลา 00:00:00) จึงใช้เป็นตัวสำรอง
  return appointmentTime || receiveDate || null;
};

export const getOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const order_id = (
      req.params.id ||
      req.params.order_id ||
      req.query.order_id ||
      req.headers.order_id
    ) as string;

    if (!order_id) {
      return res.status(400).json({ error: "order_id is required" });
    }

    const { data: order, error } = await supabase
      .from("print_order")
      .select(
        `
        id, order_no, description, subtotal_price, small_order_fee, platform_fee,
        total_amount, order_date, receive_date, appointment_time, current_status_id,
        payment_id, review_id, reject_reason,
        customer (
          id, first_name, last_name, contact,
          address ( detail, subdistrict, district, province, postcode )
        ),
        print_order_item ( id, category, describe, file_url, quantity, unit_price, subtotal, page_count ),
        print_file ( id, filename, file_url, file_size_mb, page_count, item_id )
        `
      )
      .eq("id", order_id)
      .single();

    if (error || !order) {
      console.error("Fetch Order Supabase Error:", error);
      return res.status(404).json({ error: "Order not found" });
    }

    const [
      { data: statusRow },
      { data: paymentRow },
      { data: reviewRow },
    ] = await Promise.all([
      order.current_status_id
        ? supabase.from("status").select("state").eq("id", order.current_status_id).single()
        : Promise.resolve({ data: null }),
      order.payment_id
        ? supabase.from("payment").select("amount, slip_url, payment_date, status, is_verified").eq("id", order.payment_id).single()
        : Promise.resolve({ data: null }),
      order.review_id
        ? supabase.from("review").select("score, comment").eq("id", order.review_id).single()
        : Promise.resolve({ data: null }),
    ]);

    const statusState = statusRow?.state || ORDER_PENDING_STATE;
    const formattedCustomer: any = Array.isArray(order.customer) ? order.customer[0] : order.customer;
    const formattedAddress = Array.isArray(formattedCustomer?.address) ? formattedCustomer.address[0] : formattedCustomer?.address;

    return res.status(200).json({
      order: {
        id: order.id,
        order_no: order.order_no,
        order_date: order.order_date,
        receive_date: resolveReceiveDate(order.receive_date, order.appointment_time),
        description: order.description,
        reject_reason: (order as any).reject_reason || null,
        subtotal_price: Number(order.subtotal_price || 0),
        small_order_fee: Number(order.small_order_fee || 0),
        platform_fee: Number(order.platform_fee || 0),
        total_amount: Number(order.total_amount || 0),
        total_price: Number(order.total_amount || 0),
        status_state: statusState,
        customer: {
          id: formattedCustomer?.id,
          first_name: formattedCustomer?.first_name,
          last_name: formattedCustomer?.last_name,
          contact: formattedCustomer?.contact,
          address: formattedAddress || null,
        },
        items: (order.print_order_item || []).map((item: any) => ({
          ...item,
          unit_price: Number(item.unit_price || 0),
          subtotal: Number(item.subtotal || 0),
        })),
        files: order.print_file || [],
        payment: paymentRow || null,
        review: reviewRow || null,
      },
    });
  } catch (err: any) {
    console.error("Backend Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// UPDATE ORDER STATUS (เปลี่ยนสถานะทั่วไป)
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id || req.params.order_id;
    const { status_name } = req.body;
    const rejectReason =
      typeof req.body.reject_reason === "string"
        ? req.body.reject_reason.trim().slice(0, REJECT_REASON_MAX_LENGTH)
        : "";
    const shop_id = (req.query.shop_id || req.headers.shop_id) as string | undefined;

    if (!id || !status_name) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // ปฏิเสธออเดอร์ (ยกเลิกการพิมพ์) ต้องมีเหตุผลเสมอ
    if (status_name === ORDER_CANCELLED_STATE && !rejectReason) {
      return res.status(400).json({ error: "กรุณาระบุเหตุผลในการปฏิเสธออเดอร์" });
    }

    const { data: order, error: orderError } = await supabase
      .from("print_order")
      .select("id, shop_id, current_status_id, payment_id")
      .eq("id", id)
      .single();

    if (orderError || !order) return res.status(404).json({ error: "Order not found" });
    if (shop_id && order.shop_id !== shop_id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ยืนยันออเดอร์ (เริ่มพิมพ์) ได้เฉพาะเมื่อร้านตรวจสลิปแล้วว่าถูกต้อง
    if (status_name === ORDER_PRINTING_STATE) {
      const { data: payRow } = order.payment_id
        ? await supabase.from("payment").select("is_verified").eq("id", order.payment_id).maybeSingle()
        : await supabase.from("payment").select("is_verified").eq("order_id", id).maybeSingle();

      if (payRow?.is_verified !== true) {
        return res.status(400).json({
          error: "กรุณาตรวจสอบสลิปให้ถูกต้องก่อนยืนยันออเดอร์",
          code: "SLIP_NOT_VERIFIED",
        });
      }
    }

    const { data: statusData } = await supabase
      .from("status")
      .select("id, state")
      .eq("state", status_name)
      .single();

    if (!statusData) return res.status(404).json({ error: `Status '${status_name}' not found` });

    // สร้างประวัติการอัปเดตสถานะ (work_status)
    const { data: newWorkStatus } = await supabase
      .from("work_status")
      .insert([{ order_id: id, status_id: statusData.id, updated_at: new Date().toISOString() }])
      .select("id")
      .single();

    // อัปเดตสถานะหลักบน print_order
    const updatePayload: any = { current_status_id: statusData.id };
    if (newWorkStatus?.id) {
      updatePayload.work_state_id = newWorkStatus.id;
    }

    // เก็บเหตุผลที่ปฏิเสธลงคอลัมน์ reject_reason (ชื่อคอลัมน์ตามที่มีใน DB)
    if (status_name === ORDER_CANCELLED_STATE) {
      updatePayload.reject_reason = rejectReason;
    }

    const { error: updateError } = await supabase
      .from("print_order")
      .update(updatePayload)
      .eq("id", id);

    if (updateError) {
      console.error("Update order status error:", updateError);
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({
      message: "Status updated",
      data: {
        status_state: statusData.state,
        reject_reason: status_name === ORDER_CANCELLED_STATE ? rejectReason : null,
      },
    });
  } catch (err: any) {
    console.error("Update Order Status Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// VERIFY PAYMENT SLIP & AUTO CHANGE STATUS
export const verifyPayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id || req.params.order_id;
    let { is_verified } = req.body;
    const shop_id = (req.query.shop_id || req.headers.shop_id) as string | undefined;

    if (typeof is_verified === "string") {
      is_verified = is_verified === "true";
    }

    if (!id || typeof is_verified !== "boolean") {
      return res.status(400).json({ error: "Invalid payload: is_verified must be boolean" });
    }

    const { data: order } = await supabase
      .from("print_order")
      .select("id, shop_id, payment_id, current_status_id, order_date, expires_at")
      .eq("id", id)
      .single();

    if (!order || (shop_id && order.shop_id !== shop_id)) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    // 1. อัปเดตสถานะสลิป
    if (order.payment_id) {
      await supabase
        .from("payment")
        .update({ is_verified, status: is_verified ? "paid" : "rejected" })
        .eq("id", order.payment_id);
    }

    // สลิปถูกต้อง: บันทึกผลตรวจสลิปอย่างเดียว ไม่เปลี่ยนสถานะออเดอร์
    // (ร้านต้องกด "ยืนยันออเดอร์" เองอีกครั้ง)
    if (is_verified) {
      const { data: curStatus } = order.current_status_id
        ? await supabase.from("status").select("state").eq("id", order.current_status_id).maybeSingle()
        : { data: null };

      return res.status(200).json({
        message: "Payment verified successfully",
        is_verified,
        new_status: curStatus?.state ?? null,
      });
    }

    // สลิปไม่ถูกต้อง: เปลี่ยนเป็น "รอการชำระเงิน" ตามเดิม
    const nextStatusName = "รอการชำระเงิน";
    let newExpiresAt: string | undefined = undefined;
    const now = Date.now();

    // =========================================================
    // 🌟 สิ่งที่เพื่อนต้องเพิ่ม: คำนวณคืนเวลาให้ลูกค้า ถ้าร้านปฏิเสธสลิป
    // =========================================================
    if (!is_verified) {
      const parseSafeTime = (dateStr?: string | null) => {
        if (!dateStr) return null;
        let cleaned = String(dateStr).trim();
        if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
          cleaned = `${cleaned.replace(" ", "T")}Z`;
        }
        const parsed = new Date(cleaned).getTime();
        return isNaN(parsed) ? null : parsed;
      };

      const { data: payData, error: payErr } = await supabase
        .from("payment")
        .select("payment_date")
        .eq("order_id", id)
        .maybeSingle();
      if (payErr) console.error("Fetch payment_date error:", payErr);

      const uploadTimeMs = parseSafeTime(payData?.payment_date) || now;
      
      let currentExpiresAtMs = parseSafeTime(order.expires_at);
      if (!currentExpiresAtMs) {
        const orderDateMs = parseSafeTime(order.order_date) || now;
        currentExpiresAtMs = orderDateMs + 10 * 60 * 1000;
      }

      // เวลาที่เหลือ = เวลาหมดอายุเดิม - เวลาตอนส่งสลิป
      let remainingMs = currentExpiresAtMs - uploadTimeMs;
      if (remainingMs > 10 * 60 * 1000) remainingMs = 10 * 60 * 1000;
      if (remainingMs < 0) remainingMs = 0;

      // วันหมดอายุใหม่ = ปัจจุบัน + เวลาที่เหลือ
      newExpiresAt = new Date(now + remainingMs).toISOString();
    }

    const { data: targetStatus } = await supabase.from("status").select("id").eq("state", nextStatusName).single();

    if (targetStatus) {
      const { data: newWorkStatus } = await supabase
        .from("work_status")
        .insert([{ order_id: id, status_id: targetStatus.id, updated_at: new Date().toISOString() }])
        .select("id")
        .single();

      const updatePayload: any = { current_status_id: targetStatus.id };
      if (newWorkStatus?.id) updatePayload.work_state_id = newWorkStatus.id;
      
      // 🌟 บันทึกเวลาที่คืนให้ลูกค้ายัดลง DB ให้ด้วย
      if (newExpiresAt) updatePayload.expires_at = newExpiresAt;

      await supabase.from("print_order").update(updatePayload).eq("id", id);
    }

    return res.status(200).json({ message: "Payment verified successfully", is_verified, new_status: nextStatusName });
  } catch (err: any) {
    return res.status(500).json({ error: "Server Error" });
  }
};