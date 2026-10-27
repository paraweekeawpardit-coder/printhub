import { Request, Response } from "express";
import supabase from "../config/supabase.js";

// Helper สำหรับดึงเลข ORD- ให้ถูกต้อง
const formatOrderNo = (orderNo: any, orderId: string) => {
  if (!orderNo) return orderId.slice(0, 8);
  return String(orderNo).startsWith("ORD-") ? orderNo : `ORD-${orderNo}`;
};

// 🌟 ฟังก์ชันป้องกัน Timezone
const parseSafeTime = (dateStr?: string | null) => {
  if (!dateStr) return null;
  let cleaned = String(dateStr).trim();
  if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
    cleaned = `${cleaned.replace(" ", "T")}Z`;
  }
  const parsed = new Date(cleaned).getTime();
  return isNaN(parsed) ? null : parsed;
};

// 🌟 เวลานัดรับ (appointment_time) เก็บเป็นเวลาไทยแบบไม่มี timezone เช่น "2026-10-14T00:14:00"
// จึงต้องตีความเป็น +07:00 (ห้ามใช้ parseSafeTime ซึ่งตีความเป็น UTC จะทำให้เวลาเลื่อนไป 7 ชั่วโมง)
const parseBangkokTime = (dateStr?: string | null) => {
  if (!dateStr) return null;
  let cleaned = String(dateStr).trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) cleaned += "T00:00:00";
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(cleaned)) cleaned += "+07:00";
  const parsed = new Date(cleaned).getTime();
  return isNaN(parsed) ? null : parsed;
};

// ==========================================
// 1. ดึงข้อมูล Dashboard ลูกค้า
// ==========================================
export const getCustomerDashboard = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id) return res.status(400).json({ success: false, error: "Missing customer_id" });

    const { data: customer } = await supabase.from("customer").select("id, first_name, last_name, contact").eq("id", customer_id).single();
    if (!customer) return res.status(404).json({ success: false, error: "ไม่พบข้อมูลลูกค้า" });

    const { data: orders, error: ordersError } = await supabase
      .from("print_order")
      .select(`
        id, order_no, description, subtotal_price, small_order_fee, total_price, total_amount,
        receive_date, appointment_time, order_date, review_id, report_id, payment_id, expires_at, cancel_reason,
        shop:shop_id ( id, shop_name, phone ),
        current_status:current_status_id ( id, state ),
        print_order_item ( id, category, quantity, unit_price, subtotal, page_count, describe, file_url ),
        print_file ( id, filename, file_url, item_id )
      `)
      .eq("customer_id", customer_id)
      .order("order_date", { ascending: false });

    if (ordersError) throw ordersError;

    const orderList = orders || [];
    const now = Date.now();
    const cancelStatusId = "9aee439b-3d24-4b4e-8d68-d9b63081b80c";

    // 🌟 ฟังก์ชันป้องกัน Timezone
    const parseSafeTime = (dateStr?: string | null) => {
      if (!dateStr) return null;
      let cleaned = String(dateStr).trim();
      if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
        cleaned = `${cleaned.replace(" ", "T")}Z`;
      }
      const parsed = new Date(cleaned).getTime();
      return isNaN(parsed) ? null : parsed;
    };

    for (const order of orderList as any[]) {
      let { data: paymentData } = await supabase.from("payment").select("*").eq("order_id", order.id).maybeSingle();
      if (!paymentData && order.payment_id) {
        const { data: directPay } = await supabase.from("payment").select("*").eq("id", order.payment_id).maybeSingle();
        paymentData = directPay;
      }

      order.payment = paymentData || null;
      order.payment_detail = paymentData || null;

      const isSlipRejected = paymentData?.is_verified === false || String(paymentData?.status).toLowerCase() === "rejected";
      const hasPaid = paymentData?.status === "paid" || paymentData?.status === "refunded";

      let expiresAtMs: number | null = null;
      if (order.expires_at) {
        expiresAtMs = parseSafeTime(order.expires_at);
      } else if (order.order_date) {
        const orderDateMs = parseSafeTime(order.order_date);
        if (orderDateMs) expiresAtMs = orderDateMs + 10 * 60 * 1000;
      }

      if (isSlipRejected && order.current_status?.state !== "ยกเลิกการพิมพ์") {
        if (order.current_status) order.current_status.state = "รอการชำระเงิน";
      }


      // เส้นตายชำระเงินต้องไม่เกินเวลานัดรับ (ใช้กับออเดอร์ที่ยังรอชำระเงิน รวมถึงสลิปโดนปฏิเสธ)
      // ส่งเส้นตายจริงกลับไปใน expires_at ให้หน้าเว็บนับถอยหลังถึงเวลานัดรับ (ไม่เขียนลง DB)
      if (order.current_status?.state === "รอการชำระเงิน") {
        const apptMs = parseBangkokTime(order.appointment_time);
        if (apptMs && (!expiresAtMs || apptMs < expiresAtMs)) {
          expiresAtMs = apptMs;
          order.expires_at = new Date(apptMs).toISOString();
        }
      }

      // 1. ตัดยกเลิกเมื่อเวลาหมดจริงๆ (รวมกรณีเลยเวลานัดรับ)
      if (order.current_status?.state === "รอการชำระเงิน" && !hasPaid && expiresAtMs && now >= expiresAtMs) {
        await supabase.from("print_order").update({ current_status_id: cancelStatusId, cancel_reason: "payment_timeout" }).eq("id", order.id);
        order.current_status_id = cancelStatusId;
        order.cancel_reason = "payment_timeout";
        if (order.current_status) order.current_status.state = "ยกเลิกการพิมพ์";
      }

      // 2. ถ้าเลยเวลานัดรับงาน
      if (order.appointment_time) {
        const appointmentMs = parseBangkokTime(order.appointment_time);
        const isPendingOrPrinting = order.current_status?.state === "รอการดำเนินงาน" || order.current_status?.state === "กำลังพิมพ์";
        if (appointmentMs && !isNaN(appointmentMs) && now >= appointmentMs && isPendingOrPrinting) {
          await supabase.from("print_order").update({ current_status_id: cancelStatusId, cancel_reason: "appointment_timeout" }).eq("id", order.id);
          order.current_status_id = cancelStatusId;
          order.cancel_reason = "appointment_timeout";
          if (order.current_status) order.current_status.state = "ยกเลิกการพิมพ์";
        }
      }
    }

    const { data: reports } = await supabase.from("report").select("*, shop:shop_id(shop_name), order:order_id(order_no)").eq("customer_id", customer_id).order("created_at", { ascending: false });

    const reportList = reports || [];

    // แนบผลการคืนเงิน (อยู่ในตาราง payment) ให้คำร้อง และผูกสถานะคำร้องเข้ากับออเดอร์
    const orderById = new Map((orderList as any[]).map((o: any) => [o.id, o]));
    for (const rep of reportList as any[]) {
      const ord: any = orderById.get(rep.order_id);
      // สลิปคืนเงิน: ใช้ report.refund_slip_url ก่อน ถ้าไม่มีใช้ payment.refund_slip_url (ที่ processRefund ของแอดมินบันทึกไว้)
      rep.refund_slip_url = rep.refund_slip_url || ord?.payment?.refund_slip_url || null;
      // ไม่ต้องส่งข้อมูลบัญชีธนาคารกลับไปที่หน้าเว็บ
      delete rep.bank_name;
      delete rep.account_number;
      delete rep.account_name;
      rep.payment_status = ord?.payment?.status || null;
      if (ord) {
        ord.report = { id: rep.id, status: rep.status || "pending", refund_slip_url: rep.refund_slip_url };

        // แอดมินอนุมัติคืนเงินจากคำร้อง -> ใน DB ออเดอร์ถูกตั้งเป็น "ยกเลิกการพิมพ์" (เพื่อเข้าหน้าคืนเงินของแอดมิน)
        // แต่งานพิมพ์เสร็จและลูกค้ารับของแล้ว ฝั่งลูกค้าจึงแสดงเป็น "รายการเสร็จสิ้น" (แก้เฉพาะข้อมูลที่ส่งกลับ ไม่แก้ DB)
        if (String(rep.status).toLowerCase() === "resolved_refund" && ord.current_status?.state === "ยกเลิกการพิมพ์") {
          ord.current_status.state = "รายการเสร็จสิ้น";
        }
      }
    }
    const inProgressCount = orderList.filter((o: any) => o.current_status?.state === "รอการดำเนินงาน" || o.current_status?.state === "กำลังพิมพ์").length;
    const readyCount = orderList.filter((o: any) => o.current_status?.state === "พิมพ์เสร็จสิ้น").length;
    // ออเดอร์ที่แอดมินอนุมัติคืนเงินจากคำร้อง นับเป็นรายการเสร็จสิ้นในฝั่งลูกค้า
    const completedCount = orderList.filter((o: any) => o.current_status?.state === "รายการเสร็จสิ้น" || o.report?.status === "resolved_refund").length;

    // กล่องสถิติ "ข้อพิพาท/ขอคืนเงิน - รอการตรวจสอบ" นับเฉพาะคำร้องที่ยังรอแอดมิน
    // (ไม่นับที่คืนเงินแล้ว / ไม่อนุมัติ / ลูกค้ายกเลิกเอง)
    const pendingReportCount = reportList.filter((r: any) => {
      const st = String(r.status || "pending").toLowerCase();
      return st === "pending" || st === "investigating";
    }).length;

    return res.status(200).json({
      success: true,
      data: {
        customer: { fullName: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || customer.contact || "ลูกค้า" },
        stats: { inProgress: inProgressCount, ready: readyCount, completed: completedCount, reports: pendingReportCount },
        orders: orderList, reports: reportList,
      },
    });
  } catch (err: any) {
    console.error("Dashboard Exception:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ==========================================
// 2. ฟังก์ชัน: สร้าง Order เมื่อกดชำระเงิน
// ==========================================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_id, shop_id, items, receive_date, appointment_time, description } = req.body;

    if (!customer_id || !shop_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: "ข้อมูลไม่ครบถ้วน" });
    }

    const subtotal_price = items.reduce((sum: number, item: any) => sum + Number(item.subtotal || 0), 0);
    const small_order_fee = (subtotal_price < 50 && subtotal_price > 0) ? 20 : 0;
    const total_price = subtotal_price + small_order_fee;

    const pendingPaymentStatusId = "8961dbd1-5317-4690-b037-e2ed4e9587e5";
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data: newOrder, error: orderErr } = await supabase
      .from("print_order")
      .insert({
        customer_id, shop_id, description: description || "",
        subtotal_price, small_order_fee, total_price,
        receive_date, appointment_time,
        current_status_id: pendingPaymentStatusId, expires_at: expiresAt,
      })
      .select("id, order_no, total_price, expires_at")
      .single();

    if (orderErr || !newOrder) throw orderErr;

    const { data: wsDataList } = await supabase.from("work_status").insert([{ order_id: newOrder.id, status_id: pendingPaymentStatusId }]).select("id");
    const wsId = wsDataList?.[0]?.id || null;
    if (wsId) await supabase.from("print_order").update({ work_state_id: wsId }).eq("id", newOrder.id);

    const orderItemsPayload = items.map((item: any) => ({
      order_id: newOrder.id, category: item.category, file_url: item.file_url,
      quantity: item.quantity, unit_price: item.unit_price, subtotal: item.subtotal,
      page_count: item.total_pages || 1, describe: `${item.selected_size || ""} | ${item.color_type || ""} | ${item.finishing_option || ""}`.trim(),
    }));

    await supabase.from("print_order_item").insert(orderItemsPayload);

    const { data: paymentData } = await supabase
      .from("payment")
      .insert({ order_id: newOrder.id, sender: customer_id, receiver: shop_id, amount: total_price, status: "pending" })
      .select("id")
      .single();

    if (paymentData) await supabase.from("print_order").update({ payment_id: paymentData.id }).eq("id", newOrder.id);

    return res.status(200).json({
      success: true,
      data: { order_id: newOrder.id, order_no: newOrder.order_no, total_price: newOrder.total_price, expires_at: newOrder.expires_at },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// 3. อัปโหลดสลิปชำระเงิน
// ==========================================
export const uploadPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { orderId, order_id } = req.body;
    const targetOrderId = orderId || order_id;
    const file = req.file;

    if (!targetOrderId || !file) return res.status(400).json({ success: false, error: "ขาดข้อมูล" });

    const { data: orderData } = await supabase.from("print_order").select("id, order_no, customer_id, shop_id, total_price, expires_at, order_date").eq("id", targetOrderId).maybeSingle();
    if (!orderData) return res.status(404).json({ success: false, error: "ไม่พบคำสั่งซื้อ" });

    const fileExt = file.originalname.split(".").pop();
    const fileName = `slip_${targetOrderId}_${Date.now()}.${fileExt}`;

    await supabase.storage.from("payment_slip").upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
    const { data: urlData } = supabase.storage.from("payment_slip").getPublicUrl(fileName);
    const slipPublicUrl = urlData.publicUrl;

    const { data: payList } = await supabase
      .from("payment")
      .upsert({
        order_id: targetOrderId, sender: orderData.customer_id, receiver: orderData.shop_id, amount: orderData.total_price,
        slip_url: slipPublicUrl, status: "paid", payment_date: new Date().toISOString(), is_verified: null,
      }, { onConflict: "order_id" })
      .select("id");

    const paymentId = payList?.[0]?.id || null;
    const inProgressStatusId = "8c416cf8-140c-4563-a912-6a4a6c0a4d9f";

    const { data: wsDataList } = await supabase.from("work_status").insert([{ order_id: targetOrderId, status_id: inProgressStatusId }]).select("id");
    const wsId = wsDataList?.[0]?.id || null;

    await supabase.from("print_order").update({ payment_id: paymentId, current_status_id: inProgressStatusId, work_state_id: wsId }).eq("id", targetOrderId);

    if (orderData.shop_id) {
      await supabase.from("notifications").insert([{ shop_id: orderData.shop_id, order_id: targetOrderId, title: "แจ้งชำระเงินแล้ว", message: `ออเดอร์ #${formatOrderNo(orderData.order_no, targetOrderId)} ชำระเงินแล้ว กรุณาตรวจสอบสลิป`, is_read: false }]);
    }

    return res.status(200).json({ success: true, message: "อัปโหลดสลิปชำระเงินสำเร็จ", slip_url: slipPublicUrl });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// 4. ดึงรายชื่อลูกค้าทั้งหมดสำหรับ Admin
// ==========================================
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { data: customers } = await supabase.from("customer").select("*").order("created_at", { ascending: false });
    return res.status(200).json(customers);
  } catch (err: any) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ==========================================
// 5. บันทึกรายงานปัญหา / ขอคืนเงิน
// ==========================================
export const createReport = async (req: Request, res: Response) => {
  try {
    const { order_id, customer_id, issue_type, description, resolution, image_url, shop_id } = req.body;
    if (!order_id) return res.status(400).json({ success: false, message: "ไม่พบรหัสคำสั่งซื้อ" });

    const { data: existingReport } = await supabase.from("report").select("id").eq("order_id", order_id).maybeSingle();
    if (existingReport) return res.status(400).json({ success: false, message: "คุณได้ส่งคำร้องสำหรับคำสั่งซื้อนี้ไปแล้ว" });

    const { data: newReport } = await supabase.from("report").insert([{ order_id, customer_id, shop_id: shop_id || null, issue_type: issue_type || "อื่น ๆ", description: description || "", resolution: resolution || null, image_url: image_url || null, is_verified: false }]).select("id").single();

    return res.status(201).json({ success: true, message: "ส่งคำร้องสำเร็จ", data: newReport });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// 6. ตรวจสอบว่าออร์เดอร์นี้เคยถูกรายงานไปแล้วหรือยัง
// ==========================================
export const checkOrderStatusReported = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ success: false, error: "Missing orderId" });

    const { data: reportData } = await supabase.from("report").select("id, created_at, description").eq("order_id", orderId).maybeSingle();
    return res.status(200).json({ success: true, hasReported: !!reportData, report: reportData || null });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


// ==========================================
// ดึงรายการร้านค้าทั้งหมด พร้อมคำนวณคะแนนและจำนวนรีวิว
// ==========================================
export const getShops = async (req: Request, res: Response) => {
  try {
    // 1. ดึงข้อมูลร้านค้าพร้อมรีวิว (ปรับชื่อตาราง print_shop หรือ print_shops ตามฐานข้อมูลของคุณ)
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select(`
        *,
        reviews: review ( score )
      `);

    if (error) {
      console.error("Fetch shops error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // 2. คำนวณ rating และ review_count ให้กับแต่ละร้าน
    const formattedShops = (shops || []).map((shop: any) => {
      const shopReviews = shop.reviews || [];
      const review_count = shopReviews.length;
      const totalScore = shopReviews.reduce((sum: number, r: any) => sum + Number(r.score || 0), 0);
      const rating = review_count > 0 ? Number((totalScore / review_count).toFixed(1)) : 0;

      return {
        ...shop,
        rating,
        review_count,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedShops,
    });
  } catch (err: any) {
    console.error("Get Shops Exception:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ==========================================
// ดึงข้อมูลรีวิวของร้านค้าสำหรับฝั่งลูกค้า
// ==========================================
export const getShopReviews = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({ success: false, message: "กรุณาระบุ shopId" });
    }

    // 🟢 เพิ่ม shop_reply และ reply_at ในการ select จากตาราง review
    const { data: reviews, error } = await supabase
      .from("review") // ใช้ชื่อตาราง review (ไม่มี s) ให้ตรงตาม Supabase DB
      .select(`
        id,
        score,
        comment,
        image_url,
        created_at,
        shop_reply,
        reply_at,
        customer:customer_id (
          first_name,
          last_name
        ),
        print_order:order_id (
          id,
          description,
          print_order_item (*)
        )
      `)
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const rawReviews = reviews || [];
    const total_reviews = rawReviews.length;

    // คำนวณสรุปคะแนนดาว (Average & Breakdown)
    let sumScore = 0;
    const rating_counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    rawReviews.forEach((r: any) => {
      const s = Number(r.score || 0);
      sumScore += s;
      if (s >= 1 && s <= 5) {
        rating_counts[s] = (rating_counts[s] || 0) + 1;
      }
    });

    const average_rating =
      total_reviews > 0 ? Number((sumScore / total_reviews).toFixed(1)) : 0;

    const rating_breakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: rating_counts[stars] || 0,
      percentage:
        total_reviews > 0
          ? Number(((rating_counts[stars] / total_reviews) * 100).toFixed(1))
          : 0,
    }));

    return res.status(200).json({
      success: true,
      data: rawReviews,
      summary: {
        average_rating,
        total_reviews,
        rating_breakdown,
      },
    });
  } catch (err: any) {
    console.error("Error in getShopReviews:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


// ตัวอย่างฟังก์ชัน cancelReport ใน Controller
export const cancelReport = async (req: Request, res: Response) => {
  try {
    const reportId = req.params.id;

    // อัปเดตสถานะในตาราง complaints หรือ reports ของ Supabase
    const { data, error } = await supabase
      .from('report') // หรือชื่อตารางเก็บคำร้องของคุณ
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', reportId)
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "ยกเลิกคำขอคืนเงินสำเร็จ",
      data,
    });
  } catch (err: any) {
    console.error("Cancel report error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "เกิดข้อผิดพลาดในการยกเลิกคำขอคืนเงิน",
    });
  }
};