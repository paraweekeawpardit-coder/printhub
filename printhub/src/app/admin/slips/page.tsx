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
      const rawList = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];

      // Mapping ข้อมูลรองรับ platform_fee จากตาราง print_order
      const mappedData: TransactionItem[] = rawList.map((tx: any) => {
        // ดึงค่า total_amount หรือ amount
        const totalAmount = Number(
          tx.amount ?? tx.order?.total_amount ?? tx.order?.total_price ?? 0
        );

        // ดึง platform_fee จาก print_order (หรือ payment ถ้ามี)
        const platformFee = Number(
          tx.platform_fee ?? tx.order?.platform_fee ?? 0
        );

        // คำนวณ net_amount (ยอดที่ร้านค้าได้รับสุทธิ)
        const netAmount = Number(
          tx.net_amount ?? tx.shop_income ?? (totalAmount - platformFee)
        );

        return {
          ...tx,
          id: tx.id,
          order_id: tx.order_id || tx.order?.id,
          order_no: tx.order_no || tx.order?.order_no ? `#${tx.order_no || tx.order?.order_no}` : "-",
          amount: totalAmount,
          platform_fee: platformFee,
          net_amount: netAmount,
          payment_method: tx.payment_method || "PromptPay",
          payment_date: tx.payment_date || tx.created_at || tx.order?.order_date,
          status: tx.status || "completed",
          slip_url: tx.slip_url || tx.order?.payment?.slip_url || "",
          customer_name: tx.customer_name || 
            (tx.order?.customer ? `${tx.order.customer.first_name || ""} ${tx.order.customer.last_name || ""}`.trim() : "ลูกค้าทั่วไป"),
          shop_name: tx.shop_name || tx.order?.shop?.shop_name || "-",
        };
      });

      setTransactions(mappedData);
    } catch (error) {
      console.warn("API Error, using fallback data for slips/transactions:", error);
      setTransactions([
        {
          id: "tx-101",
          order_id: "#162",
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
          order_id: "#161",
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

  const filteredTransactions = transactions.filter((tx: any) => {
    const searchLower = search.toLowerCase();
    const orderNo = String(tx.order_no || tx.order?.order_no || "").toLowerCase();
    const orderId = String(tx.order_id || "").toLowerCase();
    const txId = String(tx.id || "").toLowerCase();
    const method = String(tx.payment_method || "").toLowerCase();
    const customer = String(tx.customer_name || "").toLowerCase();
    const shop = String(tx.shop_name || "").toLowerCase();

    return (
      orderNo.includes(searchLower) ||
      orderId.includes(searchLower) ||
      txId.includes(searchLower) ||
      method.includes(searchLower) ||
      customer.includes(searchLower) ||
      shop.includes(searchLower)
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
            placeholder="ค้นหา Order ID, ชื่อลูกค้า หรือ ร้านค้า..."
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