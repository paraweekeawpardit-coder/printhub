import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'all';
    const selectedDate = searchParams.get('date'); // รูปแบบ YYYY-MM-DD
    const selectedMonth = searchParams.get('month'); // รูปแบบ YYYY-MM

    // 1. ดึงข้อมูลรายการชำระเงินทั้งหมด
    const { data: payments, error: paymentErr } = await supabase
      .from('payment')
      .select('*');

    if (paymentErr) throw paymentErr;

    // 2. ดึงข้อมูลร้านค้าทั้งหมด
    const { data: shops, error: shopErr } = await supabase
      .from('print_shop')
      .select('*');

    if (shopErr) throw shopErr;

    let filteredPayments = payments || [];
    const now = new Date();

    // 3. กรองข้อมูลตามเงื่อนไขที่เลือก
    if (timeRange === 'today') {
      const targetDate = selectedDate || now.toISOString().split('T')[0];
      filteredPayments = filteredPayments.filter((p: any) => {
        if (!p.payment_date) return false;
        const pDate = new Date(p.payment_date).toISOString().split('T')[0];
        return pDate === targetDate;
      });
    } else if (timeRange === 'month') {
      const targetMonth = selectedMonth || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      filteredPayments = filteredPayments.filter((p: any) => {
        if (!p.payment_date) return false;
        const pDate = new Date(p.payment_date);
        const pMonthStr = `${pDate.getFullYear()}-${String(pDate.getMonth() + 1).padStart(2, '0')}`;
        return pMonthStr === targetMonth;
      });
    }

    // 4. คำนวณสรุปยอดรวม (คิดค่าธรรมเนียม 8%)
    let totalGross = 0;
    let totalPlatformIncome = 0;

    filteredPayments.forEach((p: any) => {
      const amount = Number(p.amount || 0);
      const fee = Number(p.platform_fee) > 0 ? Number(p.platform_fee) : amount * 0.08;

      totalGross += amount;
      totalPlatformIncome += fee;
    });

    const pendingPayout = totalGross - totalPlatformIncome;

    // 5. จัดกลุ่มรายได้แยกตามร้านค้า
    const shopRevenues = (shops || []).map((s: any) => {
      const shopPayments = filteredPayments.filter((p: any) => p.receiver === s.id);

      const sales = shopPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
      const platformFee = shopPayments.reduce((sum: number, p: any) => {
        const amt = Number(p.amount || 0);
        return sum + (Number(p.platform_fee) > 0 ? Number(p.platform_fee) : amt * 0.08);
      }, 0);

      const netPayout = sales - platformFee;

      return {
        id: s.id,
        shop_name: s.shop_name || 'ไม่ระบุชื่อร้าน',
        owner_name: s.owner_name || '-',
        status: s.status || 'pending',
        totalSales: sales,
        platformFee: platformFee,
        netPayout: netPayout,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        finance: {
          totalPlatformIncome,
          totalGrossVolume: totalGross,
          pendingPayout,
        },
        shopRevenues,
      },
    });

  } catch (error: any) {
    console.error('Owner Stats API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}