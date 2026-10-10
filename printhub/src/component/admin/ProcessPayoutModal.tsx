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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900">
            {showRejectBox ? "ปฏิเสธ / ระงับการโอนเงินให้ร้านค้า" : "ยืนยันการโอนเงินให้ร้านค้า"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
          <p className="font-semibold text-slate-800 text-sm border-b border-slate-200 pb-2">
            ข้อมูลบัญชีธนาคารร้านค้า
          </p>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">ชื่อร้านค้า:</span>
            <span className="font-medium text-slate-800">{getShopName(selectedPayout)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">ธนาคาร:</span>
            <span className="font-semibold text-slate-800">{bankAccount?.bank_name || "ไม่ระบุ"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">ชื่อบัญชี:</span>
            <span className="font-medium text-slate-800">{bankAccount?.account_name || "-"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">เลขที่บัญชี:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-slate-800 font-bold">{bankAccount?.account_number || "-"}</span>
              {bankAccount?.account_number && (
                <button
                  type="button"
                  onClick={() => onCopy(bankAccount.account_number, "account")}
                  className="px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-all cursor-pointer"
                >
                  {copiedType === "account" ? "คัดลอกแล้ว!" : "คัดลอก"}
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-slate-700 font-semibold text-sm">ยอดเงินโอน:</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-emerald-600">
                ฿{getPayoutAmount(selectedPayout).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => onCopy(getPayoutAmount(selectedPayout).toString(), "amount")}
                className="px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200 rounded-md transition-all cursor-pointer"
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
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold text-rose-800">
              ระบุเหตุผลในการปฏิเสธ / ชะลอการโอนเงิน:
            </label>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="เช่น มีรายงานปัญหาจากลูกค้าอยู่ระหว่างตรวจสอบ / งานผิดสเปก"
              className="w-full px-3 py-2 border border-rose-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRejectBox(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRejectPayout}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
              >
                {isProcessing ? "กำลังบันทึก..." : "ยืนยันปฏิเสธ"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                แนบไฟล์สลิปการโอนเงิน (รูปภาพ)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRejectBox(true)}
                className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                ปฏิเสธการโอน
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !payoutSlipUrl}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                >
                  {isProcessing ? "กำลังบันทึก..." : "ยืนยันโอนเงินเรียบร้อย"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}