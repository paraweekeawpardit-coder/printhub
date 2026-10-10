"use client";

import { useState, useEffect } from "react";

export interface ReportDetailItem {
  id: string;
  order_id?: string;
  order_no?: string;
  order_id_display?: string;
  customer_name?: string;
  customer_phone?: string;
  shop_name?: string;
  shop_phone?: string;
  description?: string;
  image_url?: string | null;
  status?: string;
  created_at?: string;
  total_price?: number;
  admin_note?: string;
}

interface ReportDetailModalProps {
  report: ReportDetailItem | null;
  onClose: () => void;
  onAcceptReport?: (id: string) => Promise<void>;
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
  onAcceptReport,
  onResolve,
}: ReportDetailModalProps) {
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (report) {
      setAdminNote(report.admin_note || "");
    }
  }, [report]);

  if (!report) return null;

  const totalPrice = report.total_price || 0;
  const isNoteValid = adminNote.trim().length > 0;
  const isPending = !report.status || report.status === "pending";
  const isResolved = report.status === "resolved_refund" || report.status === "rejected";

  const handleSubmit = async () => {
    if (!isNoteValid || isPending) return;
    try {
      setIsSubmitting(true);
      await onResolve(report.id, decision, adminNote, totalPrice);
      onClose();
    } catch (err) {
      console.error("Resolve Report Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async () => {
    if (!onAcceptReport) return;
    try {
      setIsSubmitting(true);
      await onAcceptReport(report.id);
      onClose();
    } catch (err) {
      console.error("Accept Report Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayOrderNo =
    report.order_no ||
    report.order_id_display ||
    (report.order_id ? `#${report.order_id.slice(0, 8)}` : "-");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-bold">
              รายละเอียดรายงานปัญหาและการตัดสินเคส
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ticket ID: {report.id} • ยื่นเรื่องเมื่อ:{" "}
              {report.created_at
                ? new Date(report.created_at).toLocaleString("th-TH")
                : "-"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Content - Single Scroll Point */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: ข้อมูลคำสั่งซื้อ & หลักฐาน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 flex justify-between items-center">
                <span>ข้อมูลคำสั่งซื้อ</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    isPending
                      ? "bg-amber-100 text-amber-800"
                      : report.status === "investigating"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isPending
                    ? "รอดำเนินการ"
                    : report.status === "investigating"
                    ? "กำลังตรวจสอบ"
                    : report.status === "resolved_refund"
                    ? "อนุมัติคืนเงิน"
                    : "ปฏิเสธคำร้อง"}
                </span>
              </h3>

              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">หมายเลข Order:</span>
                  <span className="font-bold text-slate-900">{displayOrderNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ยอดรวมออเดอร์:</span>
                  <span className="font-bold text-emerald-600">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-slate-200 my-2 pt-2 space-y-1">
                  <p className="font-semibold text-slate-800">ผู้แจ้งเรื่อง (ลูกค้า):</p>
                  <p className="pl-2 font-medium text-slate-900">{report.customer_name || "-"}</p>
                </div>

                <div className="border-t border-slate-200 my-2 pt-2 space-y-1">
                  <p className="font-semibold text-slate-800">ร้านค้าคู่กรณี:</p>
                  <p className="pl-2 font-medium text-slate-900">{report.shop_name || "-"}</p>
                </div>
              </div>
            </div>

            {/* หลักฐานรูปภาพ */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                หลักฐานรูปภาพจากผู้แจ้ง
              </h3>

              {report.image_url ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-300 bg-black/5 flex items-center justify-center max-h-48">
                  <img
                    src={report.image_url}
                    alt="Evidence"
                    className="object-contain max-h-44 w-full transition-transform duration-200 group-hover:scale-105"
                  />
                  <a
                    href={report.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    เปิดดูรูปขนาดเต็ม
                  </a>
                </div>
              ) : (
                <div className="h-36 flex items-center justify-center text-slate-400 text-xs bg-white rounded-lg border border-dashed border-slate-300">
                  ไม่มีรูปภาพหลักฐานแนบมา
                </div>
              )}
            </div>
          </div>

          {/* Issue Details */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs">
            <p className="font-bold text-amber-900 mb-1">รายละเอียดปัญหาที่แจ้งเข้ามา:</p>
            <p className="text-amber-800 leading-relaxed font-medium">
              {report.description || "ไม่ได้ระบุรายละเอียด"}
            </p>
          </div>

          {/* Decision Section / Lock for Pending */}
          {isPending ? (
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  ยังไม่ได้กดรับเรื่องพิจารณา
                </h4>
                <p className="text-xs text-amber-700">
                  กรุณากดรับเรื่องพิจารณาเพื่อเปลี่ยนสถานะเป็น "กำลังตรวจสอบ" และเริ่มนับเวลา 2 วันก่อนทำการตัดสินเคส
                </p>
              </div>
              {onAcceptReport && (
                <button
                  onClick={handleAccept}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap transition-all"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "กดรับเรื่องพิจารณา"}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                คำตัดสินของแอดมิน (Admin Decision)
              </h3>

              {!isResolved ? (
                <>
                  <div className="flex flex-wrap gap-6 text-xs font-medium">
                    <label className="flex items-center gap-2 cursor-pointer text-emerald-700">
                      <input
                        type="radio"
                        name="decision"
                        value="approved"
                        checked={decision === "approved"}
                        onChange={() => setDecision("approved")}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span className="font-bold">อนุมัติคืนเงินเต็มจำนวน (ส่งไปยังรายการคืนเงิน)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-rose-700">
                      <input
                        type="radio"
                        name="decision"
                        value="rejected"
                        checked={decision === "rejected"}
                        onChange={() => setDecision("rejected")}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-rose-600"
                      />
                      <span className="font-bold">ปฏิเสธคำร้อง (ส่งยอดเข้าโอนเงินให้ร้าน)</span>
                    </label>
                  </div>

                  {decision === "approved" && (
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex justify-between items-center font-medium">
                      <span>ยอดเงินที่จะคืนให้ลูกค้าสุทธิ:</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        ฿{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      หมายเหตุการตัดสิน <span className="text-rose-500">* (จำเป็นต้องระบุทุกครั้ง)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="ระบุเหตุผลและคำอธิบายในการตัดสินเคสนี้..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                        !isNoteValid ? "border-rose-300 focus:ring-rose-400" : "border-slate-300 focus:ring-slate-400"
                      }`}
                    />
                    {!isNoteValid && (
                      <p className="text-[11px] text-rose-500 mt-1">
                        * กรุณากรอกหมายเหตุการตัดสินเพื่อให้ผู้ใช้รับทราบเหตุผล
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs space-y-2 text-slate-700">
                  <p className="font-semibold text-slate-900">
                    หมายเหตุการตัดสินที่บันทึกไว้:
                  </p>
                  <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800">
                    {report.admin_note || "ไม่ได้ระบุหมายเหตุ"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {isPending || isResolved ? "ปิดหน้าต่าง" : "ยกเลิก"}
          </button>
          {!isPending && !isResolved && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isNoteValid}
              className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                decision === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการตัดสิน"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}