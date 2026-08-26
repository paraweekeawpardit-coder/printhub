import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

// ==========================================
// GET ORDER DETAIL
// ==========================================

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

    const {
      data: order,
      error,
    } = await supabase
      .from("print_order")
      .select(`
        id,
        order_no,
        description,
        total_price,
        order_date,
        receive_date,

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

        order_item (
          id,
          quantity,
          unit_price,
          subtotal,

          service_detail:service_detail_id (
            detail,
            group_name,

            service_type:service_type_id (
              type
            )
          )
        ),

        print_file (
          id,
          filename,
          file_url
        ),

        payment (
          amount,
          slip_url,
          payment_date
        ),

        work_status (
          updated_at,

          status (
            state
          )
        )
      `)
      .eq("id", order_id)
      .single();

    if (error || !order) {
      console.error("Get order error:", error);

      return res.status(404).json({
        error: "Order not found",
      });
    }

    // ==========================================
    // Latest Status
    // ==========================================

    const sortedStatuses = Array.isArray(order.work_status)
      ? [...order.work_status].sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
        )
      : [];

    const firstStatusObj = sortedStatuses[0]?.status;

    const latestStatus = Array.isArray(firstStatusObj)
      ? firstStatusObj[0]?.state
      : (firstStatusObj as any)?.state ?? "รอการดำเนินงาน";
    // NOTE: fixed the fallback spelling to match the rest of the app
    // (was "รอการดำเนินการ", every other file uses "รอการดำเนินงาน")

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
    // Order Items
    // ==========================================

    const items = (order.order_item || []).map((item: any) => {
      const serviceDetail = Array.isArray(item.service_detail)
        ? item.service_detail[0]
        : item.service_detail;

      return {
        id: item.id,
        group_name: serviceDetail?.group_name || "รายการพิมพ์",
        detail: serviceDetail?.detail || "",
        quantity: item.quantity,
        unit_price: Number(item.unit_price || 0),
        subtotal: Number(item.subtotal || 0),
      };
    });

    // ==========================================
    // Payment
    // ==========================================

    const formattedPayment = Array.isArray(order.payment)
      ? order.payment[0]
      : order.payment;

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      order: {
        id: order.id,
        order_no: order.order_no,
        order_date: order.order_date,
        receive_date: order.receive_date,
        description: order.description,
        total_price: Number(order.total_price || 0),
        status_state: latestStatus,

        customer: {
          id: formattedCustomer?.id,
          first_name: formattedCustomer?.first_name,
          last_name: formattedCustomer?.last_name,
          contact: formattedCustomer?.contact,
          address: formattedAddress || null,
        },

        items,
        files: order.print_file || [],
        payment: formattedPayment || null,
      },
    });
  } catch (err) {
    console.error("Backend Error:", err);

    return res.status(500).json({
      error: "Server Error",
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status_name } = req.body;

    // accept shop_id from query string OR header — the frontend now sends
    // it as a query param (avoids a CORS preflight allow-list issue with
    // custom headers), but keep the header path working too for anything
    // else in the codebase that still sends it that way
    const shop_id = (req.query.shop_id || req.headers.shop_id) as
      | string
      | undefined;

    // ==========================================
    // Validate
    // ==========================================

    if (!id) {
      return res.status(400).json({
        error: "order_id is required",
      });
    }

    if (!status_name) {
      return res.status(400).json({
        error: "status_name is required",
      });
    }

    // ==========================================
    // ตรวจสอบ Order
    // ==========================================

    const { data: order, error: orderError } = await supabase
      .from("print_order")
      .select("id, shop_id")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // ==========================================
    // ตรวจว่า Order เป็นของ Shop นี้
    // ==========================================

    if (shop_id && order.shop_id !== shop_id) {
      return res.status(403).json({
        error: "This order does not belong to this shop",
      });
    }

    // ==========================================
    // หา Status ID
    // ==========================================

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

    // ==========================================
    // Insert Work Status
    // ==========================================

    const { data: newWorkStatus, error: insertError } = await supabase
      .from("work_status")
      .insert([
        {
          order_id: id,
          status_id: statusData.id,
          updated_at: new Date().toISOString(),
        },
      ])
      .select(
        `
        id,
        order_id,
        status_id,
        updated_at,
        status (
          id,
          state
        )
        `
      )
      .single();

    if (insertError) {
      console.error("Insert work_status error:", insertError);

      return res.status(400).json({
        error: insertError.message,
      });
    }

    // ==========================================
    // Success
    // ==========================================

    return res.status(200).json({
      message: "Order status updated successfully",
      data: newWorkStatus,
    });
  } catch (err) {
    console.error("Update Status Error:", err);

    return res.status(500).json({
      error: "Server Error",
    });
  }
};