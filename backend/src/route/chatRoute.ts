import express from 'express';
import { 
  getChatHistory, 
  getSupportRoomsForAdmin, 
  getShopChatRooms, // 👈 1. Import ฟังก์ชันดึงห้องแชตของร้านค้าเข้ามา
  sendMessage 
} from '../controller/chatController.js';

const router = express.Router();

// 1. ดึงประวัติแชทตาม roomId (รองรับทั้ง Order ID เช่น ORD-123 และ Support Room ID เช่น support_cust_001)
router.get('/history/:roomId', getChatHistory);

// 2. ดึงรายการห้องแชท Support ทั้งหมดสำหรับฝั่ง Admin Dashboard
router.get('/admin/rooms', getSupportRoomsForAdmin);

// 3. 🟢 [เพิ่มใหม่] ดึงรายการห้องแชททั้งหมดเฉพาะของร้านค้า (กรองด้วย shopId)
router.get('/shop/rooms/:shopId', getShopChatRooms);
router.get('/shop/rooms', getShopChatRooms); // สำรองสำหรับเรียกผ่าน Query param ?shop_id=xxx

// 4. ส่งข้อความแชตผ่าน REST API (Fallback กรณี Socket หลุด)
router.post('/', sendMessage);

export default router;