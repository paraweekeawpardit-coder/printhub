import express from 'express';
import { 
  getShops, 
  getShopServices, 
  getAllServiceTypes, 
  getCart, 
  addToCart, 
  clearCart, 
  createOrder, 
  getCustomerOrders, 
  updateWorkStatus, 
  getReviewOrderDetail, 
  submitOrderReview, 
  submitOrderReport 
} from '../controller/customerController.js'; // ตรวจสอบ path ให้ตรงกับโฟลเดอร์ของคุณ

const router = express.Router();

// 1. ค้นหาและสรุปข้อมูลร้านค้า (FR-1)
router.get('/shops', getShops);
router.get('/service-types', getAllServiceTypes);
router.get('/shops/:shopId/services', getShopServices);

// 2. ตะกร้าสินค้า (Cart)
router.get('/cart', getCart);
router.post('/cart/add', addToCart);
router.delete('/cart/clear', clearCart);

// 3. จัดการออเดอร์ (Order & Checkout)
router.post("/orders", createOrder);
router.post("/order", createOrder);
router.get('/orders', getCustomerOrders);
router.patch('/orders/:orderId/status', updateWorkStatus);

// 4. รีวิวและรายงานปัญหา (Review & Report)
router.get('/orders/:orderId/review', getReviewOrderDetail);
router.post('/order/review', submitOrderReview);
router.post('/order/report', submitOrderReport);

export default router;

