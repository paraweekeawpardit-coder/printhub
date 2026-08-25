"use client";

import { useState, useEffect } from "react";

interface ReportItem {
  id: string;
  customer_id: string;
  shop_id: string;
  admin_id: string | null;
  order_id: string;
  description: string;
  image_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export default function VerifyReportPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  // 1. ดึงข้อมูลรายงานผ่าน API_URL
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reports`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 2. อัปเดตสถานะการตรวจสอบผ่าน API_URL
  const toggleVerify = async (id: string, currentVerifiedStatus: boolean) => {
    const newStatus = !currentVerifiedStatus;

    // Optimistic UI Update (ปรับหน้าจอทันทีเพื่อความเร็ว)
    setReports((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_verified: newStatus } : item
      )
    );

    try {
      const res = await fetch(`${API_URL}/reports/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: id, is_verified: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (error) {
      console.error("Error updating verification status:", error);
      alert("ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง");
      
      // ย้อนกลับค่าเดิมถ้า API มีปัญหา
      setReports((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_verified: currentVerifiedStatus } : item
        )
      );
    }
  };

  // กรองรายการข้อมูล
  const filteredReports = reports.filter((item) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "pending"
        ? !item.is_verified
        : item.is_verified;

    const matchesSearch =
      (item.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.order_id?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.id?.toLowerCase() || "").includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = reports.filter((r) => !r.is_verified).length;
  const verifiedCount = reports.filter((r) => r.is_verified).length;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              🔍 ระบบตรวจสอบรายงานปัญหา
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการ ตรวจสอบ และอนุมัติรายการแจ้งปัญหาจากลูกค้า/ร้านค้า
            </p>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">รายงานทั้งหมด</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{reports.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">📋</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between bg-amber-50/30">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">รอตรวจสอบ (Pending)</p>
              <h3 className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold">⏳</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between bg-emerald-50/30">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">ตรวจสอบแล้ว (Verified)</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{verifiedCount}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">✅</div>
          </div>
        </div>

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
              รอตรวจสอบ ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("verified")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === "verified" ? "bg-emerald-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              อนุมัติแล้ว ({verifiedCount})
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

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-4">สถานะ</th>
                  <th className="py-4 px-4">Order ID / Ticket ID</th>
                  <th className="py-4 px-4">รายละเอียดปัญหา</th>
                  <th className="py-4 px-4">หลักฐาน</th>
                  <th className="py-4 px-4">วันที่แจ้งเรื่อง</th>
                  <th className="py-4 px-4 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.is_verified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Order & ID */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono font-medium text-slate-900">
                          {item.order_id ? `${item.order_id.substring(0, 13)}...` : "-"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          ID: {item.id ? item.id.substring(0, 8) : "-"}
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-medium text-slate-800 truncate" title={item.description}>
                          {item.description}
                        </p>
                      </td>

                      {/* Image Preview */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.image_url ? (
                          <button
                            onClick={() => setSelectedReport(item)}
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            🖼️ ดูรูปถ่าย
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">ไม่มีรูปแนบ</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                        {formatDate(item.created_at)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleVerify(item.id, item.is_verified)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm ${
                            item.is_verified
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                          }`}
                        >
                          {item.is_verified ? "ยกเลิกยืนยัน" : "ยืนยันตรวจสอบ"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      ไม่พบข้อมูลรายงานตามเงื่อนไข
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal ดูรูปภาพ */}
        {selectedReport && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-900">หลักฐานรูปถ่าย</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-mono">
                  Order ID: {selectedReport.order_id}
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.image_url && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={selectedReport.image_url}
                    alt="หลักฐาน"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-xl font-medium"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}