import { getShopReviews, reportReview } from "../controller/reviewController.js";
import express from 'express';
import { 
  getOwnerStats, 
  getOwnerShopOrders, 
  loginOwner 
} from '../controller/ownerController.js';

const router = express.Router();

// GET: ดึงข้อมูลภาพรวมการเงินและรายได้แยกตามร้านค้า
router.get('/stats', getOwnerStats);

// GET: ดึงรายการออเดอร์ย่อยของร้านค้าที่เลือก (สำหรับดูที่มาของเงิน commission 8%)
router.get('/shops/:shopId/orders', getOwnerShopOrders);

// POST: เข้าสู่ระบบ Owner ด้วย Email + Password (เปลี่ยนจาก /verify-pin)
router.post('/login', loginOwner);

// เส้นทางสำหรับร้านค้ารายงานรีวิว
router.post('/shop/report-review', reportReview);

export default router;