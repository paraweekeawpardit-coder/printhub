import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

export const getOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const order_id = (
      req.params.id ||
      req.query.order_id ||
      req.headers.order_id
    ) as string;

    if (!order_id) {
      return res.status(400).json({
        error: "order_id is required",
      });
    }

    // ==========================================
    // Main order + standard reverse relations
    // ==========================================
    const { data: order, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        order_no,
        description,
        subtotal_price,
        small_order_fee,
        platform_fee,
        total_amount,
        order_date,
        receive_date,
        appointment_time,
        current_status_id,
        payment_id,
        review_id,

        customer:customer_id (
          id,
          first_name,
          last_name,
          contact,

          address:address_id (
            detail,
            subdistrict,
            district,
            province,
            postcode
          )
        ),

        print_order_item (
          id,
          category,
          describe,
          file_url,
          quantity,
          unit_price,
          subtotal,
          page_count
        ),

        print_file (
          id,
          filename,
          file_url,
          file_size_mb,
          page_count,
          item_id
        )
        `
      )
      .eq("id", order_id)
      .single();

    if (error || !order) {
      console.error("Get order error:", error);
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // ==========================================
    // Status / Payment / Review (fetched by id)
    // ==========================================
    const [
      { data: statusRow, error: statusError },
      { data: paymentRow, error: paymentError },
      { data: reviewRow, error: reviewError },
    ] = await Promise.all([
      order.current_status_id
        ? supabase
            .from("status")
            .select("state")
            .eq("id", order.current_status_id)
            .single()
        : Promise.resolve({ data: null, error: null }),

      order.payment_id
        ? supabase
            .from("payment")
            .select("amount, slip_url, payment_date, status")
            .eq("id", order.payment_id)
            .single()
        : Promise.resolve({ data: null, error: null }),

      order.review_id
        ? supabase
            .from("review")
            .select("score, comment")
            .eq("id", order.review_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (statusError) console.error("Get status error:", statusError);
    if (paymentError) console.error("Get payment error:", paymentError);
    if (reviewError) console.error("Get review error:", reviewError);

    const statusState = statusRow?.state || "รอการดำเนินงาน";

    // ==========================================
    // Customer
    // ==========================================
    const formattedCustomer = Array.isArray(order.customer)
      ? order.customer[0]
      : order.customer;

    const formattedAddress = Array.isArray(formattedCustomer?.address)
      ? formattedCustomer.address[0]
      : formattedCustomer?.address;

    // ==========================================
    // Items
    // ==========================================
    const items = (order.print_order_item || []).map((item: any) => ({
      id: item.id,
      category: item.category || "รายการพิมพ์",
      group_name: item.category || "รายการพิมพ์", // เพิ่ม map สำหรับ Frontend
      describe: item.describe || "",
      detail: item.describe || "",               // เพิ่ม map สำหรับ Frontend
      file_url: item.file_url || null,
      quantity: item.quantity,
      unit_price: Number(item.unit_price || 0),
      subtotal: Number(item.subtotal || 0),
      page_count: item.page_count ?? null,
    }));

    // ==========================================
    // Files (mapped with item_id)
    // ==========================================
    const files = (order.print_file || []).map((f: any) => ({
      id: f.id,
      filename: f.filename,
      file_url: f.file_url,
      file_size_mb: f.file_size_mb,
      page_count: f.page_count,
      item_id: f.item_id || null,
    }));

    return res.status(200).json({
      order: {
        id: order.id,
        order_no: order.order_no,
        order_date: order.order_date,
        receive_date: order.receive_date || order.appointment_time,
        description: order.description,
        subtotal_price: Number(order.subtotal_price || 0),
        small_order_fee: Number(order.small_order_fee || 0),
        platform_fee: Number(order.platform_fee || 0),
        total_amount: Number(order.total_amount || 0),
        total_price: Number(order.total_amount || 0), // เพิ่ม total_price ตรงกับ Frontend
        status_state: statusState,

        // ส่ง slip_url ออกไปโดยตรงเพื่อให้ Frontend อ่านค่าได้ทันที
        slip_url: paymentRow?.slip_url || null,

        customer: {
          id: formattedCustomer?.id,
          first_name: formattedCustomer?.first_name,
          last_name: formattedCustomer?.last_name,
          contact: formattedCustomer?.contact,
          address: formattedAddress || null,
        },

        items,
        files,
        payment: paymentRow || null,
        review: reviewRow || null,
      },
    });
  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status_name } = req.body;
    const shop_id = (req.query.shop_id || req.headers.shop_id) as
      | string
      | undefined;

    if (!id) {
      return res.status(400).json({ error: "order_id is required" });
    }

    if (!status_name) {
      return res.status(400).json({ error: "status_name is required" });
    }

    const { data: order, error: orderError } = await supabase
      .from("print_order")
      .select("id, shop_id")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (shop_id && order.shop_id !== shop_id) {
      return res
        .status(403)
        .json({ error: "This order does not belong to this shop" });
    }

    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id, state")
      .eq("state", status_name)
      .single();

    if (statusError || !statusData) {
      return res.status(404).json({
        error: `Status '${status_name}' not found`,
      });
    }

    const { data: newWorkStatus, error: insertError } = await supabase
      .from("work_status")
      .insert([
        {
          order_id: id,
          status_id: statusData.id,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Insert work_status error:", insertError);
      return res.status(400).json({ error: insertError.message });
    }

    const { error: updateOrderError } = await supabase
      .from("print_order")
      .update({
        current_status_id: statusData.id,
        work_state_id: newWorkStatus.id,
      })
      .eq("id", id);

    if (updateOrderError) {
      console.error(
        "Update print_order current_status error:",
        updateOrderError
      );
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      data: {
        ...newWorkStatus,
        status_state: statusData.state,
      },
    });
  } catch (err) {
    console.error("Update Status Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};