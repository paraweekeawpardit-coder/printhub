"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import SlipTable, { formatThaiDate } from "../../../component/admin/SlipTable";
import SlipModal, { TransactionItem } from "../../../component/admin/SlipModal";

export default function AdminSlipsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlip, setSelectedSlip] = useState<TransactionItem | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "refunded">("all");

  // State สำหรับ Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [summaryCounts, setSummaryCounts] = useState({
    total: 0,
    paid: 0,
    refunded: 0,
  });

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      // ส่ง page และ status ไปที่ Backend ดึงทีละ 20 รายการ
      const res = await fetch(`${API_URL}/transactions?page=${page}&limit=20&status=${statusFilter}`);
      const contentType = res.headers.get("content-type");

      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error(`Failed to fetch transactions. Status: ${res.status}`);
      }

      const responseData = await res.json();
      const rawList = Array.isArray(responseData.data)
        ? responseData.data
        : Array.isArray(responseData)
        ? responseData
        : [];

      const mappedData: TransactionItem[] = rawList.map((tx: any) => {
        const totalAmount = Number(
          tx.amount ?? tx.order?.total_amount ?? tx.order?.total_price ?? 0
        );

        const platformFee = Number(
          tx.platform_fee ?? tx.order?.platform_fee ?? 0
        );

        const netAmount = Number(
          tx.net_amount ?? tx.shop_income ?? (totalAmount - platformFee)
        );

        return {
          ...tx,
          id: tx.id,
          order_id: tx.order_id || tx.order?.id,
          order_no: tx.order_no || (tx.order?.order_no ? `#${tx.order.order_no}` : "-"),
          amount: totalAmount,
          platform_fee: platformFee,
          net_amount: netAmount,
          payment_date: tx.payment_date || tx.created_at || tx.order?.order_date,
          status: tx.status || "completed",
          slip_url: tx.slip_url || tx.order?.payment?.slip_url || "",
          refund_slip_url: tx.refund_slip_url || "",
          customer_name:
            tx.customer_name ||
            (tx.order?.customer
              ? `${tx.order.customer.first_name || ""} ${tx.order.customer.last_name || ""}`.trim()
              : "ลูกค้าทั่วไป"),
          shop_name: tx.shop_name || tx.order?.shop?.shop_name || "-",
        };
      });

      setTransactions(mappedData);

      // อัปเดต Summary Counts และ TotalPages จาก Backend
      if (responseData.counts) {
        setSummaryCounts(responseData.counts);
      }
      if (responseData.totalPages) {
        setTotalPages(responseData.totalPages);
      }
    } catch (error) {
      console.warn("API Error, setting empty state:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, page, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // เปลี่ยนแท็บแล้วกลับไปหน้า 1
  const handleTabChange = (status: "all" | "paid" | "refunded") => {
    setStatusFilter(status);
    setPage(1);
  };

  // กรองค้นหาในหน้าปัจจุบัน
  const filteredTransactions = transactions.filter((tx: any) => {
    const searchLower = search.toLowerCase();
    const orderNo = String(tx.order_no || "").toLowerCase();
    const orderId = String(tx.order_id || "").toLowerCase();
    const txId = String(tx.id || "").toLowerCase();
    const customer = String(tx.customer_name || "").toLowerCase();
    const shop = String(tx.shop_name || "").toLowerCase();

    return (
      orderNo.includes(searchLower) ||
      orderId.includes(searchLower) ||
      txId.includes(searchLower) ||
      customer.includes(searchLower) ||
      shop.includes(searchLower)
    );
  });

  // 🟢 แปลงเวลาด้วย formatThaiDate (+7)
  const formatDate = (dateString?: string | null) => {
    return formatThaiDate(dateString);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            ประวัติการชำระเงิน & ค่าธรรมเนียมระบบ (Payment Transactions)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ศูนย์รวมข้อมูลสลิปหลักฐานการชำระเงินของลูกค้า และประวัติธุรกรรมในระบบ
          </p>
        </div>

        {/* 🔍 ช่องค้นหาปรับขนาดและดีไซน์ให้ตรงตามภาพตัวอย่าง */}
        <div className="w-full sm:w-96 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหา Order ID (#197), ชื่อลูกค้า, เลขบัญชี หรือร้านค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-200/60 cursor-pointer"
              title="ล้างคำค้นหา"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-medium text-slate-500">รายการรับชำระทั้งหมด</span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-slate-900">{summaryCounts.total}</span>
            <span className="text-xs text-slate-400 font-medium">รายการ</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-emerald-700">ชำระเงินสำเร็จปกติ</span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-emerald-900">{summaryCounts.paid}</span>
            <span className="text-xs text-emerald-600 font-medium">รายการ</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-amber-700">รายการที่โอนเงินคืนแล้ว (Refunded)</span>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-amber-900">{summaryCounts.refunded}</span>
            <span className="text-xs text-amber-600 font-medium">รายการ</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-slate-900 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            รายการทั้งหมด ({summaryCounts.total})
          </button>
          <button
            onClick={() => handleTabChange("paid")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "paid"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ชำระสำเร็จ ({summaryCounts.paid})
          </button>
          <button
            onClick={() => handleTabChange("refunded")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "refunded"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            คืนเงินแล้ว ({summaryCounts.refunded})
          </button>
        </div>

        <SlipTable
          transactions={filteredTransactions}
          loading={loading}
          onSelectSlip={(tx) => setSelectedSlip(tx)}
          formatDate={formatDate}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 px-2 text-xs">
            <span className="text-slate-500 font-medium">
              หน้า {page} จากทั้งหมด {totalPages} หน้า
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>

      <SlipModal
        transaction={selectedSlip}
        onClose={() => setSelectedSlip(null)}
        formatDate={formatDate}
      />
    </div>
  );
}