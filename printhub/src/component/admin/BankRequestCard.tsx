"use client";

import React from "react";
import { Check, X, ArrowRight } from "lucide-react";

export interface BankChangeRequest {
  id: string;
  shop_id: string;
  shop_name: string;
  logo_url?: string;
  shopLogo?: string;
  created_at?: string;
  createdAt?: string;
  requested_at?: string;
  updated_at?: string;
  old_account?: {
    bank_name?: string;
    account_number?: string;
    account_name?: string;
  };
  new_account?: {
    bank_name?: string;
    account_number?: string;
    account_name?: string;
  };
}

interface BankRequestCardProps {
  request: BankChangeRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Helper ฟังก์ชันแปลง Path รูปภาพให้เป็น Absolute URL ที่ถูกต้อง
const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  return `${BACKEND_URL}/${cleanPath}`;
};

export default function BankRequestCard({
  request,
  onApprove,
  onReject,
}: BankRequestCardProps) {
  const shopName = request?.shop_name || "ไม่ระบุชื่อร้าน";
  const rawLogo = request?.logo_url || request?.shopLogo;
  const logoSrc = getImageUrl(rawLogo);

  // ดึงค่าวันที่โดยรองรับหลายชื่อ field
  const rawDate =
    request?.created_at ||
    request?.createdAt ||
    request?.requested_at ||
    request?.updated_at;

  // แปลงรูปแบบวันที่เป็นภาษาไทย (บังคับ Timezone เป็น Asia/Bangkok)
  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "-") return "-";

    const safeDateStr =
      typeof dateStr === "string" &&
      !dateStr.endsWith("Z") &&
      !dateStr.includes("+")
        ? `${dateStr}Z`
        : dateStr;

    const date = new Date(safeDateStr);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleApprove = () => {
    console.log(`Approving bank request ID: ${request?.id}`);
    onApprove(request?.id);
  };

  const handleReject = () => {
    console.log(`Rejecting bank request ID: ${request?.id}`);
    onReject(request?.id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={shopName}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
              {shopName.charAt(0) || "S"}
            </div>
          )}
          <h4 className="m-0 text-lg font-semibold text-slate-800">
            {shopName}
          </h4>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
          ยื่นเมื่อ: {formatDate(rawDate)}
        </span>
      </div>

      {/* Comparison Box */}
      <div className="flex items-center bg-slate-50 rounded-xl p-4 gap-4 mb-4">
        {/* บัญชีเดิม */}
        <div className="flex-1">
          <h5 className="m-0 mb-2 text-xs text-slate-500 font-semibold">
            บัญชีเดิม
          </h5>
          <p className="my-1 text-sm text-slate-700">
            <strong>ธนาคาร:</strong> {request?.old_account?.bank_name || "-"}
          </p>
          <p className="my-1 text-sm text-slate-700">
            <strong>เลขบัญชี:</strong>{" "}
            {request?.old_account?.account_number || "-"}
          </p>
          <p className="my-1 text-sm text-slate-700">
            <strong>ชื่อบัญชี:</strong> {request?.old_account?.account_name || "-"}
          </p>
        </div>

        {/* ลูกศรคั่น */}
        <div className="flex items-center justify-center text-slate-400">
          <ArrowRight size={20} />
        </div>

        {/* บัญชีใหม่ */}
        <div className="flex-1">
          <h5 className="m-0 mb-2 text-xs text-sky-600 font-semibold">
            บัญชีใหม่ที่ขอเปลี่ยน
          </h5>
          <p className="my-1 text-sm text-slate-700">
            <strong>ธนาคาร:</strong> {request?.new_account?.bank_name || "-"}
          </p>
          <p className="my-1 text-sm text-slate-700">
            <strong>เลขบัญชี:</strong>{" "}
            {request?.new_account?.account_number || "-"}
          </p>
          <p className="my-1 text-sm text-slate-700">
            <strong>ชื่อบัญชี:</strong> {request?.new_account?.account_name || "-"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleApprove}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-4 py-2 rounded-lg font-semibold cursor-pointer flex items-center gap-1.5 text-sm transition-colors"
        >
          <Check size={16} />
          <span>อนุมัติเปลี่ยนบัญชี</span>
        </button>
        <button
          onClick={handleReject}
          className="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 rounded-lg font-semibold cursor-pointer flex items-center gap-1.5 text-sm transition-colors"
        >
          <X size={16} />
          <span>ปฏิเสธ</span>
        </button>
      </div>
    </div>
  );
}