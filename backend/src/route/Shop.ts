// Shop.ts
import express from "express";
import multer from "multer";

import * as Home from "../controller/Shop/home.js";
import * as Detail from "../controller/Shop/detail.js";
import * as Order from "../controller/Shop/order.js";
import * as Setting from "../controller/Shop/setting.js";

const router = express.Router();

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

// Dashboard
router.get("/getScore", Home.getTotalScore);
router.get("/getIncome", Home.getTodayInCome);
router.get("/numWork", Home.getNumOrderUnAccept);
router.get("/getTopOrder", Home.getTopOrder);
router.get("/getFinancialOverview", Home.getFinancialOverview);
router.get("/getOrderStatusBreakdown", Home.getOrderStatusBreakdown);
router.get("/getComplaintsAndReviews", Home.getComplaintsAndReviews);

// Orders
router.get("/getOrderByStatus", Order.getOrdersByStatus);
router.get("/orders/:id", Detail.getOrder);
router.patch("/orders/:id/status", Detail.updateOrderStatus);
router.patch("/orders/:id/verify-payment", Detail.verifyPayment);

// Shop Profile & Settings (แก้ไขส่วนนี้)
router.get("/profile/:shop_id", Setting.getShopProfile);
router.put("/profile/:shop_id", Setting.updateShopProfile); // 👈 เพิ่ม
router.patch("/profile/:shop_id/open-status", Setting.setShopOpenStatus); // 👈 เพิ่ม
// รูปโปรไฟล์ร้าน: เปลี่ยนได้อย่างเดียว (ไม่มี route สำหรับลบ เพราะร้านต้องมีรูปเสมอ)
router.put("/profile/:shop_id/image", uploadProfileImage, Setting.updateShopProfileImage);

router.get("/bank-account/:shop_id", Setting.getBankAccount);
router.put("/bank-account/:shop_id", Setting.updateBankAccount); // 👈 เพิ่ม

router.get("/services/:shop_id", Setting.getShopServices);
router.post("/services", Setting.saveShopServices);

router.get("/verify-status/:shop_id", Setting.checkShopVerified);

export default router;