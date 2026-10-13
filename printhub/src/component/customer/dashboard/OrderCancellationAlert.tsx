/**
 * Component: OrderCancellationAlert
 * Path: src/component/customer/dashboard/OrderCancellationAlert.tsx
 * หน้าที่: แสดงกล่องแจ้งเตือนเมื่อคำสั่งซื้อถูกยกเลิก แยกตามสาเหตุ (cancel_reason) และสถานะการคืนเงิน
 *
 * cancel_reason ที่รองรับ
 *  - customer_unpaid      ลูกค้ากดยกเลิกเอง ตอนยังไม่ได้ชำระเงิน          → ไม่มีการคืนเงิน (เทา)
 *  - payment_timeout      ระบบยกเลิกอัตโนมัติ เพราะไม่ชำระเงินภายในเวลา    → ไม่มีการคืนเงิน (เทา)
 *  - customer_paid        ลูกค้ากดยกเลิกเอง หลังแนบสลิปแล้ว (รอการดำเนินงาน) → เข้าขั้นตอนคืนเงิน
 *  - appointment_timeout  ระบบยกเลิกอัตโนมัติ เพราะเลยเวลานัดรับ           → เข้าขั้นตอนคืนเงิน
 *
 * สถานะการคืนเงิน (ใช้กับ 2 กรณีหลัง)
 *  - มี refund_slip_url หรือ payment.status = "refunded"  → เขียว: คืนเงินแล้ว
 *  - payment.status = "refund_rejected"                  → แดง: ไม่คืนเงิน (สลิปไม่ถูกต้อง)
 *  - อื่น ๆ                                               → เหลือง: กำลังตรวจสอบ คืนภายใน 24 ชม.
 */

"use client";

import React from "react";
import { Ban, Clock, CheckCircle2, XCircle, Receipt } from "lucide-react";

export type CancelReason =
  | "customer_unpaid"
  | "payment_timeout"
  | "customer_paid"
  | "appointment_timeout";

const KNOWN_REASONS: CancelReason[] = [
  "customer_unpaid",
  "payment_timeout",
  "customer_paid",
  "appointment_timeout",
];

const REFUND_REASONS: CancelReason[] = ["customer_paid", "appointment_timeout"];

type Tone = "gray" | "yellow" | "green" | "red";

const TONE_STYLE: Record<Tone, { box: string; icon: string; title: string; desc: string }> = {
  gray: {
    box: "bg-slate-50 border-slate-200",
    icon: "text-slate-400",
    title: "text-slate-700",
    desc: "text-slate-500",
  },
  yellow: {
    box: "bg-amber-50 border-amber-200",
    icon: "text-amber-500",
    title: "text-amber-800",
    desc: "text-amber-700",
  },
  green: {
    box: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-500",
    title: "text-emerald-800",
    desc: "text-emerald-700",
  },
  red: {
    box: "bg-rose-50 border-rose-200",
    icon: "text-rose-500",
    title: "text-rose-700",
    desc: "text-rose-600",
  },
};

interface OrderCancellationAlertProps {
  isCanceled: boolean;
  cancelReason?: string | null;
  hasPaidSlip: boolean;
  paymentStatus?: string;
  refundSlipUrl?: string | null;
}

export default function OrderCancellationAlert({
  isCanceled,
  cancelReason,
  hasPaidSlip,
  paymentStatus = "",
  refundSlipUrl,
}: OrderCancellationAlertProps) {
  if (!isCanceled) return null;

  const reason = KNOWN_REASONS.includes(cancelReason as CancelReason)
    ? (cancelReason as CancelReason)
    : null;

  const isRefunded = Boolean(refundSlipUrl) || paymentStatus === "refunded";
  const isRefundRejected = paymentStatus === "refund_rejected";

  // ข้อมูลเก่าที่ยังไม่มี cancel_reason: ดูจากว่ามีการชำระเงินที่ถูกต้องหรือมีประวัติคืนเงินหรือไม่
  const needsRefund = reason
    ? REFUND_REASONS.includes(reason)
    : hasPaidSlip || isRefunded || isRefundRejected;

  let tone: Tone;
  let Icon = Ban;
  let title: string;
  let description: string;

  if (!needsRefund) {
    tone = "gray";
    if (reason === "customer_unpaid") {
      title = "คุณยกเลิกคำสั่งซื้อนี้แล้ว";
      description = "ยกเลิกก่อนชำระเงิน จึงไม่มีการเรียกเก็บเงินใด ๆ";
    } else {
      Icon = Clock;
      title = "คำสั่งซื้อถูกยกเลิกอัตโนมัติ";
      description = "เนื่องจากไม่ได้ชำระเงินภายในเวลาที่กำหนด";
    }
  } else {
    title =
      reason === "customer_paid"
        ? "คุณยกเลิกคำสั่งซื้อหลังชำระเงินแล้ว"
        : reason === "appointment_timeout"
        ? "คำสั่งซื้อถูกยกเลิกอัตโนมัติ เนื่องจากร้านดำเนินการไม่ทันเวลานัดรับ"
        : "คำสั่งซื้อถูกยกเลิก";

    if (isRefunded) {
      tone = "green";
      Icon = CheckCircle2;
      description = "ระบบได้ดำเนินการคืนเงินให้คุณเรียบร้อยแล้ว";
    } else if (isRefundRejected) {
      tone = "red";
      Icon = XCircle;
      description = "ไม่สามารถคืนเงินได้ เนื่องจากหลักฐานการชำระเงินไม่ถูกต้อง";
    } else {
      tone = "yellow";
      Icon = Clock;
      description = "ระบบกำลังตรวจสอบหลักฐานการชำระเงิน และจะคืนเงินให้ภายใน 24 ชั่วโมง";
    }
  }

  const style = TONE_STYLE[tone];

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-2xl border ${style.box}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.icon}`} />
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className={`text-xs font-bold ${style.title}`}>{title}</p>
        <p className={`text-[11px] leading-relaxed ${style.desc}`}>{description}</p>

        {tone === "green" && refundSlipUrl && (
          <a
            href={refundSlipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold rounded-xl transition"
          >
            <Receipt className="w-3.5 h-3.5" />
            ดูสลิปคืนเงิน
          </a>
        )}
      </div>
    </div>
  );
}