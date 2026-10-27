"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { PayoutItem } from "./PayoutsTable";

interface ProcessPayoutModalProps {
  selectedPayout: PayoutItem;
  payoutSlipUrl: string;
  isProcessing: boolean;
  copiedType: "account" | "amount" | null;
  feedbackMessage: { type: "success" | "error"; text: string } | null;
  getPayoutAmount: (item: PayoutItem) => number;
  getShopName: (item: PayoutItem) => string;
  onClose: () => void;
  onCopy: (text: string, type: "account" | "amount") => void;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onPayoutSlipUrlChange: (url: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function ProcessPayoutModal({
  selectedPayout,
  payoutSlipUrl,
  isProcessing: parentProcessing,
  copiedType,
  feedbackMessage,
  getPayoutAmount,
  getShopName,
  onClose,
  onCopy,
  onFileUpload,
  onPayoutSlipUrlChange,
  onSubmit,
}: ProcessPayoutModalProps) {
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
  const API_URL = rawApiUrl.replace(/\/+$/, "");

  const bankAccount = selectedPayout.shop?.bank_account?.[0];

  const handleRejectPayout = async () => {
    try {
      setIsRejecting(true);
      const res = await fetch(`${API_URL}/payouts/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payout_id: selectedPayout.id,
          reason: rejectReason.trim() || "รายการออเดอร์อยู่ระหว่างการตรวจสอบรายงานปัญหา",
        }),
      });

      if (!res.ok) throw new Error("Failed to reject payout");

      alert("ปฏิเสธ / ชะลอการโอนเงินให้ร้านค้าเรียบร้อยแล้ว");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Error rejecting payout:", err);
      alert("เกิดข้อผิดพลาดในการปฏิเสธการโอนเงิน");
    } finally {
      setIsRejecting(false);
    }
  };

  const isProcessing = parentProcessing || isRejecting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2.5 sm:p-4 font-sans overflow-hidden">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {showRejectBox ? "ปฏิเสธ / ระงับการโอนเงินให้ร้านค้า" : "ยืนยันการโอนเงินให้ร้านค้า"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-3.5 sm:space-y-4 overflow-y-auto py-3 flex-1">
          {/* ข้อมูลบัญชีธนาคารร้านค้า */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
            <p className="font-semibold text-slate-800 text-xs sm:text-sm border-b border-slate-200 pb-2">
              ข้อมูลบัญชีธนาคารร้านค้า
            </p>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 shrink-0">ชื่อร้านค้า:</span>
              <span className="font-medium text-slate-800 truncate text-right">{getShopName(selectedPayout)}</span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 shrink-0">ธนาคาร:</span>
              <span className="font-semibold text-slate-800 truncate text-right">{bankAccount?.bank_name || "ไม่ระบุ"}</span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 shrink-0">ชื่อบัญชี:</span>
              <span className="font-medium text-slate-800 truncate text-right">{bankAccount?.account_name || "-"}</span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 shrink-0">เลขที่บัญชี:</span>
              <div className="flex items-center gap-1.5 min-w-0 justify-end">
                <span className="font-mono text-slate-800 font-bold truncate text-[11px] sm:text-xs">
                  {bankAccount?.account_number || "-"}
                </span>
                {bankAccount?.account_number && (
                  <button
                    type="button"
                    onClick={() => onCopy(bankAccount.account_number, "account")}
                    className="px-2 py-0.5 text-[10px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-all cursor-pointer shrink-0"
                  >
                    {copiedType === "account" ? "คัดลอกแล้ว!" : "คัดลอก"}
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="text-slate-700 font-semibold text-xs sm:text-sm">ยอดเงินโอน:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-emerald-600">
                  ฿{getPayoutAmount(selectedPayout).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(getPayoutAmount(selectedPayout).toString(), "amount")}
                  className="px-2 py-0.5 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 rounded-md transition-all cursor-pointer shrink-0"
                >
                  {copiedType === "amount" ? "คัดลอกแล้ว!" : "คัดลอกยอด"}
                </button>
              </div>
            </div>
          </div>

          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                feedbackMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {feedbackMessage.text}
            </div>
          )}

          {showRejectBox ? (
            <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2.5">
              <label className="block text-xs font-bold text-rose-800">
                ระบุเหตุผลในการปฏิเสธ / ชะลอการโอนเงิน:
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="เช่น มีรายงานปัญหาจากลูกค้าอยู่ระหว่างตรวจสอบ / งานผิดสเปก"
                className="w-full px-3 py-2 border border-rose-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRejectBox(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-xl font-medium cursor-pointer transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleRejectPayout}
                  className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition-all shadow-2xs"
                >
                  {isProcessing ? "กำลังบันทึก..." : "ยืนยันปฏิเสธ"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  แนบไฟล์สลิปการโอนเงิน (รูปภาพ)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  หรือวาง URL สลิปโอนเงิน
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={payoutSlipUrl}
                  onChange={(e) => onPayoutSlipUrlChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* พรีวิวสลิปโอนคืน */}
              {payoutSlipUrl && (
                <div className="p-2 border border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">พรีวิวสลิปโอนเงิน:</p>
                  <img
                    src={payoutSlipUrl}
                    alt="Payout Slip Preview"
                    className="max-h-32 sm:max-h-36 mx-auto object-contain rounded-lg border border-slate-200"
                  />
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRejectBox(true)}
                  className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-center"
                >
                  ปฏิเสธการโอน
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors text-center font-medium"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || !payoutSlipUrl}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-all shadow-2xs text-center whitespace-nowrap"
                  >
                    {isProcessing ? "กำลังบันทึก..." : "ยืนยันโอนเงินเรียบร้อย"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}