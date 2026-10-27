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

    const { data: orders, error } = await supabase
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
      .eq("id", orderId);

    if (error) {
      console.error("❌ Get Review Order Detail Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลออเดอร์",
      });
    }

    const order = orders[0];

    const { data: existingReport } = await supabase
      .from("report")
      .select("id")
      .eq("order_id", orderId);

    const { data: existingReview } = await supabase
      .from("review")
      .select("id")
      .eq("order_id", orderId);

    const hasReported = existingReport && existingReport.length > 0;
    const hasReviewed = existingReview && existingReview.length > 0;

    return res.status(200).json({
      success: true,
      data: {
        ...order,
        has_reported: !!hasReported,
        has_reviewed: !!hasReviewed,
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

    if (!score || Number(score) < 1 || Number(score) > 5) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุคะแนนรีวิว 1-5 ดาว",
      });
    }

    const { data: orders, error: orderError } = await supabase
      .from("print_order")
      .select(`
        id,
        customer_id,
        shop_id
      `)
      .eq("id", order_id);

    if (orderError) {
      throw orderError;
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำสั่งซื้อ",
      });
    }

    const order = orders[0];

    if (order.customer_id !== customer_id) {
      return res.status(403).json({
        success: false,
        message: "ไม่สามารถรีวิวคำสั่งซื้อของลูกค้ารายอื่นได้",
      });
    }

    if (order.shop_id !== shop_id) {
      return res.status(400).json({
        success: false,
        message: "ข้อมูลร้านค้าไม่ตรงกับคำสั่งซื้อ",
      });
    }

    const { data: existingReviews, error: existingReviewError } =
      await supabase
        .from("review")
        .select("id")
        .eq("order_id", order_id);

    if (existingReviewError) {
      throw existingReviewError;
    }

    if (existingReviews && existingReviews.length > 0) {
      return res.status(409).json({
        success: false,
        message: "คำสั่งซื้อนี้ได้รับการรีวิวไปแล้ว ไม่สามารถรีวิวซ้ำได้",
      });
    }

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

      const { data: publicUrlData } = supabase.storage
        .from("reviews")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

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

    const { data: existingReports, error: checkError } = await supabase
      .from("report")
      .select("id")
      .eq("order_id", order_id);

    if (checkError) {
      throw checkError;
    }

    if (existingReports && existingReports.length > 0) {
      return res.status(400).json({
        success: false,
        message: "คุณได้ส่งคำร้องขอคืนเงินสำหรับคำสั่งซื้อนี้ไปแล้ว ไม่สามารถส่งซ้ำได้",
      });
    }

    const { data: orders, error: orderError } = await supabase
      .from("print_order")
      .select(`
        id,
        customer_id,
        shop_id
      `)
      .eq("id", order_id);

    if (orderError) {
      throw orderError;
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำสั่งซื้อ",
      });
    }

    const order = orders[0];

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
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    try {
      const { data: adminUsers } = await supabase
        .from("admin")
        .select("id");

      if (adminUsers && adminUsers.length > 0) {
        const adminNotifications = adminUsers.map((admin) => ({
          admin_id: admin.id,
          order_id: order_id,
          title: "มีรายการแจ้งปัญหาใหม่",
          message: `รายการปัญหาใหม่ประเภท: ${issue_type}`,
          type: "report_issue",
          is_read: false,
        }));

        await supabase.from("notifications").insert(adminNotifications);
      }
    } catch (notiError) {
      console.error("❌ Notification error for admins:", notiError);
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
// 4. ดึงรายการรีวิวทั้งหมดของร้านค้า
// ==========================================
export const getShopReviews = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    // 1. ดึงรายงานทั้งหมดของร้านนี้
    const { data: shopReports } = await supabase
      .from("report")
      .select("review_id, order_id")
      .eq("shop_id", shopId);

    // เก็บ ID รีวิวและ Order ID ที่เคยถูกรายงานแล้ว
    const reportedReviewIds = new Set(
      shopReports?.map((r: any) => r.review_id).filter(Boolean) || []
    );
    const reportedOrderIds = new Set(
      shopReports?.map((r: any) => r.order_id).filter(Boolean) || []
    );

    const { data: reviews, error } = await supabase
      .from("review")
      .select(`
        id,
        order_id,
        score,
        comment,
        image_url,
        created_at,
        shop_reply,
        reply_at,
        customer_id,
        customer:customer_id (
          id,
          first_name,
          last_name
        ),
        print_order:order_id (
          id,
          description,
          print_order_item (*)
        )
      `)
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedReviews = (reviews || []).map((rev: any) => {
      // 🟢 เช็คว่ารีวิวนี้หรือออเดอร์นี้เคยถูกรายงานไปหรือยัง
      const hasReported =
        reportedReviewIds.has(rev.id) ||
        (rev.order_id && reportedOrderIds.has(rev.order_id));

      return {
        id: rev.id,
        score: Number(rev.score || 0),
        comment: rev.comment,
        image_url: rev.image_url,
        created_at: rev.created_at,
        shop_reply: rev.shop_reply || null,
        reply_at: rev.reply_at || null,
        customer: rev.customer,
        print_order: rev.print_order,
        has_reported: hasReported, // 🟢 ส่งค่านี้กลับไปให้ Frontend ใช้เปลี่ยนสีธง
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. ร้านค้ารายงานรีวิวที่ไม่เหมาะสม
// ==========================================
export const reportReview = async (req: Request, res: Response) => {
  try {
    const { review_id, shop_id, description, order_id } = req.body;

    if (!review_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบรหัสรีวิวที่ต้องการรายงาน",
      });
    }

    if (!shop_id) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบข้อมูลร้านค้า",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุเหตุผลในการรายงานรีวิว",
      });
    }

    const { data: existingReports, error: checkError } = await supabase
      .from("report")
      .select("id")
      .eq("review_id", review_id)
      .eq("shop_id", shop_id);

    if (checkError) {
      throw checkError;
    }

    if (existingReports && existingReports.length > 0) {
      return res.status(400).json({
        success: false,
        message: "คุณได้รายงานรีวิวนี้ไปเรียบร้อยแล้ว ไม่สามารถรายงานซ้ำได้",
      });
    }

    const { error: insertError } = await supabase
      .from("report")
      .insert([
        {
          review_id: review_id,
          shop_id: shop_id,
          order_id: order_id || null,
          description: description.trim(),
          issue_type: "review_issue",
          status: "pending",
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message: "ส่งรายงานรีวิวไม่เหมาะสมสำเร็จ",
    });
  } catch (error: any) {
    console.error("❌ reportReview Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการรายงานรีวิว",
    });
  }
};