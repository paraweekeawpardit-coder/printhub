import express from 'express';
import { 
  getChatHistory, 
  getSupportRoomsForAdmin, 
  sendMessage // 👈 1. Import sendMessage เพิ่มเข้ามา
} from '../controller/chatController.js';

const router = express.Router();

// 1. ดึงประวัติแชทตาม roomId (รองรับทั้ง Order ID เช่น ORD-123 และ Support Room ID เช่น support_cust_001)
router.get('/history/:roomId', getChatHistory);

// 2. ดึงรายการห้องแชท Support ทั้งหมดสำหรับฝั่ง Admin Dashboard
router.get('/admin/rooms', getSupportRoomsForAdmin);

// 3. ส่งข้อความแชตผ่าน REST API (Fallback กรณี Socket หลุด) 👈 เพิ่มจุดนี้
router.post('/', sendMessage);

export default router;