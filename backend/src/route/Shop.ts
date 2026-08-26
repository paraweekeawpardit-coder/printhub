import express from "express";

import * as Home from "../controller/Shop/home.js";
import * as Detail from "../controller/Shop/detail.js";
import * as Order from "../controller/Shop/order.js";
import * as Setting from "../controller/Shop/setting.js";

const router = express.Router();

// ==========================================
// Dashboard
// ==========================================

router.get("/getScore", Home.getTotalScore);
router.get("/getIncome", Home.getTodayInCome);
router.get("/numWork", Home.getNumOrderUnAccept);
router.get("/getTopOrder", Home.getTopOrder);

// ==========================================
// Orders
// ==========================================

router.get("/getOrderByStatus", Order.getOrdersByStatus);
router.get("/orders/:id", Detail.getOrder);
router.patch("/orders/:id/status", Detail.updateOrderStatus);

// ==========================================
// Shop Profile
// ==========================================

router.get("/profile/:shop_id", Setting.getShopProfile);
router.get("/bank-account/:shop_id", Setting.getBankAccount);
router.get("/services/:shop_id", Setting.getShopServices);
router.get("/verify-status/:shop_id", Setting.checkShopVerified);
router.post("/services", Setting.saveShopServices);

export default router;