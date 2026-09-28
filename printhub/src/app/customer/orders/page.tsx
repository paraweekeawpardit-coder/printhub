'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavBar from '../../../component/customer/NavBar';

interface OrderItem {
  id?: string;
  category?: string;
  selected_size?: string;
  color_type?: string;
  paper_type?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_no?: number | string;
  order_date: string;
  receive_date: string;
  total_price: number;
  description: string;
  print_shop?: {
    id?: string;
    shop_name: string;
    profile_image: string | null;
  };
  status?: {
    id?: string;
    state: string;
  };
  print_order_item?: OrderItem[];
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. ดึง customer_id จริงจากการเข้าสู่ระบบ
      const customerId =
        typeof window !== 'undefined'
          ? localStorage.getItem('customer_id') || localStorage.getItem('id')
          : null;

      // ป้องกันกรณีไม่ได้ล็อกอิน หรือมีค่าเป็นสตริง "undefined"
      if (!customerId || customerId === 'undefined' || customerId === 'null') {
        setLoading(false);
        setError('กรุณาเข้าสู่ระบบก่อนดูรายการคำสั่งซื้อ');
        return;
      }

      setLoading(true);
      setError('');

      try {
        // 2. ส่ง query param เป็น customer_id ให้ตรงกับ Backend Controller
        const res = await fetch(
          `http://localhost:5000/api/customer/orders?customer_id=${customerId}`
        );
        const result = await res.json();

        if (res.ok && result.success) {
          setOrders(result.data || []);
        } else {
          setError(result.message || 'ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusBadgeStyle = (state: string) => {
    switch (state) {
      case 'รอการดำเนินงาน':
      case 'รอดำเนินการ':
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'กำลังพิมพ์':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'พิมพ์เสร็จสิ้น':
      case 'พร้อมรับเอกสาร':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ยกเลิก':
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      {/* Navbar สดใสใช้ร่วมกันทุกหน้า */}
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* แถบส่วนหัวของหน้าคำสั่งซื้อ */}
        <div className="flex items-center justify-between pb-2">
          <h1 className="font-bold text-xl text-slate-900">คำสั่งซื้อของฉัน</h1>
          <span className="text-xs text-slate-400 font-medium">เรียงตามเวลาล่าสุด</span>
        </div>

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
            <p className="text-xs text-slate-400">
              คุณยังไม่ได้ส่งไฟล์พิมพ์งานกับร้านค้าใดๆ ในขณะนี้
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const currentStatus = order.status?.state || 'รอการดำเนินงาน';
            const items = order.print_order_item || [];

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden border border-slate-200">
                      {order.print_shop?.profile_image ? (
                        <img
                          src={order.print_shop.profile_image}
                          alt={order.print_shop.shop_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '🖨️'
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {order.print_shop?.shop_name || 'ร้านพิมพ์เอกสาร'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        สั่งซื้อเมื่อ:{' '}
                        {order.order_date
                          ? new Date(order.order_date).toLocaleString('th-TH')
                          : '-'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusBadgeStyle(
                      currentStatus
                    )}`}
                  >
                    ● {currentStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700">รายการพิมพ์:</p>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                    {items.length === 0 ? (
                      <p className="text-xs text-slate-400">ไม่มีรายละเอียดสินค้า</p>
                    ) : (
                      items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-slate-600">
                            • {item.category || 'งานพิมพ์'}{' '}
                            {item.selected_size ? `(${item.selected_size})` : ''}{' '}
                            <span className="text-slate-400">(x{item.quantity})</span>
                          </span>
                          <span className="font-semibold text-slate-800">
                            ฿{Number(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      ))
                    )}
                    {order.description && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                        หมายเหตุ: {order.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    🕒 นัดรับ:{' '}
                    {order.receive_date
                      ? new Date(order.receive_date).toLocaleDateString('th-TH')
                      : 'ไม่ระบุ'}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* ปุ่มรีวิว แสดงเมื่อพิมพ์เสร็จสิ้น */}
                    {(currentStatus === 'พิมพ์เสร็จสิ้น' || currentStatus === 'Completed') && (
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/customer/orders/${order.id}/review`);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold transition cursor-pointer"
                      >
                        ⭐ ให้คะแนนร้านค้า
                      </button>
                    )}

                    <span className="text-slate-500">ยอดรวมทั้งสิ้น:</span>
                    <span className="text-base font-extrabold text-blue-600">
                      ฿{Number(order.total_price).toFixed(2)}
                    </span>

                    {/* ปุ่มแชตแสดงเมื่อร้านรับงานหรือพิมพ์เสร็จ */}
                    {(currentStatus === 'กำลังพิมพ์' ||
                      currentStatus === 'In Progress' ||
                      currentStatus === 'พิมพ์เสร็จสิ้น' ||
                      currentStatus === 'Completed') && (
                      <Link
                        href={`/customer/order/${order.id}/chat`}
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-xl transition"
                      >
                        แชตกับร้านค้า
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}