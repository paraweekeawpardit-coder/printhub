// import { Request, Response } from "express";
// import supabase from "../config/supabase.js";

// export const getCustomerDashboard = async (req: Request, res: Response) => {
//   try {
//     const { customer_id } = req.query;

//     if (!customer_id) {
//       return res.status(400).json({ success: false, error: "Missing customer_id" });
//     }

//     // 1. ดึงข้อมูลส่วนตัวของลูกค้า
//     const { data: customer, error: custError } = await supabase
//       .from("customer")
//       .select("id, first_name, last_name, contact")
//       .eq("id", customer_id)
//       .single();

//     if (custError || !customer) {
//       return res.status(404).json({ success: false, error: "ไม่พบข้อมูลลูกค้า" });
//     }

//     // 2. ดึงรายการคำสั่งซื้อทั้งหมดของลูกค้ารายนี้ พร้อมสถานะและชื่อร้าน
//     const { data: orders, error: ordersError } = await supabase
//       .from("print_order")
//       .select(`
//         id,
//         order_no,
//         description,
//         subtotal_price,
//         small_order_fee,
//         total_price,
//         total_amount,
//         receive_date,
//         appointment_time,
//         order_date,
//         review_id,
//         report_id,
//         shop:shop_id (
//           id,
//           shop_name,
//           phone
//         ),
//         current_status:current_status_id (
//           id,
//           state
//         ),
//         print_order_item (
//           id,
//           category,
//           quantity,
//           unit_price,
//           subtotal,
//           page_count,
//           describe
//         )
//       `)
//       .eq("customer_id", customer_id)
//       .order("order_date", { ascending: false });

//     if (ordersError) {
//       console.error("Fetch orders error:", ordersError);
//       return res.status(500).json({ success: false, error: ordersError.message });
//     }

//     // 3. ดึงประวัติเรื่องร้องเรียนของลูกค้าจากตาราง report
//     const { data: reports, error: reportsError } = await supabase
//       .from("report")
//       .select(`
//         id,
//         order_id,
//         description,
//         image_url,
//         is_verified,
//         created_at,
//         shop:shop_id (
//           shop_name
//         ),
//         order:order_id (
//           order_no
//         )
//       `)
//       .eq("customer_id", customer_id)
//       .order("created_at", { ascending: false });

//     if (reportsError) {
//       console.error("Fetch reports error:", reportsError);
//     }

//     const orderList = orders || [];
//     const reportList = reports || [];

//     // 4. คำนวณตัวเลขสถิติ 4 ช่องตามค่า state ในตาราง status
//     const inProgressCount = orderList.filter((o: any) => {
//       const state = o.current_status?.state;
//       return state === "รอการดำเนินงาน" || state === "กำลังพิมพ์";
//     }).length;

//     const readyCount = orderList.filter((o: any) => {
//       const state = o.current_status?.state;
//       return state === "พิมพ์เสร็จสิ้น";
//     }).length;

//     const completedCount = orderList.filter((o: any) => {
//       const state = o.current_status?.state;
//       return state === "รายการเสร็จสิ้น";
//     }).length;

//     const reportCount = reportList.length;

//     return res.status(200).json({
//       success: true,
//       data: {
//         customer: {
//           fullName: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || customer.contact || "ลูกค้า",
//         },
//         stats: {
//           inProgress: inProgressCount,
//           ready: readyCount,
//           completed: completedCount,
//           reports: reportCount,
//         },
//         orders: orderList,
//         reports: reportList,
//       },
//     });
//   } catch (err: any) {
//     console.error("Customer Dashboard Exception:", err);
//     return res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

import { Request, Response } from "express";
import multer from "multer"; // <-- 1. เพิ่ม import multer
import supabase from "../config/supabase.js";

// ==========================================
// 1. DASHBOARD ฝั่งลูกค้า
// ==========================================
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

    // 3. ดึงประวัติเรื่องร้องเรียนของลูกค้าจากตาราง report
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

    const orderList = orders || [];
    const reportList = reports || [];

    // 4. คำนวณตัวเลขสถิติ 4 ช่องตามค่า state ในตาราง status
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
// 2. ฟังก์ชันเพิ่มใหม่: สร้าง Order เมื่อกดชำระเงิน
// ==========================================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_id, shop_id, items, receive_date, appointment_time, description } = req.body;

    if (!customer_id || !shop_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: "ข้อมูลไม่ครบถ้วน" });
    }

    // 1. คำนวณยอดเงินจริง
    const subtotal_price = items.reduce((sum: number, item: any) => sum + Number(item.subtotal || 0), 0);
    const small_order_fee = (subtotal_price < 50 && subtotal_price > 0) ? 20 : 0;
    const total_price = subtotal_price + small_order_fee;

    // 2. ดึง UUID สถานะ "รอการดำเนินงาน" จากตาราง status
    const { data: statusData } = await supabase
      .from("status")
      .select("id")
      .eq("state", "รอการดำเนินงาน")
      .single();

    const current_status_id = statusData?.id || "8c416cf8-140c-4563-a912-6a4a6c0a4d9f";

    // 3. บันทึกลงตาราง print_order
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

    // 4. บันทึกรายการลงตาราง print_order_item
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

    // 5. สร้าง Record ในตาราง payment
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

    // 6. อัปเดต payment_id กลับไปที่ print_order
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
// 3. ฟังก์ชันเพิ่มใหม่: อัปโหลดสลิปเข้า Bucket payment_slip
// ==========================================
export const uploadPaymentSlip = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const file = req.file;

    if (!orderId || !file) {
      return res.status(400).json({ success: false, error: "ขาดข้อมูล orderId หรือไฟล์สลิป" });
    }

    // 1. ตั้งชื่อไฟล์ลงใน Bucket payment_slip
    const fileExt = file.originalname.split(".").pop();
    const fileName = `slip_${orderId}_${Date.now()}.${fileExt}`;

    // 2. Upload ไฟล์ไปที่ Supabase Storage Bucket 'payment_slip'
    const { error: storageErr } = await supabase.storage
      .from("payment_slip")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (storageErr) throw storageErr;

    // 3. ดึง Public URL ของภาพสลิป
    const { data: urlData } = supabase.storage
      .from("payment_slip")
      .getPublicUrl(fileName);

    const slipPublicUrl = urlData.publicUrl;

    // 4. อัปเดต slip_url และเปลี่ยนสถานะเป็น 'paid' ในตาราง payment
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
// 3. ดึงรายชื่อลูกค้าทั้งหมดสำหรับ Admin
// ==========================================
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { data: customers, error } = await supabase
      .from("customer")
      .select("*") // ดึงมาทุกคอลัมน์ก่อนเพื่อไม่ให้เกิด Error คอลัมน์หาไม่เจอ
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