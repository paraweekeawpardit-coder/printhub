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