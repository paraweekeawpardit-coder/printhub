import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

/**
 * GET /api/admin/reports
 * ดึงรายการรายงานปัญหาทั้งหมด พร้อม Relation (Orders, Customer, Shop)
 */
export const getAllReports = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: reports, error } = await supabase
      .from("report")
      .select(`
        *,
        orders (
          id,
          total_price,
          state,
          created_at,
          customer_id,
          shop_id,
          customer:customer_id (id, name, email, phone),
          shop:shop_id (id, shop_name, email, phone)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetAllReports Error:", error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(reports ?? []);
  } catch (err: any) {
    console.error("GetAllReports Exception:", err.message || err);
    return res.status(200).json([]);
  }
};

/**
 * PATCH /api/admin/reports/verify
 * สำหรับปรับสถานะการตรวจสอบเบื้องต้น (ยันว่าได้รับเรื่องแล้ว)
 */
export const verifyReport = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { report_id, is_verified } = req.body;

    if (!report_id || typeof is_verified !== "boolean") {
      return res.status(400).json({ error: "report_id and is_verified (boolean) are required" });
    }

    const { data: updatedReport, error } = await supabase
      .from("report")
      .update({ is_verify: is_verified })
      .eq("id", report_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Report verification updated successfully",
      data: updatedReport,
    });
  } catch (err: any) {
    console.error("VerifyReport Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/**
 * PATCH /api/admin/reports/resolve
 * สำหรับ Admin ในการตัดสินเคสรายงานปัญหา (approve_refund / reject_refund / partial_refund)
 */
export const resolveReport = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { report_id, decision, admin_note, refund_amount } = req.body;

    if (!report_id || !decision) {
      return res.status(400).json({ error: "report_id and decision are required" });
    }

    // 1. ดึงข้อมูล Report เพื่อทราบ order_id
    const { data: report, error: reportErr } = await supabase
      .from("report")
      .select("*, orders(*)")
      .eq("id", report_id)
      .single();

    if (reportErr || !report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // 2. อัปเดตสถานะของ Report
    const { data: updatedReport, error: updateErr } = await supabase
      .from("report")
      .update({
        status: decision, // 'approved', 'rejected', 'partial'
        admin_note: admin_note || "",
        refund_amount: refund_amount || 0,
        is_verify: true,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", report_id)
      .select()
      .single();

    if (updateErr) {
      return res.status(400).json({ error: updateErr.message });
    }

    // 3. ปรับสถานะ Order หากมีการอนุมัติคืนเงิน
    if (decision === "approved" || decision === "partial") {
      await supabase
        .from("orders")
        .update({ state: "ยกเลิกการพิมพ์" })
        .eq("id", report.order_id);
    }

    return res.status(200).json({
      message: "Report resolved successfully",
      data: updatedReport,
    });
  } catch (err: any) {
    console.error("ResolveReport Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};