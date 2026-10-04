import { Request, Response } from "express";
import supabase from "../config/supabase.js";

// ==========================================
// 1. ดึงรายละเอียดออเดอร์สำหรับหน้ารีวิว
// ==========================================
export const getReviewOrderDetail = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบรหัสคำสั่งซื้อ",
      });
    }

    const { data: order, error } = await supabase
      .from("print_order")
      .select(`
        id,
        customer_id,
        shop_id,
        order_date,
        total_price,
        description,

        print_shop (
          id,
          shop_name,
          profile_image
        ),

        print_order_item (*)
      `)
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error("❌ Get Review Order Detail Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลออเดอร์",
      });
    }

    console.log("✅ Review Order:", {
      id: order.id,
      customer_id: order.customer_id,
      shop_id: order.shop_id,
    });

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("❌ getReviewOrderDetail:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลออเดอร์",
    });
  }
};

// ==========================================
// 2. ส่งรีวิว
// ==========================================
export const submitOrderReview = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      order_id,
      shop_id,
      customer_id,
      score,
      comment,
      image_url,
    } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบรหัสคำสั่งซื้อ",
      });
    }

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบข้อมูลลูกค้า",
      });
    }

    if (!shop_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบข้อมูลร้านค้า",
      });
    }

    if (!score || Number(score) < 1 || Number(score) > 5) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุคะแนนรีวิว 1-5 ดาว",
      });
    }

    // ==========================================
    // ตรวจสอบว่า Order มีอยู่จริง
    // ==========================================
    const { data: order, error: orderError } = await supabase
      .from("print_order")
      .select(`
        id,
        customer_id,
        shop_id
      `)
      .eq("id", order_id)
      .maybeSingle();

    if (orderError) {
      throw orderError;
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำสั่งซื้อ",
      });
    }

    // ==========================================
    // ป้องกันไม่ให้ส่ง customer_id ของคนอื่น
    // ==========================================
    if (order.customer_id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: "ไม่สามารถรีวิวคำสั่งซื้อของลูกค้ารายอื่นได้",
      });
    }

    // ==========================================
    // ตรวจสอบร้านค้า
    // ==========================================
    if (order.shop_id !== shop_id) {
      return res.status(400).json({
        success: false,
        message: "ข้อมูลร้านค้าไม่ตรงกับคำสั่งซื้อ",
      });
    }

    // ==========================================
    // ตรวจสอบว่าเคยรีวิวแล้วหรือยัง
    // ==========================================
    const { data: existingReview, error: existingReviewError } =
      await supabase
        .from("review")
        .select("id")
        .eq("order_id", order_id)
        .maybeSingle();

    if (existingReviewError) {
      throw existingReviewError;
    }

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "คำสั่งซื้อนี้ได้รับการรีวิวไปแล้ว",
      });
    }

    // ==========================================
    // บันทึกรีวิว
    // ==========================================
    const { error: insertError } = await supabase
      .from("review")
      .insert([
        {
          customer_id: customer_id,
          order_id: order_id,
          shop_id: shop_id,
          score: Number(score),
          comment: comment?.trim() || null,
          image_url: image_url || null,
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message: "ส่งรีวิวสำเร็จ ขอบคุณสำหรับข้อเสนอแนะ",
    });
  } catch (error: any) {
    console.error("❌ submitOrderReview:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการส่งรีวิว",
    });
  }
};

// ==========================================
// 3. ส่งรายงานปัญหา
// ==========================================
export const submitOrderReport = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      order_id,
      shop_id,
      admin_id,
      customer_id,
      description,
      image_url,
    } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบรหัสคำสั่งซื้อ",
      });
    }

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบข้อมูลลูกค้า",
      });
    }

    if (!shop_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบข้อมูลร้านค้า",
      });
    }

    // ==========================================
    // ตรวจสอบ Order
    // ==========================================
    const { data: order, error: orderError } = await supabase
      .from("print_order")
      .select(`
        id,
        customer_id,
        shop_id
      `)
      .eq("id", order_id)
      .maybeSingle();

    if (orderError) {
      throw orderError;
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำสั่งซื้อ",
      });
    }

    // ==========================================
    // ตรวจสอบว่าเป็นเจ้าของ Order
    // ==========================================
    if (order.customer_id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: "ไม่สามารถรายงานคำสั่งซื้อของลูกค้ารายอื่นได้",
      });
    }

    if (order.shop_id !== shop_id) {
      return res.status(400).json({
        success: false,
        message: "ข้อมูลร้านค้าไม่ตรงกับคำสั่งซื้อ",
      });
    }

    // ==========================================
    // บันทึกรายงาน
    // ==========================================
    const { error: insertError } = await supabase
      .from("report")
      .insert([
        {
          customer_id: customer_id,
          order_id: order_id,
          shop_id: shop_id,
          admin_id: admin_id || null,
          description: description || null,
          image_url: image_url || null,
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message:
        "ส่งรายงานปัญหาเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบ",
    });
  } catch (error: any) {
    console.error("❌ submitOrderReport:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "เกิดข้อผิดพลาดในการส่งรายงาน",
    });
  }
};