"use client";

import { useState, useEffect, useCallback } from "react";
import ReportStats from "../../../component/admin/ReportStats";
import ReportTable, { ReportItem } from "../../../component/admin/ReportTable";
import ReportImageModal from "../../../component/admin/ReportImageModal";
import ReportDetailModal, { ReportDetailItem } from "../../../component/admin/ReportDetailModal";

export default function ReportsAdminPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "pending" | "investigating" | "resolved">("all");
  const [search, setSearch] = useState("");
  const [selectedImageReport, setSelectedImageReport] = useState<ReportItem | null>(null);
  const [selectedDetailReport, setSelectedDetailReport] = useState<ReportDetailItem | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reports?t=${Date.now()}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch reports. Status: ${res.status}`);
      }

      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
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

  // ปุ่มกดรับเรื่องพิจารณา
  const handleAcceptReport = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/reports/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: id }),
      });

      if (!res.ok) throw new Error("Accept report failed");
      fetchReports();
    } catch (error) {
      console.error("Error accepting report:", error);
    }
  };

  const handleResolveReport = async (
    reportId: string,
    decision: "approved" | "rejected",
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

      console.log("Report resolved successfully:", { reportId, decision });
      setSelectedDetailReport(null);
      fetchReports();
    } catch (err) {
      console.error("Error resolving report:", err);
    }
  };

  const filteredReports = reports.filter((item) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "pending"
        ? item.status === "pending" || !item.status
        : filter === "investigating"
        ? item.status === "investigating"
        : item.status === "resolved_refund" || item.status === "rejected";

    const matchesSearch =
      (item.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.order_id?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.id?.toLowerCase() || "").includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = reports.filter((r) => r.status === "pending" || !r.status).length;
  const investigatingCount = reports.filter((r) => r.status === "investigating").length;
  const resolvedCount = reports.filter(
    (r) => r.status === "resolved_refund" || r.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ระบบตรวจสอบรายงานปัญหา
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการ ตรวจสอบ และอนุมัติรายการแจ้งปัญหาจากลูกค้า/ร้านค้า
            </p>
          </div>
        </div>

        {/* Stats */}
        <ReportStats
          total={reports.length}
          pending={pendingCount}
          verified={resolvedCount}
        />

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "all" ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ทั้งหมด ({reports.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "pending" ? "bg-amber-500 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              รอดำเนินการ ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("investigating")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "investigating" ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              กำลังตรวจสอบ ({investigatingCount})
            </button>
            <button
              onClick={() => setFilter("resolved")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "resolved" ? "bg-emerald-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ตัดสินเรียบร้อย ({resolvedCount})
            </button>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="ค้นหา Order ID หรือ ปัญหา..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Data Table Component */}
        <ReportTable
          reports={filteredReports}
          loading={loading}
          onSelectReport={(report) => setSelectedDetailReport(report as unknown as ReportDetailItem)}
          onAcceptReport={handleAcceptReport}
          onOpenImage={(report) => setSelectedImageReport(report)}
        />

        {/* Image Preview Modal */}
        <ReportImageModal
          report={selectedImageReport as any}
          onClose={() => setSelectedImageReport(null)}
        />

        {/* Report Detail & Decision Modal */}
        <ReportDetailModal
          report={selectedDetailReport}
          onClose={() => setSelectedDetailReport(null)}
          onAcceptReport={handleAcceptReport}
          onResolve={handleResolveReport}
        />

      </div>
    </main>
  );
}