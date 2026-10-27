"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { FileText, ExternalLink, Upload, X, Image as ImageIcon, AlertCircle, Ban } from "lucide-react";
import supabase from "@/config/supabase";

const ISSUE_TYPE_MAP: Record<string, string> = {
  damaged: "งานพิมพ์ชำรุด / ยับ / เป็นรอย",
  color_mismatch: "สีเพี้ยน / ไม่ตรงตามไฟล์งาน",
  wrong_size: "ชนิดกระดาษ / ขนาด ไม่ตรงตามที่สั่ง",
  incomplete: "ได้รับสินค้าไม่ครบตามจำนวน",
  delay: "จัดส่งล่าช้า",
  other: "อื่นๆ",
  "สีเพี้ยน / ไม่ตรงตามไฟล์งาน": "สีเพี้ยน / ไม่ตรงตามไฟล์งาน",
  "ชนิดกระดาษ / ขนาด ไม่ตรงตามที่สั่ง": "ชนิดกระดาษ / ขนาด ไม่ตรงตามที่สั่ง",
  "งานพิมพ์ชำรุด / ยับ / เป็นรอย": "งานพิมพ์ชำรุด / ยับ / เป็นรอย",
  "ได้รับสินค้าไม่ครบตามจำนวน": "ได้รับสินค้าไม่ครบตามจำนวน",
  "จัดส่งล่าช้า": "จัดส่งล่าช้า",
  "อื่นๆ": "อื่นๆ",
};

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface OrderItemDetail {
  id?: string;
  item_name?: string;
  quantity?: number;
  price?: number;
  unit_price?: number;
  details?: string;
  page_count?: number;
  file_url?: string | null;
}

export interface OrderFileDetail {
  id?: string;
  filename?: string;
  file_url?: string;
  file_size_mb?: number;
  page_count?: number;
}

export interface ReportDetailItem {
  id: string;
  order_id?: string;
  order_no?: string;
  order_id_display?: string;
  order_description?: string | null;
  customer_name?: string;
  customer_phone?: string;
  shop_name?: string;
  shop_phone?: string;
  issue_type?: string;
  category?: string;
  description?: string;
  image_url?: string | null;
  status?: string;
  created_at?: string;
  total_price?: number;
  admin_note?: string;
  admin_image_url?: string | null;
  order_items?: OrderItemDetail[];
  order_files?: OrderFileDetail[];
}

interface ReportDetailModalProps {
  report: ReportDetailItem | null;
  onClose: () => void;
  onAcceptReport?: (id: string) => Promise<void>;
  onResolve: (
    reportId: string,
    decision: "approved" | "rejected",
    adminNote: string,
    refundAmount: number,
    adminImageUrl?: string | null
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
  const [adminImageUrl, setAdminImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (report) {
      setAdminNote(report.admin_note || "");
      setAdminImageUrl(report.admin_image_url || "");
      setSelectedFile(null);
      setFileError(null);
    }
  }, [report]);

  if (!report) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    let formattedStr = dateString;
    if (formattedStr.includes("T") && !formattedStr.endsWith("Z") && !formattedStr.includes("+")) {
      formattedStr += "Z";
    }
    const d = new Date(formattedStr);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPrice = report.total_price || 0;
  const isNoteValid = adminNote.trim().length > 0;
  const isPending = !report.status || report.status === "pending";
  const isCancelled = report.status === "cancelled";
  const isResolved = report.status === "resolved_refund" || report.status === "rejected";

  const rawIssueKey = report.issue_type || report.category || "";
  const issueCategoryDisplay = ISSUE_TYPE_MAP[rawIssueKey] || rawIssueKey || "ไม่ระบุประเภทปัญหา";

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFileError("อนุญาตเฉพาะไฟล์รูปภาพ JPG, PNG, WEBP เท่านั้น");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setFileError(`ขนาดไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE_MB} MB (ไฟล์ของคุณ: ${fileSizeMB.toFixed(2)} MB)`);
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAdminImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (isCancelled || !isNoteValid || isPending || fileError) return;
    try {
      setIsSubmitting(true);
      let finalAdminImageUrl: string | null = report.admin_image_url || null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `admin_evidence_${report.id}_${Date.now()}.${fileExt}`;
        const filePath = `admin-evidence/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("reports")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          setFileError("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพหลักฐาน");
          setIsSubmitting(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("reports")
          .getPublicUrl(filePath);

        finalAdminImageUrl = publicUrlData.publicUrl;
      } else if (!adminImageUrl) {
        finalAdminImageUrl = null;
      }

      await onResolve(
        report.id,
        decision,
        adminNote,
        totalPrice,
        finalAdminImageUrl
      );
      onClose();
    } catch (err) {
      console.error("Resolve Report Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async () => {
    if (isCancelled || !onAcceptReport) return;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-hidden font-sans">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-4 sm:px-6 py-3.5 sm:py-4 text-white flex justify-between items-center shrink-0">
          <div className="pr-2">
            <h2 className="text-base sm:text-lg font-bold leading-snug">
              รายละเอียดรายงานปัญหาและการตัดสินเคส
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Ticket ID: {report.id} • ยื่นเรื่องเมื่อ: {formatDate(report.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base sm:text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* บล็อกส่วนที่ 1: ข้อมูลคำสั่งซื้อ (ซ้าย) & หลักฐานจากผู้แจ้ง (ขวา) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* ข้อมูลคำสั่งซื้อ */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm border-b border-slate-200 pb-2 flex justify-between items-center">
                <span>ข้อมูลคำสั่งซื้อ</span>
                <span
                  className={`text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    isCancelled
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : isPending
                      ? "bg-amber-100 text-amber-800"
                      : report.status === "investigating"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isCancelled
                    ? "ลูกค้ายกเลิกแล้ว"
                    : isPending
                    ? "รอดำเนินการ"
                    : report.status === "investigating"
                    ? "กำลังตรวจสอบ"
                    : report.status === "resolved_refund"
                    ? "อนุมัติคืนเงิน"
                    : "ปฏิเสธคำร้อง"}
                </span>
              </h3>

              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">หมายเลข Order:</span>
                  <span className="font-bold text-slate-900">{displayOrderNo}</span>
                </div>
                <div className="flex justify-between items-center">
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

            {/* หลักฐานรูปภาพจากผู้แจ้ง */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm border-b border-slate-200 pb-2">
                หลักฐานรูปภาพจากผู้แจ้งปัญหา
              </h3>

              {report.image_url ? (
                <div className="relative group rounded-lg overflow-hidden border border-slate-300 bg-black/5 flex items-center justify-center min-h-[120px] max-h-48">
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
                <div className="h-28 sm:h-36 flex items-center justify-center text-slate-400 text-xs bg-white rounded-lg border border-dashed border-slate-300">
                  ไม่มีรูปภาพหลักฐานแนบมา
                </div>
              )}
            </div>
          </div>

          {/* บล็อกส่วนที่ 2: รวมรายละเอียดการรายงาน + หมายเหตุสั่งซื้อ + สินค้า + ไฟล์งานต้นฉบับ */}
          <div className="bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm border-b border-slate-200 pb-2">
              รายละเอียดรายงานปัญหาและข้อมูลออเดอร์
            </h3>

            {/* 1. ประเภทและรายละเอียดปัญหาที่แจ้งเข้ามา */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-xl border border-amber-200 text-xs space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-amber-900">ประเภทปัญหา:</span>
                <span className="px-2.5 py-0.5 sm:py-1 rounded-md bg-amber-200/70 font-semibold text-amber-950 border border-amber-300/50">
                  {issueCategoryDisplay}
                </span>
              </div>
              <div>
                <p className="font-bold text-amber-900 mb-1">รายละเอียดปัญหาที่แจ้งเข้ามา:</p>
                <p className="text-amber-900 leading-relaxed font-medium bg-white/70 p-2.5 rounded-lg border border-amber-200/60 break-words">
                  {report.description || "ไม่ได้ระบุรายละเอียด"}
                </p>
              </div>
            </div>

            {/* 2. หมายเหตุสั่งซื้อเพิ่มเติมจากลูกค้า */}
            <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>หมายเหตุเพิ่มเติมจากการสั่งซื้อ (Order Note):</span>
              </p>
              <p className={`pl-5 font-medium leading-relaxed break-words ${report.order_description ? "text-slate-900" : "text-slate-400 italic"}`}>
                {report.order_description ? report.order_description : "ลูกค้าไม่ได้ใส่รายละเอียดส่วนนี้"}
              </p>
            </div>

            {/* 3. รายละเอียดสินค้า/งานพิมพ์ในคำสั่งซื้อ */}
            {report.order_items && report.order_items.length > 0 && (
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800 text-xs">
                  รายละเอียดสินค้า/งานพิมพ์ในคำสั่งซื้อ:
                </p>
                <div className="space-y-2">
                  {report.order_items.map((item, idx) => (
                    <div key={item.id || idx} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{item.item_name || `รายการที่ ${idx + 1}`}</p>
                        <p className="text-slate-600 text-[11px] break-words">
                          {item.details ? `รายละเอียดสเปก: ${item.details}` : "ไม่มีรายละเอียดเพิ่มเติม"}
                          {item.page_count && item.page_count > 1 ? ` (${item.page_count} หน้า)` : ""}
                        </p>
                      </div>
                      <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="font-semibold text-slate-700">จำนวน: {item.quantity || 1} ชุด</span>
                        <span className="font-bold text-slate-900">
                          {item.price && item.price > 0 
                            ? `฿${item.price.toLocaleString()}` 
                            : item.unit_price 
                            ? `฿${(item.unit_price * (item.quantity || 1)).toLocaleString()}` 
                            : "฿0"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ไฟล์งานต้นฉบับจากลูกค้า */}
            {report.order_files && report.order_files.length > 0 && (
              <div className="bg-blue-50/50 p-3 sm:p-3.5 rounded-xl border border-blue-200 text-xs space-y-2">
                <p className="font-bold text-blue-900 text-xs flex items-center gap-1.5 border-b border-blue-200/60 pb-1.5">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>ไฟล์งานต้นฉบับจากลูกค้า (สำหรับแอดมินตรวจสอบ):</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.order_files.map((file, idx) => (
                    <div key={file.id || idx} className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between gap-2">
                      <div className="truncate pr-1">
                        <p className="font-semibold text-slate-800 truncate text-[11px]">{file.filename}</p>
                        <p className="text-[10px] text-slate-400">
                          {file.file_size_mb ? `${file.file_size_mb} MB` : ""}
                          {file.page_count ? ` • ${file.page_count} หน้า` : ""}
                        </p>
                      </div>
                      {file.file_url && (
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                          เปิดไฟล์
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* บล็อกส่วนที่ 3: คำตัดสินของแอดมิน */}
          {isCancelled ? (
            /* 🔴 บล็อกเตือน: กรณีลูกค้ายกเลิกคำร้องไปแล้ว */
            <div className="bg-slate-100 p-4 sm:p-5 rounded-xl border border-slate-300 flex items-center gap-3">
              <Ban className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  รายงานปัญหานี้ถูกยกเลิกโดยลูกค้าแล้ว
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ลูกค้ายกเลิกคำร้องปัญหานี้ก่อนแอดมินทำการตัดสิน จึงไม่ต้องดำเนินการใดๆ เพิ่มเติม
                </p>
              </div>
            </div>
          ) : isPending ? (
            <div className="bg-amber-50 p-4 sm:p-5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  ยังไม่ได้กดรับเรื่องพิจารณา
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  กรุณากดรับเรื่องพิจารณาเพื่อเปลี่ยนสถานะเป็น "กำลังตรวจสอบ" และเริ่มนับเวลา 2 วันก่อนทำการตัดสินเคส
                </p>
              </div>
              {onAcceptReport && (
                <button
                  onClick={handleAccept}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap transition-all cursor-pointer text-center"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "กดรับเรื่องพิจารณา"}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm border-b border-slate-200 pb-2">
                คำตัดสินของแอดมิน (Admin Decision)
              </h3>

              {!isResolved ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-xs font-medium">
                    <label className="flex items-start sm:items-center gap-2 cursor-pointer text-emerald-700">
                      <input
                        type="radio"
                        name="decision"
                        value="approved"
                        checked={decision === "approved"}
                        onChange={() => setDecision("approved")}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 mt-0.5 sm:mt-0"
                      />
                      <span className="font-bold">อนุมัติคืนเงินเต็มจำนวน (ส่งไปยังรายการคืนเงิน)</span>
                    </label>

                    <label className="flex items-start sm:items-center gap-2 cursor-pointer text-rose-700">
                      <input
                        type="radio"
                        name="decision"
                        value="rejected"
                        checked={decision === "rejected"}
                        onChange={() => setDecision("rejected")}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-rose-600 mt-0.5 sm:mt-0"
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

                  {/* หมายเหตุการตัดสิน */}
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

                  {/* แนบรูปภาพหลักฐานการตัดสิน (Optional) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      รูปภาพหลักฐานการตัดสิน (ไม่จำเป็นต้องใส่)
                      <span className="block sm:inline text-slate-400 font-normal sm:ml-1">
                        (รองรับ JPG, PNG, WEBP ไม่เกิน 5MB / สูงสุด 1 รูป)
                      </span>
                    </label>

                    {adminImageUrl ? (
                      <div className="relative inline-block border border-slate-300 rounded-lg overflow-hidden bg-slate-100 max-w-xs">
                        <img
                          src={adminImageUrl}
                          alt="Admin Evidence Preview"
                          className="max-h-36 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAdminImageUrl("");
                            setSelectedFile(null);
                            setFileError(null);
                          }}
                          className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 hover:bg-rose-700 shadow-md transition-colors"
                          title="ลบรูปภาพ"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto justify-center sm:justify-start">
                          <Upload className="w-3.5 h-3.5 text-slate-500" />
                          <span>เลือกไฟล์รูปภาพหลักฐาน...</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">
                        * {fileError}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs space-y-3 text-slate-700">
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">
                      หมายเหตุการตัดสินที่บันทึกไว้:
                    </p>
                    <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 leading-relaxed break-words">
                      {report.admin_note || "ไม่ได้ระบุหมายเหตุ"}
                    </p>
                  </div>

                  {report.admin_image_url && (
                    <div>
                      <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        รูปภาพหลักฐานการตัดสิน:
                      </p>
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-w-xs bg-slate-100 p-1">
                        <img
                          src={report.admin_image_url}
                          alt="Admin Evidence"
                          className="max-h-40 object-contain rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
          >
            {isCancelled || isPending || isResolved ? "ปิดหน้าต่าง" : "ยกเลิก"}
          </button>
          {!isCancelled && !isPending && !isResolved && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isNoteValid || !!fileError}
              className={`w-full sm:w-auto px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer ${
                decision === "approved"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              } disabled:opacity-50 disabled:cursor-not-allowed text-center`}
            >
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการตัดสิน"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}