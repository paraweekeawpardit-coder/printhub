"use client";

import { useState, useEffect, useCallback, ChangeEvent, FormEvent, useMemo } from "react";
import RefundsTable, { RefundItem } from "@/component/admin/RefundsTable";
import ProcessRefundModal from "@/component/admin/ProcessRefundModal";

export default function RefundsAdminPage() {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null);
  const [refundSlipUrl, setRefundSlipUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedType, setCopiedType] = useState<"contact" | "amount" | null>(null);
  const [activeTab, setActiveTab] = useState<"PENDING" | "REFUNDED">("PENDING");
  const [viewSlipUrl, setViewSlipUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
  const API_URL = rawApiUrl.replace(/\/+$/, "");

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/refunds`);
      if (!res.ok) throw new Error("Failed to fetch refunds");
      const data = await res.json();
      setRefunds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching refunds:", err);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const getOrderAmount = (item: RefundItem) => {
    return Number(item.total_amount || item.total_price || 0);
  };

  const getCustomerName = useCallback((item: RefundItem) => {
    if (item.customer?.name) return item.customer.name;
    const firstName = item.customer?.first_name || "";
    const lastName = item.customer?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "ลูกค้าทั่วไป";
  }, []);

  const getOrderDate = (item: RefundItem) => {
    const rawDate = item.canceled_at || item.order_date || item.created_at;
    if (!rawDate) return "-";
    return new Date(rawDate).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isRefundCompleted = useCallback((item: RefundItem) => {
    if (Boolean(item.refund_slip_url)) return true;

    const completedKeywords = ["REFUNDED", "REFUND_COMPLETED", "คืนเงินแล้ว", "COMPLETED"];
    const rootPaymentStatus = String(item.payment_status || "").toUpperCase();
    if (completedKeywords.includes(rootPaymentStatus)) return true;

    if (Array.isArray(item.payment)) {
      const hasRefundedInArray = item.payment.some((p) => {
        const pStatus = String(p?.status || "").toUpperCase();
        return completedKeywords.includes(pStatus);
      });
      if (hasRefundedInArray) return true;
    }

    return false;
  }, []);

  const handleCopy = (text: string, type: "contact" | "amount") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setRefundSlipUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessRefund = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRefund) return;

    try {
      setIsProcessing(true);
      const res = await fetch(`${API_URL}/refunds/process`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedRefund.id,
          refund_slip_url: refundSlipUrl,
          refund_amount: getOrderAmount(selectedRefund),
        }),
      });

      if (!res.ok) throw new Error("Process refund failed");

      setSelectedRefund(null);
      setRefundSlipUrl("");
      fetchRefunds();
    } catch (err) {
      console.error("Refund processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRefunds = useMemo(() => {
    return refunds.filter((item) => {
      const completed = isRefundCompleted(item);
      const matchesTab = activeTab === "REFUNDED" ? completed : !completed;

      if (!matchesTab) return false;
      if (!searchTerm.trim()) return true;

      const term = searchTerm.trim().toLowerCase().replace(/^#/, "");
      const displayOrderNo = item.order_no
        ? String(item.order_no).toLowerCase()
        : item.id.slice(0, 8).toLowerCase();

      const customerName = getCustomerName(item).toLowerCase();
      const shopName = (item.shop?.shop_name || "").toLowerCase();
      const contact = (item.customer?.contact || "").toLowerCase();
      const bankAcc = (item.bank_account_no || item.customer?.bank_account_no || "").toLowerCase();

      return (
        displayOrderNo.includes(term) ||
        customerName.includes(term) ||
        shopName.includes(term) ||
        contact.includes(term) ||
        bankAcc.includes(term)
      );
    });
  }, [refunds, activeTab, searchTerm, isRefundCompleted, getCustomerName]);

  const completedCount = refunds.filter((item) => isRefundCompleted(item)).length;
  const pendingCount = refunds.length - completedCount;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ระบบดำเนินการคืนเงิน (Refunds)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการรายการยกเลิกออเดอร์ และตรวจสอบประวัติการโอนเงินคืน
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "PENDING"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              รอคืนเงิน ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab("REFUNDED")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "REFUNDED"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              คืนเงินแล้ว ({completedCount})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา Order ID (#197), ชื่อลูกค้า, เลขบัญชี หรือร้านค้า..."
              className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            พบข้อมูลทั้งหมด <span className="font-bold text-slate-900">{filteredRefunds.length}</span> รายการ
          </div>
        </div>

        {/* Refund Table Component */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <RefundsTable
            refunds={filteredRefunds}
            loading={loading}
            activeTab={activeTab}
            searchTerm={searchTerm}
            onSelectRefund={(item) => setSelectedRefund(item)}
            onViewSlip={(url) => setViewSlipUrl(url)}
            getOrderAmount={getOrderAmount}
            getCustomerName={getCustomerName}
            getOrderDate={getOrderDate}
          />
        </div>
      </div>

      {/* Modal ดูสลิปการโอนคืน/สลิปเดิม */}
      {viewSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
            <h3 className="text-md font-bold text-slate-900">
              หลักฐานสลิปโอนเงิน
            </h3>
            <div className="border rounded-xl p-2 bg-slate-50 max-h-[60vh] overflow-y-auto">
              <img
                src={viewSlipUrl}
                alt="Slip"
                className="w-full h-auto rounded-lg object-contain mx-auto"
              />
            </div>
            <button
              onClick={() => setViewSlipUrl(null)}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* Modal ดำเนินการโอนเงินคืน / ปฏิเสธคืนเงิน */}
      {selectedRefund && (
        <ProcessRefundModal
          selectedRefund={selectedRefund}
          onClose={() => {
            setSelectedRefund(null);
            setRefundSlipUrl("");
          }}
          onSubmit={handleProcessRefund}
          refundSlipUrl={refundSlipUrl}
          setRefundSlipUrl={setRefundSlipUrl}
          handleFileUpload={handleFileUpload}
          handleCopy={handleCopy}
          copiedType={copiedType}
          isProcessing={isProcessing}
          feedbackMessage={null}
          getOrderAmount={getOrderAmount}
          getCustomerName={getCustomerName}
        />
      )}
    </main>
  );
}