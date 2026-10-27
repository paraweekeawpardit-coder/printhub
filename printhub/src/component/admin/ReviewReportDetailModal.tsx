"use client";

import { useState } from "react";

export interface ReviewReportDetailItem {
  id: string;
  shop_name?: string;
  customer_name?: string;
  description?: string; // เหตุผลที่ร้านค้ารายงาน
  review_comment?: string; // ข้อความในรีวิว
  review_rating?: number; // คะแนนดาว 1-5
  image_url?: string | null;
  status?: string;
  created_at?: string;
}

interface ReviewReportDetailModalProps {
  report: ReviewReportDetailItem | null;
  onClose: () => void;
  onResolve: (
    reportId: string,
    decision: "hide_review" | "rejected",
    adminNote: string
  ) => void;
}

export default function ReviewReportDetailModal({
  report,
  onClose,
  onResolve,
}: ReviewReportDetailModalProps) {
  const [decision, setDecision] = useState<"hide_review" | "rejected">("hide_review");
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const handleSubmit = async () => {
    if (!adminNote.trim()) return;
    setIsSubmitting(true);
    await onResolve(report.id, decision, adminNote);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-hidden font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 px-4 sm:px-6 py-3.5 sm:py-4 text-white flex justify-between items-center shrink-0">
          <div className="pr-2">
            <h3 className="font-bold text-base sm:text-lg leading-snug">
              ตรวจสอบรายงานรีวิวไม่เหมาะสม
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              ID รายงาน: {report.id}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-base sm:text-xl font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* ข้อมูลคู่กรณี ( Responsive Grid ) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 text-[11px] sm:text-xs block mb-0.5">ร้านค้าผู้แจ้งรายงาน</span>
              <span className="font-semibold text-slate-800">{report.shop_name || "-"}</span>
            </div>
            <div className="border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
              <span className="text-slate-400 text-[11px] sm:text-xs block mb-0.5">ลูกค้าเจ้าของรีวิว</span>
              <span className="font-semibold text-slate-800">{report.customer_name || "-"}</span>
            </div>
          </div>

          {/* รายละเอียดรีวิวที่ถูกร้องเรียน */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 sm:p-4">
            <h4 className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              ข้อความรีวิวของลูกค้า
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-amber-100 italic leading-relaxed break-words">
              "{report.review_comment || "ไม่มีข้อความรีวิว (ให้เฉพาะดาว)"}"
            </p>
          </div>

          {/* เหตุผลที่ร้านค้ารายงานเข้ามา */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 sm:p-4">
            <h4 className="text-[11px] sm:text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              เหตุผลที่ร้านค้าขอให้ซ่อนรีวิว
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed break-words">
              {report.description || "-"}
            </p>
          </div>

          {/* ส่วนการตัดสินของแอดมิน */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              การตัดสินของแอดมิน (Admin Decision)
            </h4>
            
            {/* ตัวเลือกการตัดสิน (แนวตั้งบนมือถือ) */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer text-rose-600">
                <input
                  type="radio"
                  name="decision"
                  checked={decision === "hide_review"}
                  onChange={() => setDecision("hide_review")}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-rose-600 shrink-0"
                />
                <span>ซ่อน/ลบรีวิวนี้ออก (อนุมัติคำร้อง)</span>
              </label>

              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer text-slate-600">
                <input
                  type="radio"
                  name="decision"
                  checked={decision === "rejected"}
                  onChange={() => setDecision("rejected")}
                  className="w-4 h-4 text-slate-600 focus:ring-slate-500 accent-slate-600 shrink-0"
                />
                <span>ปฏิเสธคำร้อง (คงรีวิวไว้ตามเดิม)</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-medium text-slate-600 mb-1">
                หมายเหตุการตัดสิน * <span className="text-rose-500">(ระบุเหตุผลส่งให้ร้านค้า/ลูกค้าทราบ)</span>
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="เช่น ตรวจสอบพบคำหยาบคายจริง ดำเนินการซ่อนรีวิวเรียบร้อย..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Footer ( Responsive Buttons ) */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors text-center"
          >
            ยกเลิก
          </button>
          <button
            disabled={!adminNote.trim() || isSubmitting}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all text-center cursor-pointer"
          >
            {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการตัดสิน"}
          </button>
        </div>

      </div>
    </div>
  );
}