/**
 * Component: CustomerDashboardView
 * Path: src/component/customer/dashboard/CustomerDashboardView.tsx
 * หน้าที่: ควบคุม State, การกรองสถานะคำสั่งซื้อ และ Modal ทั้งหมด (ใช้ร่วมกันทั้งหน้า Dashboard และ Orders)
 */

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Printer, CheckCircle2, Loader2, Check } from "lucide-react";

import DashboardWelcomeBanner from "./DashboardWelcomeBanner";
import DashboardStatsGrid from "./DashboardStatsGrid";
import DashboardStatusFilter from "./DashboardStatusFilter";
import CustomerOrderCard from "./CustomerOrderCard";
import CustomerReportCard from "./CustomerReportCard";
import ConfirmActionModal from "./ConfirmActionModal";
import ReportIssueModal from "./ReportIssueModal";

const STATUS_FILTERS = [
  "ทั้งหมด",
  "รอการชำระเงิน",
  "รอการดำเนินงาน",
  "กำลังพิมพ์",
  "พิมพ์เสร็จสิ้น",
  "รายการเสร็จสิ้น",
  "ยกเลิกการพิมพ์",
];

interface CustomerDashboardViewProps {
  showBanner?: boolean; // เปิด/ปิด Banner ต้อนรับ
  showStats?: boolean;  // เปิด/ปิด การ์ดสถิติ 4 ช่อง
  pageTitle?: string;   // กำหนดหัวข้อหน้า (กรณีเป็นหน้าคำสั่งซื้อของฉัน)
}

export default function CustomerDashboardView({
  showBanner = true,
  showStats = true,
  pageTitle,
}: CustomerDashboardViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "reports">("orders");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState<string>("");
  const [stats, setStats] = useState({ inProgress: 0, ready: 0, completed: 0, reports: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState<any>(null);
  const [reportDescription, setReportDescription] = useState("");
  const [reportImageUrl, setReportImageUrl] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "cancel" | "received";
    orderId: string;
    orderNo: string;
  }>({ isOpen: false, type: "cancel", orderId: "", orderNo: "" });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const parseSafeTime = (dateStr?: string | null) => {
    if (!dateStr) return null;
    let cleaned = String(dateStr).trim();
    if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
      cleaned = `${cleaned.replace(" ", "T")}Z`;
    }
    const parsed = new Date(cleaned).getTime();
    return isNaN(parsed) ? null : parsed;
  };

  // 🌟 ฟังก์ชันคำนวณสถานะจริงของออเดอร์ (จุดตรวจจับสถานะจุดเดียวของทั้งระบบ)
  const getRealOrderState = (o: any) => {
    if (!o) return "รอการดำเนินงาน";

    const dbState =
      o.current_status?.state ||
      o.status?.state ||
      (typeof o.current_status === "string" ? o.current_status : null) ||
      (typeof o.status === "string" ? o.status : null) ||
      "";

    // 1. ถ้าระบุชัดเจนว่าเป็นยกเลิก ให้ยึดเป็นยกเลิกทันที
    if (dbState === "ยกเลิกการพิมพ์" || dbState === "ยกเลิก") {
      return "ยกเลิกการพิมพ์";
    }

    const now = Date.now();
    const paymentData = Array.isArray(o?.payment) ? o.payment[0] : o?.payment;
    const isSlipRejected = paymentData?.is_verified === false || paymentData?.status === "rejected";

    // 2. เช็คการหมดเวลาชำระเงิน
    let isExpired = false;
    const expiresAtMs = parseSafeTime(o?.expires_at);
    const orderDateMs = parseSafeTime(o?.order_date);

    if (expiresAtMs) {
      isExpired = now > expiresAtMs;
    } else if (!isSlipRejected && orderDateMs) {
      isExpired = now > (orderDateMs + 10 * 60 * 1000);
    }

    // 🌟 หมดเวลาชำระเงินแล้ว -> ต้องตัดเข้า "ยกเลิกการพิมพ์" ทันที ห้ามค้างที่รอชำระเงิน
    if (isExpired) {
      return "ยกเลิกการพิมพ์";
    }

    // 3. ตรวจสอบกรณีเลยเวลานัดรับงาน (S2G7 Auto-Cancel)
    const appointmentMs = parseSafeTime(o?.appointment_time);
    if (appointmentMs && now >= appointmentMs) {
      if (dbState === "รอการดำเนินงาน" || dbState === "กำลังพิมพ์") {
        return "ยกเลิกการพิมพ์";
      }
    }

    // 4. สลิปถูกปฏิเสธ แต่ยังไม่หมดเวลา -> ให้แสดงในแท็บ "รอการชำระเงิน"
    if (isSlipRejected) {
      return "รอการชำระเงิน";
    }

    return dbState || "รอการชำระเงิน";
  };

  const fetchDashboardData = useCallback(async (cid: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/customer/dashboard?customer_id=${cid}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (json.success && json.data) {
        setCustomerName(json.data.customer?.fullName || json.data.customer?.name || "");
        setStats(json.data.stats || { inProgress: 0, ready: 0, completed: 0, reports: 0 });
        setOrders(json.data.orders || []);
        setReports(json.data.reports || []);
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

  // คำนวณจำนวนออเดอร์ในแต่ละสถานะ
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
      const state = getRealOrderState(o);
      if (state === "รับงานแล้ว" || state === "รายการเสร็จสิ้น") {
        counts["รายการเสร็จสิ้น"] = (counts["รายการเสร็จสิ้น"] || 0) + 1;
      } else if (counts[state] !== undefined) {
        counts[state]++;
      }
    });

    return counts;
  }, [orders]);

  // กรองรายการคำสั่งซื้อตามแท็บที่เลือก
  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {
      const state = getRealOrderState(o);
      if (selectedStatusFilter === "ทั้งหมด") return true;
      if (selectedStatusFilter === "รายการเสร็จสิ้น") {
        return state === "รายการเสร็จสิ้น" || state === "รับงานแล้ว";
      }
      return state === selectedStatusFilter;
    });
  }, [orders, selectedStatusFilter]);

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
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 py-32">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xs">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <>
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#0F2942] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {pageTitle && (
          <div className="flex items-center justify-between pb-1">
            <h1 className="font-bold text-xl text-slate-900">{pageTitle}</h1>
            <span className="text-xs text-slate-400 font-medium">เรียงตามเวลาล่าสุด</span>
          </div>
        )}

        {showBanner && <DashboardWelcomeBanner customerName={customerName} />}
        {showStats && <DashboardStatsGrid stats={stats} />}

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

        {activeTab === "orders" && (
          <DashboardStatusFilter
            filters={STATUS_FILTERS}
            selectedFilter={selectedStatusFilter}
            counts={statusCounts}
            onSelectFilter={setSelectedStatusFilter}
          />
        )}

        {activeTab === "orders" ? (
          filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 text-slate-400 space-y-2">
              <Printer className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">
                ไม่พบคำสั่งซื้อในสถานะ &quot;{selectedStatusFilter}&quot;
              </p>
              <p className="text-xs">ลองเลือกดูสถานะอื่น หรือสั่งพิมพ์งานใหม่</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <CustomerOrderCard
                  key={order.id}
                  order={order}
                  showOrderDate={true}
                  isExpanded={expandedOrderId === order.id}
                  onToggleExpand={() =>
                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                  }
                  onCancelClick={(orderId, orderNo) =>
                    setConfirmModal({
                      isOpen: true,
                      type: "cancel",
                      orderId,
                      orderNo,
                    })
                  }
                  onReceivedClick={(orderId, orderNo) =>
                    setConfirmModal({
                      isOpen: true,
                      type: "received",
                      orderId,
                      orderNo,
                    })
                  }
                  onReportClick={(ord) => {
                    setSelectedOrderForReport(ord);
                    setIsReportModalOpen(true);
                  }}
                  onShowToast={showToast}
                />
              ))}
            </div>
          )
        ) : reports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
            <p className="text-sm font-bold text-slate-700">ไม่มีรายการข้อร้องเรียนหรือคำขอคืนเงิน</p>
            <p className="text-xs">รายการสั่งพิมพ์ของคุณเสร็จสมบูรณ์เรียบร้อยดีทั้งหมด</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <CustomerReportCard key={rep.id} report={rep} />
            ))}
          </div>
        )}
      </main>

      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        orderNo={confirmModal.orderNo}
        onClose={() => setConfirmModal({ isOpen: false, type: "cancel", orderId: "", orderNo: "" })}
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
    </>
  );
}