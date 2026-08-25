import express from 'express';
// นำเข้า controller ของคุณ (ปรับ path ตามจริงหากต่างจากนี้)
import { getShops } from '../controller/customerController.js';

const router = express.Router();

// ตัวอย่าง Route สแกนหาร้านค้า
router.get('/shops', getShops);

export default router;