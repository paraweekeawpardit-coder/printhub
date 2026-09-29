import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// Helper Function คำนวณราคา
export const calculateOrderPricing = (items: Array<any>) => {
  const subtotal = items.reduce((sum, item) => {
    const pages = Number(item.page_count || item.total_pages) || 1;
    const qty = Number(item.quantity) || 1;
    const price = Number(item.unit_price) || 0;
    return sum + (price * pages * qty);
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

// ==========================================
// 1. สั่งพิมพ์งาน (Checkout)
// ==========================================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { description, receive_date, appointment_time } = req.body;

    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select(`
        id,
        shop_id,
        cart_item (*)
      `)
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
      .single();

    if (shopError || !shop) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลร้านค้า" });
    }

    if (appointment_time && shop.open_time && shop.close_time) {
      const reqTime = new Date(appointment_time).toTimeString().slice(0, 8);
      
      if (reqTime < shop.open_time || reqTime > shop.close_time) {
        return res.status(400).json({
          success: false,
          message: `เวลานัดหมายต้องอยู่ระหว่างเวลาทำการของร้าน (${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.)`
        });
      }
    }

    const pricing = calculateOrderPricing(cart.cart_item);

    const { data: statusRow } = await supabase
      .from("status")
      .select("id")
      .eq("state", "Pending")
      .maybeSingle();

    const { data: newOrder, error: orderError } = await supabase
      .from("print_order")
      .insert([
        {
          customer_id: customerId,
          shop_id: cart.shop_id,
          description: description || null,
          receive_date: receive_date || null,
          appointment_time: appointment_time || null,
          current_status_id: statusRow?.id || "8c416cf8-140c-4563-a912-6a4a6c0a4d9f", // 👈 ใส่ fallback รหัสนี้ไว้ได้เลย
          subtotal_price: pricing.subtotal_price,
          small_order_fee: pricing.small_order_fee,
          platform_fee: pricing.platform_fee,
          total_amount: pricing.net_total,
          total_price: pricing.net_total,
        },
      ])
      .select("id")
      .single();

    if (orderError) throw orderError;

    // 2. ปรับให้ insert เฉพาะคอลัมน์ที่มีอยู่จริงในตาราง print_order_item
    const orderItems = cart.cart_item.map((item: any) => ({
      order_id: newOrder.id,
      file_url: item.file_url,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal || item.quantity * item.unit_price,
      page_count: item.page_count || 1,
      // เก็บพวกรายละเอียดขนาด, สี, กระดาษ รวมไว้ใน describe เพื่อไม่ให้ข้อมูลหาย
      describe: [
        item.selected_size,
        item.color_type,
        item.paper_type,
        item.finishing_option,
        item.side_type
      ].filter(Boolean).join(" | ") || null,
    }));

    const { error: itemsError } = await supabase.from("print_order_item").insert(orderItems);
    if (itemsError) throw itemsError;

    if (statusRow?.id) {
      await supabase.from("work_status").insert([
        {
          order_id: newOrder.id,
          status_id: statusRow.id,
        },
      ]);
    }

    await supabase.from("cart_item").delete().eq("cart_id", cart.id);
    await supabase.from("cart").delete().eq("id", cart.id);

    return res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      data: { order_id: newOrder.id, total_price: pricing.net_total },
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

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(`
        id,
        order_no,
        total_price,
        order_date,
        receive_date,
        description,
        print_shop (
          id,
          shop_name,
          profile_image
        ),
        print_order_item (*),
        status:current_status_id (
          id,
          state
        )
      `)
      .eq("customer_id", customerId)
      .order("order_date", { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data: orders || [] });
  } catch (error: any) {
    console.error("Get customer orders error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. อัปเดตสถานะงานพิมพ์
// ==========================================
export const updateWorkStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status_id } = req.body;

    const { error: logError } = await supabase.from("work_status").insert([
      {
        order_id: orderId,
        status_id,
      },
    ]);
    if (logError) throw logError;

    const { error: orderError } = await supabase
      .from("print_order")
      .update({ current_status_id: status_id })
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

    // 1. ดึงสถานะปัจจุบันของออเดอร์
    const { data: order, error: findError } = await supabase
      .from("print_order")
      .select(`
        id,
        current_status:current_status_id (
          id,
          state
        )
      `)
      .eq("id", id)
      .single();

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

    // 2. ดึง ID ของสถานะ 'ยกเลิกการพิมพ์' จากตาราง status
    const { data: cancelStatus, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", "ยกเลิกการพิมพ์")
      .single();

    if (statusError || !cancelStatus) {
      return res.status(500).json({
        success: false,
        message: "ไม่พบสถานะ 'ยกเลิกการพิมพ์' ในตาราง status",
      });
    }

    // 3. อัปเดตคอลัมน์ current_status_id ใน print_order
    const { error: updateError } = await supabase
      .from("print_order")
      .update({ current_status_id: cancelStatus.id })
      .eq("id", id);

    if (updateError) throw updateError;

    // 4. บันทึกลง work_status (ครอบ try/catch แยก ป้องกัน Trigger เก่าที่เรียก status_type ขัดจังหวะ)
    try {
      await supabase.from("work_status").insert({
        order_id: id,
        status_id: cancelStatus.id,
      });
    } catch (wsErr) {
      console.warn("work_status trigger warning (ignored):", wsErr);
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

    // 1. ค้นหาสถานะ 'รับงานแล้ว' หรือ 'รายการเสร็จสิ้น' จากตาราง status
    const { data: doneStatus, error: statusError } = await supabase
      .from("status")
      .select("id")
      .or("state.eq.รับงานแล้ว,state.eq.รายการเสร็จสิ้น")
      .limit(1)
      .single();

    if (statusError || !doneStatus) {
      return res.status(500).json({
        success: false,
        message: "ไม่พบสถานะ 'รับงานแล้ว' หรือ 'รายการเสร็จสิ้น' ในตาราง status",
      });
    }

    // 2. อัปเดต current_status_id ใน print_order
    const { error: updateError } = await supabase
      .from("print_order")
      .update({ current_status_id: doneStatus.id })
      .eq("id", id);

    if (updateError) throw updateError;

    // 3. บันทึกลง work_status
    try {
      await supabase.from("work_status").insert({
        order_id: id,
        status_id: doneStatus.id,
      });
    } catch (wsErr) {
      console.warn("work_status trigger warning (ignored):", wsErr);
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

