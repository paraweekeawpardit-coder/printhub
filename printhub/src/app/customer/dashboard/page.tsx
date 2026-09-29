/**
 * Page: CustomerDashboardPage
 * หน้าที่: หน้าหลักแดชบอร์ดของลูกค้า ทำหน้าที่เป็น Controller คอยจัดการ State,
 * ดึงข้อมูลสรุปจาก API, จัดการเงื่อนไข Filter และประกอบ Component ย่อยทั้งหมดเข้าด้วยกัน
 */

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Printer, CheckCircle2, Loader2, Check } from "lucide-react";
import NavBar from "../../../component/customer/NavBar";

// Import Components ที่แยกออกมา
import DashboardWelcomeBanner from "../../../component/customer/dashboard/DashboardWelcomeBanner";
import DashboardStatsGrid from "../../../component/customer/dashboard/DashboardStatsGrid";
import DashboardStatusFilter from "../../../component/customer/dashboard/DashboardStatusFilter";
import CustomerOrderCard from "../../../component/customer/dashboard/CustomerOrderCard";
import CustomerReportCard from "../../../component/customer/dashboard/CustomerReportCard";
import ConfirmActionModal from "../../../component/customer/dashboard/ConfirmActionModal";
import ReportIssueModal from "../../../component/customer/dashboard/ReportIssueModal";

const STATUS_FILTERS = [
  "ทั้งหมด",
  "รอการชำระเงิน",
  "รอการดำเนินงาน",
  "กำลังพิมพ์",
  "พิมพ์เสร็จสิ้น",
  "รายการเสร็จสิ้น",
  "ยกเลิกการพิมพ์",
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

  // State ควบคุม Accordion Dropdown รายการงานพิมพ์
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // State สำหรับ Modal ร้องเรียน / ขอคืนเงิน
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState<any>(null);
  const [reportDescription, setReportDescription] = useState("");
  const [reportImageUrl, setReportImageUrl] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  // State สำหรับ Confirm Action Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "cancel" | "received";
    orderId: string;
    orderNo: string;
  }>({ isOpen: false, type: "cancel", orderId: "", orderNo: "" });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isOrderExpired = (orderDateStr: string) => {
    if (!orderDateStr) return false;
    const orderTime = new Date(orderDateStr).getTime();
    return Date.now() - orderTime > 10 * 60 * 1000;
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

    orders.forEach((o) => {
      let state = o.current_status?.state || "รอการดำเนินงาน";
      if (state === "รอการชำระเงิน" && isOrderExpired(o.order_date)) {
        state = "ยกเลิกการพิมพ์";
      }

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
    return orders.filter((o) => {
      let state = o.current_status?.state || "รอการดำเนินงาน";
      if (state === "รอการชำระเงิน" && isOrderExpired(o.order_date)) {
        state = "ยกเลิกการพิมพ์";
      }

      if (selectedStatusFilter === "ทั้งหมด") return true;
      if (selectedStatusFilter === "รายการเสร็จสิ้น") {
        return state === "รายการเสร็จสิ้น" || state === "รับงานแล้ว";
      }
      return state === selectedStatusFilter;
    });
  }, [orders, selectedStatusFilter]);

  // จัดการ Action กดยืนยันจาก Modal
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

  // จัดการส่งฟอร์มเรื่องร้องเรียน
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

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#0F2942] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* 1. แบนเนอร์ต้อนรับ */}
        <DashboardWelcomeBanner customerName={customerName} />

        {/* 2. การ์ดสถิติ 4 ช่อง */}
        <DashboardStatsGrid stats={stats} />

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

        {/* 4. แถบตัวกรองสถานะ (แสดงเฉพาะแท็บคำสั่งซื้อ) */}
        {activeTab === "orders" && (
          <DashboardStatusFilter
            filters={STATUS_FILTERS}
            selectedFilter={selectedStatusFilter}
            counts={statusCounts}
            onSelectFilter={setSelectedStatusFilter}
          />
        )}

        {/* 5. แสดงผลรายการคำสั่งซื้อ หรือ รายการเรื่องร้องเรียน */}
        {activeTab === "orders" ? (
          filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 text-slate-400 space-y-2">
              <Printer className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">ไม่พบคำสั่งซื้อในสถานะ &quot;{selectedStatusFilter}&quot;</p>
              <p className="text-xs">ลองเลือกดูสถานะอื่น หรือสั่งพิมพ์งานใหม่</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <CustomerOrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  onToggleExpand={() =>
                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                  }
                  onCancelClick={(ord) =>
                    setConfirmModal({
                      isOpen: true,
                      type: "cancel",
                      orderId: ord.id,
                      orderNo: `#ORD-${ord.order_no || ord.id.slice(0, 6)}`,
                    })
                  }
                  onConfirmReceivedClick={(ord) =>
                    setConfirmModal({
                      isOpen: true,
                      type: "received",
                      orderId: ord.id,
                      orderNo: `#ORD-${ord.order_no || ord.id.slice(0, 6)}`,
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

      {/* Modal ยืนยันการดำเนินการ (ยกเลิก / รับงาน) */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        orderNo={confirmModal.orderNo}
        onClose={() => setConfirmModal({ isOpen: false, type: "cancel", orderId: "", orderNo: "" })}
        onConfirm={handleExecuteAction}
      />

      {/* Modal ยื่นเรื่องร้องเรียน / ขอคืนเงิน */}
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