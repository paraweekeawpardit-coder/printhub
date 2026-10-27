import { Request, Response } from "express";
import supabase from "../config/supabase.js";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.query;

    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    // 🟢 กรณีเป็น admin: ดึงแจ้งเตือนของตัวเอง + แจ้งเตือนกลางทั้งหมด (admin_id เป็น null หรือประเภท report/appeal)
    if (role === "admin") {
      if (userId && userId !== "null" && userId !== "undefined") {
        query = query.or(
          `admin_id.eq.${userId},admin_id.is.null,type.eq.report,type.eq.report_issue,type.eq.shop_appeal`
        );
      } else {
        query = query.or(
          `admin_id.not.is.null,admin_id.is.null,type.eq.report,type.eq.report_issue,type.eq.shop_appeal`
        );
      }
    } else if (role === "shop") {
      // 🟢 ฝั่งร้านค้า: ดึงเฉพาะ notification ที่มี shop_id ตรงกับ userId
      // และประเภทไม่ใช่แจ้งเตือนแอดมิน (report_issue)
      query = query
        .eq("shop_id", userId as string)
        .neq("type", "report_issue");
    } else {
      query = query.eq("customer_id", userId as string);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};