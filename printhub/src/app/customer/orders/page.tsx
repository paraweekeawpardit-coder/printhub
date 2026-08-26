'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";

interface OrderItem {
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_date: string;
  receive_date: string;
  total_price: number;
  description: string;
  shop: {
    shop_name: string;
    phone: string;
    profile_image: string | null;
  };
  current_status: string;
  items: OrderItem[];
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // กำหนด customer_id ให้ตรงกับที่สั่งซื้อจริงในฐานข้อมูล Supabase
  const customerId = "50f1946f-79ed-47ad-939d-48d32b6a7547";

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        // ส่ง query param ?customerId=... ไปที่ Backend
        const res = await fetch(`http://localhost:5000/api/customer/orders?customerId=${customerId}`);
        const result = await res.json();

        if (res.ok && result.success) {
          setOrders(result.data || []);
        } else {
          setError(result.message || "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'รอดำเนินการ':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'กำลังพิมพ์':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'พร้อมรับเอกสาร':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'สำเร็จ':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'ยกเลิก':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/customer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
            >
              ← หน้าแรก
            </Link>
            <h1 className="font-bold text-lg text-slate-900">คำสั่งซื้อของฉัน</h1>
          </div>
          <span className="text-xs text-slate-400">เรียงตามเวลาล่าสุด</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>กำลังโหลดประวัติคำสั่งซื้อ...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <span className="text-4xl">📦</span>
            <p className="text-sm font-bold text-slate-700">ยังไม่มีประวัติคำสั่งซื้อ</p>
            <p className="text-xs text-slate-400">คุณยังไม่ได้ส่งไฟล์พิมพ์งานกับร้านค้าใดๆ ในขณะนี้</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden border border-slate-200">
                    {order.shop.profile_image ? (
                      <img src={order.shop.profile_image} alt={order.shop.shop_name} className="w-full h-full object-cover" />
                    ) : (
                      '🖨️'
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{order.shop.shop_name || 'ร้านพิมพ์เอกสาร'}</h3>
                    <p className="text-[11px] text-slate-400">
                      สั่งซื้อเมื่อ: {new Date(order.order_date).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusBadgeStyle(
                    order.current_status
                  )}`}
                >
                  ● {order.current_status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700">รายการพิมพ์:</p>
                <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">
                        • {item.name} <span className="text-slate-400">(x{item.quantity})</span>
                      </span>
                      <span className="font-semibold text-slate-800">฿{Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.description && (
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                      หมายเหตุ: {order.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  🕒 นัดรับ: {order.receive_date ? new Date(order.receive_date).toLocaleString('th-TH') : 'ไม่ระบุ'}
                </span>

                <div className="flex items-center gap-3">
                    {/* ⭐ Rating Button */}
                    {order.current_status === 'พิมพ์เสร็จสิ้น' && (
                      
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/customer/order/review`);
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 text-[10px] font-semibold transition"
                      >
                        ⭐ Rating
                      </button>
                    )}
                  <span className="text-slate-500">ยอดรวมทั้งสิ้น:</span>
                  <span className="text-base font-extrabold text-blue-600">฿{Number(order.total_price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
