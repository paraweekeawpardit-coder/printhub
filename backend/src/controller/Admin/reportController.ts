import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/reports
 */
export const getAllReports = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data: reports, error } = await supabase
      .from("report")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !reports) {
      console.error("GetAllReports Error:", error?.message);
      return res.status(200).json([]);
    }

    const customerIds = [
      ...new Set(reports.map((r: any) => r.customer_id).filter(Boolean)),
    ];
    const shopIds = [
      ...new Set(reports.map((r: any) => r.shop_id).filter(Boolean)),
    ];
    const orderIds = [
      ...new Set(reports.map((r: any) => r.order_id).filter(Boolean)),
    ];
    const reviewIds = [
      ...new Set(reports.map((r: any) => r.review_id).filter(Boolean)),
    ];

    const [
      { data: customers },
      { data: shops },
      { data: orders },
      { data: orderItems },
      { data: orderFiles },
      { data: reviewsByReviewId },
      { data: reviewsByOrderId },
    ] = await Promise.all([
      customerIds.length > 0
        ? supabase
            .from("customer")
            .select("id, first_name, last_name, contact")
            .in("id", customerIds)
        : Promise.resolve({ data: [] }),
      shopIds.length > 0
        ? supabase
            .from("print_shop")
            .select("id, shop_name, email, phone, open_time, close_time")
            .in("id", shopIds)
        : Promise.resolve({ data: [] }),
      orderIds.length > 0
        ? supabase
            .from("print_order")
            .select(
              "id, order_no, total_price, total_amount, platform_fee, small_order_fee, description, appointment_time, order_date"
            )
            .in("id", orderIds)
        : Promise.resolve({ data: [] }),
      orderIds.length > 0
        ? supabase.from("print_order_item").select("*").in("order_id", orderIds)
        : Promise.resolve({ data: [] }),
      orderIds.length > 0
        ? supabase.from("print_file").select("*").in("order_id", orderIds)
        : Promise.resolve({ data: [] }),
      reviewIds.length > 0
        ? supabase
            .from("review")
            .select("id, order_id, comment, score, image_url, is_hidden")
            .in("id", reviewIds)
        : Promise.resolve({ data: [] }),
      orderIds.length > 0
        ? supabase
            .from("review")
            .select("id, order_id, comment, score, image_url, is_hidden")
            .in("order_id", orderIds)
        : Promise.resolve({ data: [] }),
    ]);

    const customerMap = new Map((customers || []).map((c: any) => [c.id, c]));
    const shopMap = new Map((shops || []).map((s: any) => [s.id, s]));
    const orderMap = new Map((orders || []).map((o: any) => [o.id, o]));
    
    const reviewIdMap = new Map((reviewsByReviewId || []).map((rv: any) => [rv.id, rv]));
    const reviewOrderMap = new Map((reviewsByOrderId || []).map((rv: any) => [rv.order_id, rv]));

    const orderItemsMap = new Map<string, any[]>();
    (orderItems || []).forEach((item: any) => {
      const oid = String(item.order_id);
      if (!orderItemsMap.has(oid)) {
        orderItemsMap.set(oid, []);
      }

      orderItemsMap.get(oid)!.push({
        id: item.id,
        item_name: item.category || "งานพิมพ์",
        quantity: item.quantity || 1,
        price: Number(item.subtotal || item.quantity * item.unit_price || 0),
        unit_price: Number(item.unit_price || 0),
        details: item.describe || "",
        page_count: item.page_count || 1,
      });
    });

    const orderFilesMap = new Map<string, any[]>();
    (orderFiles || []).forEach((file: any) => {
      const oid = String(file.order_id);
      if (!orderFilesMap.has(oid)) {
        orderFilesMap.set(oid, []);
      }

      orderFilesMap.get(oid)!.push({
        id: file.id,
        filename: file.filename || "ไฟล์งานพิมพ์",
        file_url: file.file_url,
        file_size_mb: file.file_size_mb || 0,
        page_count: file.page_count || 1,
      });
    });

    const formattedReports = reports.map((item: any) => {
      const cust: any = customerMap.get(item.customer_id);
      const shp: any = shopMap.get(item.shop_id);
      const ord: any = orderMap.get(item.order_id);
      
      const rvw: any = reviewIdMap.get(item.review_id) || reviewOrderMap.get(item.order_id);
      const itemsInOrder = orderItemsMap.get(String(item.order_id)) || [];
      const filesInOrder = orderFilesMap.get(String(item.order_id)) || [];

      const custName = cust
        ? `${cust.first_name || ""} ${cust.last_name || ""}`.trim() ||
          cust.contact
        : "-";

      const displayOrderNo = ord?.order_no
        ? `#${ord.order_no}`
        : item.order_id
          ? `#${item.order_id.slice(0, 8)}`
          : "-";

      return {
        ...item,
        status: item.status || "pending",
        issue_type:
          item.issue_type ||
          item.category ||
          item.problem_type ||
          "ไม่ระบุประเภทปัญหา",
        category: item.category || item.issue_type || "ไม่ระบุประเภทปัญหา",
        order_no: displayOrderNo,
        order_id_display: displayOrderNo,
        total_price: ord?.total_amount || ord?.total_price || 0,
        order_description: ord?.description || null,
        customer_name: custName,
        customer_phone: cust?.contact || "-",
        shop_name: shp?.shop_name || "-",
        shop_phone: shp?.phone || "-",
        updated_at: item.updated_at || null,
        admin_image_url: item.admin_image_url || null,
        order_items: itemsInOrder,
        order_files: filesInOrder,
        review_comment: rvw?.comment || null,
        review_rating: rvw?.score || 0,
        review_is_hidden: Boolean(rvw?.is_hidden),
        
        open_time: shp?.open_time || null,
        close_time: shp?.close_time || null,
        appointment_time: ord?.appointment_time || null,
        order_date: ord?.order_date || null,
      };
    });

    return res.status(200).json(formattedReports);
  } catch (err: any) {
    console.error("GetAllReports Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/reports/verify (รับเรื่องพิจารณา)
 */
export const verifyReport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { report_id, admin_id } = req.body;
    if (!report_id)
      return res.status(400).json({ error: "report_id is required" });

    const nowIso = new Date().toISOString();

    const updateData: any = {
      status: "investigating",
      is_verified: true,
      updated_at: nowIso,
    };

    if (admin_id) {
      updateData.admin_id = admin_id;
    }

    const { data, error } = await supabase
      .from("report")
      .update(updateData)
      .eq("id", report_id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res
      .status(200)
      .json({ message: "Updated status to investigating", data });
  } catch (err: any) {
    console.error("VerifyReport Exception:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/reports/resolve (ตัดสินเคส)
 */
export const resolveReport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { report_id, decision, admin_note, admin_image_url, admin_id, review_id } = req.body;

    if (!report_id || !decision || !admin_note?.trim()) {
      return res
        .status(400)
        .json({ error: "report_id, decision, and admin_note are required" });
    }

    const statusValue =
      decision === "approved" || decision === "hide_review" || decision === "resolved"
        ? "resolved"
        : "rejected";
        
    const nowIso = new Date().toISOString();

    const { data: report } = await supabase
      .from("report")
      .select("*")
      .eq("id", report_id)
      .single();

    const updatePayload: any = {
      status: statusValue,
      admin_note: admin_note.trim(),
      admin_image_url: admin_image_url || null,
      is_verified: true,
      updated_at: nowIso,
    };

    if (admin_id) {
      updatePayload.admin_id = admin_id;
    }

    // 1. อัปเดตสถานะของใบรายงานในตาราง report
    const { data: updatedReport, error } = await supabase
      .from("report")
      .update(updatePayload)
      .eq("id", report_id)
      .select()
      .single();

    if (error) {
      console.error("Update report status failed:", error.message);
      return res.status(400).json({ error: error.message });
    }

    // 2. 🟢 กรณีซ่อนรีวิว (hide_review): เคลียร์คอมเมนต์/รูปภาพ และตั้งค่า is_hidden = true
    if (decision === "hide_review") {
      const targetReviewId = review_id || report?.review_id;

      const reviewUpdatePayload = {
        comment: null,
        image_url: null,
        is_hidden: true,
      };
      
      if (targetReviewId) {
        await supabase
          .from("review")
          .update(reviewUpdatePayload)
          .eq("id", targetReviewId);
      }
      
      if (report?.order_id) {
        await supabase
          .from("review")
          .update(reviewUpdatePayload)
          .eq("order_id", report.order_id);
      }
    }

    // 3. ปรับสถานะสำหรับรายงานประเภทออเดอร์/ขอคืนเงิน
    if (report?.order_id) {
      if (decision === "approved") {
        const { data: statusObj } = await supabase
          .from("status")
          .select("id")
          .eq("state", "ยกเลิกการพิมพ์")
          .maybeSingle();

        if (statusObj) {
          await supabase
            .from("print_order")
            .update({ current_status_id: statusObj.id })
            .eq("id", report.order_id);
        }
      } else if (decision === "rejected" && report.issue_type !== "รายงานรีวิวที่ไม่เหมาะสม") {
        const { data: order } = await supabase
          .from("print_order")
          .select("total_amount, total_price, platform_fee, small_order_fee")
          .eq("id", report.order_id)
          .single();

        const amount = Number(order?.total_amount || order?.total_price || 0);
        const smallFee = Number(order?.small_order_fee || 0);
        const percentFee = Number(order?.platform_fee || 0);

        let totalFee = smallFee + percentFee;
        if (totalFee === 0 && amount > 0) {
          totalFee = Math.round(amount * 0.08 * 100) / 100;
        }

        const shopIncome = Math.max(0, amount - totalFee);

        await supabase
          .from("print_order")
          .update({
            shop_income: shopIncome,
          })
          .eq("id", report.order_id);

        await supabase
          .from("payment")
          .update({
            status: "pending_payout",
            platform_fee: totalFee,
            shop_income: shopIncome,
          })
          .eq("order_id", report.order_id);
      }
    }

    // 4. ส่ง การแจ้งเตือน (Notifications)
    const notificationsToInsert = [];
    const decisionText =
      decision === "approved" || decision === "hide_review"
        ? "อนุมัติคำร้องเรียน"
        : "ปฏิเสธคำร้องเรียน";

    if (report?.customer_id) {
      notificationsToInsert.push({
        customer_id: report.customer_id,
        order_id: report.order_id || null,
        title: "ผลการพิจารณารายงานปัญหา",
        message: `รายงานปัญหาของคุณได้รับการพิจารณาแล้ว: ${decisionText} - ${admin_note}`,
        type: "report_result",
        is_read: false,
      });
    }

    if (report?.shop_id) {
      notificationsToInsert.push({
        shop_id: report.shop_id,
        order_id: report.order_id || null,
        title: "ผลการพิจารณารายงานปัญหา",
        message: `รายงานปัญหาได้รับการพิจารณาแล้ว: ${decisionText}`,
        type: "report_result",
        is_read: false,
      });
    }

    if (notificationsToInsert.length > 0) {
      await supabase.from("notifications").insert(notificationsToInsert);
    }

    return res
      .status(200)
      .json({ message: "Report resolved successfully", data: updatedReport });
  } catch (err: any) {
    console.error("ResolveReport Exception:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};