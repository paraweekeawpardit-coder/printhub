import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// ==========================================
// 1. ดึงรายละเอียดออเดอร์สำหรับหน้ารีวิว
// ==========================================
export const getReviewOrderDetail = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabase
      .from("print_order")
      .select(`
        id,
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

    if (error) throw error;
    if (!order) return res.status(404).json({ success: false, message: "ไม่พบข้อมูลออเดอร์" });

    return res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ส่งรีวิว
// ==========================================
export const submitOrderReview = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { order_id, shop_id, score, comment, image_url } = req.body;

    const { error } = await supabase.from("review").insert([
      {
        customer_id: customerId,
        order_id,
        shop_id,
        score: Number(score),
        comment: comment || null,
        image_url: image_url || null,
      },
    ]);

    if (error) throw error;

    return res.status(201).json({ success: true, message: "ส่งรีวิวสำเร็จ ขอบคุณสำหรับข้อเสนอแนะ" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. ส่งรายงานปัญหา
// ==========================================
export const submitOrderReport = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { order_id, shop_id, admin_id, description, image_url } = req.body;

    const { error } = await supabase.from("report").insert([
      {
        customer_id: customerId,
        order_id: order_id || null,
        shop_id,
        admin_id,
        description,
        image_url: image_url || null,
      },
    ]);

    if (error) throw error;

    return res.status(201).json({ success: true, message: "ส่งรายงานปัญหาเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบ" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};