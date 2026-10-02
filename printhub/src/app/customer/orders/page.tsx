'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Package, Check, ShoppingBag } from 'lucide-react';
import NavBar from '../../../component/customer/NavBar';

// 🌟 ดึง Component จาก Dashboard มาใช้ทั้งหมด โค้ดจะสั้นและหน้าตาตรงกัน 100%
import DashboardStatusFilter from '../../../component/customer/dashboard/DashboardStatusFilter';
import CustomerOrderCard from '../../../component/customer/dashboard/CustomerOrderCard';
import ConfirmActionModal from '../../../component/customer/dashboard/ConfirmActionModal';
import ReportIssueModal from '../../../component/customer/dashboard/ReportIssueModal';

import PaymentActionButton from '../../../component/customer/payment/PaymentActionButton';

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

  // Modals State
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
    return !isNaN(orderTime) && Date.now() - orderTime > 10 * 60 * 1000;
  };

  const fetchOrdersData = useCallback(async (customerId: string) => {
    setLoading(true);
    setError('');

    try {
      // ดึงจาก dashboard API เป็นหลักเพื่อให้ข้อมูลครบเหมือนแดชบอร์ด
      const res = await fetch(`http://localhost:5000/api/customer/dashboard?customer_id=${customerId}`);
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setOrders(json.data.orders || []);
      } else {
        const orderRes = await fetch(`http://localhost:5000/api/customer/orders?customer_id=${customerId}`);
        const orderJson = await orderRes.json();
        setOrders(orderJson.data || []);
      }

      const cartRes = await fetch(`http://localhost:5000/api/customer/cart?customer_id=${customerId}`);
      const cartJson = await cartRes.json();
      if (cartJson.success && cartJson.data) {
        const rawItems = Array.isArray(cartJson.data) ? cartJson.data : (cartJson.data.items || []);
        setCartCount(rawItems.length);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cid = typeof window !== 'undefined' ? localStorage.getItem('customer_id') || localStorage.getItem('id') : null;
    if (!cid || cid === 'undefined') {
      setLoading(false);
      setError('กรุณาเข้าสู่ระบบก่อน');
      return;
    }
    fetchOrdersData(cid);
  }, [fetchOrdersData]);

  // ฟังก์ชันแปลงเวลาแบบปลอดภัย ป้องกัน Timezone เพี้ยน
  const parseSafeTime = (dateStr?: string | null) => {
    if (!dateStr) return null;
    let cleaned = dateStr.trim();
    if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
      cleaned = `${cleaned.replace(" ", "T")}Z`;
    }
    const parsed = new Date(cleaned).getTime();
    return isNaN(parsed) ? null : parsed;
  };

  // ฟังก์ชันกลางสำหรับดึงสถานะจริงของออเดอร์
  const getOrderState = (o: any) => {
    let state =
      o.status?.state ||
      o.current_status?.state ||
      (typeof o.status === "string" ? o.status : "") ||
      "รอการชำระเงิน";

    if (state === "รอการชำระเงิน") {
      const now = Date.now();
      let isExpired = false;

      if (o.expires_at) {
        const expTime = parseSafeTime(o.expires_at);
        if (expTime && expTime < now) isExpired = true;
      } else if (o.order_date) {
        const createTime = parseSafeTime(o.order_date);
        if (createTime && now > createTime + 10 * 60 * 1000) isExpired = true;
      }

      if (isExpired) {
        state = "ยกเลิกการพิมพ์";
      }
    }

    return state;
  };

  // 🌟 1. คำนวณจำนวนในแต่ละสถานะ (statusCounts)
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

    orders.forEach((o: any) => {
      const state = getOrderState(o);

      if (state === "รับงานแล้ว" || state === "รายการเสร็จสิ้น") {
        counts["รายการเสร็จสิ้น"] = (counts["รายการเสร็จสิ้น"] || 0) + 1;
      } else if (counts[state] !== undefined) {
        counts[state] += 1;
      } else {
        counts[state] = 1;
      }
    });

    return counts;
  }, [orders]);

  // 🌟 2. กรองและเรียงลำดับรายการคำสั่งซื้อ (filteredOrders)
  const filteredOrders = useMemo(() => {
    const validOrders = [...orders].filter((o) => Boolean(o && (o.id || o.order_no)));

    validOrders.sort((a, b) => {
      const timeA = parseSafeTime(a.order_date) || 0;
      const timeB = parseSafeTime(b.order_date) || 0;
      return timeB - timeA;
    });

    if (selectedStatus === "ทั้งหมด") return validOrders;

    return validOrders.filter((order) => {
      const state = getOrderState(order);
      if (selectedStatus === "รายการเสร็จสิ้น") {
        return state === "รายการเสร็จสิ้น" || state === "รับงานแล้ว";
      }
      return state === selectedStatus;
    });
  }, [orders, selectedStatus]);
  
  const handleExecuteAction = async () => {
    const cid = localStorage.getItem('customer_id') || localStorage.getItem('id');
    const { type, orderId } = confirmModal;
    const url = type === 'cancel' 
      ? `http://localhost:5000/api/customer/order/${orderId}/cancel`
      : `http://localhost:5000/api/customer/order/${orderId}/confirm-received`;

    try {
      const res = await fetch(url, { method: 'PUT' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(type === 'cancel' ? 'ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว' : 'ยืนยันรับงานสำเร็จ');
        if (cid) fetchOrdersData(cid);
      } else {
        showToast(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch {
      showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
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
          shop_id: selectedOrderForReport?.shop?.id || selectedOrderForReport?.shop_id,
          order_id: selectedOrderForReport?.id,
          description: reportDescription,
          image_url: reportImageUrl || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('ส่งคำร้องเรียนเรียบร้อยแล้ว');
        setIsReportModalOpen(false);
        setReportDescription('');
        setReportImageUrl('');
        if (cid) fetchOrdersData(cid);
      }
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12 relative text-slate-800">
      <NavBar cartCount={cartCount} onOpenCart={() => router.push('/customer/cart')} />

      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#0F2942] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between pb-1">
          <h1 className="font-bold text-xl text-slate-900">คำสั่งซื้อของฉัน</h1>
          <span className="text-xs text-slate-400 font-medium">เรียงตามเวลาล่าสุด</span>
        </div>

        <DashboardStatusFilter
          filters={FILTER_TABS}
          selectedFilter={selectedStatus}
          counts={statusCounts}
          onSelectFilter={setSelectedStatus}
        />

        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400 space-y-2">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin mx-auto" />
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">ไม่มีคำสั่งซื้อในสถานะ &quot;{selectedStatus}&quot;</p>
            <button
              onClick={() => (selectedStatus === 'ทั้งหมด' ? router.push('/customer') : setSelectedStatus('ทั้งหมด'))}
              className="mt-3 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              {selectedStatus === 'ทั้งหมด' ? 'ค้นหาร้านพิมพ์งาน' : 'ดูทั้งหมด'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              /* 🟢 เพิ่ม id="order-${order.id}" ตรงนี้ */
              <div key={order.id} id={`order-${order.id}`} className="transition-all duration-500 rounded-2xl">
                <CustomerOrderCard
                  order={order}
                  showOrderDate={true}
                  isExpanded={expandedOrderId === order.id}
                  onToggleExpand={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  onCancelClick={(orderId, orderNo) => setConfirmModal({ isOpen: true, type: 'cancel', orderId, orderNo })}
                  onReceivedClick={(orderId, orderNo) => setConfirmModal({ isOpen: true, type: 'received', orderId, orderNo })}
                  onReportClick={(ord) => { setSelectedOrderForReport(ord); setIsReportModalOpen(true); }}
                  onShowToast={showToast}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🌟 3. Modals จาก Dashboard */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        orderNo={confirmModal.orderNo}
        onClose={() => setConfirmModal({ isOpen: false, type: 'cancel', orderId: '', orderNo: '' })}
        onConfirm={handleExecuteAction}
      />

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
