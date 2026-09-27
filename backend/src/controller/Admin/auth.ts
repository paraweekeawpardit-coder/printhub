import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

export const adminLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "กรุณากรอก Username/Email และ Password" });
    }

    // แก้ไขตรงนี้: เปลี่ยนเป็น contact และ name ให้ตรงกับตาราง admin ใน Supabase
    const { data: admin, error } = await supabase
      .from("admin")
      .select("*")
      .or(`contact.eq.${username},name.eq.${username}`)
      .eq("password", password)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่าน Admin ไม่ถูกต้อง" });
    }

    return res.status(200).json({
      message: "เข้าสู่ระบบ Admin สำเร็จ",
      token: "admin-secret-token",
      admin: {
        id: admin.id,
        name: admin.name,
        contact: admin.contact,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Server Error" });
  }
};