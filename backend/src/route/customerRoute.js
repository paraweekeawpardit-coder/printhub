const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

// 1. Route ดึงร้านค้าทั้งหมด
router.get('/shops', customerController.getShops);

// 2. Route ดึงบริการของร้านตาม shopId
router.get('/shops/:shopId/services', customerController.getShopServices);

module.exports = router;