import express from 'express';
import { 
  getShops, 
  getAllServiceTypes, 
  getShopServices 
} from '../controller/shopController.js';

import { 
  getCart, 
  addToCart, 
  clearCart 
} from '../controller/cartController.js';

import { 
  createOrder, 
  getCustomerOrders, 
  updateWorkStatus 
} from '../controller/orderController.js';

import { 
  getReviewOrderDetail, 
  submitOrderReview, 
  submitOrderReport 
} from '../controller/reviewController.js';

const router = express.Router();

// ==========================================
// 1. ค้นหาและสรุปข้อมูลร้านค้า (FR-1)
// ==========================================
router.get('/shops', getShops);
router.get('/service-types', getAllServiceTypes);
router.get('/shops/:shopId/services', getShopServices);

// ==========================================
// 2. ตะกร้าสินค้า (Cart)
// ==========================================
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.delete('/cart', clearCart);

// ==========================================
// 3. คำสั่งซื้อและสถานะ (Order)
// ==========================================
router.post('/order', createOrder);
router.get('/orders', getCustomerOrders);
router.patch('/order/:orderId/status', updateWorkStatus);

// ==========================================
// 4. รีวิวและรายงานปัญหา (Review & Report)
// ==========================================
router.get('/order/:orderId/review', getReviewOrderDetail);
router.post('/review', submitOrderReview);
router.post('/report', submitOrderReport);

export default router;