"use client";

import React from "react";
import {
  X,
  Store,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Paperclip,
  AlertCircle,
} from "lucide-react";
import { ShopAppeal } from "@/app/admin/shops/page";

interface AppealDetailModalProps {
  appeal: ShopAppeal | null;
  onClose: () => void;
  onApprove?: (shopId: string | number) => void;
  onReject?: (appealId: string | number) => void;
}

export default function AppealDetailModal({
  appeal,
  onClose,
  onApprove,
  onReject,
}: AppealDetailModalProps) {
  if (!appeal) return null;

  const shopName = appeal.shop?.shop_name || `ร้านค้า ID: ${appeal.shop_id}`;
  const shopEmail = appeal.shop?.email || "-";
  const shopPhone = appeal.shop?.phone || "-";
  const suspendReason = appeal.shop?.suspend_reason || "-";

  // ดึงรายการไฟล์แนบแบบปลอดภัย
  const attachments = Array.isArray(appeal.attachment_urls)
    ? appeal.attachment_urls
    : Array.isArray((appeal as any)?.attachments)
    ? (appeal as any).attachments
    : [];

  // พาร์สวันที่ยื่นเรื่อง
  const formattedDate = new Date(appeal.created_at).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2.5 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="rounded-xl bg-sky-100 p-2 text-sky-600 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                รายละเอียดคำขอปลดระงับใช้งาน
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                ตรวจสอบข้อความและหลักฐานอุทธรณ์จากร้านค้า
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs sm:text-sm text-slate-700 flex-1">
          {/* ข้อมูลร้านค้า */}
          <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
              <Store size={18} className="text-sky-600 shrink-0" />
              <span className="truncate">{shopName}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">อีเมล: {shopEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">เบอร์โทร: {shopPhone}</span>
              </div>
            </div>
          </div>

          {/* เหตุผลที่ถูกระงับเดิม (ถ้ามี) */}
          {suspendReason && suspendReason !== "-" && (
            <div className="rounded-xl bg-rose-50 p-3.5 sm:p-4 border border-rose-200/60 text-xs text-rose-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertCircle size={15} className="shrink-0" />
                <span>สาเหตุที่ร้านค้าถูกระงับใช้งานเดิม:</span>
              </div>
              <p className="pl-5 leading-relaxed">{suspendReason}</p>
            </div>
          )}

          {/* รายละเอียดคำขออุทธรณ์ */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                เรื่องที่ยื่นอุทธรณ์
              </span>
              <p className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                {appeal.subject}
              </p>
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                รายละเอียด / ข้อความอุทธรณ์จากร้านค้า
              </span>
              <div className="mt-1 rounded-xl bg-slate-50 p-3.5 sm:p-4 text-xs text-slate-800 leading-relaxed border border-slate-200 whitespace-pre-line font-sans">
                {appeal.message || "ไม่ได้ระบุข้อความ"}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <Clock size={14} className="text-slate-400 shrink-0" />
              <span>วันที่ยื่นเรื่อง: {formattedDate}</span>
            </div>
          </div>

          {/* รูปภาพ/ไฟล์แนบอุทธรณ์ (ถ้ามี) */}
          {attachments.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
                <Paperclip size={14} className="text-slate-500 shrink-0" />
                <span>หลักฐานแนบ ({attachments.length} รายการ)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {attachments.map((url: string, idx: number) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 block"
                  >
                    <img
                      src={url}
                      alt={`attachment-${idx}`}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium">
                      เปิดดูรูปขนาดเต็ม
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between border-t border-slate-100 bg-slate-50 px-4 sm:px-6 py-3.5 sm:py-4 gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer text-center"
          >
            ปิดหน้าต่าง
          </button>

          {appeal.status === "pending" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {onReject && (
                <button
                  type="button"
                  onClick={() => {
                    onReject(appeal.id);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 border border-rose-200 transition cursor-pointer text-center"
                >
                  <ShieldAlert size={15} />
                  ปฏิเสธคำขอ
                </button>
              )}

              {onApprove && (
                <button
                  type="button"
                  onClick={() => {
                    onApprove(appeal.shop_id);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition cursor-pointer text-center whitespace-nowrap"
                >
                  <ShieldCheck size={15} />
                  อนุมัติปลดระงับร้านค้า
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}