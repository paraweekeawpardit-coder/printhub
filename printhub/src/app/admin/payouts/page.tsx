"use client";

import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import PayoutsTable, { PayoutItem } from "@/component/admin/PayoutsTable";
import ProcessPayoutModal from "@/component/admin/ProcessPayoutModal";
import ViewSlipModal from "@/component/admin/ViewSlipModal";

export default function PayoutsAdminPage() {
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);
  const [payoutSlipUrl, setPayoutSlipUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedType, setCopiedType] = useState<"account" | "amount" | null>(null);
  const [activeTab, setActiveTab] = useState<"PENDING" | "PAID">("PENDING");
  const [viewSlipUrl, setViewSlipUrl] = useState<string | null>(null);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
  const API_URL = rawApiUrl.replace(/\/+$/, "");

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/payouts`);
      if (!res.ok) throw new Error("Failed to fetch payouts");
      const data = await res.json();
      setPayouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching payouts:", err);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const getPayoutAmount = (item: PayoutItem) => {
    return Number(item.shop_income || item.amount || 0);
  };

  const getShopName = (item: PayoutItem) => {
    return item.shop?.shop_name || "ไม่ระบุชื่อร้านค้า";
  };

  const getPayoutDate = (item?: PayoutItem | string) => {
    const rawDate = typeof item === "string" ? item : item?.payment_date || item?.created_at;
    if (!rawDate) return "-";
    return new Date(rawDate).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = (text: string, type: "account" | "amount") => {
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
      setPayoutSlipUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessPayout = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    setFeedbackMessage(null);

    try {
      setIsProcessing(true);

      // ตรวจสอบว่าเป็นรายการโอนรวมหลายออเดอร์หรือไม่
      const isGrouped = Array.isArray((selectedPayout as any).items);
      const payoutIds = isGrouped
        ? (selectedPayout as any).items.map((i: PayoutItem) => i.id)
        : [selectedPayout.id];

      const res = await fetch(`${API_URL}/payouts/process`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payout_id: selectedPayout.id,
          payout_ids: payoutIds, // ส่งรายการ ID ทั้งหมดหากโอนรวม
          payout_slip_url: payoutSlipUrl,
          amount: getPayoutAmount(selectedPayout),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Process payout failed");
      }

      setFeedbackMessage({
        type: "success",
        text: "ดำเนินการโอนเงินให้ร้านค้าเรียบร้อยแล้ว",
      });

      setTimeout(() => {
        setSelectedPayout(null);
        setPayoutSlipUrl("");
        setFeedbackMessage(null);
        fetchPayouts();
      }, 1500);
    } catch (err: any) {
      console.error("Payout processing error:", err);
      setFeedbackMessage({
        type: "error",
        text: err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูลการโอนเงิน",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ตรวจสอบสถานะการโอนเงิน
  const checkIsPaid = (item: PayoutItem) => {
    const status = (item.payout_status || (item as any).status || "").toUpperCase();
    return Boolean(item.payout_slip_url || status === "PAID" || status === "COMPLETED");
  };

  const filteredPayouts = payouts.filter((item) => {
    const isPaid = checkIsPaid(item);
    return activeTab === "PAID" ? isPaid : !isPaid;
  });

  const paidCount = payouts.filter(checkIsPaid).length;
  const pendingCount = payouts.length - paidCount;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ระบบโอนเงินให้ร้านค้า (Shop Payouts)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการรายการโอนเงินค่าบริการให้ร้านค้า เมื่อออเดอร์เสร็จสมบูรณ์หรือเสร็จสิ้นกระบวนการพิจารณา
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
              รอโอนเงิน ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab("PAID")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "PAID"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              โอนเงินแล้ว ({paidCount})
            </button>
          </div>
        </div>

        {/* Payout Table Component */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <PayoutsTable
            payouts={filteredPayouts}
            activeTab={activeTab}
            loading={loading}
            formatDate={getPayoutDate}
            onSelectPayout={(item) => setSelectedPayout(item)}
            onViewSlip={(url) => setViewSlipUrl(url)}
          />
        </div>
      </div>

      {/* View Slip Modal Component */}
      {viewSlipUrl && (
        <ViewSlipModal
          slipUrl={viewSlipUrl}
          onClose={() => setViewSlipUrl(null)}
        />
      )}

      {/* Process Payout Modal Component */}
      {selectedPayout && (
        <ProcessPayoutModal
          selectedPayout={selectedPayout}
          payoutSlipUrl={payoutSlipUrl}
          isProcessing={isProcessing}
          copiedType={copiedType}
          feedbackMessage={feedbackMessage}
          getPayoutAmount={getPayoutAmount}
          getShopName={getShopName}
          onClose={() => setSelectedPayout(null)}
          onCopy={handleCopy}
          onFileUpload={handleFileUpload}
          onPayoutSlipUrlChange={setPayoutSlipUrl}
          onSubmit={handleProcessPayout}
        />
      )}
    </main>
  );
}