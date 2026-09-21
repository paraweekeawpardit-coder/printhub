const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

// Import Supabase client จาก config
const supabase = require('../config/supabase');

// 1. Route ดึงร้านค้าทั้งหมด
router.get('/shops', customerController.getShops);

// 2. Route ดึงบริการของร้านตาม shopId
router.get('/shops/:shopId/services', customerController.getShopServices);

router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // ดึงข้อมูลจาก Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*), extra_services(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ success: false, message: 'ไม่พบออเดอร์' });
    }

    return res.json({
      success: true,
      data: order
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;