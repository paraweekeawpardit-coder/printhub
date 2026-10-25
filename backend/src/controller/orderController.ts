import { Request, Response } from 'express';
import multer from 'multer';
import supabase from '../config/supabase.js';

// วันเปิดร้าน (print_shop.open_days: 0=อาทิตย์ ... 6=เสาร์) ถ้าไม่มีข้อมูล = เปิดทุกวัน
const isShopOpenOnWeekday = (raw: any, weekday: number) => {
  let list: any[] = [];
  if (Array.isArray(raw)) list = raw;
  else if (typeof raw === "string") list = raw.replace(/[{}\[\]"\s]/g, "").split(",").filter(Boolean);
  const days = list.map(Number).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  return days.length === 0 || days.includes(weekday);
};

// วันในสัปดาห์ของ "ตอนนี้" ตามเวลาไทย (0=อาทิตย์ ... 6=เสาร์)
const todayWeekdayBangkok = () =>
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", weekday: "short" }).format(new Date())
  );

export const upload = multer({ storage: multer.memoryStorage() });

// Helper Function คำนวณราคา
export const calculateOrderPricing = (items: Array<any>) => {
  const subtotal = items.reduce((sum, item) => {
    let itemSubtotal = 0;

    if (item.subtotal !== undefined && item.subtotal !== null && Number(item.subtotal) > 0) {
      itemSubtotal = Number(item.subtotal);
    } else {
      const unitPrice = Number(item.unit_price) || 0;
      const quantity = Number(item.quantity) || 1;
      const pageCount = Number(item.page_count || item.total_pages) || 1;
      itemSubtotal = unitPrice * pageCount * quantity;
    }

    return sum + itemSubtotal;
  }, 0);

  let smallOrderFee = 0;
  let platformFee = 0;

  if (subtotal < 50) {
    smallOrderFee = 20;
    platformFee = 0;
  } else {
    smallOrderFee = 0;
    platformFee = Number((subtotal * 0.08).toFixed(2));
  }

  const netTotal = subtotal + smallOrderFee;

  return {
    subtotal_price: subtotal,
    small_order_fee: smallOrderFee,
    platform_fee: platformFee,
    net_total: netTotal
  };
};

// Helper สำหรับดึงเลข ORD- ให้ถูกต้อง
const formatOrderNo = (orderNo: any, orderId: string) => {
  if (!orderNo) return orderId.slice(0, 8);
  return String(orderNo).startsWith("ORD-") ? orderNo : `ORD-${orderNo}`;
};

// Helper แปลงเวลา Timezone ให้ปลอดภัย
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

// Helper สำหรับแปลงเวลา "HH:mm" หรือ "HH:mm:ss" เป็นนาที
const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
};

// ==========================================
// 1. สั่งพิมพ์งาน (Checkout)
// ==========================================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { description, receive_date, appointment_time } = req.body;
    const targetShopId = req.body.shop_id || req.query.shop_id;

    if (!customerId || !targetShopId) {
      return res.status(400).json({ 
        success: false, 
        message: "กรุณาระบุ customer_id และ shop_id ให้ครบถ้วน" 
      });
    }

    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id, shop_id, cart_item (*)")
      .eq("customer_id", customerId)
      .eq("shop_id", targetShopId)
      .maybeSingle();

    if (cartError) throw cartError;
    if (!cart || !cart.cart_item || cart.cart_item.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "ไม่มีสินค้าในตะกร้าของร้านค้านี้" 
      });
    }

    const { data: shop, error: shopError } = await supabase
      .from("print_shop")
      .select("open_time, close_time, open_days")
      .eq("id", targetShopId)
      .maybeSingle();

    if (shopError || !shop) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลร้านค้า" });
    }

    if (appointment_time) {
      const nowMs = Date.now();
      const appointmentMs = parseBangkokTime(appointment_time) ?? NaN;

      // เผื่อ 60 วินาที เพราะหน้าเว็บเลือกเวลาได้ละเอียดแค่ระดับนาที
      if (isNaN(appointmentMs)) {
        return res.status(400).json({ success: false, message: "รูปแบบเวลานัดรับไม่ถูกต้อง" });
      }
      if (appointmentMs < nowMs + 30 * 60 * 1000 - 60 * 1000) {
        return res.status(400).json({
          success: false,
          message: "เวลานัดรับงานต้องล่วงหน้าอย่างน้อย 30 นาที",
        });
      }

      // วันนัดรับต้องเป็นวันที่ร้านเปิด
      const apptDateStr = String(appointment_time).replace(" ", "T").slice(0, 10);
      const [ay, am, ad] = apptDateStr.split("-").map(Number);
      const apptWeekday = new Date(ay, (am || 1) - 1, ad || 1).getDay();
      if (!isShopOpenOnWeekday((shop as any).open_days, apptWeekday)) {
        const dayName = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"][apptWeekday];
        return res.status(400).json({
          success: false,
          message: `ร้านไม่เปิดทำการวัน${dayName} กรุณาเลือกวันนัดรับอื่น`,
        });
      }

      if (shop.open_time && shop.close_time) {
        // ใช้เวลาจากข้อความตรง ๆ (HH:mm) ไม่ขึ้นกับ timezone ของเครื่อง server
        const reqTime = String(appointment_time).replace(" ", "T").slice(11, 16);
        const selMin = timeToMinutes(reqTime);
        const openMin = timeToMinutes(shop.open_time);
        const closeMin = timeToMinutes(shop.close_time);

        let isWithinHours = false;
        if (closeMin < openMin) {
          isWithinHours = selMin >= openMin || selMin <= closeMin;
        } else {
          isWithinHours = selMin >= openMin && selMin <= closeMin;
        }

        if (!isWithinHours) {
          return res.status(400).json({
            success: false,
            message: `เวลานัดหมายต้องอยู่ระหว่างเวลาทำการของร้าน (${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.)`,
          });
        }
      }
    }

    const pricing = calculateOrderPricing(cart.cart_item);
    const pendingPaymentStatusId = "8961dbd1-5317-4690-b037-e2ed4e9587e5";
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data: createdOrders, error: orderError } = await supabase
      .from("print_order")
      .insert([
        {
          customer_id: customerId,
          shop_id: cart.shop_id,
          description: description || null,
          receive_date: receive_date || null,
          appointment_time: appointment_time || null,
          current_status_id: pendingPaymentStatusId,
          expires_at: expiresAt,
          subtotal_price: pricing.subtotal_price,
          small_order_fee: pricing.small_order_fee,
          platform_fee: pricing.platform_fee,
          total_amount: pricing.net_total,
          total_price: pricing.net_total,
        },
      ])
      .select("id, order_no, expires_at");

    if (orderError) throw orderError;
    const newOrder = createdOrders?.[0];
    if (!newOrder) throw new Error("ไม่สามารถสร้างออเดอร์ในระบบได้");

    try {
      const { data: wsDataList } = await supabase
        .from("work_status")
        .insert([
          {
            order_id: newOrder.id,
            status_id: pendingPaymentStatusId,
          },
        ])
        .select("id");

      const wsId = wsDataList?.[0]?.id;
      if (wsId) {
        await supabase
          .from("print_order")
          .update({ work_state_id: wsId })
          .eq("id", newOrder.id);
      }
    } catch (wsErr) {
      console.warn("work_status insert warning:", wsErr);
    }

    const orderItems = cart.cart_item.map((item: any) => ({
      order_id: newOrder.id,
      file_url: item.file_url,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal || (Number(item.unit_price || 0) * Number(item.page_count || item.total_pages || 1) * Number(item.quantity || 1)),
      page_count: item.page_count || item.total_pages || 1,
      describe: [
        item.selected_size,
        item.color_type,
        item.paper_type,
        item.finishing_option,
      ].filter(Boolean).join(" | ") || null,
    }));

    const { data: insertedItems, error: itemsError } = await supabase
      .from("print_order_item")
      .insert(orderItems)
      .select("id, file_url, category, page_count");

    if (itemsError) throw itemsError;

    const filesToInsert: any[] = [];
    (cart.cart_item || []).forEach((item: any, idx: number) => {
      if (!item.file_url) return;
      const correspondingItemId = insertedItems?.[idx]?.id || null;
      const urls = item.file_url.split(",").map((u: string) => u.trim()).filter(Boolean);

      urls.forEach((url: string, fileIdx: number) => {
        const fileNameFromUrl = url.split("/").pop() || `${item.category}_${fileIdx + 1}.pdf`;
        filesToInsert.push({
          order_id: newOrder.id,
          item_id: correspondingItemId,
          filename: urls.length > 1 ? `${item.category || "เอกสาร"}_ไฟล์ที่_${fileIdx + 1}` : fileNameFromUrl,
          file_url: url,
          file_size_mb: 0,
          page_count: Number(item.page_count || item.total_pages) || 1,
        });
      });
    });

    if (filesToInsert.length > 0) {
      await supabase.from("print_file").insert(filesToInsert);
    }

    await supabase.from("cart_item").delete().eq("cart_id", cart.id);
    await supabase.from("cart").delete().eq("id", cart.id).eq("shop_id", targetShopId);

    return res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      data: { 
        order_id: newOrder.id, 
        total_price: pricing.net_total,
        expires_at: newOrder.expires_at || expiresAt,
      },
    });
  } catch (error: any) {
    console.error("Create order error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ดึงประวัติคำสั่งซื้อ (พร้อมระบบ Auto-Heal 🦸‍♂️)
// ==========================================
export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.query.customer_id;
    if (!customerId) return res.status(400).json({ success: false, message: "Missing customer_id" });

    const now = Date.now();
    const CANCELLED_STATUS_ID = "9aee439b-3d24-4b4e-8d68-d9b63081b80c";
    
    const parseSafeTime = (dateStr?: string | null) => {
      if (!dateStr) return null;
      let cleaned = String(dateStr).trim();
      if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
        cleaned = `${cleaned.replace(" ", "T")}Z`;
      }
      const parsed = new Date(cleaned).getTime();
      return isNaN(parsed) ? null : parsed;
    };

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(`*, current_status:current_status_id (id, state), shop:shop_id (id, shop_name), print_order_item (*), payment (*)`)
      .eq("customer_id", customerId)
      .order("order_date", { ascending: false });

    if (error) throw error;
    const orderList = orders || [];

    for (const order of orderList as any[]) {
      const appointmentMs = parseBangkokTime(order.appointment_time);
      const payments = Array.isArray(order.payment) ? order.payment : (order.payment ? [order.payment] : []);
      const latestPayment = payments.length > 0 ? payments[payments.length - 1] : null;
      order.payment = latestPayment; order.payment_detail = latestPayment;

      const isRejected = payments.some((p: any) => p.is_verified === false || p.status === "rejected");
      const hasPaidSuccess = payments.some((p: any) => p.status === "paid" || p.status === "refunded" || p.status === "pending_payout");

      let expiresAtMs = order.expires_at ? parseSafeTime(order.expires_at) : null;
      if (!expiresAtMs && order.order_date) {
        const orderDateMs = parseSafeTime(order.order_date);
        if (orderDateMs) expiresAtMs = orderDateMs + 10 * 60 * 1000;
      }

      // สลิปโดนปฏิเสธ -> แสดงเป็น "รอการชำระเงิน" (เวลาที่เหลือถูกชดเชยไว้แล้วตอนร้านกดปฏิเสธ)
      if (isRejected && order.current_status?.state !== "ยกเลิกการพิมพ์") {
        if (order.current_status) order.current_status.state = "รอการชำระเงิน";
      }

      const isCurrentWaitingPayment = order.current_status?.state === "รอการชำระเงิน" || isRejected;

      // เส้นตายชำระเงินต้องไม่เกินเวลานัดรับ (ส่งค่าจริงกลับไปใน expires_at โดยไม่เขียนลง DB)
      if (isCurrentWaitingPayment && appointmentMs && (!expiresAtMs || appointmentMs < expiresAtMs)) {
        expiresAtMs = appointmentMs;
        order.expires_at = new Date(appointmentMs).toISOString();
      }

      if (isCurrentWaitingPayment && !hasPaidSuccess && expiresAtMs && now >= expiresAtMs) {
        await supabase.from("print_order").update({ current_status_id: CANCELLED_STATUS_ID, cancel_reason: "payment_timeout" }).eq("id", order.id);
        order.current_status_id = CANCELLED_STATUS_ID;
        order.cancel_reason = "payment_timeout";
        if (order.current_status) order.current_status.state = "ยกเลิกการพิมพ์";
      }

      const isPendingOrPrinting = order.current_status?.state === "รอการดำเนินงาน" || order.current_status?.state === "กำลังพิมพ์";
      if (appointmentMs && !isNaN(appointmentMs) && now >= appointmentMs && isPendingOrPrinting) {
        await supabase.from("print_order").update({ current_status_id: CANCELLED_STATUS_ID, cancel_reason: "appointment_timeout" }).eq("id", order.id);
        order.current_status_id = CANCELLED_STATUS_ID;
        order.cancel_reason = "appointment_timeout";
        if (order.current_status) order.current_status.state = "ยกเลิกการพิมพ์";
      }
    }

    return res.status(200).json({ success: true, data: orderList });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. อัปเดตสถานะงานพิมพ์ (ฝั่งร้านค้า) + ดักจับการตีกลับสลิปเพื่อชดเชยเวลา
// ==========================================
export const updateWorkStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status_id } = req.body;
    const now = Date.now();

    const pendingPaymentStatusId = "8961dbd1-5317-4690-b037-e2ed4e9587e5"; // รอการชำระเงิน
    const cancelStatusId = "9aee439b-3d24-4b4e-8d68-d9b63081b80c"; // ยกเลิกการพิมพ์
    
    let finalStatusId = status_id;
    let newExpiresAt: string | undefined = undefined;
    let cancelReason: string | undefined = undefined;

    // ฟังก์ชันป้องกัน Timezone เพี้ยน
    const parseSafeTime = (dateStr?: string | null) => {
      if (!dateStr) return null;
      let cleaned = String(dateStr).trim();
      if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
        cleaned = `${cleaned.replace(" ", "T")}Z`;
      }
      const parsed = new Date(cleaned).getTime();
      return isNaN(parsed) ? null : parsed;
    };

    // 🌟 ดักจับ: ถ้าร้านค้าอัปเดตสถานะกลับมาเป็น "รอการชำระเงิน" (สลิปไม่ผ่าน) ให้ชดเชยเวลาที่ Pause ไว้!
    if (status_id === pendingPaymentStatusId) {
      const { data: order } = await supabase.from("print_order").select("expires_at, order_date").eq("id", orderId).maybeSingle();
      const { data: payData, error: payErr } = await supabase
        .from("payment")
        .select("payment_date")
        .eq("order_id", orderId)
        .maybeSingle();
      if (payErr) console.error("Fetch payment_date error:", payErr);
      
      if (order) {
        // เวลาที่ลูกค้าส่งสลิป (จุดที่ Pause)
        const uploadTimeMs = parseSafeTime(payData?.payment_date) || now;
        
        // เส้นตายเดิม
        let currentExpiresAtMs = parseSafeTime(order.expires_at);
        if (!currentExpiresAtMs) {
          const orderDateMs = parseSafeTime(order.order_date) || now;
          currentExpiresAtMs = orderDateMs + 10 * 60 * 1000;
        }

        // 🌟 เวลาคงเหลือ = เส้นตายเดิม - เวลาที่ลูกค้าส่งสลิป (ได้เวลาที่เหลือจริงๆ เช่น 9 นาที)
        let remainingMs = currentExpiresAtMs - uploadTimeMs;
        if (remainingMs > 10 * 60 * 1000) remainingMs = 10 * 60 * 1000;

        if (remainingMs <= 0) {
          finalStatusId = cancelStatusId; // หมดเวลาแล้ว ให้ตัดยกเลิก
          cancelReason = "payment_timeout";
        } else {
          // 🌟 ตั้งเส้นตายใหม่ = เวลาที่ร้านกดตีกลับ (now) + เวลาที่ค้างไว้
          newExpiresAt = new Date(now + remainingMs).toISOString();
          
          // อัปเดตสถานะในตาราง payment ให้เป็น rejected ด้วย
          await supabase.from("payment").update({ is_verified: false, status: "rejected" }).eq("order_id", orderId);
        }
      }
    }

    // 1. บันทึก work_status แถวใหม่
    const { data: wsDataList, error: wsError } = await supabase
      .from("work_status")
      .insert([{ order_id: orderId, status_id: finalStatusId }])
      .select("id");

    if (wsError) throw wsError;
    const wsId = wsDataList?.[0]?.id || null;

    // 2. อัปเดต print_order พร้อมเวลาที่ชดเชยให้
    const updatePayload: any = { 
      current_status_id: finalStatusId,
      work_state_id: wsId,
    };
    if (newExpiresAt) {
      updatePayload.expires_at = newExpiresAt;
    }
    if (cancelReason) {
      updatePayload.cancel_reason = cancelReason;
    }

    const { error: orderError } = await supabase
      .from("print_order")
      .update(updatePayload)
      .eq("id", orderId);

    if (orderError) throw orderError;

    // 💡 ตัดการ insert notifications ฝั่งร้านค้าออกทั้งหมดแล้ว

    return res.status(200).json({ success: true, message: "อัปเดตสถานะเรียบร้อยแล้ว" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. กดยกเลิกคำสั่งซื้อ (FR-2.10)
// ==========================================
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: order, error: findError } = await supabase
      .from("print_order")
      .select(`
        id,
        order_no,
        shop_id,
        customer_id,
        current_status:current_status_id (id, state)
      `)
      .eq("id", id)
      .maybeSingle();

    if (findError || !order) {
      return res.status(404).json({ success: false, message: "ไม่พบคำสั่งซื้อ" });
    }

    const currentState = (order.current_status as any)?.state;
    if (currentState !== "รอการชำระเงิน" && currentState !== "รอการดำเนินงาน") {
      return res.status(400).json({
        success: false,
        message: currentState === "กำลังพิมพ์"
          ? "ไม่สามารถยกเลิกได้ เนื่องจากร้านค้าเริ่มพิมพ์แล้ว"
          : "คำสั่งซื้อนี้ไม่อยู่ในสถานะที่ยกเลิกได้",
      });
    }
    // รอการดำเนินงาน = แนบสลิปแล้ว รอร้านรับงาน -> เข้าขั้นตอนคืนเงิน
    const cancelReason = currentState === "รอการดำเนินงาน" ? "customer_paid" : "customer_unpaid";

    const cancelStatusId = "9aee439b-3d24-4b4e-8d68-d9b63081b80c";
    let newWorkStateId = null;
    try {
      const { data: wsDataList } = await supabase
        .from("work_status")
        .insert({ order_id: id, status_id: cancelStatusId })
        .select("id");
      newWorkStateId = wsDataList?.[0]?.id || null;
    } catch (wsErr) {
      console.warn("work_status insert warning (ignored):", wsErr);
    }

    const { error: updateError } = await supabase
      .from("print_order")
      .update({ 
        current_status_id: cancelStatusId,
        work_state_id: newWorkStateId,
        cancel_reason: cancelReason,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    const displayNo = formatOrderNo(order.order_no, id as string);
    if (order.shop_id) {
      await supabase.from("notifications").insert([
        {
          shop_id: order.shop_id,
          order_id: id,
          title: "คำสั่งซื้อถูกยกเลิก",
          message: `ลูกค้าได้กดยกเลิกคำสั่งซื้อ #${displayNo}`,
          is_read: false,
        },
      ]);
    }

    return res.status(200).json({ success: true, message: "ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Cancel order error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// ==========================================
// 5. กดยืนยันการรับงาน (FR-4.4)
// ==========================================
export const confirmReceivedOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: doneStatusList, error: statusError } = await supabase
      .from("status")
      .select("id")
      .or("state.eq.รับงานแล้ว,state.eq.รายการเสร็จสิ้น")
      .limit(1);

    const doneStatus = doneStatusList?.[0];
    if (statusError || !doneStatus) {
      return res.status(500).json({
        success: false,
        message: "ไม่พบสถานะ 'รับงานแล้ว' หรือ 'รายการเสร็จสิ้น' ในตาราง status",
      });
    }

    let newWorkStateId = null;
    try {
      const { data: wsDataList } = await supabase
        .from("work_status")
        .insert({ order_id: id, status_id: doneStatus.id })
        .select("id");
      newWorkStateId = wsDataList?.[0]?.id || null;
    } catch (wsErr) {
      console.warn("work_status insert warning (ignored):", wsErr);
    }

    const { error: updateError } = await supabase
      .from("print_order")
      .update({ 
        current_status_id: doneStatus.id,
        work_state_id: newWorkStateId,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    const { data: orderData } = await supabase
      .from("print_order")
      .select("shop_id, order_no")
      .eq("id", id)
      .maybeSingle();

    if (orderData?.shop_id) {
      const displayNo = formatOrderNo(orderData.order_no, id as string);
      await supabase.from("notifications").insert([
        {
          shop_id: orderData.shop_id,
          order_id: id,
          title: "ลูกค้ารับงานเรียบร้อย",
          message: `ออเดอร์ #${displayNo} ได้รับการยืนยันรับงานเสร็จสิ้นแล้ว`,
          is_read: false,
        },
      ]);
    }

    return res.status(200).json({ success: true, message: "ยืนยันการรับงานเรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Confirm received error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// ==========================================
// 6. อัปโหลดสลิปชำระเงินเข้า Bucket payment_slip
// ==========================================
export const uploadPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { order_id, orderId } = req.body;
    const targetOrderId = order_id || orderId;
    const file = req.file;

    if (!targetOrderId || !file) {
      return res.status(400).json({ success: false, message: "กรุณาระบุ order_id และแนบไฟล์สลิป" });
    }

    const { data: orderData, error: orderErr } = await supabase
      .from("print_order")
      .select("id, order_no, customer_id, shop_id, total_price, expires_at, order_date, appointment_time, current_status:current_status_id (state)")
      .eq("id", targetOrderId)
      .maybeSingle();

    if (orderErr || !orderData) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลคำสั่งซื้อ" });
    }

    // รับสลิปได้เฉพาะตอนรอชำระเงิน และยังไม่เลยเส้นตาย (เส้นตาย = ที่ถึงก่อนระหว่าง expires_at กับเวลานัดรับ)
    const currentState = (orderData.current_status as any)?.state;
    if (currentState !== "รอการชำระเงิน") {
      return res.status(400).json({ success: false, message: "คำสั่งซื้อนี้ไม่อยู่ในสถานะรอชำระเงิน" });
    }
    const expMs =
      parseSafeTime(orderData.expires_at) ??
      ((parseSafeTime(orderData.order_date) ?? Date.now()) + 10 * 60 * 1000);
    const apptMs = parseBangkokTime(orderData.appointment_time);
    const paymentDeadline = Math.min(expMs, apptMs ?? Infinity);
    if (Date.now() >= paymentDeadline) {
      return res.status(400).json({
        success: false,
        message: apptMs && apptMs <= expMs ? "เลยเวลานัดรับงานแล้ว ไม่สามารถชำระเงินได้" : "หมดเวลาชำระเงินแล้ว",
      });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `slip_${targetOrderId}_${Date.now()}.${fileExt}`;

    const { error: storageErr } = await supabase.storage
      .from("payment_slip")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (storageErr) throw storageErr;

    const { data: urlData } = supabase.storage
      .from("payment_slip")
      .getPublicUrl(fileName);

    const slipPublicUrl = urlData.publicUrl;

    const { data: paymentDataList, error: payErr } = await supabase
      .from("payment")
      .upsert({
        order_id: targetOrderId,
        sender: orderData.customer_id,
        receiver: orderData.shop_id,
        amount: orderData.total_price,
        slip_url: slipPublicUrl,
        status: "paid",
        payment_date: new Date().toISOString(),
        is_verified: null,
      }, { onConflict: 'order_id' })
      .select("id");

    if (payErr) throw payErr;
    const paymentId = paymentDataList?.[0]?.id || null;

    const inProgressStatusId = "8c416cf8-140c-4563-a912-6a4a6c0a4d9f"; // รอดำเนินงาน

    const { data: wsDataList } = await supabase
      .from("work_status")
      .insert([
        {
          order_id: targetOrderId,
          status_id: inProgressStatusId,
        },
      ])
      .select("id");

    const wsId = wsDataList?.[0]?.id || null;

    // อัปเดต print_order เข้าสู่สถานะรอดำเนินงาน
    await supabase
      .from("print_order")
      .update({ 
        payment_id: paymentId,
        current_status_id: inProgressStatusId,
        work_state_id: wsId,
      })
      .eq("id", targetOrderId);

    const displayNo = formatOrderNo(orderData.order_no, targetOrderId);
    if (orderData.shop_id) {
      await supabase.from("notifications").insert([
        {
          shop_id: orderData.shop_id,
          order_id: targetOrderId,
          title: "คำสั่งพิมพ์ใหม่!",
          message: `คุณมีคำสั่งพิมพ์ใหม่ #${displayNo} ได้ทำการชำระเงินแล้ว กรุณาตรวจสอบและดำเนินการ`,
          is_read: false,
        },
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "อัปโหลดสลิปชำระเงินเรียบร้อยแล้ว",
      slip_url: slipPublicUrl,
    });
  } catch (error: any) {
    console.error("Upload payment slip error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// ==========================================
// 7. ยกเลิกคำสั่งซื้ออัตโนมัติเมื่อหมดเวลาชำระเงิน
// ==========================================
export const cancelOrderTimeout = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const cancelStatusId = "9aee439b-3d24-4b4e-8d68-d9b63081b80c";

    const { data: orderData } = await supabase
      .from("print_order")
      .select("order_no, customer_id, shop_id, expires_at, appointment_time, current_status:current_status_id (state)")
      .eq("id", orderId)
      .maybeSingle();

    // กันยกเลิกผิดออเดอร์: ต้องยังรอชำระเงินอยู่ และหมดเวลาจริงตามเวลาของ server (เผื่อนาฬิกาเครื่องลูกค้าเพี้ยน 5 วิ)
    const state = (orderData?.current_status as any)?.state;
    // เส้นตาย = ที่ถึงก่อนระหว่าง expires_at กับเวลานัดรับ
    const rawExpMs = parseSafeTime(orderData?.expires_at);
    const apptMs = parseBangkokTime(orderData?.appointment_time);
    const expMs = rawExpMs && apptMs ? Math.min(rawExpMs, apptMs) : rawExpMs || apptMs;
    if (!orderData || state !== "รอการชำระเงิน" || (expMs && Date.now() + 5000 < expMs)) {
      return res.status(200).json({ success: false, message: "ยังไม่ถึงเงื่อนไขยกเลิกอัตโนมัติ" });
    }

    let newWorkStateId = null;
    try {
      const { data: wsDataList } = await supabase
        .from("work_status")
        .insert([{ order_id: orderId, status_id: cancelStatusId }])
        .select("id");
      newWorkStateId = wsDataList?.[0]?.id || null;
    } catch (wsErr) {
      console.warn("work_status insert warning:", wsErr);
    }

    const { error: orderError } = await supabase
      .from("print_order")
      .update({ 
        current_status_id: cancelStatusId,
        work_state_id: newWorkStateId,
        cancel_reason: "payment_timeout",
      })
      .eq("id", orderId);

    if (orderError) throw orderError;

    if (orderData?.customer_id) {
      const displayNo = formatOrderNo(orderData.order_no, orderId as string);
      await supabase.from("notifications").insert([
        {
          customer_id: orderData.customer_id,
          order_id: orderId,
          title: "คำสั่งซื้อถูกยกเลิก",
          message: `ออเดอร์ #${displayNo} ถูกยกเลิกอัตโนมัติเนื่องจากหมดเวลาชำระเงิน`,
          is_read: false,
        },
      ]);
    }

    return res.status(200).json({ success: true, message: "ยกเลิกคำสั่งซื้อเนื่องจากหมดเวลาแล้ว" });
  } catch (error: any) {
    console.error("Cancel order timeout error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. ร้านค้าปฏิเสธสลิป / สลิปไม่ถูกต้อง (นับต่อจากเวลาเดิมเป๊ะ ๆ)
// ==========================================
export const rejectPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const { data: order, error: orderErr } = await supabase
      .from("print_order")
      .select("id, order_no, expires_at, order_date, customer_id, appointment_time")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return res.status(404).json({ success: false, message: "ไม่พบคำสั่งซื้อ" });
    }

    const now = Date.now();
    const cancelStatusId = "9aee439b-3d24-4b4e-8d68-d9b63081b80c"; 
    const pendingPaymentStatusId = "8961dbd1-5317-4690-b037-e2ed4e9587e5"; 

    const parseSafeTime = (dateStr?: string | null) => {
      if (!dateStr) return null;
      let cleaned = String(dateStr).trim();
      if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
        cleaned = `${cleaned.replace(" ", "T")}Z`;
      }
      const parsed = new Date(cleaned).getTime();
      return isNaN(parsed) ? null : parsed;
    };
    
    const appointmentMs = parseBangkokTime(order.appointment_time);

    // 1. ถ้าเลยเวลานัดรับงานแล้ว -> ยกเลิกทันที
    if (appointmentMs && !isNaN(appointmentMs) && now >= appointmentMs) {
      await supabase.from("print_order").update({ current_status_id: cancelStatusId, cancel_reason: "payment_timeout" }).eq("id", orderId);
      return res.status(400).json({ success: false, message: "เลยเวลานัดรับงานแล้ว คำสั่งซื้อถูกยกเลิก" });
    }

    // 2. ดึงเวลาที่ลูกค้ากดส่งสลิปมา
    const { data: payData, error: payErr } = await supabase
      .from("payment")
      .select("payment_date")
      .eq("order_id", orderId)
      .maybeSingle();
    if (payErr) console.error("Fetch payment_date error:", payErr);

    const uploadTimeMs = parseSafeTime(payData?.payment_date) || now;

    let currentExpiresAtMs = parseSafeTime(order.expires_at);
    if (!currentExpiresAtMs) {
      const orderDateMs = parseSafeTime(order.order_date) || now;
      currentExpiresAtMs = orderDateMs + 10 * 60 * 1000;
    }

    // 🌟 เวลาคงเหลือ = เส้นตายเดิม - เวลาที่ลูกค้ากดส่งสลิป (การ Pause ตัวจริง)
    let remainingMs = currentExpiresAtMs - uploadTimeMs;
    if (remainingMs > 10 * 60 * 1000) remainingMs = 10 * 60 * 1000;

    if (remainingMs <= 0) {
      await supabase.from("print_order").update({ current_status_id: cancelStatusId, cancel_reason: "payment_timeout" }).eq("id", orderId);
      return res.status(400).json({ success: false, message: "หมดเวลาชำระเงินแล้ว คำสั่งซื้อถูกยกเลิก" });
    }

    // 🌟 3. เวลาหมดอายุใหม่ = ปัจจุบัน + เวลาคงเหลือ (Resume เวลาให้)
    let calculatedExpiresAtMs = now + remainingMs;
    if (appointmentMs && !isNaN(appointmentMs) && calculatedExpiresAtMs > appointmentMs) {
      calculatedExpiresAtMs = appointmentMs;
    }

    const newExpiresAt = new Date(calculatedExpiresAtMs).toISOString();

    const { data: wsData } = await supabase.from("work_status").insert({ order_id: orderId, status_id: pendingPaymentStatusId }).select("id").single();
    const wsId = wsData?.id || null;

    // 🌟 4. อัปเดต expires_at ตัวใหม่ลงตาราง
    const { error: updateErr } = await supabase
      .from("print_order")
      .update({
        current_status_id: pendingPaymentStatusId,
        work_state_id: wsId,
        expires_at: newExpiresAt,
      })
      .eq("id", orderId);

    if (updateErr) throw updateErr;

    await supabase.from("payment").update({ is_verified: false, status: "rejected" }).eq("order_id", orderId);

    if (order.customer_id) {
      await supabase.from("notifications").insert([
        {
          customer_id: order.customer_id,
          order_id: orderId,
          title: "สลิปชำระเงินไม่ถูกต้อง",
          message: `สลิปสำหรับออเดอร์ #${formatOrderNo(order.order_no, orderId as string)} ไม่ถูกต้อง กรุณาแนบใหม่`,
          is_read: false,
        },
      ]);
    }

    return res.status(200).json({ success: true, message: "ปฏิเสธสลิปแล้ว เวลานับถอยหลังต่อเรียบร้อย" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. แอดมินอนุมัติคืนเงิน
// ==========================================
export const adminApproveRefund = async (req: Request, res: Response) => {
  try {
    const { order_id, refund_slip_url } = req.body;

    if (!order_id || !refund_slip_url) {
      return res.status(400).json({ 
        success: false, 
        message: "กรุณาระบุ order_id และแนบ refund_slip_url" 
      });
    }

    const { error: payErr } = await supabase
      .from("payment")
      .update({
        status: "refunded",
        refund_slip_url: refund_slip_url,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order_id);

    if (payErr) throw payErr;
    return res.status(200).json({ success: true, message: "บันทึกการคืนเงินสำเร็จ" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 10. แอดมินปฏิเสธคืนเงิน
// ==========================================
export const adminRejectRefund = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: "กรุณาระบุ order_id" });
    }

    const { error: payErr } = await supabase
      .from("payment")
      .update({
        status: "refund_rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order_id);

    if (payErr) throw payErr;
    return res.status(200).json({ success: true, message: "ปฏิเสธการคืนเงินเรียบร้อยแล้ว" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};