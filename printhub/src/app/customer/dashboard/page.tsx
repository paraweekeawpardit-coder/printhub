"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MessageCircle, 
  FileWarning, 
  Star, 
  X, 
  Search, 
  Loader2, 
  Calendar, 
  Store, 
  ChevronDown, 
  ChevronUp, 
  Ban,
  Check
} from "lucide-react";
import NavBar from "../../../component/customer/NavBar";

const STATUS_FILTERS = [
  "ทั้งหมด",
  "รอการดำเนินงาน",
  "กำลังพิมพ์",
  "พิมพ์เสร็จสิ้น",
  "รายการเสร็จสิ้น",
  "ยกเลิกการพิมพ์"
];

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "reports">("orders");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState<string>("");
  const [stats, setStats] = useState({ inProgress: 0, ready: 0, completed: 0, reports: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // State สำหรับ Accordion Dropdown
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // State สำหรับ Modal ร้องเรียน / ขอคืนเงิน
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState<any>(null);
  const [reportDescription, setReportDescription] = useState("");
  const [reportImageUrl, setReportImageUrl] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  // State สำหรับ Modal กดยืนยัน Action ต่างๆ
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "cancel" | "received";
    orderId: string;
    orderNo: string;
  }>({ isOpen: false, type: "cancel", orderId: "", orderNo: "" });

  // Toast Notification แจ้งผลสำเร็จบนจอ
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDashboardData = useCallback(async (cid: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/customer/dashboard?customer_id=${cid}`);
      const json = await res.json();

      if (json.success && json.data) {
        setCustomerName(json.data.customer.fullName);
        setStats(json.data.stats);
        setOrders(json.data.orders);
        setReports(json.data.reports);
      }
    } catch (err) {
      console.error("Load dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id");
    if (!cid || cid.startsWith("customer_")) {
      router.push("/auth");
      return;
    }
    fetchDashboardData(cid);
  }, [router, fetchDashboardData]);

  // คำนวณจำนวนออเดอร์ในแต่ละสถานะสำหรับ Badge ตัวเลข
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ทั้งหมด: orders.length,
      รอการดำเนินงาน: 0,
      กำลังพิมพ์: 0,
      พิมพ์เสร็จสิ้น: 0,
      รายการเสร็จสิ้น: 0,
      ยกเลิกการพิมพ์: 0,
    };

    orders.forEach((o) => {
      const state = o.current_status?.state || "รอการดำเนินงาน";
      if (state === "รับงานแล้ว" || state === "รายการเสร็จสิ้น") {
        counts["รายการเสร็จสิ้น"] = (counts["รายการเสร็จสิ้น"] || 0) + 1;
      } else if (counts[state] !== undefined) {
        counts[state]++;
      }
    });

    return counts;
  }, [orders]);

  // กรองรายการคำสั่งซื้อตามแท็บสถานะที่เลือก
  const filteredOrders = useMemo(() => {
    if (selectedStatusFilter === "ทั้งหมด") return orders;

    return orders.filter((o) => {
      const state = o.current_status?.state || "รอการดำเนินงาน";
      if (selectedStatusFilter === "รายการเสร็จสิ้น") {
        return state === "รายการเสร็จสิ้น" || state === "รับงานแล้ว";
      }
      return state === selectedStatusFilter;
    });
  }, [orders, selectedStatusFilter]);

  // ดำเนินการ Action เมื่อกดยืนยันใน Custom Modal
  const handleExecuteAction = async () => {
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id");
    const { type, orderId } = confirmModal;

    try {
      if (type === "cancel") {
        const res = await fetch(`http://localhost:5000/api/customer/order/${orderId}/cancel`, {
          method: "PUT",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast("ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว");
          if (cid) fetchDashboardData(cid);
        } else {
          showToast(data.error || "ไม่สามารถยกเลิกได้");
        }
      } else if (type === "received") {
        const res = await fetch(`http://localhost:5000/api/customer/order/${orderId}/confirm-received`, {
          method: "PUT",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast("ยืนยันรับงานสำเร็จ คุณสามารถรีวิวร้านค้าได้แล้ว");
          if (cid) fetchDashboardData(cid);
        } else {
          showToast(data.error || "เกิดข้อผิดพลาดในการยืนยันรับงาน");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setConfirmModal({ isOpen: false, type: "cancel", orderId: "", orderNo: "" });
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id");
    if (!reportDescription.trim()) return;

    try {
      setSubmittingReport(true);
      const res = await fetch("http://localhost:5000/api/customer/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        showToast("ส่งคำขอคืนเงิน/รายงานปัญหาเรียบร้อยแล้ว");
        setIsReportModalOpen(false);
        setReportDescription("");
        setReportImageUrl("");
        if (cid) fetchDashboardData(cid);
      } else {
        showToast(data.error || "ไม่สามารถส่งคำขอได้");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xs">กำลังโหลดข้อมูลแดชบอร์ด...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pb-20 relative">
      <NavBar />

      {/* Toast Alert มุมขวาบน */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#0F2942] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        
        {/* 1. Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100 shrink-0">
              {customerName ? customerName.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  ยินดีต้อนรับ, คุณ {customerName || "ลูกค้า"}
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  ลูกค้า (Customer)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                เข้าสู่ระบบในฐานะ: ผู้สั่งพิมพ์งาน
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/customer")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2942] hover:bg-[#1a3d5e] text-white text-xs font-semibold rounded-2xl transition shadow-xs cursor-pointer shrink-0"
          >
            <Search size={14} />
            <span>ค้นหาร้านพิมพ์งาน</span>
          </button>
        </div>

        {/* 2. การ์ดสถิติ 4 ช่อง */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">กำลังดำเนินการ</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.inProgress}</div>
            <p className="text-[11px] text-slate-400">รอดำเนินงาน / กำลังพิมพ์</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">พร้อมรับงาน</span>
              <Printer className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.ready}</div>
            <p className="text-[11px] text-emerald-600/80">พิมพ์เสร็จสิ้น</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">รับงานแล้ว</span>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.completed}</div>
            <p className="text-[11px] text-slate-400">สำเร็จเรียบร้อย</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">ข้อพิพาท/ขอคืนเงิน</span>
              <FileWarning className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600">{stats.reports}</div>
            <p className="text-[11px] text-rose-500/80">รอแอดมินตัดสิน (FR-8)</p>
          </div>
        </div>

        {/* 3. แท็บสลับหน้าคำสั่งซื้อ vs เรื่องร้องเรียน */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "orders"
                ? "text-[#0F2942] border-b-2 border-[#0F2942]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            รายการสั่งซื้อของฉัน ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`pb-3 transition relative flex items-center gap-1.5 cursor-pointer ${
              activeTab === "reports"
                ? "text-[#0F2942] border-b-2 border-[#0F2942]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>ข้อร้องเรียน / ขอคืนเงิน</span>
            {reports.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-600 font-bold">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        {/* 4. แถบตัวกรองสถานะ 6 ปุ่ม */}
        {activeTab === "orders" && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {STATUS_FILTERS.map((st) => {
              const isActive = selectedStatusFilter === st;
              const count = statusCounts[st] || 0;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 5. รายการคำสั่งซื้อ */}
        {activeTab === "orders" ? (
          filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 text-slate-400 space-y-2">
              <Printer className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">ไม่พบคำสั่งซื้อในสถานะ &quot;{selectedStatusFilter}&quot;</p>
              <p className="text-xs">ลองเลือกดูสถานะอื่น หรือสั่งพิมพ์งานใหม่</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const state = order.current_status?.state || "รอการดำเนินงาน";
                const isPending = state === "รอการดำเนินงาน";
                const isPrinting = state === "กำลังพิมพ์";
                const isReady = state === "พิมพ์เสร็จสิ้น";
                const isReceived = state === "รับงานแล้ว" || state === "รายการเสร็จสิ้น";
                const isCanceled = state === "ยกเลิกการพิมพ์";

                const stateBadgeStyle =
                  isReady
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : isReceived
                    ? "bg-slate-100 text-slate-600 border-slate-200"
                    : isCanceled
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : isPrinting
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-amber-50 text-amber-700 border-amber-200";

                const formattedDate = order.receive_date
                  ? new Date(order.receive_date).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })
                  : "-";

                const formattedTime = order.appointment_time
                  ? new Date(order.appointment_time).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) + " น."
                  : "";

                const itemSummary =
                  order.order_items && order.order_items.length > 0
                    ? order.order_items
                        .map((it: any) => `${it.category || "งานพิมพ์"} (x${it.quantity})`)
                        .join(", ")
                    : "งานพิมพ์เอกสาร";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200"
                  >
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-slate-900 text-base">
                            #ORD-{order.order_no || order.id.slice(0, 6)}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stateBadgeStyle}`}>
                            {state}
                          </span>
                        </div>

                        {/* ชื่อร้านค้า + วันเวลานัดรับ */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Store className="w-3.5 h-3.5 text-slate-400" />
                            {order.shop?.shop_name || "ร้านค้า"}
                          </span>

                          <span className="text-slate-300">•</span>

                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>นัดรับ: <strong className="text-slate-700">{formattedDate}</strong></span>
                          </span>

                          {formattedTime && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <strong className="text-slate-700">{formattedTime}</strong>
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 truncate max-w-md">
                          {itemSummary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-left md:text-right pr-2">
                          <span className="text-[11px] text-slate-400 block font-medium">ยอดชำระสุทธิ</span>
                          <span className="text-base font-black text-blue-600">
                            ฿{Number(order.total_amount || order.total_price || 0).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* ปุ่มยกเลิก */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => setConfirmModal({
                                isOpen: true,
                                type: "cancel",
                                orderId: order.id,
                                orderNo: `#ORD-${order.order_no || order.id.slice(0, 6)}`,
                              })}
                              className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>ยกเลิก</span>
                            </button>
                          )}

                          {/* ปุ่มแชต */}
                          {(isPrinting || isReady) && (
                            <button
                                type="button"
                                onClick={() => router.push(`/customer/chat?order_id=${order.id}&shop_id=${order.shop?.id}`)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <MessageCircle className="w-3.5 h-3.5 text-white" />
                                <span>แชท</span>
                            </button>
                          )}

                          {/* ปุ่มยืนยันรับงาน */}
                          {isReady && (
                            <button
                              type="button"
                              onClick={() => setConfirmModal({
                                isOpen: true,
                                type: "received",
                                orderId: order.id,
                                orderNo: `#ORD-${order.order_no || order.id.slice(0, 6)}`,
                              })}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                            >
                              ยืนยันรับงานแล้ว
                            </button>
                          )}

                          {/* ปุ่มขอคืนเงิน/ร้องเรียน + ปุ่มรีวิว */}
                          {isReceived && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForReport(order);
                                  setIsReportModalOpen(true);
                                }}
                                className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>ขอคืนเงิน</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => router.push(`/customer/review?order_id=${order.id}&shop_id=${order.shop?.id}`)}
                                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                                >
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>รีวิว</span>
                                </button>
                            </>
                          )}

                          {/* ปุ่ม Dropdown รายละเอียด */}
                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer border ${
                              isExpanded
                                ? "bg-slate-100 text-blue-600 border-slate-300"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <span>รายละเอียด</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* กล่อง Dropdown รายละเอียด */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-[#F8FAFC] p-4 sm:p-5 space-y-4">
                        <div>
                          <span className="text-xs font-bold text-slate-700 block mb-2">
                            รายการเอกสารและสเปกงานพิมพ์
                          </span>
                          <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
                            {(order.order_items && order.order_items.length > 0) ? (
                              order.order_items.map((it: any, idx: number) => (
                                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                                  <div>
                                    <span className="font-semibold text-slate-800">
                                      {idx + 1}. {it.category || "งานพิมพ์"}
                                    </span>
                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                      จำนวน: {it.quantity} ชุด
                                      {it.page_count ? ` • ${it.page_count} หน้า/ชุด` : ""}
                                    </div>
                                  </div>
                                  <span className="font-bold text-slate-700">
                                    ฿{Number(it.subtotal || it.unit_price * it.quantity || 0).toFixed(2)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-xs text-slate-400">ไม่มีข้อมูลสินค้าย่อย</div>
                            )}
                          </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/80 p-3 space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-500">
                            <span>ค่างานพิมพ์รวม</span>
                            <span>฿{Number(order.subtotal_price || order.total_price || 0).toFixed(2)}</span>
                          </div>
                          {Number(order.small_order_fee || 0) > 0 && (
                            <div className="flex justify-between text-amber-600">
                              <span>ค่าธรรมเนียมคำสั่งซื้อขนาดเล็ก (&lt;50 บาท)</span>
                              <span>+฿{Number(order.small_order_fee).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-slate-800 pt-1.5 border-t border-slate-100">
                            <span>ยอดชำระสุทธิ</span>
                            <span className="text-blue-600">
                              ฿{Number(order.total_amount || order.total_price || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span>
                            ร้านค้า: <strong>{order.shop?.shop_name}</strong> {order.shop?.phone ? `(โทร: ${order.shop.phone})` : ""}
                          </span>
                          <span>
                            เลขอ้างอิง: <code>{order.id}</code>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* ประวัติการร้องเรียน */
          reports.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
              <p className="text-sm font-bold text-slate-700">ไม่มีรายการข้อร้องเรียนหรือคำขอคืนเงิน</p>
              <p className="text-xs">รายการสั่งพิมพ์ของคุณเสร็จสมบูรณ์เรียบร้อยดีทั้งหมด</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      คำขอคืนเงิน / ข้อร้องเรียนออเดอร์ #{rep.order?.order_no || rep.order_id?.slice(0, 8)}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${
                      rep.is_verified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {rep.is_verified ? "แอดมินตัดสินแล้ว" : "อยู่ระหว่างตรวจสอบข้อพิพาท"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                    &ldquo;{rep.description}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>ร้านค้า: {rep.shop?.shop_name || "ไม่ระบุ"}</span>
                    <span>ยื่นคำขอเมื่อ: {new Date(rep.created_at).toLocaleDateString("th-TH")}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* 🌟 Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 text-center">
            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${
              confirmModal.type === "cancel" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {confirmModal.type === "cancel" ? <Ban size={24} /> : <CheckCircle2 size={24} />}
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {confirmModal.type === "cancel" ? "ยืนยันการยกเลิกคำสั่งซื้อ?" : "ยืนยันการรับงานพิมพ์?"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {confirmModal.type === "cancel"
                  ? `คุณต้องการยกเลิกคำสั่งซื้อ ${confirmModal.orderNo} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`
                  : `คุณได้รับเอกสารงานพิมพ์ ${confirmModal.orderNo} และตรวจสอบความเรียบร้อยแล้วใช่หรือไม่?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, type: "cancel", orderId: "", orderNo: "" })}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition cursor-pointer flex-1"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                className={`px-4 py-2 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex-1 ${
                  confirmModal.type === "cancel" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 Modal สำหรับแจ้งข้อร้องเรียน / ขอคืนเงิน */}
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