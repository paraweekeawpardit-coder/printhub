import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ชนิดของ req.user ประกาศไว้ที่ types/express.d.ts
export interface AuthPayload {
  id: string;
  role?: "customer" | "shop";
  shop_name?: string;
  name?: string;
}

// ตรวจ JWT จาก header: Authorization: Bearer <token>
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({ error: "Server Error" });
  }

  try {
    req.user = jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as AuthPayload;
    next();
  } catch {
    return res.status(401).json({ error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" });
  }
};

// ต้องเป็นบัญชีร้านค้าเท่านั้น
export const requireShop = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "shop") {
    return res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึง" });
  }
  next();
};