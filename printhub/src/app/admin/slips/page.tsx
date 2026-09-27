"use client";

import { useState, useEffect, useCallback } from "react";
import SlipTable from "../../../component/admin/SlipTable";
import SlipModal, { TransactionItem } from "../../../component/admin/SlipModal";

export default function AdminSlipsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlip, setSelectedSlip] = useState<TransactionItem | null>(null);
  const [search, setSearch] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/transactions`);
      const contentType = res.headers.get("content-type");

      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error(`Failed to fetch transactions. Status: ${res.status}`);
      }

      const responseData = await res.json();
      const dataList = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];
      setTransactions(dataList);
    } catch (error) {
      console.warn("API Error, using fallback data for slips/transactions:", error);
      setTransactions([
        {
          id: "tx-101",
          order_id: "ORD-2026-9901",
          amount: 450.0,
          net_amount: 427.5,
          platform_fee: 22.5,
          payment_method: "PromptPay",
          payment_date: new Date().toISOString(),
          status: "completed",
          slip_url: "https://via.placeholder.com/400x600?text=Slip+Preview",
        },
        {
          id: "tx-102",
          order_id: "ORD-2026-8812",
          amount: 1200.0,
          net_amount: 1140.0,
          platform_fee: 60.0,
          payment_method: "Bank Transfer",
          payment_date: new Date(Date.now() - 3600000).toISOString(),
          status: "pending",
          slip_url: "https://via.placeholder.com/400x600?text=Slip+Preview+2",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((tx) => {
    const searchLower = search.toLowerCase();
    return (
      (tx.order_id?.toLowerCase() || "").includes(searchLower) ||
      (tx.id?.toLowerCase() || "").includes(searchLower) ||
      (tx.payment_method?.toLowerCase() || "").includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            ตรวจสอบสลิป & ธุรกรรมการเงิน
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            รายการชำระเงิน ค่าธรรมเนียมแพลตฟอร์ม และหลักฐานสลิปโอนเงินทั้งหมด
          </p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="ค้นหา Order ID หรือ Transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Table Component */}
      <SlipTable
        transactions={filteredTransactions}
        loading={loading}
        onSelectSlip={(tx) => setSelectedSlip(tx)}
        formatDate={formatDate}
      />

      {/* Modal Component */}
      <SlipModal
        transaction={selectedSlip}
        onClose={() => setSelectedSlip(null)}
        formatDate={formatDate}
      />
    </div>
  );
}