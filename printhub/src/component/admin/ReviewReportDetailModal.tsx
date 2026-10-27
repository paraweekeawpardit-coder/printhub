"use client";

import { useState } from "react";
import { Clock, MessageSquare } from "lucide-react";

export interface ReviewReportDetailItem {
  id: string;
  shop_name?: string;
  customer_name?: string;
  customer_id?: string;
  shop_id?: string;
  print_shop_id?: string;
  customer?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
  };
  shop?: {
    id?: string;
    shop_name?: string;
  };
  print_shop?: {
    id?: string;
    shop_name?: string;
  };
  order_id?: string;
  description?: string;
  review_comment?: string;
  comment?: string;
  review_text?: string;
  review?: {
    comment?: string;
    score?: number;
  };
  review_rating?: number;
  image_url?: string | null;
  status?: string;
  created_at?: string;
  admin_note?: string;
  open_time?: string | null;
  close_time?: string | null;
  appointment_time?: string | null;
  order_date?: string | null;
}

interface ReviewReportDetailModalProps {
  report: ReviewReportDetailItem | null;
  onClose: () => void;
  onAcceptReport?: (id: string) => void;
  onResolve: (
    reportId: string,
    decision: "hide_review" | "rejected",
    adminNote: string
  ) => void;
  onOpenChat?: (targetType: "customer" | "shop", targetId?: string) => void;
}

export default function ReviewReportDetailModal({
  report,
  onClose,
  onAcceptReport,
  onResolve,
  onOpenChat,
}: ReviewReportDetailModalProps) {
  const [decision, setDecision] = useState<"hide_review" | "rejected">("hide_review");
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const displayReviewComment =
    report.review_comment ||
    report.comment ||
    report.review_text ||
    report.review?.comment;

  const isPending = !report.status || report.status === "pending";
  const isResolved =
    report.status === "resolved_refund" ||
    report.status === "resolved_payout" ||
    report.status === "resolved" ||
    report.status === "rejected";

  // 🟢 คำนวณหา ID ของร้านค้าและลูกค้าแบบยืดหยุ่น ป้องกันค่า undefined
  const targetShopId =
    report.shop_id ||
    report.print_shop_id ||
    report.shop?.id ||
    report.print_shop?.id;

  const targetCustomerId =
    report.customer_id ||
    report.customer?.id;

  const handleAccept = async () => {
    if (onAcceptReport) {
      setIsSubmitting(true);
      await onAcceptReport(report.id);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!adminNote.trim()) return;
    setIsSubmitting(true);
    await onResolve(report.id, decision, adminNote);
    setIsSubmitting(false);
  };

  const formatTimeOnly = (timeStr?: string | null) => {
    if (!timeStr) return "-";
    return timeStr.slice(0, 5);
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("th-TH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-hidden font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Modal Header */}
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* ข้อมูลผู้เกี่ยวข้อง */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px] sm:text-xs">ร้านค้าผู้แจ้งรายงาน</span>
                {onOpenChat && (
                  <button
                    onClick={() => onOpenChat("shop", targetShopId)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    แชตกับร้าน
                  </button>
                )}
              </div>
              <span className="font-semibold text-slate-800 block">{report.shop_name || "-"}</span>
              <span className="text-[11px] text-slate-500 block">
                เวลาทำการ: {formatTimeOnly(report.open_time)} - {formatTimeOnly(report.close_time)} น.
              </span>
            </div>

            <div className="border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px] sm:text-xs">ลูกค้าเจ้าของรีวิว</span>
                {onOpenChat && (
                  <button
                    onClick={() => onOpenChat("customer", targetCustomerId)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium hover:underline cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    แชตกับลูกค้า
                  </button>
                )}
              </div>
              <span className="font-semibold text-slate-800 block">{report.customer_name || "-"}</span>
              <span className="text-[11px] text-slate-500 block">
                นัดรับสินค้า: {formatDateTime(report.appointment_time)}
              </span>
            </div>
          </div>

          {/* ข้อมูลเวลาระบบ */}
          <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
            <Clock size={16} className="text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-1 w-full">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                ข้อมูลเวลาระบบ
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>เวลาปิดร้านค้า: <span className="font-semibold text-slate-900">{formatTimeOnly(report.close_time)} น.</span></div>
                <div>เวลานัดรับสินค้า: <span className="font-semibold text-slate-900">{formatDateTime(report.appointment_time)}</span></div>
              </div>
            </div>
          </div>

          {/* ข้อความรีวิวของลูกค้า */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 sm:p-4">
            <h4 className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              ข้อความรีวิวของลูกค้า
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-amber-100 italic leading-relaxed break-words">
              "{displayReviewComment || "ไม่มีข้อความรีวิว (ให้เฉพาะดาว)"}"
            </p>
          </div>

          {/* เหตุผลการรายงาน */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 sm:p-4">
            <h4 className="text-[11px] sm:text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              เหตุผลที่ร้านค้าขอให้ซ่อนรีวิว
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed break-words">
              {report.description || "-"}
            </p>
          </div>

          {/* การลงคำตัดสิน */}
          {isPending ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-3">
              <div className="text-amber-800 font-semibold text-xs sm:text-sm">
                ⚠️ รายงานนี้ยังอยู่ในสถานะ "รอดำเนินการ" กรุณากดรับเรื่องพิจารณาก่อนจึงจะสามารถลงคำตัดสินได้
              </div>
              <button
                disabled={isSubmitting}
                onClick={handleAccept}
                className="px-5 py-2 text-xs sm:text-sm font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-xl transition-all cursor-pointer"
              >
                {isSubmitting ? "กำลังรับเรื่อง..." : "รับเรื่องพิจารณา"}
              </button>
            </div>
          ) : isResolved ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                คำตัดสินของแอดมิน
              </h4>
              <p className="text-xs sm:text-sm text-slate-700">
                สถานะ: <span className="font-bold">{report.status === "rejected" ? "ปฏิเสธคำร้อง" : "อนุมัติคำร้อง (ซ่อนรีวิว)"}</span>
              </p>
              {report.admin_note && (
                <p className="text-xs sm:text-sm text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                  หมายเหตุ: {report.admin_note}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                การตัดสินของแอดมิน (Admin Decision)
              </h4>
              
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer text-rose-600">
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "hide_review"}
                    onChange={() => setDecision("hide_review")}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-rose-600 shrink-0"
                  />
                  <span>ซ่อนรีวิวนี้ (อนุมัติคำร้อง)</span>
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
                  หมายเหตุการตัดสิน * <span className="text-rose-500">(ระบุเหตุผลคำตัดสิน)</span>
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="เช่น ตรวจสอบจากเวลาปิดทำการร้านค้าพบว่าลูกค้านัดรับนอกเวลาทำการจริง ดำเนินการซ่อนรีวิวเรียบร้อย..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors text-center cursor-pointer"
          >
            ปิด
          </button>
          {!isPending && !isResolved && (
            <button
              disabled={!adminNote.trim() || isSubmitting}
              onClick={handleSubmit}
              className="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all text-center cursor-pointer"
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการตัดสิน"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}