import express from 'express';
import chatController from '../controller/chatController.js';

const router = express.Router();

router.get('/:print_order_id', chatController.getChatHistory);

export default router;