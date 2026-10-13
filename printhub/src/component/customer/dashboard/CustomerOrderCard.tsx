"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Ban, 
  MessageCircle, 
  Star, 
  AlertTriangle,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import PaymentActionButton from "@/component/customer/payment/PaymentActionButton";
import OrderCancellationAlert from "./OrderCancellationAlert";
import OrderItemsAccordion from "./OrderItemsAccordion";

interface CustomerOrderCardProps {
  order: any;
  showOrderDate?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onCancelClick?: (orderId: string, orderNo: string) => void;
  onReceivedClick?: (orderId: string, orderNo: string) => void;
  onReportClick?: (order: any) => void;
  onShowToast?: (msg: string) => void;
}

export default function CustomerOrderCard({
  order,
  showOrderDate = false,
  isExpanded: controlledExpanded,
  onToggleExpand: controlledToggle,
  onCancelClick,
  onReceivedClick,
  onReportClick,
  onShowToast,
}: CustomerOrderCardProps) {
  const router = useRouter();
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpand = controlledToggle || (() => setInternalExpanded(!internalExpanded));

  if (!order) return null;

  // 1. ตรวจสอบข้อมูล payment ให้รอบด้าน
  const rawPayment = order?.payment || order?.payment_detail || order?.payments;
  const paymentData = Array.isArray(rawPayment) ? rawPayment[0] : rawPayment;
  
  const paymentStatus = paymentData?.status ? String(paymentData.status).toLowerCase().trim() : "";
  const refundSlipUrl = paymentData?.refund_slip_url || null;

  // ตรวจจับว่ามีการจ่ายเงิน/แนบสลิปแล้วหรือไม่
  const hasPaidSlip = Boolean(
    paymentData?.slip_url || 
    paymentStatus === "paid" || 
    paymentStatus === "refunded" || 
    paymentStatus === "pending_payout" ||
    order?.payment_id
  );

  const isSlipRejected = paymentData?.is_verified === false || paymentStatus === "rejected";

  // 2. ฟังก์ชันแปลงเวลา Timezone
  const parseSafeTime = (dateStr?: string | null) => {
    if (!dateStr) return null;
    let cleaned = String(dateStr).trim();
    if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
      cleaned = `${cleaned.replace(" ", "T")}Z`;
    }
    const parsed = new Date(cleaned).getTime();
    return isNaN(parsed) ? null : parsed;
  };

  const now = Date.now();

  let state = 
    order?.current_status?.state || 
    order?.status?.state || 
    (typeof order?.status === "string" ? order.status : "รอการชำระเงิน");

  if (isSlipRejected && state !== "ยกเลิกการพิมพ์") {
    state = "รอการชำระเงิน";
  }

  const expiresAtMs = parseSafeTime(order?.expires_at);
  const orderDateMs = parseSafeTime(order?.order_date);

  let isPaymentExpired = false;
  if (expiresAtMs) {
    isPaymentExpired = now > expiresAtMs;
  } else if (!isSlipRejected && orderDateMs) {
    isPaymentExpired = now > (orderDateMs + 10 * 60 * 1000);
  }

  if (state === "รอการชำระเงิน" && isPaymentExpired && !hasPaidSlip && !isSlipRejected) {
    state = "ยกเลิกการพิมพ์";
  }

  const appointmentMs = parseSafeTime(order?.appointment_time || order?.receive_date);
  const isOverdue = appointmentMs ? now >= appointmentMs : false;

  if (isOverdue && (state === "รอการดำเนินงาน" || state === "กำลังพิมพ์")) {
    state = "ยกเลิกการพิมพ์";
  }

  const isPendingPayment = state === "รอการชำระเงิน" && (!isPaymentExpired || isSlipRejected);
  const isPending = state === "รอการดำเนินงาน" && !isSlipRejected;
  const isPrinting = state === "กำลังพิมพ์";
  const isReady = state === "พิมพ์เสร็จสิ้น";
  const isReceived = state === "รับงานแล้ว" || state === "รายการเสร็จสิ้น";
  const isCanceled = state === "ยกเลิกการพิมพ์";

  const isTimeoutCancelled = isCanceled && isPaymentExpired && !hasPaidSlip;

  const stateBadgeStyle =
    isPendingPayment
      ? "bg-amber-50 text-amber-700 border-amber-200/80"
      : isReady
      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
      : isReceived
      ? "bg-slate-100 text-slate-600 border-slate-200"
      : isCanceled
      ? "bg-rose-50 text-rose-600 border-rose-200/80"
      : isPrinting
      ? "bg-blue-50 text-blue-700 border-blue-200/80"
      : "bg-slate-50 text-slate-600 border-slate-200";

  const formatThaiDateTime = (dateStr?: string | null) => {
    if (!dateStr) return { date: "-", time: "" };
    const ts = parseSafeTime(dateStr);
    if (!ts) return { date: "-", time: "" };

    const d = new Date(ts);
    const date = d.toLocaleDateString("th-TH", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const time = d.toLocaleTimeString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    }) + " น.";

    return { date, time };
  };

  const { date: formattedOrderDate, time: formattedOrderTime } = formatThaiDateTime(order?.order_date);
  const { date: formattedDate, time: formattedTime } = formatThaiDateTime(order?.appointment_time || order?.receive_date);

  const items = order?.print_order_item || order?.order_items || order?.items || [];
  
  const itemCategorySummary = (() => {
    if (!items || items.length === 0) return "เอกสาร x1 ชุด";

    const categoryTotals: Record<string, number> = {};
    items.forEach((it: any) => {
      const cat = it?.category || "เอกสาร";
      const qty = Number(it?.quantity) || 1;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + qty;
    });

    return Object.entries(categoryTotals)
      .map(([cat, totalQty]) => `${cat} x${totalQty} ชุด`)
      .join(", ");
  })();

  const subtotalPrice = Number(order?.subtotal_price || order?.total_price || 0);
  const smallOrderFee = Number(order?.small_order_fee || 0);
  const orderPrice = Number(order?.total_amount || order?.total_price || 0);
  const orderNumberStr = `#ORD-${order?.order_no || order?.id?.slice(0, 6) || "------"}`;
  const shopId = order?.shop?.id || order?.print_shop?.id || order?.shop_id;
  const shopName = order?.shop?.shop_name || order?.print_shop?.shop_name || "ร้านค้า";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
      
      {/* 1. Header บาร์บน */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight shrink-0">
            {orderNumberStr}
          </span>
          
          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm sm:text-base truncate">
            <Store className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">{shopName}</span>
          </div>

          {!isCanceled && (
            <button
              type="button"
              onClick={() => {
                if (!order?.id || !shopId) {
                  onShowToast?.("ไม่พบข้อมูลร้านค้า");
                  return;
                }
                router.push(`/customer/order/${shopId}/chat?order_id=${order.id}`);
              }}
              className="p-1 sm:px-2.5 sm:py-1 text-sky-700 bg-sky-50 hover:bg-sky-300 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer border border-sky-300 shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">แชท</span>
            </button>
          )}
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${stateBadgeStyle}`}>
          {state}
        </span>
      </div>

      {/* 2. เนื้อหาการ์ด */}
      <div className="p-4 sm:px-5 space-y-3">
        
        <div className="flex items-center gap-2.5 flex-wrap text-xs text-slate-500">
          {showOrderDate && order?.order_date && (
            <>
              <div className="inline-flex items-center gap-1.5 text-slate-500">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>สั่งซื้อเมื่อ:</span>
                <span className="font-medium text-slate-700">{formattedOrderDate}</span>
                {formattedOrderTime && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-700">{formattedOrderTime}</span>
                  </>
                )}
              </div>
              <span className="text-slate-200 hidden sm:inline">|</span>
            </>
          )}

          <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-200/80 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>นัดรับ: <strong className="text-slate-800 font-semibold">{formattedDate}</strong></span>
            </div>

            {formattedTime && (
              <>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-semibold">{formattedTime}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 🌟 แสดงกล่องแจ้งเตือนยกเลิก / คืนเงิน จุดเดียวเท่านั้น */}
        <OrderCancellationAlert 
          isCanceled={isCanceled}
          hasPaidSlip={hasPaidSlip}
          paymentStatus={paymentStatus}
          refundSlipUrl={refundSlipUrl}
          isTimeoutCancelled={isTimeoutCancelled}
        />

        {/* แถวล่าง: ปุ่มรายละเอียด และปุ่ม Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100/80">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={toggleExpand}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer border ${
                isExpanded
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{isExpanded ? "ซ่อนรายละเอียด" : "รายละเอียด"}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <span className="text-[11px] font-normal text-slate-500">
              {itemCategorySummary}
            </span>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3.5">
            <div className="flex items-center gap-2 flex-wrap">
              
              {isSlipRejected && !isCanceled && (
                <span className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  สลิปไม่ถูกต้อง แนบใหม่ก่อนหมดเวลา
                </span>
              )}

              {!isCanceled && (isPendingPayment || isSlipRejected) && (
                <PaymentActionButton order={order} />
              )}

              {/* ปุ่มยกเลิก: แสดงเฉพาะตอนรอดำเนินงาน หรือ รอชำระเงิน และยังไม่ยกเลิก */}
              {!isCanceled && (isPending || isPendingPayment) && (
                <button
                  type="button"
                  onClick={() => onCancelClick?.(order.id, orderNumberStr)}
                  className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>ยกเลิก</span>
                </button>
              )}

              {!isCanceled && isReady && (
                <button
                  type="button"
                  onClick={() => onReceivedClick?.(order.id, orderNumberStr)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ยืนยันรับของ</span>
                </button>
              )}

              {!isCanceled && isReceived && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => router.push(`/customer/review?order_id=${order.id}&shop_id=${shopId}`)}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>รีวิว</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReportClick?.(order)}
                    className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>ขอคืนเงิน</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-right pl-3.5 border-l border-slate-200/80 shrink-0">
              <span className="text-[10px] text-slate-400 block font-medium">ยอดชำระสุทธิ</span>
              <span className="text-base font-extrabold text-blue-600">
                ฿{orderPrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <OrderItemsAccordion
        isExpanded={isExpanded}
        items={items}
        description={order?.description}
        subtotalPrice={subtotalPrice}
        smallOrderFee={smallOrderFee}
        netTotalPrice={orderPrice}
      />

    </div>
  );
}