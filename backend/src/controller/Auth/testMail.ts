import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"; // ใช้ตอนทำขั้นตอนรีเซ็ตรหัสผ่านใหม่

// ตั้งค่า Nodemailer สำหรับส่งอีเมล (ใช้ App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ฟังก์ชันขอรีเซ็ตรหัสผ่าน (ตรวจสอบอีเมล + ส่งลิงก์)
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

    if (!email) {
      return res.status(400).json({ error: "กรุณากรอกอีเมล" });
    }

    // 1. ตรวจสอบในตาราง customer (ฟิลด์ contact)[cite: 4]
    const { data: customer, error: customerError } = await supabase
      .from("customer")
      .select("id, contact")
      .eq("contact", email)
      .maybeSingle();

    if (customerError) {
      console.error("Check customer error:", customerError);
      return res.status(500).json({ error: "Server Error" });
    }

    let userId = customer?.id;
    let userType = "customer";

    // 2. ถ้าไม่เจอใน customer ให้ตรวจสอบในตาราง print_shop (ฟิลด์ email)[cite: 3]
    if (!userId) {
      const { data: shop, error: shopError } = await supabase
        .from("print_shop")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (shopError) {
        console.error("Check shop error:", shopError);
        return res.status(500).json({ error: "Server Error" });
      }

      if (shop) {
        userId = shop.id;
        userType = "shop";
      }
    }

    // 3. Security Best Practice: หากไม่พบอีเมลในระบบ ให้ตอบกลับสำเร็จเสมอเพื่อป้องกันการสุ่มอีเมล
    if (!userId) {
      return res.status(200).json({
        message: "หากอีเมลนี้มีในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว",
      });
    }

    // 4. สร้าง Reset Token (สามารถบันทึกลงฐานข้อมูลหรือใช้ JWT ชั่วคราวได้)
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // *หมายเหตุ: หากต้องการความปลอดภัยสูง แนะนำให้บันทึก token และเวลาหมดอายุลงในตารางของ user ด้วย*

    // 5. ส่งอีเมลผ่าน Nodemailer
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&type=${userType}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"PrintHub Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "คำขอรีเซ็ตรหัสผ่านของคุณ (PrintHub)",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>คุณได้ขอรีเซ็ตรหัสผ่าน</h2>
          <p>กรุณาคลิกที่ปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่ (ลิงก์นี้มีอายุการใช้งาน 1 ชั่วโมง):</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #001B3A; color: #fff; text-decoration: none; border-radius: 8px; margin-top: 10px; font-weight: bold;">ตั้งรหัสผ่านใหม่</a>
          <p style="margin-top: 25px; color: #888; font-size: 12px;">หากคุณไม่ได้เป็นผู้ขอรีเซ็ตรหัสผ่าน สามารถละเลยอีเมลฉบับนี้ได้</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "หากอีเมลนี้มีในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};