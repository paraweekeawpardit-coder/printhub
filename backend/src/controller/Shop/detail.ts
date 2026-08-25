import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

export const getOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const order_id = (req.headers.order_id || req.headers["order_id"]) as string;

    console.log("headers =", req.headers);
    console.log("order_id =", order_id);

    if (!order_id) {
      return res.status(400).json({
        error: "order_id is required",
      });
    }

    const { data: order, error } = await supabase
      .from("print_order")
      .select("*")
      .eq("id", order_id)
      .single();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    const { data: customer } = await supabase
      .from("customer")
      .select("first_name, last_name")
      .eq("id", order.customer_id)
      .single();

    const { data: orderItem } = await supabase
      .from("order_item")
      .select("quantity, unit_price, service_detail_id")
      .eq("order_id", order.id)
      .limit(1)
      .single();

    let serviceDetail = null;
    let serviceType = null;

    if (orderItem?.service_detail_id) {
      const { data: detail } = await supabase
        .from("service_detail")
        .select("detail, price, service_type_id")
        .eq("id", orderItem.service_detail_id)
        .single();

      serviceDetail = detail;

      if (detail?.service_type_id) {
        const { data: stType } = await supabase
          .from("service_type")
          .select("type")
          .eq("id", detail.service_type_id)
          .single();

        serviceType = stType;
      }
    }

    const { data: file } = await supabase
      .from("print_file")
      .select("filename, file_url")
      .eq("order_id", order.id)
      .limit(1)
      .single();

    const { data: payment } = await supabase
      .from("payment")
      .select("amount")
      .eq("order_id", order.id)
      .single();

    const { data: curStatus, error: statusError } = await supabase
      .from("work_status")
      .select("status_id, status(state)")
      .eq("order_id", order.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (statusError && statusError.code !== "PGRST116") {
      // PGRST116 = ไม่พบข้อมูล
      return res.status(400).json({
        error: statusError.message,
      });
    }

    console.log("customer =", customer);
    console.log("service =", serviceType);
    console.log("detail =", serviceDetail);
    console.log("file =", file);
    console.log("payment =", payment);
    console.log("status =", curStatus);

    return res.status(200).json({
      order: {
        order_id: order.id,
        date: order.order_date,
        customer_name: `${customer?.first_name ?? ""} ${
          customer?.last_name ?? ""
        }`.trim(),
        qty: orderItem?.quantity ?? 0,
        type: serviceType?.type ?? null,
        detail: serviceDetail?.detail ?? order.description ?? null,
        file_name: file?.filename ?? null,
        file_url: file?.file_url ?? null,
        status: (curStatus?.status as any)?.state ?? null,
        price: orderItem?.unit_price ?? serviceDetail?.price ?? 0,
        amount: payment?.amount ?? order.total_price ?? 0,
      },
    });
  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};