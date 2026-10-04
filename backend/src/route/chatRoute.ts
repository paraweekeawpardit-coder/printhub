import express from 'express';
import { getChatHistory } from '../controller/chatController.js';

const router = express.Router();

// ต้องใช้ :print_order_id ให้ตรงกับที่ Controller รับค่า req.params
router.get('/history/:print_order_id', getChatHistory);

export default router;