/**
 * Component: CustomerReportCard
 * หน้าที่: แสดงการ์ดประวัติข้อร้องเรียน / คำขอคืนเงิน แต่ละรายการ
 * ประกอบด้วย หมายเลขคำสั่งซื้อ, ป้ายสถานะการตัดสินของแอดมิน, รายละเอียดปัญหาที่แจ้ง, และวันที่ยื่นเรื่อง
 */

"use client";

import React from "react";

interface CustomerReportCardProps {
  report: any;
}

export default function CustomerReportCard({ report }: CustomerReportCardProps) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-800">
          คำขอคืนเงิน / ข้อร้องเรียนออเดอร์ #{report.order?.order_no || report.order_id?.slice(0, 8)}
        </span>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${
            report.is_verified
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {report.is_verified ? "แอดมินตัดสินแล้ว" : "อยู่ระหว่างตรวจสอบข้อพิพาท"}
        </span>
      </div>

      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
        &ldquo;{report.description}&rdquo;
      </p>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>ร้านค้า: {report.shop?.shop_name || "ไม่ระบุ"}</span>
        <span>ยื่นคำขอเมื่อ: {new Date(report.created_at).toLocaleDateString("th-TH")}</span>
      </div>
    </div>
  );
}