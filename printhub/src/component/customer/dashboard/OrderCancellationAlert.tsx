"use client";

import React from "react";
import { AlertTriangle, Ban, CheckCircle2, XCircle } from "lucide-react";

interface OrderCancellationAlertProps {
  isCanceled: boolean;
  hasPaidSlip?: boolean;
  paymentStatus?: string | null;
  refundSlipUrl?: string | null;
  isTimeoutCancelled?: boolean;
}

export default function OrderCancellationAlert({
  isCanceled,
  hasPaidSlip = false,
  paymentStatus,
  refundSlipUrl,
  isTimeoutCancelled = false,
}: OrderCancellationAlertProps) {
  if (!isCanceled) return null;

  const status = String(paymentStatus || "").toLowerCase().trim();
  const hasRefundSlip = Boolean(
    refundSlipUrl && 
    String(refundSlipUrl).trim() !== "" && 
    refundSlipUrl !== "null" && 
    refundSlipUrl !== "NULL"
  );

  // 🟢 1. คืนเงินสำเร็จแล้ว (status เป็น refunded หรือมี refund_slip_url)
  if (status === "refunded" || hasRefundSlip) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2 mt-1 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">ระบบได้ดำเนินการคืนเงินเรียบร้อยแล้ว</span>
        </div>
        {hasRefundSlip && (
          <a
            href={refundSlipUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-100 px-2.5 py-1 rounded-lg text-[11px] transition shrink-0 cursor-pointer shadow-2xs"
          >
            ดูสลิปคืนเงิน
          </a>
        )}
      </div>
    );
  }

  // 🔴 2. ปฏิเสธการคืนเงิน (สลิปปลอม)
  if (status === "rejected") {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2 mt-1 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="leading-relaxed">
            คำสั่งซื้อถูกยกเลิก และไม่ผ่านการอนุมัติคืนเงิน เนื่องจากหลักฐานการชำระเงินไม่ถูกต้อง
          </span>
        </div>
        <span className="font-bold text-rose-800 shrink-0 text-[10px] sm:text-[11px] bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md">
          ปฏิเสธคืนเงิน
        </span>
      </div>
    );
  }

  // 🟡 3. จ่ายเงินแล้ว กำลังรอแอดมินตรวจสอบเพื่อคืนเงิน (กดยกเลิกตอนสถานะรอดำเนินงาน หรือเลยเวลานัดรับ)
  if (hasPaidSlip || status === "paid" || status === "pending_payout") {
    return (
      <div className="bg-amber-50 border border-amber-200/90 text-amber-900 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="leading-relaxed">
            คุณได้ทำการยกเลิกคำสั่งซื้อนี้เรียบร้อยแล้ว ระบบกำลังดำเนินการตรวจสอบเพื่อคืนเงินภายใน 48 ชั่วโมง
          </span>
        </div>
        <span className="font-bold text-amber-800 shrink-0 text-[10px] sm:text-[11px] bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-md">
          รอตรวจสอบ
        </span>
      </div>
    );
  }

  // ⚪ 4. ยกเลิกตอนยังไม่จ่ายเงิน
  return (
    <div className="bg-slate-50 border border-slate-200 text-slate-600 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 mt-1">
      <div className="flex items-center gap-2 min-w-0">
        <Ban className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          {isTimeoutCancelled
            ? "คำสั่งซื้อนี้ถูกยกเลิกอัตโนมัติ เนื่องจากไม่ได้ชำระเงินภายในเวลาที่กำหนด"
            : "คุณได้ทำการยกเลิกคำสั่งซื้อนี้เรียบร้อยแล้ว"}
        </span>
      </div>
      <span className="text-[10px] sm:text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
        ยกเลิกแล้ว
      </span>
    </div>
  );
}