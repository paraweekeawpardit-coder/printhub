'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Package, 
  Check, 
  ShoppingBag,
  Store,
  Calendar,
  Clock,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Ban,
  CheckCircle2,
  Star,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import NavBar from '../../../component/customer/NavBar';

// 🌟 ดึง Component ตัวกรอง และ Modals มาจาก dashboard ตรงๆ ตามที่ต้องการ
import DashboardStatusFilter from '../../../component/customer/dashboard/DashboardStatusFilter';
import ConfirmActionModal from '../../../component/customer/dashboard/ConfirmActionModal';
import ReportIssueModal from '../../../component/customer/dashboard/ReportIssueModal';

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
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState<any>(null);
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportImageUrl, setReportImageUrl] = useState<string>('');
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'received';
    orderId: string;
    orderNo: string;
  }>({ isOpen: false, type: 'cancel', orderId: '', orderNo: '' });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isOrderExpired = (orderDateStr?: string) => {
    if (!orderDateStr) return false;
    const orderTime = new Date(orderDateStr).getTime();
    if (isNaN(orderTime)) return false;
    return Date.now() - orderTime > 10 * 60 * 1000;
  };

  const fetchOrdersData = useCallback(async (customerId: string) => {
    setLoading(true);
    setError('');

    try {
      // ดึงจาก dashboard API เพื่อให้ได้ข้อมูลครบถ้วนเหมือนแดชบอร์ด
      const res = await fetch(`http://localhost:5000/api/customer/dashboard?customer_id=${customerId}`);
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setOrders(json.data.orders || []);
      } else {
        const orderRes = await fetch(`http://localhost:5000/api/customer/orders?customer_id=${customerId}`);
        const orderJson = await orderRes.json();
        if (orderRes.ok && orderJson.success) {
          setOrders(orderJson.data || []);
        } else {
          setError(orderJson.message || 'ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
        }
      }

      // ดึงจำนวนในตะกร้า
      const cartRes = await fetch(`http://localhost:5000/api/customer/cart?customer_id=${customerId}`);
      const cartJson = await cartRes.json();
      if (cartJson.success && cartJson.data) {
        const rawItems = Array.isArray(cartJson.data)
          ? cartJson.data
          : cartJson.data.cart_items || cartJson.data.cart_item || cartJson.data.items || [];
        setCartCount(rawItems.length);
      }
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cid =
      typeof window !== 'undefined'
        ? localStorage.getItem('customer_id') || localStorage.getItem('id')
        : null;

    if (!cid || cid === 'undefined' || cid === 'null') {
      setLoading(false);
      setError('กรุณาเข้าสู่ระบบก่อนดูรายการคำสั่งซื้อ');
      return;
    }

    fetchOrdersData(cid);
  }, [fetchOrdersData]);

  const getOrderState = (order: any): string => {
    if (!order) return 'รอการดำเนินงาน';
    let state =
      order.current_status?.state ||
      order.status?.state ||
      (typeof order.status === 'string' ? order.status : 'รอการดำเนินงาน');

    if (state === 'รอการชำระเงิน' && isOrderExpired(order.order_date)) {
      state = 'ยกเลิกการพิมพ์';
    }
    return state;
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ทั้งหมด: orders.length,
      รอการชำระเงิน: 0,
      รอการดำเนินงาน: 0,
      กำลังพิมพ์: 0,
      พิมพ์เสร็จสิ้น: 0,
      รายการเสร็จสิ้น: 0,
      ยกเลิกการพิมพ์: 0,
    };

    orders.forEach((o) => {
      if (!o) return;
      const state = getOrderState(o);
      if (state === 'รับงานแล้ว' || state === 'รายการเสร็จสิ้น' || state === 'พร้อมรับเอกสาร') {
        counts['รายการเสร็จสิ้น'] = (counts['รายการเสร็จสิ้น'] || 0) + 1;
      } else if (counts[state] !== undefined) {
        counts[state]++;
      }
    });

    return counts;
  }, [orders]);

  // เรียงลำดับจากวันที่สั่งซื้อล่าสุดเสมอ
  const filteredOrders = useMemo(() => {
    const validOrders = orders.filter((o) => Boolean(o && (o.id || o.order_no)));

    validOrders.sort((a, b) => {
      const dateA = new Date(a.order_date).getTime() || 0;
      const dateB = new Date(b.order_date).getTime() || 0;
      return dateB - dateA;
    });

    if (selectedStatus === 'ทั้งหมด') return validOrders;

    return validOrders.filter((order) => {
      const state = getOrderState(order);
      if (selectedStatus === 'รายการเสร็จสิ้น') {
        return state === 'รายการเสร็จสิ้น' || state === 'รับงานแล้ว' || state === 'พร้อมรับเอกสาร';
      }
      return state === selectedStatus;
    });
  }, [orders, selectedStatus]);

  const handleExecuteAction = async () => {
    const cid = localStorage.getItem('customer_id') || localStorage.getItem('id');
    const { type, orderId } = confirmModal;

    try {
      if (type === 'cancel') {
        const res = await fetch(`http://localhost:5000/api/customer/order/${orderId}/cancel`, {
          method: 'PUT',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว');
          if (cid) fetchOrdersData(cid);
        } else {
          showToast(data.message || data.error || 'ไม่สามารถยกเลิกได้');
        }
      } else if (type === 'received') {
        const res = await fetch(`http://localhost:5000/api/customer/order/${orderId}/confirm-received`, {
          method: 'PUT',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('ยืนยันรับงานสำเร็จ คุณสามารถรีวิวร้านค้าได้แล้ว');
          if (cid) fetchOrdersData(cid);
        } else {
          showToast(data.message || data.error || 'เกิดข้อผิดพลาดในการยืนยันรับงาน');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
    } finally {
      setConfirmModal({ isOpen: false, type: 'cancel', orderId: '', orderNo: '' });
    }
  };

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
          shop_id: selectedOrderForReport?.shop?.id || selectedOrderForReport?.print_shop?.id || selectedOrderForReport?.shop_id,
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
        if (cid) fetchOrdersData(cid);
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12 relative text-slate-800">
      <NavBar 
        cartCount={cartCount}
        onOpenCart={() => router.push('/customer/cart')}
      />

      {/* Toast Alert */}
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

        {/* แถบตัวกรองสถานะดึงมาจาก Dashboard */}
        <DashboardStatusFilter
          filters={FILTER_TABS}
          selectedFilter={selectedStatus}
          counts={statusCounts}
          onSelectFilter={setSelectedStatus}
        />

        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400 space-y-2">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
            <p>กำลังโหลดประวัติคำสั่งซื้อ...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3 shadow-2xs">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              {selectedStatus === 'ทั้งหมด' 
                ? 'ยังไม่มีประวัติคำสั่งซื้อ' 
                : `ไม่มีคำสั่งซื้อในสถานะ "${selectedStatus}"`}
            </p>
            <p className="text-xs text-slate-400">
              {selectedStatus === 'ทั้งหมด'
                ? 'คุณยังไม่มีรายการสั่งพิมพ์งานในขณะนี้ สามารถค้นหาร้านค้าเพื่อสั่งพิมพ์ได้ทันที'
                : 'ลองเลือกดูสถานะอื่น หรือเลือกดูรายการทั้งหมด'}
            </p>
            {selectedStatus === 'ทั้งหมด' ? (
              <button
                type="button"
                onClick={() => router.push('/customer')}
                className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ค้นหาร้านพิมพ์งาน</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedStatus('ทั้งหมด')}
                className="mt-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                ดูรายการทั้งหมด
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              let state = getOrderState(order);
              const expired = isOrderExpired(order.order_date);

              const isPendingPayment = state === 'รอการชำระเงิน' && !expired;
              const isPending = state === 'รอการดำเนินงาน';
              const isPrinting = state === 'กำลังพิมพ์';
              const isReady = state === 'พิมพ์เสร็จสิ้น';
              const isReceived = state === 'รับงานแล้ว' || state === 'รายการเสร็จสิ้น';
              const isCanceled = state === 'ยกเลิกการพิมพ์';

              const stateBadgeStyle =
                isPendingPayment
                  ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                  : isReady
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                  : isReceived
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : isCanceled
                  ? 'bg-rose-50 text-rose-600 border-rose-200/80'
                  : isPrinting
                  ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                  : 'bg-slate-50 text-slate-600 border-slate-200';

              // 🌟 วันที่และเวลาสั่งซื้อ (Order Date & Time) ที่เพิ่มเข้ามาเฉพาะในหน้านี้
              const formattedOrderDate = order.order_date
                ? new Date(order.order_date).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-';

              const formattedOrderTime = order.order_date
                ? new Date(order.order_date).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) + ' น.'
                : '';

              // วันเวลานัดรับงาน
              const formattedReceiveDate = order.receive_date
                ? new Date(order.receive_date).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-';

              const formattedReceiveTime = order.appointment_time
                ? new Date(order.appointment_time).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) + ' น.'
                : '';

              const items = order.print_order_item || order.order_items || order.items || [];
              const itemCategorySummary = (() => {
                if (!items || items.length === 0) return 'เอกสาร x1 ชุด';
                const categoryTotals: Record<string, number> = {};
                items.forEach((it: any) => {
                  const cat = it?.category || 'เอกสาร';
                  const qty = Number(it?.quantity) || 1;
                  categoryTotals[cat] = (categoryTotals[cat] || 0) + qty;
                });
                return Object.entries(categoryTotals)
                  .map(([cat, totalQty]) => `${cat} x${totalQty} ชุด`)
                  .join(', ');
              })();

              const orderPrice = Number(order.total_amount || order.total_price || 0);
              const orderNumberStr = `#ORD-${order.order_no || order.id?.slice(0, 6) || '------'}`;
              const shopId = order.shop?.id || order.print_shop?.id || order.shop_id;
              const shopName = order.shop?.shop_name || order.print_shop?.shop_name || 'ร้านค้า';

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
                  
                  {/* แถว 1: Header ร้านค้า + แชท + สถานะ */}
                  <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight shrink-0">
                        {orderNumberStr}
                      </span>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm sm:text-base truncate">
                        <Store className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{shopName}</span>
                      </div>

                      {!isCanceled && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!order?.id || !shopId) {
                              showToast('ไม่พบข้อมูลร้านค้า');
                              return;
                            }
                            router.push(`/customer/order/${shopId}/chat?order_id=${order.id}`);
                          }}
                          className="p-1 sm:px-2.5 sm:py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer border border-indigo-100 shrink-0"
                          title="เปิดแชทกับร้านนี้"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">แชท</span>
                        </button>
                      )}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${stateBadgeStyle}`}>
                      {state}
                    </span>
                  </div>

                  {/* แถว 2: ข้อมูลวันเวลาสั่งซื้อ (เพิ่มใหม่) + วันเวลานัดรับ (Pill) */}
                  <div className="p-4 sm:px-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      
                      {/* 🌟 วันที่และเวลาสั่งซื้อที่เพิ่มเข้ามาในหน้านี้ */}
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>สั่งซื้อเมื่อ:</span>
                        <span className="font-medium text-slate-700">{formattedOrderDate}</span>
                        {formattedOrderTime && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="font-medium text-slate-700">{formattedOrderTime}</span>
                          </>
                        )}
                      </div>

                      <span className="text-slate-200 hidden sm:inline">|</span>

                      {/* วันเวลานัดรับแบบ Pill เหมือนแดชบอร์ด */}
                      <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-200/80 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>นัดรับ: <strong className="text-slate-800 font-semibold">{formattedReceiveDate}</strong></span>
                        </div>

                        {formattedReceiveTime && (
                          <>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="text-slate-800 font-semibold">{formattedReceiveTime}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* แถว 3: ปุ่มรายละเอียด + ประเภทงานพิมพ์ vs ปุ่ม Actions + ยอดสุทธิขวาสุด */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100/80">
                      
                      {/* ฝั่งซ้าย: ปุ่มรายละเอียด และ ประเภทงานพิมพ์ตัวบาง */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer border ${
                            isExpanded
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span>{isExpanded ? 'ซ่อนรายละเอียด' : 'รายละเอียด'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <span className="text-[11px] font-normal text-slate-500">
                          {itemCategorySummary}
                        </span>
                      </div>

                      {/* ฝั่งขวา: ปุ่ม Action ต่างๆ และ ยอดชำระสุทธิขวาสุด */}
                      <div className="flex items-center justify-between md:justify-end gap-3.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isPendingPayment && (
                            <button
                              type="button"
                              onClick={() => router.push(`/customer/order/payment/${order.id}?totalPrice=${orderPrice}`)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-xs cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>ชำระเงิน</span>
                            </button>
                          )}

                          {(isPending || isPendingPayment) && (
                            <button
                              type="button"
                              onClick={() => setConfirmModal({
                                isOpen: true,
                                type: 'cancel',
                                orderId: order.id,
                                orderNo: orderNumberStr,
                              })}
                              className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>ยกเลิก</span>
                            </button>
                          )}

                          {isReady && (
                            <button
                              type="button"
                              onClick={() => setConfirmModal({
                                isOpen: true,
                                type: 'received',
                                orderId: order.id,
                                orderNo: orderNumberStr,
                              })}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>ยืนยันรับของ</span>
                            </button>
                          )}

                          {isReceived && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => router.push(`/customer/review?order_id=${order.id}&shop_id=${shopId}`)}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>รีวิว</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForReport(order);
                                  setIsReportModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>ขอคืนเงิน</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ยอดชำระสุทธิ วางไว้ขวาสุด */}
                        <div className="text-right pl-3.5 border-l border-slate-200/80 shrink-0">
                          <span className="text-[10px] text-slate-400 block font-medium">ยอดชำระสุทธิ</span>
                          <span className="text-base font-extrabold text-blue-600">
                            ฿{orderPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Accordion กางแสดงสเปกและราคา แบบเดียวกับใน Dashboard */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-[#F9FAFB] p-4 text-xs space-y-3">
                      <div className="space-y-2">
                        {items.map((item: any, idx: number) => {
                          const pageCount = Number(item?.page_count) || 1;
                          const unitPrice = Number(item?.unit_price) || 0;
                          const quantity = Number(item?.quantity) || 1;
                          const itemSubtotal = Number(item?.subtotal) || unitPrice * pageCount * quantity;

                          const specs = item?.describe
                            ? item.describe.split('|').map((s: string) => s.trim()).filter(Boolean)
                            : [];

                          return (
                            <div key={item?.id || idx} className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-slate-800 text-xs">
                                  {idx + 1}. {item?.category || 'งานพิมพ์เอกสาร'}
                                </span>
                                <span className="font-bold text-slate-900">
                                  ฿{itemSubtotal.toFixed(2)}
                                </span>
                              </div>

                              {specs.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {specs.map((spec: string, sIdx: number) => (
                                    <span key={sIdx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="text-[11px] text-slate-400 flex justify-between pt-0.5">
                                <span>{pageCount} หน้า × ฿{unitPrice.toFixed(2)}/หน้า</span>
                                <span className="font-medium text-slate-600">รวม {quantity} ชุด</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* สรุปราคาท้ายใบเสร็จ */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1 text-slate-600 text-[11px]">
                        <div className="flex justify-between">
                          <span>ค่างานพิมพ์รวม</span>
                          <span className="font-semibold text-slate-800">
                            ฿{Number(order?.subtotal_price || order?.total_price || 0).toFixed(2)}
                          </span>
                        </div>

                        {Number(order?.small_order_fee) > 0 && (
                          <div className="flex justify-between text-orange-600">
                            <span>ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (&lt;50 บาท)</span>
                            <span className="font-semibold">+฿{Number(order.small_order_fee).toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                          <span className="text-blue-700">ยอดชำระสุทธิ</span>
                          <span className="text-sm font-extrabold text-blue-700">
                            ฿{orderPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        orderNo={confirmModal.orderNo}
        onClose={() => setConfirmModal({ isOpen: false, type: 'cancel', orderId: '', orderNo: '' })}
        onConfirm={handleExecuteAction}
      />

      {/* Modal ร้องเรียน / ขอคืนเงิน */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        description={reportDescription}
        imageUrl={reportImageUrl}
        isSubmitting={submittingReport}
        onDescriptionChange={setReportDescription}
        onImageUrlChange={setReportImageUrl}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
}