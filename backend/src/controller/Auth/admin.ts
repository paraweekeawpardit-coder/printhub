import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

export const adminLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    // ตรวจสอบข้อมูลเฉพาะในตาราง admin เท่านั้น
    const { data: admin, error } = await supabase
      .from("admin")
      .select("*")
      .or(`email.eq.${username},username.eq.${username}`)
      .eq("password", password) // หากใช้ hashing ให้แก้ตรงนี้เป็น bcrypt.compare
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่าน Admin ไม่ถูกต้อง" });
    }

    return res.status(200).json({
      message: "Admin login successful",
      token: "admin-session-token", // สามารถเปลี่ยนเป็น JWT Token ได้
      admin: { id: admin.id, username: admin.username }
    });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
};