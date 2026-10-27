import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import crypto from "crypto";
import nodemailer, { Transporter } from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { passwordPolicyError } from "./Validator.js";

// โดเมนจริงของหน้าเว็บ (ใช้เป็นค่า default เมื่อไม่ได้ตั้ง FRONTEND_URL)
const DEFAULT_FRONTEND_URL = "https://printhub.cskmitl.com/";

// สร้าง transporter ตอนเรียกใช้จริง (ไม่ใช่ตอน import ไฟล์)
// เดิมสร้างตอน import: ถ้า dotenv ยังไม่ถูกโหลด ค่า user/pass จะเป็น undefined แล้วส่งเมลไม่ได้
let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  // ใช้ตัวแปรตามไฟล์ .env ของโปรเจกต์ (SMTP_*) และรองรับชื่อเก่า EMAIL_* เป็น fallback
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER)?.trim();
  // Gmail App Password แสดงเป็นกลุ่ม 4 ตัวคั่นด้วยช่องว่าง -> ตัดช่องว่างทิ้ง
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS)?.replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("SMTP_USER / SMTP_PASS is not defined in environment variables");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  return cachedTransporter;
}

// อ่าน URL ของหน้าเว็บ
// - ถ้าตั้ง FRONTEND_URL ไว้ -> ใช้ค่านั้น
// - ถ้าไม่ตั้งและรันแบบ development -> localhost:3000
// - นอกนั้น (cloud/production) -> https://printhub.cskmitl.com
// จะได้ไม่มีทางส่งลิงก์ localhost ออกไปจาก server จริงอีก
function getFrontendUrl(): string {
  const fromEnv = process.env.FRONTEND_URL?.trim();

  let url: string;
  if (fromEnv) {
    url = fromEnv;
  } else if (process.env.NODE_ENV === "development") {
    url = "http://localhost:3000";
  } else {
    url = DEFAULT_FRONTEND_URL;
  }

  // กันลืมใส่ https:// และตัด / ท้ายออก
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

// escape ตัวอักษรพิเศษของ LIKE (% _ \) เพื่อใช้ ilike เทียบอีเมลแบบไม่สนตัวพิมพ์เล็ก/ใหญ่
const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

const maskEmail = (email: string) => {
  const [name = "", domain = ""] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
};

// ==========================================
// Reset token (JWT แบบ stateless ไม่ต้องเพิ่มคอลัมน์ในฐานข้อมูล)
// - หมดอายุใน 1 ชั่วโมง
// - ผูกกับลายนิ้วมือของรหัสผ่านเดิม -> พอเปลี่ยนรหัสแล้ว ลิงก์เดิมใช้ซ้ำไม่ได้
// ==========================================
type ResetUserType = "customer" | "shop";

const RESET_PURPOSE = "pwd-reset";

function getResetSecret(): string {
  if (process.env.RESET_PASSWORD_SECRET) return process.env.RESET_PASSWORD_SECRET;
  const base = process.env.JWT_SECRET;
  if (!base) throw new Error("JWT_SECRET is not defined");
  // ต่อท้ายให้ต่างจาก secret ของ token ล็อกอิน เพื่อไม่ให้ token รีเซ็ตถูกเอาไปใช้เป็น token ล็อกอินได้
  return `${base}:${RESET_PURPOSE}`;
}

const passwordFingerprint = (hash: string | null | undefined) =>
  crypto.createHash("sha256").update(hash || "").digest("hex").slice(0, 24);

function createResetToken(userId: string, type: ResetUserType, passwordHash: string | null | undefined) {
  return jwt.sign(
    { purpose: RESET_PURPOSE, uid: userId, type, pv: passwordFingerprint(passwordHash) },
    getResetSecret(),
    { expiresIn: "1h" }
  );
}

type ResolvedReset =
  | { ok: true; table: "customer" | "print_shop"; userId: string; passwordHash: string }
  | { ok: false; error: string };

async function resolveResetToken(token: unknown): Promise<ResolvedReset> {
  if (typeof token !== "string" || !token) {
    return { ok: false, error: "ลิงก์ไม่ถูกต้อง กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่" };
  }

  let payload: any;
  try {
    payload = jwt.verify(token, getResetSecret());
  } catch (err) {
    // log สาเหตุจริง: invalid signature = secret ไม่ตรงกัน, jwt malformed = token เพี้ยน/ถูกตัด
    console.warn("[resolveResetToken] verify failed:", (err as Error).name, "-", (err as Error).message);
    if (err instanceof jwt.TokenExpiredError) {
      return { ok: false, error: "ลิงก์หมดอายุแล้ว กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่" };
    }
    return { ok: false, error: "ลิงก์ไม่ถูกต้อง กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่" };
  }

  if (!payload || payload.purpose !== RESET_PURPOSE || !payload.uid || !payload.type) {
    return { ok: false, error: "ลิงก์ไม่ถูกต้อง กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่" };
  }

  const table = payload.type === "shop" ? "print_shop" : "customer";

  const { data: user, error } = await supabase
    .from(table)
    .select("id, password")
    .eq("id", payload.uid)
    .maybeSingle();

  if (error) {
    console.error("Resolve reset token error:", error);
    throw error;
  }

  if (!user) {
    return { ok: false, error: "ไม่พบบัญชีผู้ใช้" };
  }

  if (passwordFingerprint(user.password) !== payload.pv) {
    return { ok: false, error: "ลิงก์นี้ถูกใช้ไปแล้ว กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่" };
  }

  return { ok: true, table, userId: user.id, passwordHash: user.password || "" };
}

// ฟังก์ชันขอรีเซ็ตรหัสผ่าน (ตรวจสอบอีเมล + ส่งลิงก์)
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";

    if (!email) {
      return res.status(400).json({ error: "กรุณากรอกอีเมล" });
    }

    // 1. ตรวจสอบในตาราง customer (ฟิลด์ contact) - ไม่สนตัวพิมพ์เล็ก/ใหญ่
    const { data: customer, error: customerError } = await supabase
      .from("customer")
      .select("id, contact, password")
      .ilike("contact", escapeLike(email))
      .limit(1)
      .maybeSingle();

    if (customerError) {
      console.error("Check customer error:", customerError);
      return res.status(500).json({ error: "Server Error" });
    }

    let userId = customer?.id;
    let userType: ResetUserType = "customer";
    let passwordHash: string = customer?.password ?? "";
    let targetEmail = customer?.contact || email;

    // 2. ถ้าไม่เจอใน customer ให้ตรวจสอบในตาราง print_shop (ฟิลด์ email)
    if (!userId) {
      const { data: shop, error: shopError } = await supabase
        .from("print_shop")
        .select("id, email, password")
        .ilike("email", escapeLike(email))
        .limit(1)
        .maybeSingle();

      if (shopError) {
        console.error("Check shop error:", shopError);
        return res.status(500).json({ error: "Server Error" });
      }

      if (shop) {
        userId = shop.id;
        userType = "shop";
        passwordHash = shop.password ?? "";
        targetEmail = shop.email || email;
      }
    }

    // 3. Security Best Practice: หากไม่พบอีเมลในระบบ ให้ตอบกลับสำเร็จเสมอเพื่อป้องกันการสุ่มอีเมล
    //    (แต่ log ฝั่งเซิร์ฟเวอร์ไว้ เพื่อให้รู้ว่าทำไมไม่มีเมลส่งออก)
    if (!userId) {
      console.warn(`[forgotPassword] ไม่พบอีเมล ${maskEmail(email)} ในตาราง customer/print_shop -> ไม่ส่งเมล`);
      return res.status(200).json({
        message: "หากอีเมลนี้มีในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว",
      });
    }

    // 4. สร้าง Reset Token (JWT อายุ 1 ชั่วโมง ผูกกับรหัสผ่านปัจจุบัน)
    const resetToken = createResetToken(userId, userType, passwordHash);

    // 5. ส่งอีเมลผ่าน Nodemailer
    const frontendUrl = getFrontendUrl();
    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `"PrintHub Support" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: "คำขอรีเซ็ตรหัสผ่านของคุณ (PrintHub)",
      text: `คุณได้ขอรีเซ็ตรหัสผ่าน กรุณาเปิดลิงก์นี้เพื่อตั้งรหัสผ่านใหม่ (มีอายุ 1 ชั่วโมง): ${resetUrl}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>คุณได้ขอรีเซ็ตรหัสผ่าน</h2>
          <p>กรุณาคลิกที่ปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่ (ลิงก์นี้มีอายุการใช้งาน 1 ชั่วโมง):</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #001B3A; color: #fff; text-decoration: none; border-radius: 8px; margin-top: 10px; font-weight: bold;">ตั้งรหัสผ่านใหม่</a>
          <p style="margin-top: 25px; color: #888; font-size: 12px;">หากคุณไม่ได้เป็นผู้ขอรีเซ็ตรหัสผ่าน สามารถละเลยอีเมลฉบับนี้ได้</p>
        </div>
      `,
    });

    console.log(
      `[forgotPassword] ส่งเมลถึง ${maskEmail(targetEmail)} (${userType}) messageId=${info.messageId} accepted=${JSON.stringify(info.accepted)} rejected=${JSON.stringify(info.rejected)} link=${frontendUrl}/reset-password`
    );

    return res.status(200).json({
      message: "หากอีเมลนี้มีในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ตรวจว่าลิงก์รีเซ็ตยังใช้ได้ไหม (หน้าเว็บเรียกตอนเปิดหน้า เพื่อแจ้งทันทีถ้าลิงก์หมดอายุ)
export const verifyResetToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await resolveResetToken(req.body?.token);
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).json({ valid: true });
  } catch (err) {
    console.error("Verify Reset Token Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ตั้งรหัสผ่านใหม่ด้วยลิงก์จากอีเมล
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, password } = req.body ?? {};

    const policyError = passwordPolicyError(password);
    if (policyError) {
      return res.status(400).json({ error: policyError });
    }

    const result = await resolveResetToken(token);
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    if (result.passwordHash && (await bcrypt.compare(password, result.passwordHash))) {
      return res.status(400).json({ error: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const { error: updateError } = await supabase
      .from(result.table)
      .update({ password: hashed })
      .eq("id", result.userId);

    if (updateError) {
      console.error("Reset password update error:", updateError);
      return res.status(500).json({ error: "ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง" });
    }

    console.log(`[resetPassword] เปลี่ยนรหัสผ่านสำเร็จ (${result.table}) id=${result.userId}`);

    return res.status(200).json({ message: "ตั้งรหัสผ่านใหม่สำเร็จ" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
