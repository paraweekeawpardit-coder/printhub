import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

interface ServiceType {
  id: string;
  type: string;
}

interface ServiceDetail {
  id: string;
  detail: string;
  price: number;
  service_type_id: string;
}

interface OrderItem {
  order_id: string;
  quantity: number;
  unit_price: number;
  service_detail_id: string;
}

interface PrintFile {
  order_id: string;
  filename: string;
  file_url: string;
}

interface Payment {
  order_id: string;
  amount: number;
}

interface WorkStatus {
  order_id: string;
  status_id: string;
  updated_at: string;
}

interface Status {
  id: string;
  state: "พิมพ์เสร็จสิ้น" | "รอการดำเนินการ" | "ยกเลิกการพิมพ์" | "กำลังพิมพ์";
}

interface Order {
  id: string;
  shop_id: string;
  customer_id: string;
  order_date: string;
  total_price: number;
  description: string | null;
}

interface ResultOrder {
  order_id: string;
  date: string;
  customer_name: string;
  customer_avatar: string;
  qty: number;
  type: string;
  detail: string;
  file_name: string;
  file_url: string;
  status: string;
  price: number;
  amount: number;
}

export const getOrdersByStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.headers["shop_id"]) as string;
    const status = req.query.status as string;

    if (!shop_id || !status) {
      return res.status(400).json({
        error: "shop_id and status are required",
      });
    }

    const { data: orders, error: orderError } = await supabase
      .from("print_order")
      .select("*")
      .eq("shop_id", shop_id);

    if (orderError) {
      return res.status(400).json({
        error: orderError.message,
      });
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        count: 0,
        orders: [],
      });
    }

    const orderIds = orders.map((o) => o.id);

    const [
      { data: customers },
      { data: orderItems },
      { data: serviceDetails },
      { data: serviceTypes },
      { data: files },
      { data: payments },
      { data: workStatuses },
      { data: statuses },
    ] = await Promise.all([
      supabase
        .from("customer")
        .select("id, first_name, last_name, avatar"),

      supabase
        .from("order_item")
        .select("order_id, quantity, unit_price, service_detail_id")
        .in("order_id", orderIds),

      supabase
        .from("service_detail")
        .select("id, detail, price, service_type_id"),

      supabase
        .from("service_type")
        .select("id, type"),

      supabase
        .from("print_file")
        .select("order_id, filename, file_url")
        .in("order_id", orderIds),

      supabase
        .from("payment")
        .select("order_id, amount")
        .in("order_id", orderIds),

      supabase
        .from("work_status")
        .select("order_id, status_id, updated_at")
        .in("order_id", orderIds),

      supabase
        .from("status")
        .select("id, state"),
    ]);

    const statusMap = new Map(
      ((statuses || []) as Status[]).map((s) => [s.id, s.state])
    );

    const customerMap = new Map(
      ((customers || []) as Customer[]).map((c) => [c.id, c])
    );

    const serviceDetailMap = new Map(
      ((serviceDetails || []) as ServiceDetail[]).map((sd) => [sd.id, sd])
    );

    const serviceTypeMap = new Map(
      ((serviceTypes || []) as ServiceType[]).map((st) => [st.id, st.type])
    );

    const orderItemMap = new Map(
      ((orderItems || []) as OrderItem[]).map((item) => [item.order_id, item])
    );

    const fileMap = new Map(
      ((files || []) as PrintFile[]).map((f) => [f.order_id, f])
    );

    const paymentMap = new Map(
      ((payments || []) as Payment[]).map((p) => [p.order_id, p])
    );

    const workStatusMap = new Map<string, WorkStatus[]>();

    ((workStatuses || []) as WorkStatus[]).forEach((ws) => {
      if (!workStatusMap.has(ws.order_id)) {
        workStatusMap.set(ws.order_id, []);
      }
      workStatusMap.get(ws.order_id)!.push(ws);
    });

    const result: ResultOrder[] = (orders as Order[])
      .map((order) => {
        const orderStates = workStatusMap.get(order.id) || [];

        orderStates.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
        );

        const latestStatusId = orderStates[0]?.status_id;
        const currentStateText = statusMap.get(latestStatusId) || "";

        const customer = customerMap.get(order.customer_id);
        const orderItem = orderItemMap.get(order.id);
        const detail = orderItem ? serviceDetailMap.get(orderItem.service_detail_id) : null;
        const serviceTypeName = detail ? serviceTypeMap.get(detail.service_type_id) : "";
        const file = fileMap.get(order.id);
        const payment = paymentMap.get(order.id);

        return {
          order_id: order.id,
          date: order.order_date,
          customer_name: `${customer?.first_name ?? ""} ${
            customer?.last_name ?? ""
          }`.trim(),
          customer_avatar: customer?.avatar ?? "",
          qty: orderItem?.quantity ?? 0,
          type: serviceTypeName ?? "",
          detail: detail?.detail ?? order.description ?? "",
          file_name: file?.filename ?? "",
          file_url: file?.file_url ?? "",
          status: currentStateText,
          price: orderItem?.unit_price ?? detail?.price ?? 0,
          amount: payment?.amount ?? order.total_price ?? 0,
        };
      })
      .filter((item) => {
        if (status === "ทั้งหมด") {
          return true;
        }
        return item.status === status;
      });

    return res.status(200).json({
      count: result.length,
      orders: result,
    });
  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};