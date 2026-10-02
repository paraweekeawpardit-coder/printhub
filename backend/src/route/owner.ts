import express from 'express';
import { getOwnerStats, verifyOwnerPin } from '../controller/ownerController.js';

const router = express.Router();

router.get('/stats', getOwnerStats);
router.post('/verify-pin', verifyOwnerPin);

export default router;