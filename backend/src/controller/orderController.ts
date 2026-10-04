import { Request, Response } from 'express';
import multer from 'multer';
import supabase from '../config/supabase.js';

export const upload = multer({ storage: multer.memoryStorage() });

// Helper Function คำนวณราคา
export const calculateOrderPricing = (items: Array<any>) => {
  const subtotal = items.reduce((sum, item) => {
    const itemSubtotal = item.subtotal !== undefined && item.subtotal !== null
      ? Number(item.subtotal)
      : (Number(item.unit_price) || 0) * (Number(item.quantity) || 1);

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

// ==========================================
// 1. สั่งพิมพ์งาน (Checkout)
// ==========================================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { description, receive_date, appointment_time } = req.body;

    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select("id, shop_id, cart_item (*)")
      .eq("customer_id", customerId)
      .maybeSingle();

    if (cartError) throw cartError;
    if (!cart || !cart.shop_id || !cart.cart_item || cart.cart_item.length === 0) {
      return res.status(400).json({ success: false, message: "ไม่มีสินค้าในตะกร้า" });
    }

    const targetShopId = cart?.shop_id || req.body.shop_id;
    const { data: shop, error: shopError } = await supabase
      .from("print_shop")
      .select("open_time, close_time")
      .eq("id", targetShopId)
      .maybeSingle();

    if (shopError || !shop) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลร้านค้า" });
    }

    if (appointment_time) {
      const nowMs = Date.now();
      const appointmentMs = new Date(appointment_time).getTime();

      if (appointmentMs < nowMs + 30 * 60 * 1000) {
        return res.status(400).json({
          success: false,
          message: "เวลานัดรับงานต้องล่วงหน้าอย่างน้อย 30 นาที",
        });
      }

      if (shop.open_time && shop.close_time) {
        const reqTime = new Date(appointment_time).toTimeString().slice(0, 8);
        if (reqTime < shop.open_time || reqTime > shop.close_time) {
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
    if (!newOrder) {
      throw new Error("ไม่สามารถสร้างออเดอร์ในระบบได้");
    }

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
      subtotal: item.subtotal || item.quantity * item.unit_price,
      page_count: item.page_count || 1,
      describe: [
        item.selected_size,
        item.color_type,
        item.paper_type,
        item.finishing_option,
        item.side_type
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
    await supabase.from("cart").delete().eq("id", cart.id);

    const displayNo = formatOrderNo(newOrder.order_no, newOrder.id);
    await supabase.from("notifications").insert([
      {
        shop_id: cart.shop_id,
        order_id: newOrder.id,
        title: "คำสั่งพิมพ์ใหม่!",
        message: `คุณมีออเดอร์ใหม่ #${displayNo} รอลูกค้าชำระเงิน`,
        is_read: false,
      },
    ]);

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
// 2. ดึงประวัติคำสั่งซื้อ
// ==========================================
export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.query.customer_id;

    if (!customerId) {
      return res.status(400).json({ success: false, message: "Missing customer_id" });
    }

    const now = Date.now();
    const CANCELLED_STATUS_ID = "9aee439b-3d24-4b4e-8d68-d9b63081b80c";
    const PENDING_STATUS_ID = "8c416cf8-140c-4563-a912-6a4a6c0a4d9f";
    const PRINTING_STATUS_ID = "adce12c6-d8cd-4c2e-b7ca-e69fe603a8a0";

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(`
        *,
        current_status:current_status_id (id, state),
        shop:shop_id (id, shop_name),
        print_order_item (*),
        payment (*)
      `)
      .eq("customer_id", customerId)
      .order("order_date", { ascending: false });

    if (error) throw error;

    for (const order of orders || []) {
      const currentState = order.current_status?.state;
      const appointmentMs = parseSafeTime(order.appointment_time);

      // กรณี Auto-Cancel: เลยเวลานัดรับ และค้างอยู่ที่รอดำเนินงาน หรือ กำลังพิมพ์
      const isPendingOrPrinting = 
        currentState === "รอการดำเนินงาน" || 
        currentState === "กำลังพิมพ์" ||
        order.current_status_id === PENDING_STATUS_ID ||
        order.current_status_id === PRINTING_STATUS_ID;

      if (appointmentMs && now >= appointmentMs && isPendingOrPrinting) {
        let cancelWsId = null;
        try {
          const { data: wsCancelList } = await supabase
            .from("work_status")
            .insert([
              {
                order_id: order.id,
                status_id: CANCELLED_STATUS_ID,
              },
            ])
            .select("id");
          cancelWsId = wsCancelList?.[0]?.id || null;
        } catch (wsErr) {
          console.warn("work_status cancel insert warning:", wsErr);
        }

        await supabase
          .from("print_order")
          .update({ 
            current_status_id: CANCELLED_STATUS_ID,
            work_state_id: cancelWsId,
          })
          .eq("id", order.id);

        order.current_status_id = CANCELLED_STATUS_ID;
        order.work_state_id = cancelWsId;
        if (order.current_status) {
          order.current_status.state = "ยกเลิกการพิมพ์";
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// 3. อัปเดตสถานะงานพิมพ์ (ฝั่งร้านค้า)
// ==========================================
export const updateWorkStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status_id } = req.body;

    const { data: wsDataList, error: wsError } = await supabase
      .from("work_status")
      .insert([{ order_id: orderId, status_id }])
      .select("id");

    if (wsError) throw wsError;
    const wsId = wsDataList?.[0]?.id || null;

    const { error: orderError } = await supabase
      .from("print_order")
      .update({ 
        current_status_id: status_id,
        work_state_id: wsId,
      })
      .eq("id", orderId);

    if (orderError) throw orderError;

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
        current_status:current_status_id (
          id,
          state
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (findError || !order) {
      return res.status(404).json({ success: false, message: "ไม่พบคำสั่งซื้อ" });
    }

    const currentState = (order.current_status as any)?.state;
    if (currentState === "กำลังพิมพ์") {
      return res.status(400).json({
        success: false,
        message: "ไม่สามารถยกเลิกได้ เนื่องจากร้านค้าเริ่มพิมพ์แล้ว",
      });
    }

    const cancelStatusId = "9aee439b-3d24-4b4e-8d68-d9b63081b80c";

    let newWorkStateId = null;
    try {
      const { data: wsDataList } = await supabase
        .from("work_status")
        .insert({
          order_id: id,
          status_id: cancelStatusId,
        })
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

    return res.status(200).json({
      success: true,
      message: "ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว",
    });
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
        .insert({
          order_id: id,
          status_id: doneStatus.id,
        })
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

    return res.status(200).json({
      success: true,
      message: "ยืนยันการรับงานเรียบร้อยแล้ว",
    });
  } catch (error: any) {
    console.error("Confirm received error:", error.message || error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// ==========================================
// 6. อัปโหลดสลิปชำระเงินเข้า Bucket payment_slip (Pause เวลาเดิมไว้)
// ==========================================
export const uploadPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;
    const file = req.file;

    if (!order_id || !file) {
      return res.status(400).json({ success: false, message: "กรุณาระบุ order_id และแนบไฟล์สลิป" });
    }

    const { data: orderData, error: orderErr } = await supabase
      .from("print_order")
      .select("id, order_no, customer_id, shop_id, total_price, expires_at")
      .eq("id", order_id)
      .maybeSingle();

    if (orderErr || !orderData) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลคำสั่งซื้อ" });
    }

    // คำนวณเวลาคงเหลือจริง (ms) ก่อน Pause
    let remainingMs = 5 * 60 * 1000;
    if (orderData.expires_at) {
      const expMs = parseSafeTime(orderData.expires_at);
      if (expMs) {
        const diff = expMs - Date.now();
        remainingMs = diff > 0 ? diff : 60 * 1000;
      }
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `slip_${order_id}_${Date.now()}.${fileExt}`;

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
        order_id: order_id,
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
          order_id: order_id,
          status_id: inProgressStatusId,
        },
      ])
      .select("id");

    const wsId = wsDataList?.[0]?.id || null;

    // Pause เวลา: บันทึกระยะเวลาคงเหลือจริงไว้ใน expires_at
    await supabase
      .from("print_order")
      .update({ 
        payment_id: paymentId,
        current_status_id: inProgressStatusId,
        work_state_id: wsId,
        expires_at: new Date(Date.now() + remainingMs).toISOString(),
      })
      .eq("id", order_id);

    const displayNo = formatOrderNo(orderData.order_no, order_id);
    if (orderData.shop_id) {
      await supabase.from("notifications").insert([
        {
          shop_id: orderData.shop_id,
          order_id: order_id,
          title: "แจ้งชำระเงินแล้ว",
          message: `ออเดอร์ #${displayNo} ได้ทำการชำระเงินแล้ว กรุณาตรวจสอบและดำเนินการ`,
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
      .select("order_no, customer_id, shop_id")
      .eq("id", orderId)
      .maybeSingle();

    let newWorkStateId = null;
    try {
      const { data: wsDataList } = await supabase
        .from("work_status")
        .insert([
          {
            order_id: orderId,
            status_id: cancelStatusId,
          },
        ])
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
// 8. ร้านค้าปฏิเสธสลิป / สลิปไม่ถูกต้อง (นับเวลาต่อจากเดิมที่ Pause ไว้ตาม S2G7)
// ==========================================
export const rejectPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const { data: order, error: orderErr } = await supabase
      .from("print_order")
      .select("id, expires_at, customer_id, appointment_time")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return res.status(404).json({ success: false, message: "ไม่พบคำสั่งซื้อ" });
    }

    const now = Date.now();
    const cancelStatusId = "9aee439b-3d24-4b4e-8d68-d9b63081b80c";
    const appointmentMs = parseSafeTime(order.appointment_time);

    // S2G7: ถ้าเลยเวลานัดรับงานแล้ว ตัดเป็นยกเลิกทันที
    if (appointmentMs && now >= appointmentMs) {
      await supabase
        .from("print_order")
        .update({ current_status_id: cancelStatusId })
        .eq("id", orderId);

      return res.status(400).json({ 
        success: false, 
        message: "เลยเวลานัดรับงานแล้ว คำสั่งซื้อถูกยกเลิกการพิมพ์อัตโนมัติ" 
      });
    }

    const pendingPaymentStatusId = "8961dbd1-5317-4690-b037-e2ed4e9587e5"; // รอการชำระเงิน

    // 1. บันทึกประวัติสถานะลง work_status
    const { data: wsDataList, error: wsErr } = await supabase
      .from("work_status")
      .insert([
        {
          order_id: orderId,
          status_id: pendingPaymentStatusId,
        },
      ])
      .select("id");

    if (wsErr) console.warn("work_status insert warning:", wsErr);
    const wsId = wsDataList?.[0]?.id || null;

    // 2. คำนวณเวลานับถอยหลังต่อจากเวลาเดิมที่ Pause ไว้
    let remainingMs = 5 * 60 * 1000;
    if (order.expires_at) {
      const expMs = parseSafeTime(order.expires_at);
      if (expMs) {
        const diff = expMs - now;
        remainingMs = diff > 30 * 1000 ? diff : 3 * 60 * 1000;
      }
    }

    let calculatedExpiresAtMs = now + remainingMs;
    if (appointmentMs && calculatedExpiresAtMs > appointmentMs) {
      calculatedExpiresAtMs = appointmentMs; // เพดานไม่เกินเวลานัดรับ
    }

    const newExpiresAt = new Date(calculatedExpiresAtMs).toISOString();

    // 3. ปรับสถานะ print_order กลับเป็น "รอการชำระเงิน"
    const { error: updateErr } = await supabase
      .from("print_order")
      .update({ 
        current_status_id: pendingPaymentStatusId,
        work_state_id: wsId,
        expires_at: newExpiresAt
      })
      .eq("id", orderId);

    if (updateErr) throw updateErr;

    // 4. บันทึกใน payment ว่าสลิปไม่ถูกต้อง (is_verified = false)
    await supabase
      .from("payment")
      .update({ is_verified: false, status: "rejected" })
      .eq("order_id", orderId);

    // 5. แจ้งเตือนลูกค้า
    if (order.customer_id) {
      await supabase.from("notifications").insert([
        {
          customer_id: order.customer_id,
          order_id: orderId,
          title: "สลิปชำระเงินไม่ถูกต้อง",
          message: `สลิปสำหรับออเดอร์ #${orderId.slice(0, 8)} ไม่ถูกต้อง กรุณาแนบสลิปใหม่ก่อนหมดเวลา`,
          is_read: false,
        },
      ]);
    }

    return res.status(200).json({ 
      success: true, 
      message: "ปฏิเสธสลิปแล้ว ระบบเปิดให้นับเวลาถอยหลังต่อจากเดิมเพื่อส่งสลิปใหม่",
      current_status_id: pendingPaymentStatusId,
      expires_at: newExpiresAt,
      work_state_id: wsId,
    });
  } catch (error: any) {
    console.error("Reject slip error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};