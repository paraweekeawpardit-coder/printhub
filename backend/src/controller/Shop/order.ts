import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import { syncAutoStatuses } from "./home.js";

// ==========================================
// Types
// ==========================================
export interface OrderItemDetail {
  id: string;
  category: string;
  describe: string;
  file_url: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  page_count: number | null;
}

export interface PaymentDetail {
  id: string;
  slip_url: string | null;
  is_verified: boolean | null;
}

export interface ResultOrder {
  order_id: string;
  order_no: number;
  date: string;
  customer_name: string;
  status: string;
  amount: number;
  items: OrderItemDetail[];
  payment: PaymentDetail | null;
  pickup_time: string | null;
}

interface SupabaseOrderQueryResult {
  id: string;
  order_no: number;
  order_date: string;
  appointment_time: string | null;
  receive_date: string | null;
  total_amount: number | null;
  payment_id: string | null;
  customer: { first_name: string | null; last_name: string | null } | { first_name: string | null; last_name: string | null }[] | null;
  current_status: { state: string } | { state: string }[] | null;
  payment: { id: string; slip_url: string | null; is_verified: boolean | null } | { id: string; slip_url: string | null; is_verified: boolean | null }[] | null;
  print_order_item: Array<{
    id: string;
    category: string | null;
    describe: string | null;
    file_url: string | null;
    quantity: number;
    unit_price: number | null;
    subtotal: number | null;
    page_count: number | null;
  }> | null;
}

// ==========================================
// Get Orders By Status (for a shop)
// ==========================================

export const getOrdersByStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers.shop_id || req.query.shop_id) as string;
    const statusFilter = (req.query.status as string) || "ทั้งหมด";

    if (!shop_id) {
      return res.status(400).json({
        error: "shop_id is required",
      });
    }

    // เขียนสถานะที่เปลี่ยนอัตโนมัติลง DB ก่อนดึงข้อมูล
    await syncAutoStatuses(shop_id);

    const { data: rawOrders, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        order_no,
        order_date,
        receive_date,
        appointment_time,
        total_price,
        total_amount,
        payment_id,
        customer:customer_id (
          first_name,
          last_name
        ),
        current_status:current_status_id (
          state
        ),
        payment:payment_id (
          id,
          slip_url,
          is_verified
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
        )
        `
      )
      .eq("shop_id", shop_id);

    // 2. ถ้ามีการส่ง status ที่ไม่ใช่ "ทั้งหมด" ให้ Filter ตั้งแต่ชั้น Query
    if (status !== "ทั้งหมด") {
      query = query.eq("current_status.state", status);
    }

    // สั่ง Query ข้อมูลและเรียงลำดับ order_date
    const { data: orders, error } = await query.order("order_date", {
      ascending: false,
    });

    if (error) {
      console.error("Get orders error:", error);
      return res.status(400).json({
        error: error.message,
      });
    }

    const orders = (rawOrders || []) as unknown as SupabaseOrderQueryResult[];
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const processedOrders: ResultOrder[] = orders
      .map((order) => {
        const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer;
        const currentStatus = Array.isArray(order.current_status) ? order.current_status[0] : order.current_status;
        const payment = Array.isArray(order.payment) ? order.payment[0] : order.payment;

        let computedStatus = currentStatus?.state || "รอการดำเนินงาน";

        // -------------------------------------------------------------
        // เงื่อนไขเวลาเพิ่มเติม:
        // -------------------------------------------------------------
        const appointmentTimeStr = order.appointment_time || order.receive_date;

        if (appointmentTimeStr) {
          const appointmentTime = new Date(appointmentTimeStr).getTime();

          if (!isNaN(appointmentTime)) {
            const isPending =
              computedStatus === "รอการดำเนินการ" ||
              computedStatus === "รอการดำเนินงาน";
            const isPendingOrPrinting = isPending || computedStatus === "กำลังพิมพ์";

            // ถ้ารอดำเนินการ หรือ กำลังพิมพ์ แล้วเลยเวลานัดรับ -> เปลี่ยนเป็น "ยกเลิกการพิมพ์"
            if (isPendingOrPrinting && now > appointmentTime) {
              computedStatus = "ยกเลิกการพิมพ์";
            }

            // ถ้าพิมพ์เสร็จสิ้น แล้วเลยเวลานัดรับเกิน 24 ชม. -> เปลี่ยนเป็น "รายการเสร็จสิ้น"
            const isCompletedPrint = computedStatus === "พิมพ์เสร็จสิ้น";
            if (isCompletedPrint && now > appointmentTime + ONE_DAY_MS) {
              computedStatus = "รายการเสร็จสิ้น";
            }
          }
        }

        const items: OrderItemDetail[] = (order.print_order_item || []).map(
          (item) => ({
            id: item.id,
            category: item.category || "รายการพิมพ์",
            describe: item.describe || "",
            file_url: item.file_url || null,
            quantity: Number(item.quantity || 0),
            unit_price: Number(item.unit_price || 0),
            subtotal: Number(item.subtotal || 0),
            page_count: item.page_count ?? null,
          })
        );

        return {
          order_id: order.id,
          order_no: order.order_no,
          date: order.order_date,
          customer_name: `${customer?.first_name ?? ""} ${
            customer?.last_name ?? ""
          }`.trim() || "ลูกค้าทั่วไป",
          status: computedStatus,
          amount: Number(order.total_amount || order.total_price || 0),
          items,
          pickup_time:
            order.appointment_time || order.receive_date || order.order_date || null,
          payment: payment
            ? {
                id: payment.id,
                slip_url: payment.slip_url || null,
                is_verified: payment.is_verified ?? null,
              }
            : null,
        };
      })
      .filter((order) => {
        // 1. กรองสถานะ "รอการชำระเงิน" ออก
        if (order.status === "รอการชำระเงิน") return false;
        // 2. กรองตาม Tab สถานะที่เลือก
        if (statusFilter !== "ทั้งหมด" && order.status !== statusFilter) return false;
        return true;
      });

    // กำหนดลำดับความสำคัญของสถานะ
    const STATUS_PRIORITY: Record<string, number> = {
      รอการดำเนินการ: 1,
      รอการดำเนินงาน: 1,
      กำลังพิมพ์: 2,
      พิมพ์เสร็จสิ้น: 3,
      รายการเสร็จสิ้น: 4,
      ยกเลิกการพิมพ์: 5,
    };

    const getPickupTimestamp = (o: ResultOrder): number => {
      const t = new Date(o.pickup_time || o.date).getTime();
      return isNaN(t) ? new Date(o.date).getTime() : t;
    };

    // จัดเรียงข้อมูล (Status Priority -> เวลานัดรับเรียงตามลำดับก่อน-หลัง)
    const sortedOrders = [...processedOrders].sort((a, b) => {
      const priorityA = STATUS_PRIORITY[a.status] ?? 99;
      const priorityB = STATUS_PRIORITY[b.status] ?? 99;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // สถานะเดียวกัน -> เวลานัดรับที่ใกล้ถึงที่สุดขึ้นก่อน
      return getPickupTimestamp(a) - getPickupTimestamp(b);
    });

    return res.status(200).json({
      count: sortedOrders.length,
      orders: sortedOrders,
    });
  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};

// ==========================================
// Update Order Status (Check Suspended)
// ==========================================

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    const shop_id = (req.headers.shop_id ||
      req.query.shop_id ||
      req.body.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: shop, error: shopError } = await supabase
      .from("print_shop")
      .select("status")
      .eq("id", shop_id)
      .single();

    if (shopError || !shop) {
      return res.status(404).json({ error: "ไม่พบข้อมูลร้านค้า" });
    }

    if (shop.status === "suspended") {
      return res.status(403).json({
        error: "บัญชีของคุณถูกระงับการใช้งาน ไม่สามารถเปลี่ยนสถานะออเดอร์ได้",
      });
    }

    const { data: statusData, error: statusError } = await supabase
      .from("status")
      .select("id")
      .eq("state", newStatus)
      .single();

    if (statusError || !statusData) {
      return res.status(400).json({ error: "ไม่พบสถานะออเดอร์ที่ระบุ" });
    }

    const { error: updateError } = await supabase
      .from("print_order")
      .update({ current_status_id: statusData.id })
      .eq("id", orderId)
      .eq("shop_id", shop_id);

    if (updateError) {
      console.error("Update order status error:", updateError);
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({
      message: "อัปเดตสถานะออเดอร์เรียบร้อยแล้ว",
    });
  } catch (err) {
    console.error("Update order status server error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ==========================================
// Get Single Order By ID (for shop detail page)
// ==========================================

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        error: "orderId is required",
      });
    }

    const { data: order, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        order_no,
        order_date,
        receive_date,
        appointment_time,
        total_price,
        total_amount,
        payment_id,

        customer:customer_id (
          first_name,
          last_name,
          contact
        ),

        current_status:current_status_id (
          id,
          state
        ),

        payment:payment_id (
          id,
          slip_url,
          is_verified,
          amount,
          payment_date
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
        )
        `
      )
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error("Get order detail error:", error);
      return res.status(404).json({
        error: "ไม่พบข้อมูลรายการสั่งซื้อ",
      });
    }

    const customer = Array.isArray(order.customer)
      ? order.customer[0]
      : order.customer;

    const currentStatus = Array.isArray(order.current_status)
      ? order.current_status[0]
      : order.current_status;

    const payment = Array.isArray(order.payment)
      ? order.payment[0]
      : order.payment;

    const items: OrderItemDetail[] = (order.print_order_item || []).map(
      (item: any) => ({
        id: item.id,
        category: item.category || "รายการพิมพ์",
        describe: item.describe || "",
        file_url: item.file_url || null,
        quantity: item.quantity,
        unit_price: Number(item.unit_price || 0),
        subtotal: Number(item.subtotal || 0),
        page_count: item.page_count ?? null,
      })
    );

    const resultOrder = {
      order_id: order.id,
      order_no: order.order_no,
      date: order.order_date,
      appointment_time: order.appointment_time || order.receive_date,
      customer_name: `${customer?.first_name ?? ""} ${
        customer?.last_name ?? ""
      }`.trim(),
      customer_contact: customer?.contact || "",
      status: currentStatus?.state || "รอการดำเนินการ",
      amount: Number(order.total_amount || order.total_price || 0),
      items,
      payment: payment
        ? {
            id: payment.id,
            slip_url: payment.slip_url || null,
            is_verified: payment.is_verified ?? null,
            amount: Number(payment.amount || 0),
            payment_date: payment.payment_date || null,
          }
        : null,
    };

    return res.status(200).json({
      order: resultOrder,
    });
  } catch (err) {
    console.error("Get order by ID server error:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};