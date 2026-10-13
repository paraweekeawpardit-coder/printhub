/**
 * Component: CustomerReportCard
 * หน้าที่: แสดงการ์ดคำร้อง / คำขอคืนเงิน แต่ละรายการ พร้อมผลการพิจารณาของแอดมิน
 *
 * report.status
 *  - pending          รอแอดมินรับเรื่อง
 *  - investigating    แอดมินรับเรื่องแล้ว กำลังพิจารณา
 *  - resolved_refund  อนุมัติและโอนเงินคืนเต็มจำนวนแล้ว (สลิปจาก report.refund_slip_url หรือ payment.refund_slip_url)
 *  - rejected         ไม่อนุมัติ (ยอดเงินโอนให้ร้านค้า)
 */

"use client";

import React from "react";
import RefundSlipButton from "./RefundSlipButton";
import {
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  MessageSquareText,
} from "lucide-react";

interface CustomerReportCardProps {
  report: any;
}

type Tone = "amber" | "blue" | "green" | "rose";

const TONE: Record<Tone, { badge: string; box: string; icon: string; title: string; text: string }> = {
  amber: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    box: "bg-amber-50 border-amber-200",
    icon: "text-amber-500",
    title: "text-amber-800",
    text: "text-amber-700",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    box: "bg-blue-50 border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-800",
    text: "text-blue-700",
  },
  green: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    box: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-500",
    title: "text-emerald-800",
    text: "text-emerald-700",
  },
  rose: {
    badge: "bg-rose-50 text-rose-600 border-rose-200",
    box: "bg-rose-50 border-rose-200",
    icon: "text-rose-500",
    title: "text-rose-700",
    text: "text-rose-600",
  },
};

const formatThaiDate = (value?: string | null) => {
  if (!value) return "-";
  let cleaned = String(value).trim().replace(" ", "T");
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(cleaned)) cleaned += "Z"; // created_at / updated_at เก็บเป็น UTC
  const d = new Date(cleaned);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function CustomerReportCard({ report }: CustomerReportCardProps) {
  if (!report) return null;

  const status = String(report.status || (report.is_verified ? "resolved_refund" : "pending"))
    .toLowerCase()
    .trim();
  const refundSlipUrl: string | null = report.refund_slip_url || null;

  let tone: Tone;
  let Icon = Clock;
  let label: string;
  let title: string;
  let description: string;

  if (status === "investigating") {
    tone = "blue";
    Icon = Search;
    label = "กำลังพิจารณา";
    title = "แอดมินรับเรื่องแล้ว";
    description = "อยู่ระหว่างตรวจสอบหลักฐานจากคุณและร้านค้า";
  } else if (status === "resolved_refund") {
    tone = "green";
    Icon = CheckCircle2;
    label = "คืนเงินแล้ว";
    title = "คืนเงินเต็มจำนวนเรียบร้อยแล้ว";
    description = "แอดมินอนุมัติคำร้องและโอนเงินคืนให้คุณแล้ว";
  } else if (status === "rejected") {
    tone = "rose";
    Icon = XCircle;
    label = "ไม่อนุมัติ";
    title = "คำร้องไม่ได้รับการอนุมัติ";
    description = "แอดมินพิจารณาแล้ว ไม่สามารถคืนเงินสำหรับคำสั่งซื้อนี้ได้";
  } else {
    tone = "amber";
    Icon = Clock;
    label = "รอดำเนินการ";
    title = "ส่งคำร้องเรียบร้อยแล้ว";
    description = "รอแอดมินรับเรื่องเพื่อพิจารณา";
  }

  const style = TONE[tone];
  const orderNo = report.order?.order_no || report.order_id?.slice(0, 6) || "------";
  const isDecided = status === "resolved_refund" || status === "rejected";

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      {/* หัวการ์ด */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="min-w-0 truncate text-sm">
          <span className="font-extrabold text-slate-900">#ORD-{orderNo}</span>
          <span className="text-slate-300 mx-2">|</span>
          <span className="font-semibold text-slate-600">ร้าน {report.shop?.shop_name || "ไม่ระบุ"}</span>
        </p>
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${style.badge}`}>
          {label}
        </span>
      </div>

      {/* ผลการพิจารณา */}
      <div className={`flex items-start gap-2.5 p-3 rounded-2xl border ${style.box}`}>
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.icon}`} />
        <div className="flex-1 min-w-0 space-y-1">
          <p className={`text-xs font-bold ${style.title}`}>{title}</p>
          <p className={`text-[11px] leading-relaxed ${style.text}`}>{description}</p>

          {isDecided && report.admin_note && (
            <div className="mt-1.5 bg-white/70 border border-white rounded-xl p-2.5">
              <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-0.5">
                <MessageSquareText className="w-3 h-3" />
                เหตุผลจากแอดมิน
              </p>
              <p className="text-[11px] text-slate-700 whitespace-pre-line">{report.admin_note}</p>
            </div>
          )}

          {/* ปุ่มดูสลิปคืนเงินที่แอดมินส่งมา (report.refund_slip_url) */}
          {status === "resolved_refund" && (
            <div className="pt-1">
              {refundSlipUrl ? (
                <RefundSlipButton slipUrl={refundSlipUrl} />
              ) : (
                <span className="text-[11px] text-emerald-700/70">ยังไม่มีสลิปคืนเงินจากแอดมิน</span>
              )}
            </div>
          )}

          {isDecided && report.admin_image_url && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {isDecided && report.admin_image_url && (
                <a
                  href={report.admin_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 text-[11px] font-semibold rounded-xl transition"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  หลักฐานจากแอดมิน
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* รายละเอียดที่ลูกค้าแจ้ง */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400">ปัญหาที่คุณแจ้ง</p>
        <p className="text-xs text-slate-600 whitespace-pre-line">{report.description || "-"}</p>
        {report.image_url && (
          <a
            href={report.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            ดูรูปที่แนบ
          </a>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>ยื่นคำร้องเมื่อ {formatThaiDate(report.created_at)}</span>
        {isDecided && report.updated_at && <span>ตัดสินเมื่อ {formatThaiDate(report.updated_at)}</span>}
      </div>
    </div>
  );
}
