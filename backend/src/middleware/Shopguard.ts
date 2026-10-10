import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase.js";

const pick = (v: unknown): string | undefined =>
  (Array.isArray(v) ? v[0] : v) as string | undefined;

// ค่าใน print_shop.status ที่ถือว่า "ถูกระงับ" — ปรับให้ตรงกับค่าที่แอดมินตั้งจริงในระบบ
const SUSPENDED_STATUSES = ["suspended", "banned"];

const isSuspended = (status?: string | null): boolean =>
  !!status && SUSPENDED_STATUSES.includes(status.toLowerCase());

// เช็กว่า request อ้างถึงร้านของตัวเอง (shop id จาก token) เท่านั้น
// คืน true ถ้าผ่าน, ถ้าไม่ผ่านจะตอบ response เองแล้วคืน false
const verifyOwnership = async (req: Request, res: Response): Promise<boolean> => {
  const myShopId = req.user!.id;

  const claimed = [
    pick(req.params.shop_id),
    pick(req.headers.shop_id),
    pick(req.query.shop_id as unknown),
    pick(req.body?.shop_id),
  ].filter(Boolean) as string[];

  if (claimed.some((id) => id !== myShopId)) {
    res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึงข้อมูลของร้านอื่น" });
    return false;
  }

  // route แบบ /orders/:id ออเดอร์ต้องเป็นของร้านตัวเอง
  const orderId = pick(req.params.id);
  if (orderId) {
    const { data: order } = await supabase
      .from("print_order")
      .select("shop_id")
      .eq("id", orderId)
      .single();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return false;
    }
    if (order.shop_id !== myShopId) {
      res.status(403).json({ error: "ไม่มีสิทธิ์เข้าถึงออเดอร์นี้" });
      return false;
    }
  }

  // controller เดิมอ่าน shop_id จาก header อยู่ ใส่ค่าที่ตรวจแล้วให้เสมอ
  req.headers.shop_id = myShopId;
  return true;
};

// เช็กเจ้าของอย่างเดียว ไม่เช็กแบน (ให้ร้านที่โดนแบนเรียกได้)
export const requireOwnShop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (await verifyOwnership(req, res)) next();
  } catch (err) {
    console.error("Shop ownership error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// เช็กเจ้าของ + ร้านต้องไม่โดนแบน
export const requireActiveShop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await verifyOwnership(req, res))) return;

    // อ่านจาก DB ทุกครั้ง ไม่เชื่อ token เพราะ token เก่าไม่รู้ว่าเพิ่งโดนแบน
    const { data: shop, error } = await supabase
      .from("print_shop")
      .select("status, suspend_reason")
      .eq("id", req.user!.id)
      .single();

    if (error || !shop) return res.status(404).json({ error: "ไม่พบร้านค้า" });

    if (isSuspended(shop.status)) {
      return res.status(403).json({
        code: "SHOP_BANNED",
        error: "บัญชีนี้ถูกระงับการใช้งาน",
        reason: shop.suspend_reason ?? null,
      });
    }

    next();
  } catch (err) {
    console.error("Shop guard error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// ร้านที่โดนแบนต้องเรียกได้ เพื่อให้หน้าเว็บรู้ว่าต้องโชว์ banner
export const getShopStatus = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("print_shop")
    .select("status, suspend_reason")
    .eq("id", req.user!.id)
    .single();

  if (error || !data) return res.status(404).json({ error: "Shop not found" });

  return res.status(200).json({
    isBanned: isSuspended(data.status),
    reason: data.suspend_reason ?? null,
  });
};