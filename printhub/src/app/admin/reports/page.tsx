"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReportStats from "../../../component/admin/ReportStats";
import ReportTable, { ReportItem } from "../../../component/admin/ReportTable";
import ReportImageModal from "../../../component/admin/ReportImageModal";
import ReportDetailModal, { ReportDetailItem } from "../../../component/admin/ReportDetailModal";
import ReviewReportDetailModal, { ReviewReportDetailItem } from "../../../component/admin/ReviewReportDetailModal";

export default function ReportsAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🟢 อ่านค่าจาก URL เพื่อใช้เป็นค่าเริ่มต้น เมื่อกด Refresh จะได้อยู่ที่แท็บเดิม
  const initialCategory = (searchParams.get("category") as "refund" | "review") || "refund";
  const initialFilter = (searchParams.get("filter") as "all" | "pending" | "investigating" | "resolved") || "all";

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [category, setCategory] = useState<"refund" | "review">(initialCategory);
  const [filter, setFilter] = useState<"all" | "pending" | "investigating" | "resolved">(initialFilter);
  const [search, setSearch] = useState("");
  const [selectedImageReport, setSelectedImageReport] = useState<ReportItem | null>(null);

  const [selectedDetailReport, setSelectedDetailReport] = useState<ReportDetailItem | null>(null);
  const [selectedReviewReport, setSelectedReviewReport] = useState<ReviewReportDetailItem | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  // 🟢 ฟังก์ชันสำหรับอัปเดต URL เมื่อมีการเปลี่ยน Category หรือ Filter
  const updateQueryParams = (newCategory: "refund" | "review", newFilter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", newCategory);
    params.set("filter", newFilter);
    router.replace(`/admin/reports?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (newCategory: "refund" | "review") => {
    setCategory(newCategory);
    setFilter("all");
    updateQueryParams(newCategory, "all");
  };

  const handleFilterChange = (newFilter: "all" | "pending" | "investigating" | "resolved") => {
    setFilter(newFilter);
    updateQueryParams(category, newFilter);
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reports?t=${Date.now()}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch reports. Status: ${res.status}`);
      }

      const data = await res.json();
      
      const formattedData = (Array.isArray(data) ? data : []).map((item: any) => {
        const reviewText =
          item.review_comment ||
          item.comment ||
          item.review_text ||
          item.review?.comment ||
          item.review?.review_comment ||
          "";

        return {
          ...item,
          review_comment: reviewText,
          customer_name:
            item.customer_name ||
            (item.customer ? `${item.customer.first_name || ""} ${item.customer.last_name || ""}`.trim() : "") ||
            item.customer?.name ||
            "-",
          shop_name: item.shop_name || item.print_shop?.shop_name || item.shop?.shop_name || "-",
        };
      });

      setReports(formattedData);
    } catch (error) {
      console.error("Error fetching reports from API:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleOpenChat = (targetType: "customer" | "shop", targetId?: string) => {
    if (!targetId) return;
    window.open(`/admin/support?type=${targetType}&id=${targetId}`, "_blank");
  };

  const handleAcceptReport = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/reports/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: id }),
      });

      if (!res.ok) throw new Error("Accept report failed");

      if (selectedDetailReport && selectedDetailReport.id === id) {
        setSelectedDetailReport((prev) => (prev ? { ...prev, status: "investigating" } : null));
      }
      if (selectedReviewReport && selectedReviewReport.id === id) {
        setSelectedReviewReport((prev) => (prev ? { ...prev, status: "investigating" } : null));
      }

      fetchReports();
    } catch (error) {
      console.error("Error accepting report:", error);
    }
  };

  const handleResolveOrderReport = async (
    reportId: string,
    decision: "approved" | "rejected" | "resolved_refund" | "resolved_payout" | "hide_review",
    adminNote: string,
    refundAmount: number
  ) => {
    try {
      const res = await fetch(`${API_URL}/reports/resolve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          decision,
          admin_note: adminNote,
          refund_amount: refundAmount,
        }),
      });

      if (!res.ok) throw new Error("Resolve report failed");

      setSelectedDetailReport(null);
      fetchReports();
    } catch (err) {
      console.error("Error resolving report:", err);
    }
  };

  const handleResolveReviewReport = async (
    reportId: string,
    decision: "hide_review" | "rejected",
    adminNote: string
  ) => {
    try {
      const currentReport = reports.find((r) => r.id === reportId) as any;
      const resolveDecision = decision === "hide_review" ? "hide_review" : "rejected";

      const res = await fetch(`${API_URL}/reports/resolve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          decision: resolveDecision,
          admin_note: adminNote,
          refund_amount: 0,
          review_id: currentReport?.review_id || currentReport?.review?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Backend Error Response:", errorData);
        throw new Error(errorData.message || "Resolve review report failed");
      }

      setSelectedReviewReport(null);
      fetchReports();
    } catch (err) {
      console.error("Error resolving review report:", err);
    }
  };

  const handleSelectReport = (report: ReportItem) => {
    const rawReport = report as any;
    const isReview = report.issue_type === "รายงานรีวิวที่ไม่เหมาะสม" || Boolean(report.review_id);

    if (isReview) {
      const reviewText =
        rawReport.review_comment ||
        rawReport.comment ||
        rawReport.review_text ||
        rawReport.review?.comment ||
        "";

      const reviewDetailItem: ReviewReportDetailItem = {
        ...rawReport,
        review_comment: reviewText,
      };

      setSelectedReviewReport(reviewDetailItem);
    } else {
      setSelectedDetailReport(report as unknown as ReportDetailItem);
    }
  };

  const categoryReports = reports.filter((item) => {
    if (category === "review") {
      return item.issue_type === "รายงานรีวิวที่ไม่เหมาะสม" || Boolean(item.review_id);
    }
    return item.issue_type !== "รายงานรีวิวที่ไม่เหมาะสม" && !item.review_id;
  });

  const filteredReports = categoryReports.filter((item) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "pending"
        ? item.status === "pending" || !item.status
        : filter === "investigating"
        ? item.status === "investigating"
        : item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" || item.status === "rejected";

    const searchLower = search.toLowerCase();
    const matchesSearch =
      (item.description?.toLowerCase() || "").includes(searchLower) ||
      (item.order_id?.toLowerCase() || "").includes(searchLower) ||
      (item.id?.toLowerCase() || "").includes(searchLower) ||
      ((item as any).review_comment?.toLowerCase() || "").includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const pendingCount = categoryReports.filter((r) => r.status === "pending" || !r.status).length;
  const investigatingCount = categoryReports.filter((r) => r.status === "investigating").length;
  const resolvedCount = categoryReports.filter(
    (r) => r.status === "resolved_refund" || r.status === "resolved_payout" || r.status === "resolved" || r.status === "rejected"
  ).length;

  return (
    <div className="w-full min-w-0 max-w-full space-y-4 sm:space-y-6 font-sans p-2 sm:p-6 lg:p-8">
      <div className="w-full min-w-0 max-w-full space-y-4 sm:space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              ระบบตรวจสอบรายงานปัญหา
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              จัดการ ตรวจสอบ และอนุมัติรายการแจ้งปัญหาจากลูกค้า/ร้านค้า
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full lg:w-auto gap-1">
            <button
              onClick={() => handleCategoryChange("refund")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer text-center ${
                category === "refund"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>ขอคืนเงิน / ออเดอร์</span>
            </button>
            <button
              onClick={() => handleCategoryChange("review")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer text-center ${
                category === "review"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>รายงานรีวิวไม่เหมาะสม</span>
            </button>
          </div>
        </div>

        {/* Stats Component */}
        <ReportStats
          total={categoryReports.length}
          pending={pendingCount}
          verified={resolvedCount}
        />

        {/* Filter and Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                filter === "all" ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ทั้งหมด ({categoryReports.length})
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                filter === "pending" ? "bg-amber-500 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              รอดำเนินการ ({pendingCount})
            </button>
            <button
              onClick={() => handleFilterChange("investigating")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                filter === "investigating" ? "bg-blue-600 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              กำลังตรวจสอบ ({investigatingCount})
            </button>
            <button
              onClick={() => handleFilterChange("resolved")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                filter === "resolved" ? "bg-emerald-600 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ตัดสินเรียบร้อย ({resolvedCount})
            </button>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder={category === "refund" ? "ค้นหา Order ID หรือ ปัญหา..." : "ค้นหา ข้อความ หรือ เหตุผล..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Component ตารางรายงาน */}
        <div className="w-full min-w-0 max-w-full overflow-hidden">
          <ReportTable
            reports={filteredReports}
            loading={loading}
            category={category}
            onSelectReport={handleSelectReport}
            onAcceptReport={handleAcceptReport}
            onOpenImage={(report) => setSelectedImageReport(report)}
          />
        </div>

        {/* Image Preview Modal */}
        <ReportImageModal
          report={selectedImageReport as any}
          onClose={() => setSelectedImageReport(null)}
        />

        {/* Order Report Detail Modal */}
        <ReportDetailModal
          report={selectedDetailReport}
          onClose={() => setSelectedDetailReport(null)}
          onAcceptReport={handleAcceptReport}
          onResolve={handleResolveOrderReport}
        />

        {/* Review Report Detail Modal */}
        <ReviewReportDetailModal
          report={selectedReviewReport}
          onClose={() => setSelectedReviewReport(null)}
          onAcceptReport={handleAcceptReport}
          onResolve={handleResolveReviewReport}
          onOpenChat={handleOpenChat}
        />

      </div>
    </div>
  );
}