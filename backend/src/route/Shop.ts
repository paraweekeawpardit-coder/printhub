import express from "express";

import * as Home from "../controller/Shop/home.js";
import * as Detail from "../controller/Shop/detail.js";
import * as Order from "../controller/Shop/order.js";
import * as Setting from "../controller/Shop/setting.js";

const router = express.Router();

// Dashboard
router.get("/getScore", Home.getTotalScore);
router.get("/getIncome", Home.getTodayInCome);
router.get("/numWork", Home.getNumOrderUnAccept);
router.get("/getTopOrder", Home.getTopOrder);

// Orders
router.get("/getOrderByStatus", Order.getOrdersByStatus);
router.get("/orders/:id", Detail.getOrder);
router.patch("/orders/:id/status", Detail.updateOrderStatus);

// Shop Profile & Setting
router.get("/profile/:shop_id", Setting.getShopProfile);
router.put("/profile/:shop_id", Setting.updateShopProfile); // 👈 เพิ่มบรรทัดนี้ (แก้ 404 บันทึกโปรไฟล์)

router.get("/bank-account/:shop_id", Setting.getBankAccount);
router.put("/bank-account/:shop_id", Setting.updateBankAccount); // 👈 เพิ่มบรรทัดนี้ (แก้บันทึกบัญชีธนาคาร)

router.get("/services/:shop_id", Setting.getShopServices);
router.post("/services", Setting.saveShopServices);

router.get("/verify-status/:shop_id", Setting.checkShopVerified);
router.patch("/open-status/:shop_id", Setting.setShopOpenStatus); // 👈 เพิ่มบรรทัดนี้ (แก้เปิด-ปิดร้าน)

export default router;