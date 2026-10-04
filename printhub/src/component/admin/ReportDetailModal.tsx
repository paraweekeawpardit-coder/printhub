"use client";

import { useState } from "react";

export interface ReportDetailItem {
  id: string;
  order_id: string;
  description: string;
  image_url?: string | null;
  is_verified?: boolean;
  status?: string; // 'pending' | 'approved' | 'rejected'
  created_at: string;
  orders?: {
    id: string;
    total_price: number;
    state: string;
    created_at: string;
    customer?: { id: string; name: string; email: string; phone?: string };
    shop?: { id: string; shop_name: string; email: string; phone?: string };
  };
}

interface ReportDetailModalProps {
  report: ReportDetailItem | null;
  onClose: () => void;
  onResolve: (
    reportId: string,
    decision: "approved" | "rejected",
    adminNote: string,
    refundAmount: number
  ) => Promise<void>;
}

export default function ReportDetailModal({
  report,
  onClose,
  onResolve,
}: ReportDetailModalProps) {
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [adminNote, setAdminNote] = useState("");
  const [refundAmount, setRefundAmount] = useState<number>(
    report?.orders?.total_price || 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onResolve(report.id, decision, adminNote, refundAmount);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              รายละเอียดรายงานปัญหา #{report.id.slice(0, 8)}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ยื่นเรื่องเมื่อ: {new Date(report.created_at).toLocaleString("th-TH")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Order & Customer Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <p className="font-semibold text-slate-700">ข้อมูลคำสั่งซื้อ</p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">Order ID:</span>{" "}
              {report.order_id}
            </p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">สถานะงาน:</span>{" "}
              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                {report.orders?.state || "รอตรวจสอบ"}
              </span>
            </p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">ยอดรวม:</span> ฿
              {report.orders?.total_price?.toLocaleString() || "0"}
            </p>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                ลูกค้า: {report.orders?.customer?.name || "-"} (
                {report.orders?.customer?.email || "-"})
              </p>
              <p className="text-xs text-slate-500">
                ร้านค้า: {report.orders?.shop?.shop_name || "-"}
              </p>
            </div>
          </div>

          {/* Evidence Image */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <p className="font-semibold text-slate-700 mb-2">หลักฐานจากผู้แจ้ง</p>
            {report.image_url ? (
              <a
                href={report.image_url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-lg border border-slate-300 hover:opacity-90"
              >
                <img
                  src={report.image_url}
                  alt="หลักฐาน"
                  className="w-full h-36 object-cover"
                />
              </a>
            ) : (
              <div className="h-36 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                ไม่มีภาพแนบ
              </div>
            )}
          </div>
        </div>

        {/* Issue Description */}
        <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl text-sm">
          <p className="font-semibold text-amber-900 mb-1">รายละเอียดปัญหาที่แจ้ง:</p>
          <p className="text-amber-800">{report.description}</p>
        </div>

        {/* Decision Form */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <p className="font-semibold text-slate-900 text-sm">
            การตัดสินของ Admin (Admin Action)
          </p>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
              <input
                type="radio"
                name="decision"
                value="approved"
                checked={decision === "approved"}
                onChange={() => setDecision("approved")}
                className="accent-emerald-600"
              />
              <span className="text-emerald-700">อนุมัติคืนเงิน (Approve Refund)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
              <input
                type="radio"
                name="decision"
                value="rejected"
                checked={decision === "rejected"}
                onChange={() => setDecision("rejected")}
                className="accent-rose-600"
              />
              <span className="text-rose-700">ปฏิเสธคำร้อง (Reject Claims)</span>
            </label>
          </div>

          {decision === "approved" && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                จำนวนเงินที่คืนให้ลูกค้า (บาท)
              </label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              หมายเหตุการตัดสิน (จะถูกส่งในระบบแจ้งเตือนให้ผู้ใช้ทราบ)
            </label>
            <textarea
              rows={2}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="ระบุเหตุผลในการตัดสินเคสนี้..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-100"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all ${
              decision === "approved"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            } disabled:opacity-50`}
          >
            {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการตัดสิน"}
          </button>
        </div>
      </div>
    </div>
  );
}