'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Star, 
  MessageSquare, 
  ChevronDown, 
  Clock, 
  Printer, 
  Package, 
  AlertTriangle,
  X,
  Check,
  CreditCard
} from 'lucide-react';
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
  appointment_time?: string;
  total_price: number;
  total_amount?: number;
  description: string;
  shop_id?: string;
  print_shop?: {
    id?: string;
    shop_name: string;
    profile_image: string | null;
  };
  status?: {
    id?: string;
    state: string;
  } | string;
  print_order_item?: OrderItem[];
  order_items?: OrderItem[];
  items?: OrderItem[];
}

// รายการสถานะตามค่า state ในฐานข้อมูล
const FILTER_TABS = [
  'ทั้งหมด',
  'รอการชำระเงิน',
  'รอการดำเนินงาน',
  'กำลังพิมพ์',
  'พิมพ์เสร็จสิ้น',
  'รายการเสร็จสิ้น',
  'ยกเลิกการพิมพ์',
];

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // State สำหรับแท็บสถานะที่เลือก (ค่าเริ่มต้นคือ 'ทั้งหมด')
  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด');

  // State สำหรับจัดการเปิด/ปิด Dropdown ของแต่ละ Order
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // State สำหรับ Modal ร้องเรียน / ขอคืนเงิน
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState<Order | null>(null);
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportImageUrl, setReportImageUrl] = useState<string>('');
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const router = useRouter();

  const toggleDropdown = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    const customerId =
      typeof window !== 'undefined'
        ? localStorage.getItem('customer_id') || localStorage.getItem('id')
        : null;

    if (!customerId || customerId === 'undefined' || customerId === 'null') {
      setLoading(false);
      setError('กรุณาเข้าสู่ระบบก่อนดูรายการคำสั่งซื้อ');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
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

    const fetchCartCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/customer/cart?customer_id=${customerId}`
        );
        const json = await res.json();
        if (json.success && json.data) {
          const rawItems = Array.isArray(json.data)
            ? json.data
            : json.data.cart_items ||
              json.data.cart_item ||
              json.data.items ||
              [];
          setCartCount(rawItems.length);
        }
      } catch (err) {
        console.error('Fetch cart error:', err);
      }
    };

    fetchOrders();
    fetchCartCount();
  }, [router]);

  // ฟังก์ชันดึงสถานะที่เป็น string ปลอดภัย
  const getOrderState = (order: Order): string => {
    if (typeof order.status === 'string') return order.status;
    return order.status?.state || 'รอการดำเนินงาน';
  };

  // กรองตามแท็บสถานะ + เรียงจากคำสั่งซื้อล่าสุด (เวลาใหม่สุดขึ้นก่อน)
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // 1. เรียงตามเวลาล่าสุด (Descending)
    result.sort((a, b) => {
      const dateA = new Date(a.order_date).getTime() || 0;
      const dateB = new Date(b.order_date).getTime() || 0;
      return dateB - dateA;
    });

    // 2. กรองตามแท็บที่เลือก
    if (selectedStatus !== 'ทั้งหมด') {
      result = result.filter((order) => getOrderState(order) === selectedStatus);
    }

    return result;
  }, [orders, selectedStatus]);

  // 🌟 จุดแก้ที่ 1: เพิ่มสีสำหรับป้าย "รอการชำระเงิน"
  const getStatusBadgeStyle = (state: string) => {
    switch (state) {
      case 'รอการชำระเงิน':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'รอการดำเนินงาน':
      case 'รอดำเนินการ':
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'กำลังพิมพ์':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'พิมพ์เสร็จสิ้น':
      case 'พร้อมรับเอกสาร':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'รายการเสร็จสิ้น':
      case 'Completed':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'ยกเลิกการพิมพ์':
      case 'ยกเลิก':
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // ยื่นเรื่องขอคืนเงิน / ร้องเรียน
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const cid = localStorage.getItem('customer_id') || localStorage.getItem('id');
    if (!reportDescription.trim()) return;

    try {
      setSubmittingReport(true);
      const res = await fetch('http://localhost:5000/api/customer/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: cid,
          shop_id: selectedOrderForReport?.print_shop?.id || selectedOrderForReport?.shop_id,
          order_id: selectedOrderForReport?.id,
          description: reportDescription,
          image_url: reportImageUrl || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('ส่งคำขอคืนเงิน/รายงานปัญหาเรียบร้อยแล้ว');
        setIsReportModalOpen(false);
        setReportDescription('');
        setReportImageUrl('');
      } else {
        showToast(data.error || 'ไม่สามารถส่งคำขอได้');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setSubmittingReport(false);
    }
  };

  // ฟังก์ชันตรวจว่าออเดอร์นี้สั่งมาเกิน 10 นาทีหรือยัง
const isOrderExpired = (orderDateStr: string) => {
  if (!orderDateStr) return false;
  const orderTime = new Date(orderDateStr).getTime();
  const now = Date.now();
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  return now - orderTime > TEN_MINUTES_MS;
};



  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12 relative">
      <NavBar 
        cartCount={cartCount}
        onOpenCart={() => router.push('/customer/cart')}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#0F2942] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* หัวข้อหน้า */}
        <div className="flex items-center justify-between pb-1">
          <h1 className="font-bold text-xl text-slate-900">คำสั่งซื้อของฉัน</h1>
          <span className="text-xs text-slate-400 font-medium">เรียงตามเวลาล่าสุด</span>
        </div>

        {/* Tab Filter กรองสถานะ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedStatus === tab;
            const count = tab === 'ทั้งหมด' 
              ? orders.length 
              : orders.filter((o) => getOrderState(o) === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedStatus(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#12356b] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
            <p>กำลังโหลดประวัติคำสั่งซื้อ...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs">
            {error}
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              {selectedStatus === 'ทั้งหมด' 
                ? 'ยังไม่มีประวัติคำสั่งซื้อ' 
                : `ไม่มีคำสั่งซื้อในสถานะ "${selectedStatus}"`}
            </p>
            <p className="text-xs text-slate-400">
              {selectedStatus === 'ทั้งหมด'
                ? 'คุณยังไม่ได้ส่งไฟล์พิมพ์งานกับร้านค้าใดๆ ในขณะนี้'
                : 'ลองเลือกแท็บสถานะอื่น หรือเลือกดูรายการทั้งหมด'}
            </p>
            {selectedStatus === 'ทั้งหมด' ? (
              <button
                type="button"
                onClick={() => router.push('/customer')}
                className="mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                เลือกดูร้านค้า
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedStatus('ทั้งหมด')}
                className="mt-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"
              >
                ดูทั้งหมด
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedOrders.map((order) => {
            let currentStatus = getOrderState(order);
            
            // 🌟 ถ้าสถานะเป็น "รอการชำระเงิน" แต่เวลาเกิน 10 นาทีแล้ว ให้ตัดเป็น "ยกเลิกการพิมพ์" ทันที
            const expired = isOrderExpired(order.order_date);
            if (currentStatus === 'รอการชำระเงิน' && expired) {
              currentStatus = 'ยกเลิกการพิมพ์';
            }

            const items = order.print_order_item || order.order_items || order.items || [];
            const isExpanded = !!expandedOrders[order.id];

            // ปุ่มจ่ายเงินจะแสดงได้ก็ต่อเมื่อ "รอการชำระเงิน" และ "ยังไม่หมดเวลา (< 10 นาที)" เท่านั้น
            const isPendingPayment = currentStatus === 'รอการชำระเงิน' && !expired;

            const isDone =
              currentStatus === 'พิมพ์เสร็จสิ้น' ||
              currentStatus === 'พร้อมรับเอกสาร' ||
              currentStatus === 'รายการเสร็จสิ้น' ||
              currentStatus === 'Completed';

            const canChat =
              currentStatus === 'กำลังพิมพ์' ||
              currentStatus === 'In Progress' ||
              isDone;

            const orderPrice = order.total_amount || order.total_price || 0;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Header การ์ดร้านค้าและสถานะ */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-200">
                      {order.print_shop?.profile_image ? (
                        <img
                          src={order.print_shop.profile_image}
                          alt={order.print_shop.shop_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Printer className="w-5 h-5 text-slate-400" />
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

                {/* Dropdown ส่วนรายการพิมพ์ */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(order.id)}
                    className="w-full flex items-center justify-between py-1 text-left text-xs font-bold text-slate-700 hover:text-blue-600 transition cursor-pointer"
                  >
                    <span>รายการพิมพ์ ({items.length} รายการ)</span>
                    <div className="flex items-center gap-1 text-[11px] font-normal text-slate-400">
                      <span>{isExpanded ? 'ย่อรายการ' : 'ดูรายละเอียด'}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100 transition-all">
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
                              ฿{Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)}
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
                  )}
                </div>

                {/* Footer เวลานัดรับ ยอดรวม และปุ่ม Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-100 text-xs gap-3">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>นัดรับ:{' '}</span>
                    {order.receive_date
                      ? new Date(order.receive_date).toLocaleDateString('th-TH')
                      : 'ไม่ระบุ'}
                    {order.appointment_time && (
                      <span className="text-slate-400">
                        ({new Date(order.appointment_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.)
                      </span>
                    )}
                  </span>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
                    {/* 🌟 แสดงปุ่มชำระเงินเฉพาะเมื่อ "รอการชำระเงิน" และ "ยังไม่เกิน 10 นาที" เท่านั้น */}
                    {isPendingPayment && (
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/customer/order/payment/${order.id}?totalPrice=${orderPrice}`);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>ชำระเงิน</span>
                      </button>
                    )}

                    {/* ปุ่มขอคืนเงิน (แสดงเมื่อพิมพ์เสร็จสิ้น หรือ รายการเสร็จสิ้น) */}
                    {isDone && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrderForReport(order);
                          setIsReportModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>ขอคืนเงิน</span>
                      </button>
                    )}

                    {/* ปุ่มให้คะแนนร้านค้า (สีครีมขอบเหลืองทอง) */}
                    {isDone && (
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/customer/orders/${order.id}/review`);
                        }}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>ให้คะแนนร้านค้า</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1 px-1">
                      <span className="text-slate-500">ยอดรวมทั้งสิ้น:</span>
                      <span className="text-base font-extrabold text-blue-600">
                        ฿{Number(orderPrice).toFixed(2)}
                      </span>
                    </div>

                    {/* ปุ่มแชตกับร้านค้า */}
                    {canChat && (
                      <Link
                        href={`/customer/order/${order.id}/chat`}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-white" />
                        <span>แชตกับร้านค้า</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Modal ขอคืนเงิน / ร้องเรียนปัญหา */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>แจ้งขอคืนเงิน / ร้องเรียนปัญหา</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  ระบุรายละเอียดปัญหาที่พบ
                </label>
                <textarea
                  required
                  rows={4}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="เช่น งานพิมพ์สีเพี้ยน ปริมาณหน้าไม่ครบถ้วน หรือร้านค้าพิมพ์ผิดสเปก..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  แนบลิงก์รูปภาพหลักฐาน (ถ้ามี)
                </label>
                <input
                  type="url"
                  value={reportImageUrl}
                  onChange={(e) => setReportImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingReport && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>ส่งข้อร้องเรียน</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}