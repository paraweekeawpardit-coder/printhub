import express from 'express';
// นำเข้า controller ของคุณ (ปรับ path ตามจริงหากต่างจากนี้)
import { getShops, getShopServices, getCustomerOrders } from '../controller/customerController.js';



const router = express.Router();

// ตัวอย่าง Route สแกนหาร้านค้า
router.get('/shops', getShops);

router.get('/shops/:shopId/services', getShopServices);

router.get('/customer/:customerId/orders', getCustomerOrders);

export default router;