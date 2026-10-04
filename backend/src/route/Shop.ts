import express from "express";

import * as Home from "../controller/Shop/home.js";
import * as Detail from "../controller/Shop/detail.js";
import * as Order from "../controller/Shop/order.js";
import * as Setting from "../controller/Shop/setting.js";

const router = express.Router();

// ==================== Dashboard ====================
router.get("/getScore", Home.getTotalScore);
router.get("/getIncome", Home.getTodayInCome);
router.get("/numWork", Home.getNumOrderUnAccept);
router.get("/getTopOrder", Home.getTopOrder);
router.get("/getFinancialOverview", Home.getFinancialOverview);
router.get("/getOrderStatusBreakdown", Home.getOrderStatusBreakdown);
router.get("/getComplaintsAndReviews", Home.getComplaintsAndReviews);

// ==================== Orders ====================
router.get("/getOrderByStatus", Order.getOrdersByStatus);

// 🟢 ปรับแก้ Path ให้ตรงกับ Frontend (/orders/...)
router.get("/orders/:orderId", Order.getOrderById);

// 🟢 อัปเดตสถานะออเดอร์
router.patch("/orders/:orderId/status", Order.updateOrderStatus);

// 🟢 ตรวจสอบสลิปและการชำระเงิน (รองรับทั้งสองแบบ)
router.patch("/orders/:id/paymentstatus", Detail.verifyPayment);
router.patch("/orders/:id/verify-payment", Detail.verifyPayment);

// ==================== Shop Profile & Settings ====================
router.get("/profile/:shop_id", Setting.getProfile);
router.put("/profile/:shop_id", Setting.updateProfile);
router.patch("/open-status/:shop_id", Setting.updateOpenStatus);

// ดึงข้อมูลบัญชีธนาคาร และ บันทึก/อัปเดตข้อมูลบัญชีธนาคาร
router.get("/bank-account/:shop_id", Setting.getBankAccount);
router.put("/bank-account/:shop_id", Setting.updateBankAccount);

// ตรวจสอบสถานะการยืนยันตัวตน
router.get("/verify-status/:shop_id", Setting.getVerifyStatus);

// บริการของร้านค้า
router.get("/services/:shop_id", Setting.getShopServices);
router.post("/services", Setting.saveShopServices);

export default router;