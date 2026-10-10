/**
 * =========================================================================
 * Component: PaymentActionButton
 * -------------------------------------------------------------------------
 * หน้าที่การทำงาน:
 * 1. ตรวจสอบสถานะคำสั่งซื้อว่าเป็น "รอการชำระเงิน" หรือไม่
 * 2. คำนวณเวลานับถอยหลังจริงจาก expires_at แบบ Real-time (อัปเดตทุก 1 วินาที)
 * 3. หากยังไม่หมดเวลา: แสดงปุ่ม "ชำระเงิน" พร้อมเวลานับถอยหลัง (เช่น ชำระเงิน (08:45 น.))
 *    และเมื่อกดจะพาลูกค้าไปยังหน้าชำระเงิน (/customer/order/payment/[orderId])
 * 4. หากหมดเวลาแล้ว: สลับเป็นป้าย "หมดเวลาชำระเงิน" สีแดงอัตโนมัติทันที
 *    พร้อมทั้งเรียก Callback (onExpired) เพื่อให้อัปเดตสถานะในหน้า Dashboard/Orders
 * 5. นำไป Reusable ใช้ซ้ำได้ทั้งในหน้าคำสั่งซื้อของฉัน (/customer/orders) 
 *    และหน้าแดชบอร์ด (/customer/dashboard)
 * =========================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Clock, AlertCircle } from "lucide-react";

interface PaymentActionButtonProps {
  order: {
    id: string;
    expires_at?: string | null;
    order_date?: string | null;
    created_at?: string | null;
    total_price?: number;
    payment?: {
      is_verified?: boolean | null;
    } | null;
    status?: {
      state?: string;
    } | null;
    current_status?: {
      state?: string;
    } | null;
  };
  /** Callback ฟังก์ชันเสริมเมื่อหมดเวลา เผื่อต้องการสั่ง reload หน้าหรือยิง API อัปเดต */
  onExpired?: () => void;
}

export default function PaymentActionButton({
  order,
  onExpired,
}: PaymentActionButtonProps) {
  const router = useRouter();

  // 🌟 1. ดึงชื่อสถานะคำสั่งซื้อปัจจุบัน
  const orderState = order.status?.state || order.current_status?.state;

  // 🌟 2. คำนวณเวลาเป้าหมาย (Timestamp ms) พร้อมป้องกันปัญหาเรื่อง Timezone
  const targetExpiryTime = React.useMemo(() => {
    const parseSafeTime = (dateStr?: string | null) => {
      if (!dateStr) return null;
      let cleaned = dateStr.trim();
      if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
        cleaned = `${cleaned.replace(" ", "T")}Z`;
      }
      const parsed = new Date(cleaned).getTime();
      return isNaN(parsed) ? null : parsed;
    };

    if (order.expires_at) {
      return parseSafeTime(order.expires_at);
    }
    // Fallback: order_date + 10 นาที กรณีออเดอร์เก่ายังไม่มี expires_at
    const fallbackBase = parseSafeTime(order.order_date || order.created_at);
    if (fallbackBase) {
      return fallbackBase + 10 * 60 * 1000;
    }
    return null;
  }, [order.expires_at, order.order_date, order.created_at]);

  // 🌟 3. State จัดการวินาทีที่เหลือ
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (!targetExpiryTime) return 0;
    return Math.max(0, Math.floor((targetExpiryTime - Date.now()) / 1000));
  });

  // 🌟 4. Effect วิ่งนับถอยหลังทุก 1 วินาทีแบบ Real-time
  useEffect(() => {
    if (!targetExpiryTime || orderState !== "รอการชำระเงิน") return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetExpiryTime - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        clearInterval(interval);
        if (onExpired) onExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetExpiryTime, orderState, onExpired]);

  // 🌟 5. กรองสถานะ: ถ้าไม่ใช่ "รอการชำระเงิน" ให้ซ่อนตัวเองทันที
  if (orderState !== "รอการชำระเงิน") {
    return null;
  }

  // ฟอร์แมตเวลาแสดงผล mm:ss
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  const isTimeOut = remainingSeconds <= 0;
  const isSlipRejected = order.payment?.is_verified === false;

  // นำทางไปหน้าชำระเงิน
  const handleGoToPayment = () => {
    const queryParams = new URLSearchParams({
      totalPrice: String(order.total_price || 0),
      ...(order.expires_at ? { expiresAt: order.expires_at } : {}),
    });
    router.push(`/customer/order/payment/${order.id}?${queryParams.toString()}`);
  };

  return (
    <div className="inline-flex items-center gap-2">
      {!isTimeOut ? (
        <button
          type="button"
          onClick={handleGoToPayment}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer group ${
            isSlipRejected 
              ? "bg-amber-600 hover:bg-amber-700" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          title={isSlipRejected ? "สลิปไม่ถูกต้อง คลิกเพื่อแนบสลิปใหม่" : "คลิกเพื่อดำเนินการชำระเงิน"}
        >
          <CreditCard className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition-colors" />
          <span>{isSlipRejected ? "แนบสลิปใหม่" : "ชำระเงิน"}</span>
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
            isSlipRejected ? "text-amber-100 bg-amber-800/50" : "text-blue-100 bg-blue-700/60"
          }`}>
            <Clock className="w-3 h-3 text-white/80" />
            {minutes}:{seconds}
          </span>
        </button>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          หมดเวลาชำระเงิน
        </span>
      )}
    </div>
  );
}