import { Request, Response } from "express";
import supabase from "../config/supabase.js";

export const getCustomerDashboard = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({ success: false, error: "Missing customer_id" });
    }

    // 1. ดึงข้อมูลส่วนตัวของลูกค้า
    const { data: customer, error: custError } = await supabase
      .from("customer")
      .select("id, first_name, last_name, contact")
      .eq("id", customer_id)
      .single();

    if (custError || !customer) {
      return res.status(404).json({ success: false, error: "ไม่พบข้อมูลลูกค้า" });
    }

    // 2. ดึงรายการคำสั่งซื้อทั้งหมดของลูกค้ารายนี้ พร้อมสถานะและชื่อร้าน
    const { data: orders, error: ordersError } = await supabase
      .from("print_order")
      .select(`
        id,
        order_no,
        description,
        subtotal_price,
        small_order_fee,
        total_price,
        total_amount,
        receive_date,
        appointment_time,
        order_date,
        review_id,
        report_id,
        payment_id,
        expires_at,
        shop:shop_id (
          id,
          shop_name,
          phone
        ),
        current_status:current_status_id (
          id,
          state
        ),
        print_order_item (
          id,
          category,
          quantity,
          unit_price,
          subtotal,
          page_count,
          describe
        )
      `)
      .eq("customer_id", customer_id)
      .order("order_date", { ascending: false });

    if (ordersError) {
      console.error("Fetch orders error:", ordersError);
      return res.status(500).json({ success: false, error: ordersError.message });
    }

    const orderList = orders || [];

    // 🌟 3. ดึงข้อมูล payment ของแต่ละออเดอร์มาประกบให้หน้าบ้านใช้งานได้ 100%
    for (const order of orderList) {
      const { data: paymentData } = await supabase
        .from("payment")
        .select("*")
        .eq("order_id", order.id)
        .order("payment_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      order.payment = paymentData || null;
      order.payment_detail = paymentData || null;
    }

    // 4. ดึงประวัติเรื่องร้องเรียนของลูกค้าจากตาราง report
    const { data: reports, error: reportsError } = await supabase
      .from("report")
      .select(`
        id,
        order_id,
        description,
        image_url,
        is_verified,
        created_at,
        shop:shop_id (
          shop_name
        ),
        order:order_id (
          order_no
        )
      `)
      .eq("customer_id", customer_id)
      .order("created_at", { ascending: false });

    if (reportsError) {
      console.error("Fetch reports error:", reportsError);
    }

    const reportList = reports || [];

    // 5. คำนวณตัวเลขสถิติ 4 ช่องตามค่า state ในตาราง status
    const inProgressCount = orderList.filter((o: any) => {
      const state = o.current_status?.state;
      return state === "รอการดำเนินงาน" || state === "กำลังพิมพ์";
    }).length;

    const readyCount = orderList.filter((o: any) => {
      const state = o.current_status?.state;
      return state === "พิมพ์เสร็จสิ้น";
    }).length;

    const completedCount = orderList.filter((o: any) => {
      const state = o.current_status?.state;
      return state === "รายการเสร็จสิ้น";
    }).length;

    const reportCount = reportList.length;

    return res.status(200).json({
      success: true,
      data: {
        customer: {
          fullName: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || customer.contact || "ลูกค้า",
        },
        stats: {
          inProgress: inProgressCount,
          ready: readyCount,
          completed: completedCount,
          reports: reportCount,
        },
        orders: orderList,
        reports: reportList,
      },
    });
  } catch (err: any) {
    console.error("Customer Dashboard Exception:", err);
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

    const { data: statusData } = await supabase
      .from("status")
      .select("id")
      .eq("state", "รอการดำเนินงาน")
      .single();

    const current_status_id = statusData?.id || "8c416cf8-140c-4563-a912-6a4a6c0a4d9f";

    const { data: newOrder, error: orderErr } = await supabase
      .from("print_order")
      .insert({
        customer_id,
        shop_id,
        description: description || "",
        subtotal_price,
        small_order_fee,
        total_price,
        receive_date,
        appointment_time,
        current_status_id,
      })
      .select("id, order_no, total_price")
      .single();

    if (orderErr || !newOrder) throw orderErr;

    const orderItemsPayload = items.map((item: any) => ({
      order_id: newOrder.id,
      category: item.category,
      file_url: item.file_url,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      page_count: item.total_pages || 1,
      describe: `${item.selected_size || ""} | ${item.color_type || ""} | ${item.finishing_option || ""}`.trim(),
    }));

    const { error: itemErr } = await supabase.from("print_order_item").insert(orderItemsPayload);
    if (itemErr) throw itemErr;

    const { data: paymentData, error: payErr } = await supabase
      .from("payment")
      .insert({
        order_id: newOrder.id,
        sender: customer_id,
        receiver: shop_id,
        amount: total_price,
        status: "pending",
      })
      .select("id")
      .single();

    if (payErr || !paymentData) throw payErr;

    await supabase
      .from("print_order")
      .update({ payment_id: paymentData.id })
      .eq("id", newOrder.id);

    return res.status(200).json({
      success: true,
      data: {
        order_id: newOrder.id,
        order_no: newOrder.order_no,
        total_price: newOrder.total_price,
      },
    });
  } catch (err: any) {
    console.error("Create Order Exception:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// 3. ฟังก์ชัน: อัปโหลดสลิปเข้า Bucket payment_slip
// ==========================================
export const uploadPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const file = req.file;

    if (!orderId || !file) {
      return res.status(400).json({ success: false, error: "ขาดข้อมูล orderId หรือไฟล์สลิป" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `slip_${orderId}_${Date.now()}.${fileExt}`;

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

    const { error: payUpdateErr } = await supabase
      .from("payment")
      .update({
        slip_url: slipPublicUrl,
        status: "paid",
        payment_date: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (payUpdateErr) throw payUpdateErr;

    return res.status(200).json({
      success: true,
      message: "อัปโหลดสลิปชำระเงินสำเร็จ",
      slip_url: slipPublicUrl,
    });
  } catch (err: any) {
    console.error("Upload Slip Exception:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// 4. ดึงรายชื่อลูกค้าทั้งหมดสำหรับ Admin
// ==========================================
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { data: customers, error } = await supabase
      .from("customer")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch all customers error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(customers);
  } catch (err: any) {
    console.error("Get all customers exception:", err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ==========================================
// 5. บันทึกรายงานปัญหา / ขอคืนเงิน
// ==========================================
export const createReport = async (req: Request, res: Response) => {
  try {
    const { order_id, customer_id, issue_type, description, resolution } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: "ไม่พบรหัสคำสั่งซื้อ" });
    }

    const { data: existingReport } = await supabase
      .from("report")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "คุณได้ส่งคำร้องขอคืนเงินสำหรับคำสั่งซื้อนี้ไปแล้ว ไม่สามารถส่งซ้ำได้",
      });
    }

  } catch (err: any) {
    console.error("Create Report Error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ==========================================
// 6. ตรวจสอบว่าออร์เดอร์นี้เคยถูกรายงานไปแล้วหรือยัง
// ==========================================
export const checkOrderStatusReported = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ success: false, error: "Missing orderId" });
    }

    const { data: reportData, error } = await supabase
      .from("report")
      .select("id, created_at, description")
      .eq("order_id", orderId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      hasReported: !!reportData,
      report: reportData || null,
    });
  } catch (err: any) {
    console.error("Check Report Exception:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};