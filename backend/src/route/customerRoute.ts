// import express from "express";
// import {
//   getShops,
//   getShopServices,
//   getAllServiceTypes,
//   getCustomerOrders,
//   createOrder,
// } from "../controller/customerController.js";

// const router = express.Router();

// // 1. Route ดึงข้อมูลร้านค้าและบริการ
// router.get("/shops", getShops);
// router.get("/shops/:shopId/services", getShopServices);
// router.get("/service-types", getAllServiceTypes);

// // 2. Route สร้างคำสั่งซื้อใหม่ (POST)
// router.post("/orders", createOrder);

// // 3. Route ดึงประวัติคำสั่งซื้อของลูกค้าตามเวลาล่าสุด (GET)
// router.get("/orders", getCustomerOrders);

// export default router;


import express from "express";
import {
  getShops,
  getShopServices,
  getAllServiceTypes,
  getCustomerOrders,
  createOrder,
  updateWorkStatus, //นำเข้าฟังก์ชันนี้
  getReviewOrderDetail,
  submitOrderReview,
  submitOrderReport,
} from "../controller/customerController.js";

const router = express.Router();

router.post("/orders", createOrder); // สั่งพิมพ์[cite: 1]
router.get("/orders", getCustomerOrders); // ดึงประวัติคำสั่งซื้อ
router.patch("/orders/:orderId/status", updateWorkStatus); //เพิ่ม Route อัปเดตสถานะงานพิมพ์

router.get("/shops", getShops); // หน้ารายการร้าน[cite: 1]
router.get("/shops/:shopId/services", getShopServices); // หน้ารายละเอียดบริการ[cite: 1]
router.get("/service-types", getAllServiceTypes); // รายการประเภทงานพิมพ์[cite: 1]

router.get("/orders/:orderId/review-detail", getReviewOrderDetail);
router.post("/reviews", submitOrderReview);
router.post("/reports", submitOrderReport);

export default router;