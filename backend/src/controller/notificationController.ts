import { Request, Response } from "express";
import supabase from "../config/supabase.js";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.query;

    // 🟢 1. เช็ก role เพื่อกำหนดคอลัมน์ที่จะ query ให้ถูกต้อง
    let columnCheck = "customer_id";
    if (role === "shop") {
      columnCheck = "shop_id";
    } else if (role === "admin") {
      columnCheck = "admin_id";
    }

    // 🟢 2. สร้าง Query ดึงข้อมูล
    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    // หากเป็น admin และไม่มี userId ส่งมา ให้ดึงแจ้งเตือนทั้งหมดของแอดมิน (not null)
    if (role === "admin" && (!userId || userId === "null" || userId === "undefined")) {
      query = query.not("admin_id", "is", null);
    } else {
      query = query.eq(columnCheck, userId as string);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};