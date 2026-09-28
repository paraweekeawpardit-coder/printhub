import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const cleanContact = username.trim();
    const cleanPassword = password.trim();

    // 🌟 ค้นหาจากคอลัมน์ `contact` ตามโครงสร้างใน Supabase
    const { data: admin, error } = await supabase
      .from("admin")
      .select("*")
      .eq("contact", cleanContact)
      .maybeSingle();

    if (error || !admin) {
      return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่าน Admin ไม่ถูกต้อง" });
    }

    // 🌟 เช็ครหัสผ่านโดยตรงกับคอลัมน์ `password`
    if (admin.password !== cleanPassword) {
      return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่าน Admin ไม่ถูกต้อง" });
    }

    // สร้าง JWT Token
    const secretKey = process.env.JWT_SECRET || "default_secret_key";
    const token = jwt.sign(
      { id: admin.id, contact: admin.contact, name: admin.name, role: "admin" },
      secretKey,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        contact: admin.contact,
      },
    });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
};