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
// 3. ส่งรายงานปัญหา / ขอคืนเงิน
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
      issue_type,
      resolution,
      bank_name,
      account_number,
      account_name,
    } = req.body;

    const uploadedFile = (req as any).file;

    console.log("🔍 ตรวจสอบ req.body:", req.body);
    console.log("🔍 ตรวจสอบไฟล์ที่ได้รับ (uploadedFile):", uploadedFile);

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

    if (!issue_type) {
      return res.status(400).json({
        success: false,
        message: "กรุณาเลือกประเภทปัญหา",
      });
    }

    // ==========================================
    // ตรวจสอบ Order จาก Database
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
    // ตรวจสอบความเป็นเจ้าของ Order (Security Check)
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
    // จัดการอัปโหลดรูปภาพขึ้น Supabase Storage (ถ้ามีไฟล์ส่งมา)
    // ==========================================
    let imageUrl = null;

    if (uploadedFile) {
      const fileName = `${Date.now()}_${uploadedFile.originalname}`;
      const filePath = `reports/${fileName}`;

      // อัปโหลดไฟล์ไปที่ Supabase Storage (ตัวอย่าง Bucket ชื่อ "print-shop-storage" หรือชื่อ bucket ของคุณ)
      const { data: storageData, error: storageError } = await supabase.storage
        .from("reports") // 👈 เปลี่ยนเป็นชื่อ Bucket ของคุณใน Supabase
        .upload(filePath, uploadedFile.buffer, {
          contentType: uploadedFile.mimetype,
          upsert: false,
        });

      if (storageError) {
        console.error("❌ Storage Upload Error:", storageError);
        throw new Error("ไม่สามารถอัปโหลดรูปภาพได้: " + storageError.message);
      }

      // ดึง Public URL ของรูปที่เพิ่งอัปโหลด
      const { data: publicUrlData } = supabase.storage
        .from("reports")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // ==========================================
    // บันทึกรายงานลง Database (แบบแยกคอลัมน์)
    // ==========================================
    const { error: insertError } = await supabase
      .from("report")
      .insert([
        {
          customer_id: customer_id,
          order_id: order_id,
          shop_id: shop_id,
          admin_id: admin_id || null,
          issue_type: issue_type,
          description: description || null,
          resolution: resolution || "refund",
          bank_name: bank_name || null,
          account_number: account_number || null,
          account_name: account_name || null,
          image_url: imageUrl,
          is_verified: false, // ค่าเริ่มต้นยังไม่ตรวจสอบ
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message:
        "ส่งคำร้องขอคืนเงิน/แจ้งปัญหาเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบ",
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