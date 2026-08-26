'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  type: string;
  starting_price: number;
  details?: Array<{ id: string; detail: string; price: number }>;
}

interface FullShopDetail {
  id: string;
  shop_name: string;
  profile_image: string | null;
  rating: number;
  open_time: string | null;
  close_time: string | null;
  is_open: boolean;
  is_verify?: boolean;
  starting_price: number;
  distance?: number | null;
  address?: {
    latitude?: number;
    longitude?: number;
    detail?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
  };
  service_types?: string[];
  services?: ServiceItem[];
  service_type?: Array<{
    id: string;
    type: string;
    service_detail?: Array<{ price: number }>;
  }>;
}

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = (params?.shop_id || params?.shopId) as string;

  const [shop, setShop] = useState<FullShopDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        let res = await fetch(`http://localhost:5000/api/customer/shops`);
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data)) {
          const found = result.data.find((s: any) => String(s.id) === String(shopId));
          setShop(found || null);
        }
      } catch (err) {
        console.error('Fetch shop detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShopDetail();
    }
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm">กำลังโหลดข้อมูลร้านค้า...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <div className="text-5xl">🏪</div>
        <h2 className="text-xl font-bold text-slate-800">ไม่พบข้อมูลร้านค้านี้ในระบบ</h2>
        <button
          type="button"
          onClick={() => router.push('/customer')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm"
        >
          กลับสู่หน้ารวมร้านค้า
        </button>
      </div>
    );
  }

  // ✅ รวมและจัดเตรียมรายการบริการพร้อมราคาเริ่มต้นเฉพาะตัว
  const preparedServices: Array<{ type: string; price: number }> = [];

  if (shop.services && shop.services.length > 0) {
    shop.services.forEach((s) => {
      preparedServices.push({
        type: s.type,
        price: s.starting_price > 0 ? s.starting_price : shop.starting_price,
      });
    });
  } else if (shop.service_type && shop.service_type.length > 0) {
    shop.service_type.forEach((st) => {
      const prices = (st.service_detail || []).map((sd) => Number(sd.price)).filter((p) => p > 0);
      const minP = prices.length > 0 ? Math.min(...prices) : shop.starting_price;
      preparedServices.push({
        type: st.type,
        price: minP,
      });
    });
  } else if (shop.service_types && shop.service_types.length > 0) {
    shop.service_types.forEach((t) => {
      preparedServices.push({
        type: t,
        price: shop.starting_price,
      });
    });
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans antialiased text-slate-800 pb-28">
      {/* 1. Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <span>←</span>
            <span>ย้อนกลับ</span>
          </button>
          <span className="font-bold text-base text-slate-900 truncate max-w-[220px] sm:max-w-sm">
            {shop.shop_name}
          </span>
          <div className="w-16 flex justify-end">
            <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full border border-blue-200">
              {shop.is_verify ? 'ยืนยันตัวตนแล้ว ✓' : 'ร้านค้าพาร์ทเนอร์'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="max-w-4xl w-full mx-auto px-4 py-6 space-y-6 flex-1">
        {/* รูปภาพหน้าร้าน */}
        <div className="w-full h-60 sm:h-80 bg-slate-100 rounded-3xl overflow-hidden relative shadow-sm border border-slate-200/60">
          {shop.profile_image ? (
            <img src={shop.profile_image} alt={shop.shop_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-500 font-bold text-7xl">
              🖨️
            </div>
          )}

          <span
            className={`absolute top-4 right-4 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-md backdrop-blur-md flex items-center gap-1.5 ${
              shop.is_open ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {shop.is_open ? 'เปิดให้บริการตอนนี้' : 'ปิดทำการชั่วคราว'}
          </span>
        </div>

        {/* ข้อมูลสรุปและคะแนน */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {shop.shop_name}
              </h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                📍 {shop.address && (shop.address.subdistrict || shop.address.district)
                  ? `${shop.address.subdistrict || ''} ${shop.address.district || ''} ${shop.address.province || ''}`
                  : 'ตั้งอยู่บริเวณใกล้เคียงพื้นที่ให้บริการ'}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2 rounded-2xl shrink-0 self-start sm:self-auto">
              <span className="text-amber-500 text-2xl">★</span>
              <div>
                <span className="text-base text-amber-900 font-extrabold">
                  {shop.rating > 0 ? shop.rating.toFixed(1) : '5.0'} / 5.0
                </span>
                <span className="text-[11px] text-amber-700 block font-medium">คะแนนความพึงพอใจ</span>
              </div>
            </div>
          </div>

          {/* เวลาทำการ & ที่อยู่ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">🕒 เวลาทำการ</span>
              <p className="text-slate-800 font-bold text-base">
                {shop.open_time && shop.close_time
                  ? `${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.`
                  : 'เปิดให้บริการทุกวัน'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">📍 ที่อยู่และจุดสังเกต</span>
              <p className="text-slate-700 font-medium leading-relaxed">
                {shop.address?.detail || 'บริเวณใกล้เคียงมหาวิทยาลัย/พื้นที่ให้บริการ'}
              </p>
              {shop.address?.latitude && shop.address?.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${shop.address.latitude},${shop.address.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1 pt-1"
                >
                  เปิด Google Maps ดูแผนที่เดินทาง →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ✅ บริการงานพิมพ์และราคาจริงตรงตาม Supabase */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">บริการงานพิมพ์และราคา</h2>
            <p className="text-xs text-slate-400">รายการประเภทงานที่ร้านรับทำและราคาเริ่มต้นจริง</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {preparedServices.length > 0 ? (
              preparedServices.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 transition shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base shrink-0">
                      ✓
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800 block leading-tight">
                        {service.type}
                      </span>
                      <span className="text-[11px] text-slate-400">รับพิมพ์และผลิตงาน</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block leading-tight">เริ่มต้น</span>
                    <span className="text-sm font-extrabold text-blue-600">
                      ฿{service.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">ให้บริการงานพิมพ์เอกสารทั่วไป (สอบถามราคาหน้าร้าน)</p>
              </div>
            )}
          </div>
        </div>

        {/* เงื่อนไขการรับเอกสาร */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900">เงื่อนไขและการรับเอกสาร</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> รองรับไฟล์ PDF, Word, Excel, PowerPoint และไฟล์รูปภาพทั่วไป
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> สามารถชำระเงินผ่านระบบสแกน QR Code พร้อมเพย์ได้ทันที
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> ตรวจสอบสถานะการพิมพ์ได้แบบ Real-time ผ่านหน้ารายการคำสั่งซื้อ
            </li>
          </ul>
        </div>
      </main>

      {/* 3. Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">ราคาเริ่มต้น</span>
            <p className="text-2xl font-extrabold text-blue-600">฿{shop.starting_price}</p>
          </div>

          <Link
            href={`/customer/order/${shop.id}`}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm px-8 py-3 rounded-2xl transition shadow-md shadow-blue-500/25 text-center flex-1 max-w-sm"
          >
            สั่งปริ้นท์งานกับร้านนี้ →
          </Link>
        </div>
      </div>
    </div>
  );
}