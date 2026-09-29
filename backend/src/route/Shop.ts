
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
 
// Shop Profile
 
router.get("/profile/:shop_id", Setting.getShopProfile);
router.put("/profile/:shop_id", Setting.updateShopProfile);
router.patch("/profile/:shop_id/open-status", Setting.setShopOpenStatus);
 
router.get("/bank-account/:shop_id", Setting.getBankAccount);
router.put("/bank-account/:shop_id", Setting.updateBankAccount);
 
router.get("/services/:shop_id", Setting.getShopServices);
router.post("/services", Setting.saveShopServices);
 
router.get("/verify-status/:shop_id", Setting.checkShopVerified);


// เพิ่ม 2 Endpoint ในส่วน Dashboard
router.get("/getOrderStatusBreakdown", Home.getOrderStatusBreakdown);
router.get("/getComplaintsAndReviews", Home.getComplaintsAndReviews);
export default router;