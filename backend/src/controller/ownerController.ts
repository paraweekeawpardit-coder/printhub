import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// GET: /api/owner/stats
export const getOwnerStats = async (req: Request, res: Response) => {
  try {
    const timeRange = (req.query.timeRange as string) || 'all';
    const selectedDate = req.query.date as string;   // YYYY-MM-DD
    const selectedMonth = req.query.month as string; // YYYY-MM

    // 1. ดึงข้อมูล print_order ทั้งหมด
    const { data: orders, error: orderErr } = await supabase
      .from('print_order')
      .select('*')
      .order('order_date', { ascending: false });

    if (orderErr) throw orderErr;

    // 2. ดึงข้อมูล payment
    const { data: payments, error: paymentErr } = await supabase
      .from('payment')
      .select('*');

    if (paymentErr) throw paymentErr;

    // 3. ดึงข้อมูลร้านค้า
    const { data: shops, error: shopErr } = await supabase
      .from('print_shop')
      .select('*');

    if (shopErr) throw shopErr;

    // 4. ดึงรายงานปัญหา (Dispute Report)
    const { data: reports } = await supabase
      .from('report')
      .select('order_id, status');

    const paymentMap = new Map((payments || []).map((p: any) => [p.order_id, p]));
    const shopMap = new Map((shops || []).map((s: any) => [s.id, s]));

    const pendingReportOrderIds = new Set(
      (reports || [])
        .filter((r: any) => r.status === 'pending' || r.status === 'investigating')
        .map((r: any) => r.order_id)
    );

    const now = new Date();

    // 5. กรองออเดอร์ตามช่วงเวลา และคัดออเดอร์ที่ยกเลิกออก
    const filteredOrders = (orders || []).filter((o: any) => {
      if (o.cancel_reason) return false;
      if (!o.order_date) return false;

      const oDate = new Date(o.order_date);

      if (timeRange === 'today') {
        const targetDate = selectedDate || now.toISOString().split('T')[0];
        return oDate.toISOString().split('T')[0] === targetDate;
      } else if (timeRange === 'month') {
        const targetMonth = selectedMonth || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const oMonthStr = `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, '0')}`;
        return oMonthStr === targetMonth;
      }
      return true;
    });

    // 6. คำนวณยอดรวมทางการเงินตาม Business Logic จริง
    let totalGrossVolume = 0;
    let totalPlatformIncome = 0;
    let pendingPayout = 0;

    filteredOrders.forEach((o: any) => {
      const subtotal = Number(o.subtotal_price || 0);
      const smallFee = Number(o.small_order_fee || 0);
      const platformFee = Number(o.platform_fee || 0);

      const gross = Number(o.total_amount || (subtotal + smallFee));
      const webIncome = smallFee + platformFee; 
      // ร้านค้าได้ subtotal_price ลบด้วย platform_fee 8% (ถ้ามี)
      const shopNet = subtotal - platformFee;

      if (!pendingReportOrderIds.has(o.id)) {
        totalGrossVolume += gross;
        totalPlatformIncome += webIncome;

        const paymentData = paymentMap.get(o.id);
        if (!paymentData?.payout_slip_url) {
          pendingPayout += shopNet;
        }
      }
    });

    // 7. สรุปรายได้แยกตามร้านค้า
    const shopRevenues = (shops || []).map((s: any) => {
      const shopOrders = filteredOrders.filter(
        (o: any) => o.shop_id === s.id && !pendingReportOrderIds.has(o.id)
      );

      let sales = 0;
      let platformFeeSum = 0;
      let netPayout = 0;

      shopOrders.forEach((o: any) => {
        const subtotal = Number(o.subtotal_price || 0);
        const smallFee = Number(o.small_order_fee || 0);
        const platformFee = Number(o.platform_fee || 0);
        const gross = Number(o.total_amount || (subtotal + smallFee));

        sales += gross;
        platformFeeSum += (smallFee + platformFee);
        netPayout += (subtotal - platformFee); // ยอดรวมที่ร้านค้าจะได้จริงหลังหัก 8%
      });

      return {
        id: s.id,
        shop_name: s.shop_name || 'ไม่ระบุชื่อร้าน',
        owner_name: s.owner_name || '-',
        status: s.status || 'pending',
        orderCount: shopOrders.length,
        totalSales: sales,
        platformFee: platformFeeSum,
        netPayout: netPayout,
      };
    });

    // 8. สรุปออเดอร์ย่อย
    const allOrders = filteredOrders.map((o: any) => {
      const subtotal = Number(o.subtotal_price || 0);
      const smallFee = Number(o.small_order_fee || 0);
      const platformFee = Number(o.platform_fee || 0);

      const gross = Number(o.total_amount || (subtotal + smallFee));
      const webIncome = smallFee + platformFee;
      const isSmallOrder = smallFee > 0;
      const shopNet = subtotal - platformFee; // คำนวณหัก ณ ที่จ่าย 8% ออกจากค่าสินค้าของร้าน

      const shop = shopMap.get(o.shop_id);
      const paymentData = paymentMap.get(o.id);

      let paymentStatus = 'completed';
      if (pendingReportOrderIds.has(o.id)) {
        paymentStatus = 'under_report';
      } else if (!paymentData?.payout_slip_url) {
        paymentStatus = 'pending_payout';
      } else {
        paymentStatus = 'payout_completed';
      }

      return {
        payment_id: paymentData?.id || o.id,
        order_no: String(o.order_no || 'N/A'),
        shop_id: o.shop_id,
        shop_name: shop?.shop_name || 'ไม่ระบุชื่อร้าน',
        payment_date: o.order_date,
        total_amount: gross,         // ยอดรวมที่ลูกค้าชำระเงินจริง
        platform_fee: webIncome,     // ยอดส่วนแบ่งเข้าเว็บ (20 หรือ 8%)
        shop_income: shopNet,        // ยอดโอนให้ร้านค้าจริง (subtotal_price - platform_fee)
        is_small_order: isSmallOrder,
        small_order_fee: smallFee,
        status: paymentStatus,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        finance: {
          totalPlatformIncome,
          totalGrossVolume,
          pendingPayout,
        },
        shopRevenues,
        allOrders,
      },
    });

  } catch (error: any) {
    console.error('Owner Stats API Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลการเงิน',
    });
  }
};

// GET: /api/owner/shops/:shopId/orders
export const getOwnerShopOrders = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    const { data: orders, error } = await supabase
      .from('print_order')
      .select('*')
      .eq('shop_id', shopId)
      .is('cancel_reason', null)
      .order('order_date', { ascending: false });

    if (error) throw error;

    const { data: payments } = await supabase.from('payment').select('*');
    const paymentMap = new Map((payments || []).map((p: any) => [p.order_id, p]));

    const formattedOrders = (orders || []).map((o: any) => {
      const subtotal = Number(o.subtotal_price || 0);
      const smallFee = Number(o.small_order_fee || 0);
      const platformFee = Number(o.platform_fee || 0);

      const gross = Number(o.total_amount || (subtotal + smallFee));
      const webIncome = smallFee + platformFee;
      const shopNet = subtotal - platformFee;
      const paymentData = paymentMap.get(o.id);

      return {
        payment_id: paymentData?.id || o.id,
        order_id: o.id,
        order_no: String(o.order_no || 'N/A'),
        payment_date: o.order_date,
        total_amount: gross,
        platform_fee: webIncome,
        shop_income: shopNet,
        is_small_order: smallFee > 0,
        small_order_fee: smallFee,
        status: paymentData?.payout_slip_url ? 'payout_completed' : 'pending_payout'
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedOrders
    });
  } catch (error: any) {
    console.error('Get Owner Shop Orders Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงรายละเอียดออเดอร์'
    });
  }
};

// POST: /api/owner/login
export const loginOwner = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const SERVER_OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@printhub.com';
    const SERVER_OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'OwnerSecurePassword2026!';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน',
      });
    }

    if (email === SERVER_OWNER_EMAIL && password === SERVER_OWNER_PASSWORD) {
      return res.status(200).json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'อีเมลหรือรหัสผ่านสำหรับเจ้าของระบบไม่ถูกต้อง',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ',
    });
  }
};