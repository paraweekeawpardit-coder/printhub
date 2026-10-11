import express from 'express';
import multer from 'multer';
import { createClient } from "@supabase/supabase-js";
import {
  getShops,
  getAllServiceTypes,
  getShopServices
} from '../controller/shopController.js';

import {
  getCart,
  addToCart,
  clearCart,
  removeCartItem
} from '../controller/cartController.js';

import {
  createOrder,
  getCustomerOrders,
  updateWorkStatus,
  cancelOrder,
  confirmReceivedOrder,
  uploadPaymentSlip,
  cancelOrderTimeout,
  rejectPaymentSlip,
  upload as slipUpload
} from '../controller/orderController.js';

import {
  getReviewOrderDetail,
  submitOrderReview,
  submitOrderReport,
  getShopReviews, // 👈 1. นำเข้าฟังก์ชันดึงรีวิวร้านค้า
} from '../controller/reviewController.js';

import {
  getCustomerDashboard,
  createReport,
  checkOrderStatusReported
} from '../controller/customerController.js';

import { getCustomerProfile, updateCustomerProfile } from '../controller/settingController.js';

const router = express.Router();

// ตั้งค่า Multer สำหรับอัปโหลดไฟล์งาน
const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// 1. ค้นหาและสรุปข้อมูลร้านค้า (FR-1)
// ==========================================
router.get('/shops', getShops);
router.get('/service-types', getAllServiceTypes);
router.get('/shops/:shopId/services', getShopServices);

// 💡 2. เพิ่ม Route สำหรับดึงรายการรีวิวทั้งหมดของร้านค้า
router.get('/shops/:shopId/reviews', getShopReviews);

// ==========================================
// 3. ตะกร้าสินค้า (Cart)
// ==========================================
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.delete('/cart', clearCart);
router.delete('/cart/item/:itemId', removeCartItem);

// ==========================================
// 4. คำสั่งซื้อและสถานะ (Order)
// ==========================================
router.post('/order', createOrder);
router.get('/orders', getCustomerOrders);
router.patch('/order/:orderId/status', updateWorkStatus);

// Route สำหรับอัปโหลดสลิปชำระเงิน
router.post('/payment/upload-slip', slipUpload.single('slip'), uploadPaymentSlip);

// เส้นทางสำหรับยกเลิกอัตโนมัติเมื่อหมดเวลาชำระเงิน (10 นาที)
router.put('/order/:orderId/cancel-timeout', cancelOrderTimeout);

// เส้นทางสำหรับร้านค้ากดปฏิเสธสลิป (ให้ลูกค้าแนบใหม่โดยนับเวลาเดิมต่อ)
router.put('/order/:orderId/reject-slip', rejectPaymentSlip);

// ==========================================
// 5. รีวิวและรายงานปัญหา (Review & Report)
// ==========================================
router.get('/order/:orderId/review', getReviewOrderDetail);

router.post('/review', upload.single('image'), submitOrderReview);

router.post('/report', upload.single('image'), submitOrderReport);

// Route สำหรับเช็กสถานะรายงานปัญหา
router.get("/customer/report/check/:orderId", checkOrderStatusReported);

// Route หน้า Dashboard
router.get("/dashboard", getCustomerDashboard);

// Route ปรับสถานะออเดอร์
router.put("/order/:id/cancel", cancelOrder);
router.put("/order/:id/confirm-received", confirmReceivedOrder);

// สร้าง Supabase client ฝั่ง Backend
const supabase = createClient(
  process.env.SUPABASE_URL || "https://bhypxtuezgawvnluktvn.supabase.co",
  process.env.SUPABASE_ANON_KEY || ""
);

router.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `orders/${fileName}`;

    const { data, error } = await supabase.storage
      .from("print_files")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return res.status(500).json({ message: error.message });
    }

    const { data: publicData } = supabase.storage
      .from("print_files")
      .getPublicUrl(filePath);

    return res.json({ url: publicData.publicUrl });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);

export default router;