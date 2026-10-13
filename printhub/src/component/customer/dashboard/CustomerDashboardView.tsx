/**
- Component: CustomerDashboardView
- Path: src/component/customer/dashboard/CustomerDashboardView.tsx
- หน้าที่: ควบคุม State, การกรองสถานะคำสั่งซื้อ และ Modal ทั้งหมด (ใช้ร่วมกันทั้งหน้า Dashboard และ Orders)
 */

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const highlightOrderId = searchParams.get("highlight");

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

  // เวลานัดรับเก็บเป็นเวลาไทยแบบไม่มี timezone -> ตีความเป็น +07:00
  const parseBangkokTime = (dateStr?: string | null) => {
    if (!dateStr) return null;
    let cleaned = String(dateStr).trim().replace(" ", "T");
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) cleaned += "T00:00:00";
    if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(cleaned)) cleaned += "+07:00";
    const parsed = new Date(cleaned).getTime();
    return isNaN(parsed) ? null : parsed;
  };

  // 🌟 ฟังก์ชันคำนวณสถานะจริงของออเดอร์ (แก้ไขไม่ให้เหมารวมออเดอร์ที่ดำเนินงานไปแล้วเป็นยกเลิก)
  const getRealOrderState = (o: any) => {
    if (!o) return "รอการดำเนินงาน";

    const dbState =
      o.current_status?.state ||
      o.status?.state ||
      (typeof o.current_status === "string" ? o.current_status : null) ||
      (typeof o.status === "string" ? o.status : null) ||
      "";

    // 1. ถ้าระบุชัดเจนใน DB ว่ายกเลิก ให้ยึดเป็นยกเลิกการพิมพ์ทันที
    // แอดมินอนุมัติคืนเงินจากคำร้อง -> ใน DB เป็นยกเลิก แต่ฝั่งลูกค้านับเป็น "รายการเสร็จสิ้น"
    const reportStatus = String(o?.report?.status || "").toLowerCase();
    if (
      reportStatus === "resolved_refund" &&
      (dbState === "ยกเลิกการพิมพ์" || dbState === "ยกเลิก" || dbState === "cancelled")
    ) {
      return "รายการเสร็จสิ้น";
    }

    if (dbState === "ยกเลิกการพิมพ์" || dbState === "ยกเลิก" || dbState === "cancelled") {
      return "ยกเลิกการพิมพ์";
    }

    // 2. ถ้าเป็นสถานะที่ดำเนินงานไปแล้วหรือเสร็จสิ้น ไม่ต้องเช็กเรื่องหมดเวลาชำระเงิน
    if (
      dbState === "รอการดำเนินงาน" ||
      dbState === "กำลังพิมพ์" ||
      dbState === "พิมพ์เสร็จสิ้น" ||
      dbState === "รายการเสร็จสิ้น" ||
      dbState === "รับงานแล้ว"
    ) {
      // ตรวจสอบเฉพาะกรณีเลยเวลานัดรับงาน และงานยังค้างอยู่ที่รอดำเนินงาน/กำลังพิมพ์ (S2G7 Auto-Cancel)
      const now = Date.now();
      const appointmentMs = parseBangkokTime(o?.appointment_time);
      if (appointmentMs && now >= appointmentMs && (dbState === "รอการดำเนินงาน" || dbState === "กำลังพิมพ์")) {
        return "ยกเลิกการพิมพ์";
      }
      return dbState;
    }

    // 3. ตรวจสอบเฉพาะออเดอร์ที่ยังอยู่ในสถานะ "รอการชำระเงิน"
    const now = Date.now();
    const paymentData = Array.isArray(o?.payment) ? o.payment[0] : o?.payment;
    const isSlipRejected = paymentData?.is_verified === false || paymentData?.status === "rejected";
    const hasPaidSlip = Boolean(paymentData?.slip_url) && !isSlipRejected;

    // ถ้ามีการแนบสลิปแล้ว หรือชำระเงินแล้ว ไม่ถือว่าหมดเวลาชำระเงิน
    if (hasPaidSlip) {
      return dbState || "รอการดำเนินงาน";
    }

    // เช็กหมดเวลาชำระเงินเฉพาะออเดอร์ที่ยังไม่ได้ชำระเงิน
    let isExpired = false;
    const expiresAtMs = parseSafeTime(o?.expires_at);
    if (expiresAtMs) {
      isExpired = now > expiresAtMs;
    }

    if (isExpired) {
      return "ยกเลิกการพิมพ์";
    }

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

  // ปรับกรอบไฮไลต์เมื่อมี highlightOrderId เข้ามา
  useEffect(() => {
    if (!loading && highlightOrderId && orders.length > 0) {
      const targetOrder = orders.find((o) => String(o.id) === String(highlightOrderId));
      if (targetOrder) {
        setTimeout(() => {
          const element = document.getElementById(`order-${highlightOrderId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });

            element.classList.add(
              "ring-2",
              "ring-blue-600",
              "ring-offset-2",
              "shadow-xl",
              "transition-all",
              "duration-300"
            );

            setTimeout(() => {
              element.classList.remove(
                "ring-2",
                "ring-blue-600",
                "ring-offset-2",
                "shadow-xl"
              );
            }, 3500);
          }
        }, 300);
      }
    }
  }, [loading, highlightOrderId, orders]);

  // คำนวณจำนวนออเดอร์ในแต่ละสถานะสำหรับตัวเลข Badge
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
          showToast(data.message || data.error || "ไม่สามารถยกเลิกได้");
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
          showToast(data.message || data.error || "เกิดข้อผิดพลาดในการยืนยันรับงาน");
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
        showToast(data.message || data.error || "ไม่สามารถส่งคำขอได้");
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
            className={`pb-3 transition relative cursor-pointer ${activeTab === "orders"
              ? "text-[#0F2942] border-b-2 border-[#0F2942]"
              : "text-slate-400 hover:text-slate-600"
              }`}
          >
            รายการสั่งซื้อของฉัน ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`pb-3 transition relative flex items-center gap-1.5 cursor-pointer ${activeTab === "reports"
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
                <div key={order.id} id={`order-${order.id}`} className="transition-all rounded-3xl">
                  <CustomerOrderCard
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
                    // 🌟 เปลี่ยนเส้นทางปุ่มรายงานปัญหาให้วิ่งไปที่หน้า /customer/orders/[order_id]/report
                    onReportClick={(ord) => {
                      router.push(`/customer/orders/${ord.id}/report`);
                    }}
                    onShowToast={showToast}
                  />
                </div>
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