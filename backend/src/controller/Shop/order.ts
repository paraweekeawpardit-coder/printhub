import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import { syncAutoStatuses } from "./home.js"; // ปรับ path ให้ตรงกับที่วาง home.ts

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

    // เขียนสถานะที่เปลี่ยนอัตโนมัติ (เลยเวลารับ ฯลฯ) ลง DB ก่อนดึงข้อมูล
    await syncAutoStatuses(shop_id);

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(
        `
        id,
        order_no,
        order_date,
        appointment_time,
        receive_date,
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

    if (error) {
      console.error("Get orders error:", error);
      return res.status(400).json({
        error: error.message,
      });
    }

    const now = new Date().getTime();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000; // ใช้กับ พิมพ์เสร็จสิ้น -> รายการเสร็จสิ้น

    // 1. กรองสถานะ "รอการชำระเงิน" ออก
    const filteredOrders = (orders || []).filter((order: any) => {
      const currentStatus = Array.isArray(order.current_status)
        ? order.current_status[0]
        : order.current_status;
      return currentStatus?.state !== "รอการชำระเงิน";
    });

    // 2. คำนวณและปรับเปลี่ยนสถานะตามเงื่อนไขเวลา
    const processedOrders: ResultOrder[] = filteredOrders
      .map((order: any) => {
        const customer = Array.isArray(order.customer)
          ? order.customer[0]
          : order.customer;

        const currentStatus = Array.isArray(order.current_status)
          ? order.current_status[0]
          : order.current_status;

        const payment = Array.isArray(order.payment)
          ? order.payment[0]
          : order.payment;

        let computedStatus = currentStatus?.state || "รอการดำเนินงาน";

        // -------------------------------------------------------------
        // เงื่อนไขเวลาเพิ่มเติม:
        // -------------------------------------------------------------
        const isPending =
          computedStatus === "รอการดำเนินการ" ||
          computedStatus === "รอการดำเนินงาน";

        // ยกเลิกอัตโนมัติเฉพาะเมื่อถึงเวลารับแล้วยังเป็นรอการดำเนินงาน/กำลังพิมพ์
        // (ไม่มีการยกเลิกเพราะร้านไม่กดยืนยันภายใน 24 ชม. อีกต่อไป)
        const appointmentTimeStr =
          order.appointment_time || order.receive_date;

        if (appointmentTimeStr) {
          const appointmentTime = new Date(appointmentTimeStr).getTime();

          // ถ้ารอดำเนินการ หรือ กำลังพิมพ์ แล้วเลยเวลานัดรับ -> เปลี่ยนเป็น "ยกเลิกการพิมพ์"
          const isPendingOrPrinting = isPending || computedStatus === "กำลังพิมพ์";
          if (isPendingOrPrinting && now > appointmentTime) {
            computedStatus = "ยกเลิกการพิมพ์";
          }

          // ถ้าพิมพ์เสร็จสิ้น แล้วเลยเวลานัดรับเกิน 24 ชม. -> เปลี่ยนเป็น "รายการเสร็จสิ้น"
          const isCompletedPrint = computedStatus === "พิมพ์เสร็จสิ้น";
          if (isCompletedPrint && now > appointmentTime + ONE_DAY_MS) {
            computedStatus = "รายการเสร็จสิ้น";
          }
        }

        // Sub-orders (cart items -> print_order_item)
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
          status: computedStatus,
          amount: Number(order.total_amount || 0),
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
      .filter((order) => status === "ทั้งหมด" || order.status === status);

    // 3. กำหนดลำดับความสำคัญของสถานะ
    const STATUS_PRIORITY: Record<string, number> = {
      รอการดำเนินการ: 1,
      รอการดำเนินงาน: 1,
      กำลังพิมพ์: 2,
      พิมพ์เสร็จสิ้น: 3,
      รายการเสร็จสิ้น: 4,
      ยกเลิกการพิมพ์: 5,
    };

    // 4. จัดเรียงข้อมูล (Status Priority -> เวลารับที่ใกล้ถึงขึ้นก่อน)
    const getPickupTime = (o: ResultOrder) => {
      const t = new Date(o.pickup_time || o.date).getTime();
      return isNaN(t) ? new Date(o.date).getTime() : t;
    };

    const sortedOrders = processedOrders.sort((a, b) => {
      const priorityA = STATUS_PRIORITY[a.status] ?? 99;
      const priorityB = STATUS_PRIORITY[b.status] ?? 99;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // สถานะเดียวกัน -> เวลารับที่ใกล้ปัจจุบันที่สุดขึ้นก่อน
      return (
        Math.abs(getPickupTime(a) - now) - Math.abs(getPickupTime(b) - now)
      );
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