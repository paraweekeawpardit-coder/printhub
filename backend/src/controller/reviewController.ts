import { Request, Response } from "express";
import supabase from "../config/supabase.js";

// ==========================================
// 1. ดึงรายละเอียดออเดอร์สำหรับหน้ารีวิว (พร้อมเช็กสถานะการรายงานและการรีวิว)
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

    // 🛑 1. ตรวจสอบว่าออร์เดอร์นี้เคยถูกรายงานไปแล้วหรือยัง
    const { data: existingReport } = await supabase
      .from("report")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();

    // 🛑 2. ตรวจสอบว่าออร์เดอร์นี้เคยถูกรีวิวไปแล้วหรือยัง
    const { data: existingReview } = await supabase
      .from("review")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();

    console.log("✅ Review Order:", {
      id: order.id,
      customer_id: order.customer_id,
      shop_id: order.shop_id,
      has_reported: !!existingReport,
      has_reviewed: !!existingReview,
    });

    return res.status(200).json({
      success: true,
      data: {
        ...order,
        has_reported: !!existingReport,
        has_reviewed: !!existingReview, // 👈 ส่งสถานะ true/false กลับไปที่หน้าบ้าน
      },
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
// 2. ส่งรีวิว (รองรับการอัปโหลดไฟล์รูปภาพ/PDF ขึ้น Bucket 'reviews')
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
    } = req.body;

    const uploadedFile = (req as any).file; // ดึงไฟล์ที่แนบมากับ FormData

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
    // ตรวจสอบว่าเคยรีวิวแล้วหรือยัง (ป้องกันรีวิวซ้ำ)
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
        message: "คำสั่งซื้อนี้ได้รับการรีวิวไปแล้ว ไม่สามารถรีวิวซ้ำได้",
      });
    }

    // ==========================================
    // อัปโหลดไฟล์ภาพ/PDF ขึ้น Supabase Storage (Bucket: reviews)
    // ==========================================
    let imageUrl = null;

    if (uploadedFile) {
      const fileName = `${Date.now()}_${uploadedFile.originalname}`;
      const filePath = `reviews/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from("reviews")
        .upload(filePath, uploadedFile.buffer, {
          contentType: uploadedFile.mimetype,
          upsert: false,
        });

      if (storageError) {
        console.error("❌ Storage Upload Error:", storageError);
        throw new Error("ไม่สามารถอัปโหลดรูปภาพได้: " + storageError.message);
      }

      // ดึง Public URL ของไฟล์ที่เพิ่งอัปโหลด
      const { data: publicUrlData } = supabase.storage
        .from("reviews")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // ==========================================
    // บันทึกรีวิวลงฐานข้อมูล
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
          image_url: imageUrl,
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
      issue_type,
      resolution,
      bank_name,
      account_number,
      account_name,
    } = req.body;

    const uploadedFile = (req as any).file;

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
    // 🛑 ป้องกันการส่งซ้ำ: เช็กในตาราง report ก่อนบันทึก
    // ==========================================
    const { data: existingReport, error: checkError } = await supabase
      .from("report")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "คุณได้ส่งคำร้องขอคืนเงินสำหรับคำสั่งซื้อนี้ไปแล้ว ไม่สามารถส่งซ้ำได้",
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

      const { error: storageError } = await supabase.storage
        .from("reports")
        .upload(filePath, uploadedFile.buffer, {
          contentType: uploadedFile.mimetype,
          upsert: false,
        });

      if (storageError) {
        console.error("❌ Storage Upload Error:", storageError);
        throw new Error("ไม่สามารถอัปโหลดรูปภาพได้: " + storageError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("reports")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // ==========================================
    // บันทึกรายงานลง Database
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
          is_verified: false,
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

// ==========================================
// 4. ดึงรายการรีวิวทั้งหมดของร้านค้า (ดึงชื่อ-นามสกุลจริงจากตาราง customer)
// ==========================================
export const getShopReviews = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบรหัสร้านค้า",
      });
    }

    // 1. ดึงรีวิวพร้อมเชื่อมข้อมูลตาราง customer โดยใช้ first_name และ last_name
    const { data: reviews, error } = await supabase
      .from("review")
      .select(`
        id,
        score,
        comment,
        image_url,
        created_at,
        customer_id,
        customer:customer_id (
          id,
          first_name,
          last_name
        )
      `)
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // 2. จัดรูปแบบชื่อลูกค้า (รวม first_name และ last_name เข้าด้วยกัน)
    const formattedReviews = reviews.map((rev: any) => {
      const cust = rev.customer;
      let customerName = "ลูกค้าผู้ใช้บริการ";

      if (cust) {
        const firstName = cust.first_name || "";
        const lastName = cust.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) {
          customerName = fullName;
        }
      }

      return {
        id: rev.id,
        score: rev.score,
        comment: rev.comment,
        image_url: rev.image_url,
        created_at: rev.created_at,
        customer_name: customerName,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (error: any) {
    console.error("❌ getShopReviews Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว",
    });
  }
};