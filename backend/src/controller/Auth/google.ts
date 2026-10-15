import { Request, Response } from "express";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supabase from "../../config/supabase.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// escape ตัวอักษรพิเศษของ LIKE (เช่น _ ที่พบบ่อยในอีเมล) เพื่อให้ ilike เทียบแบบตรงตัว ไม่สนตัวพิมพ์เล็ก/ใหญ่
const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export const GoogleLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { credential } = req.body;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const secretKey = process.env.JWT_SECRET;

    if (!clientId || !secretKey) {
      throw new Error("GOOGLE_CLIENT_ID or JWT_SECRET is not defined");
    }

    if (typeof credential !== "string" || !credential) {
      return res.status(400).json({ error: "ไม่พบข้อมูลยืนยันตัวตนจาก Google" });
    }

    // 1. ตรวจสอบ token กับ Google
    let payload: TokenPayload | undefined;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (e) {
      console.error("Google verify error:", e);
      return res.status(401).json({ error: "ไม่สามารถยืนยันตัวตนกับ Google ได้" });
    }

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ error: "อีเมล Google นี้ยังไม่ได้รับการยืนยัน" });
    }

    const email = payload.email.trim().toLowerCase();
    const emailPattern = escapeLike(email);

    // 2. ถ้าอีเมลตรงกับร้านค้า -> ห้ามใช้ Google login
    const { data: shop, error: shopError } = await supabase
      .from("print_shop")
      .select("id")
      .ilike("email", emailPattern)
      .limit(1)
      .maybeSingle();

    if (shopError) {
      console.error("Google login - find shop error:", shopError);
      return res.status(500).json({ error: "Server Error" });
    }

    if (shop) {
      return res.status(403).json({
        error:
          "อีเมลนี้เป็นบัญชีร้านค้า ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน",
      });
    }

    // 3. หาในตาราง customer
    const { data: found, error: findError } = await supabase
      .from("customer")
      .select("id, first_name")
      .ilike("contact", emailPattern)
      .limit(1)
      .maybeSingle();

    if (findError) {
      console.error("Google login - find customer error:", findError);
      return res.status(500).json({ error: "Server Error" });
    }

    let user = found;

    // 4. ยังไม่มีบัญชี -> สร้างลูกค้าใหม่
    if (!user) {
      const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

      const { data: created, error: insertError } = await supabase
        .from("customer")
        .insert([
          {
            first_name: payload.given_name || payload.name || "",
            last_name: payload.family_name || "",
            contact: email,
            password: randomPassword,
            avatar: payload.picture || null,
          },
        ])
        .select("id, first_name")
        .single();

      if (insertError || !created) {
        console.error("Google login - create customer error:", insertError);
        return res.status(500).json({ error: "ไม่สามารถสร้างบัญชีผู้ใช้ได้" });
      }
      user = created;
    }

    const token = jwt.sign(
      { id: user.id, name: user.first_name, role: "customer" },
      secretKey,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      id: user.id,
      name: user.first_name,
      email,
      role: "customer",
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};