// Shop.ts
import express from "express";
import multer from "multer";

import * as Home from "../controller/Shop/home.js";
import * as Detail from "../controller/Shop/detail.js";
import * as Order from "../controller/Shop/order.js";
import * as Setting from "../controller/Shop/setting.js";

import { authenticate, requireShop } from "../middleware/Auth.js";
import {
  requireActiveShop,
  requireOwnShop,
  getShopStatus,
} from "../middleware/Shopguard.js";

const router = express.Router();

// ผ่าน login + เป็นร้าน + เป็นร้านตัวเอง + ไม่โดนแบน
const shopOnly = [authenticate, requireShop, requireActiveShop];

// ผ่าน login + เป็นร้าน + เป็นร้านตัวเอง แต่ไม่เช็กแบน (ให้ร้านที่โดนแบนเรียกได้)
const shopAny = [authenticate, requireShop, requireOwnShop];

// อัปโหลดรูปโปรไฟล์ร้าน: เก็บใน memory ก่อนส่งขึ้น Supabase Storage (ไม่เกิน 5 MB เฉพาะไฟล์รูป)
const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP"));
    }
  },
}).single("image");

const uploadProfileImage = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  profileImageUpload(req, res, (err: any) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "ไฟล์ต้องมีขนาดไม่เกิน 5 MB"
          : err.message || "อัปโหลดไฟล์ไม่สำเร็จ";
      return res.status(400).json({ error: message });
    }
    next();
  });
};

// ===== เปิดไว้ให้ร้านที่โดนแบนเรียกได้ =====
router.get("/status", authenticate, requireShop, getShopStatus);
router.get("/verify-status/:shop_id", ...shopAny, Setting.checkShopVerified);

// ===== Dashboard =====
router.get("/getScore", ...shopOnly, Home.getTotalScore);
router.get("/getIncome", ...shopOnly, Home.getTodayInCome);
router.get("/numWork", ...shopOnly, Home.getNumOrderUnAccept);
router.get("/getTopOrder", ...shopOnly, Home.getTopOrder);
router.get("/getFinancialOverview", ...shopOnly, Home.getFinancialOverview);
router.get("/getOrderStatusBreakdown", ...shopOnly, Home.getOrderStatusBreakdown);
router.get("/getComplaintsAndReviews", ...shopOnly, Home.getComplaintsAndReviews);

// ===== Orders =====
router.get("/getOrderByStatus", ...shopOnly, Order.getOrdersByStatus);
router.get("/orders/:id", ...shopOnly, Detail.getOrder);
router.patch("/orders/:id/status", ...shopOnly, Detail.updateOrderStatus);
router.patch("/orders/:id/verify-payment", ...shopOnly, Detail.verifyPayment);

// ===== Shop Profile & Settings =====
router.get("/profile/:shop_id", ...shopOnly, Setting.getShopProfile);
router.put("/profile/:shop_id", ...shopOnly, Setting.updateShopProfile);
router.patch("/profile/:shop_id/open-status", ...shopOnly, Setting.setShopOpenStatus);
// รูปโปรไฟล์ร้าน: เปลี่ยนได้อย่างเดียว (ไม่มี route สำหรับลบ เพราะร้านต้องมีรูปเสมอ)
router.put("/profile/:shop_id/image", ...shopOnly, uploadProfileImage, Setting.updateShopProfileImage);

router.get("/bank-account/:shop_id", ...shopOnly, Setting.getBankAccount);
router.put("/bank-account/:shop_id", ...shopOnly, Setting.updateBankAccount);

router.get("/services/:shop_id", ...shopOnly, Setting.getShopServices);
router.post("/services", ...shopOnly, Setting.saveShopServices); // shop_id อยู่ใน body

export default router;