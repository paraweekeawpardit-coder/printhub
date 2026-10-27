"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { RefundItem } from "./RefundsTable";

interface ProcessRefundModalProps {
  selectedRefund: RefundItem;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  refundSlipUrl: string;
  setRefundSlipUrl?: (url: string) => void;
  onRefundSlipUrlChange?: (url: string) => void;
  handleFileUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFileUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCopy?: (text: string, type: "contact" | "amount") => void;
  onCopy?: (text: string, type: "contact" | "amount") => void;
  copiedType: "contact" | "amount" | null;
  isProcessing: boolean;
  feedbackMessage: { type: "success" | "error"; text: string } | null;
  getOrderAmount: (item: RefundItem) => number;
  getCustomerName: (item: RefundItem) => string;
  onViewSlip?: (url: string) => void;
}

export default function ProcessRefundModal({
  selectedRefund,
  onClose,
  onSubmit,
  refundSlipUrl,
  setRefundSlipUrl,
  onRefundSlipUrlChange,
  handleFileUpload,
  onFileUpload,
  handleCopy,
  onCopy,
  copiedType,
  isProcessing: parentProcessing,
  feedbackMessage,
  getOrderAmount,
  getCustomerName,
  onViewSlip,
}: ProcessRefundModalProps) {
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";
  const API_URL = rawApiUrl.replace(/\/+$/, "");

  const triggerCopy = onCopy || handleCopy;
  const triggerFileUpload = onFileUpload || handleFileUpload;
  const triggerUrlChange = (url: string) => {
    if (setRefundSlipUrl) setRefundSlipUrl(url);
    if (onRefundSlipUrlChange) onRefundSlipUrlChange(url);
  };

  // ดึงสลิปเดิมของลูกค้า
  const originalSlip =
    selectedRefund.original_slip_url ||
    (Array.isArray(selectedRefund.payment)
      ? selectedRefund.payment[0]?.slip_url
      : selectedRefund.payment?.slip_url);

  const handleRejectSubmit = async () => {
    try {
      setRejecting(true);
      const res = await fetch(`${API_URL}/refunds/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: selectedRefund.id,
          reason: rejectReason.trim() || "ไม่พบหลักฐานการชำระเงินเดิม",
        }),
      });

      if (!res.ok) throw new Error("Failed to reject refund");

      console.log("Refund rejected successfully");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Error rejecting refund:", err);
    } finally {
      setRejecting(false);
    }
  };

  const isProcessing = parentProcessing || rejecting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 font-sans overflow-hidden">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {isRejectMode ? "ปฏิเสธการโอนเงินคืน" : "ยืนยันการโอนเงินคืน"}
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
          {/* แถบคำแนะนำการโอนคืน */}
          <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 font-medium">
            <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-tight">โปรดโอนเงินคืนเข้า PromptPay / บัญชีเดิมตามสลิปชำระเงินของลูกค้า</span>
          </div>

          {/* รายละเอียดคำขอคืนเงิน */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-semibold text-slate-800 text-xs sm:text-sm">รายละเอียดคำขอคืนเงิน</span>
              {originalSlip && onViewSlip && (
                <button
                  type="button"
                  onClick={() => onViewSlip(originalSlip)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-100/60 hover:bg-blue-100 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  เปิดดูสลิปเดิม
                </button>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">เลขที่ออเดอร์:</span>
              <span className="font-bold text-slate-900">
                #{selectedRefund.order_no || selectedRefund.id.slice(0, 8)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">ชื่อลูกค้า:</span>
              <span className="font-medium text-slate-800 truncate max-w-[180px] text-right">
                {getCustomerName(selectedRefund)}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-500 shrink-0">ติดต่อ:</span>
              <div className="flex items-center gap-1.5 min-w-0 justify-end">
                <span className="font-mono text-slate-800 truncate text-[11px]">
                  {selectedRefund.customer?.contact || "-"}
                </span>
                {selectedRefund.customer?.contact && triggerCopy && (
                  <button
                    type="button"
                    onClick={() =>
                      triggerCopy(
                        selectedRefund.customer?.contact || "",
                        "contact"
                      )
                    }
                    className="px-2 py-0.5 text-[10px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-all cursor-pointer shrink-0"
                  >
                    {copiedType === "contact" ? "คัดลอกแล้ว!" : "คัดลอก"}
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="text-slate-700 font-semibold text-xs sm:text-sm">
                ยอดเงินที่ต้องคืน:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-emerald-600">
                  ฿{getOrderAmount(selectedRefund).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
                {triggerCopy && (
                  <button
                    type="button"
                    onClick={() =>
                      triggerCopy(
                        getOrderAmount(selectedRefund).toString(),
                        "amount"
                      )
                    }
                    className="px-2 py-0.5 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 rounded-md transition-all cursor-pointer shrink-0"
                  >
                    {copiedType === "amount" ? "คัดลอกแล้ว!" : "คัดลอกยอด"}
                  </button>
                )}
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

          {isRejectMode ? (
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-rose-800">
                  ระบุเหตุผลในการปฏิเสธการคืนเงิน:
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="เช่น ไม่พบหลักฐานสลิปการชำระเงินเดิม / ยอดเงินชำระไม่สมบูรณ์"
                  className="w-full px-3 py-2 border border-rose-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejectMode(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors font-medium"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleRejectSubmit}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition-all shadow-xs"
                >
                  {isProcessing ? "กำลังบันทึก..." : "ยืนยันปฏิเสธการคืนเงิน"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  แนบไฟล์สลิปการโอนเงินคืน (รูปภาพ)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={triggerFileUpload}
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
                  value={refundSlipUrl}
                  onChange={(e) => triggerUrlChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* พรีวิวสลิปโอนคืน */}
              {refundSlipUrl && (
                <div className="p-2 border border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-500 font-medium mb-1">พรีวิวสลิปโอนคืน:</p>
                  <img
                    src={refundSlipUrl}
                    alt="Refund Slip Preview"
                    className="max-h-32 sm:max-h-36 mx-auto object-contain rounded-lg border border-slate-200"
                  />
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejectMode(true)}
                  className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-center"
                >
                  ปฏิเสธคืนเงิน
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
                    disabled={isProcessing || !refundSlipUrl}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-all shadow-xs text-center whitespace-nowrap"
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