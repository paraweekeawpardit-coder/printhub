import express from 'express';
// นำเข้า controller ของคุณ (ปรับ path ตามจริงหากต่างจากนี้)
import { getShops, getShopServices } from '../controller/customerController.js';

const router = express.Router();

// ตัวอย่าง Route สแกนหาร้านค้า
router.get('/shops', getShops);

router.get('/shops/:shopId/services', getShopServices);

export default router;