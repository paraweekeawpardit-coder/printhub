import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

// ==========================================
// Types
// ==========================================
// NOTE: 1 order (print_order) can now hold MULTIPLE items
// (print_order_item rows), since these are created from a cart
// that can have several items in it at once. Each item below is
// what the frontend calls a "sub-order".

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

export interface ResultOrder {
  order_id: string;
  order_no: number;
  date: string;
  customer_name: string;
  status: string;
  amount: number;
  items: OrderItemDetail[];
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
    const status = (req.query.status as string) || "ทั้งหมด";

    if (!shop_id) {
      return res.status(400).json({
        error: "shop_id is required",
      });
    }

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        order_no,
        order_date,
        total_amount,

        customer:customer_id (
          first_name,
          last_name
        ),

        current_status:current_status_id (
          state
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
      .eq("shop_id", shop_id)
      .order("order_date", { ascending: false });

    if (error) {
      console.error("Get orders error:", error);
      return res.status(400).json({
        error: error.message,
      });
    }

    const result: ResultOrder[] = (orders || [])
      .map((order: any) => {
        const customer = Array.isArray(order.customer)
          ? order.customer[0]
          : order.customer;

        const currentStatus = Array.isArray(order.current_status)
          ? order.current_status[0]
          : order.current_status;

        const statusState = currentStatus?.state || "รอการดำเนินงาน";

        // ==========================================
        // Sub-orders (cart items -> print_order_item)
        // ==========================================
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

        return {
          order_id: order.id,
          order_no: order.order_no,
          date: order.order_date,
          customer_name: `${customer?.first_name ?? ""} ${
            customer?.last_name ?? ""
          }`.trim(),
          status: statusState,
          amount: Number(order.total_amount || 0),
          items,
        };
      })
      .filter((order) => status === "ทั้งหมด" || order.status === status);

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
    const shop_id = (req.headers.shop_id || req.query.shop_id || req.body.shop_id) as string;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // 🟢 1. เช็กสถานะของร้านค้าว่าถูกระงับการใช้งานอยู่หรือไม่
    const { data: shop, error: shopError } = await supabase
      .from("shop")
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

    // 🟢 2. ค้นหา status_id จากตาราง order_status ตามชื่อ newStatus
    const { data: statusData, error: statusError } = await supabase
      .from("order_status")
      .select("id")
      .eq("state", newStatus)
      .single();

    if (statusError || !statusData) {
      return res.status(400).json({ error: "ไม่พบสถานะออเดอร์ที่ระบุ" });
    }

    // 🟢 3. อัปเดตสถานะ current_status_id ในตาราง print_order
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