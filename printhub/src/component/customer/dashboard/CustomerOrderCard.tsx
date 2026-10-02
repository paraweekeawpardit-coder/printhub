/**
 * Component: CustomerOrderCard
 * หน้าที่: การ์ดแสดงข้อมูลคำสั่งซื้อเดี่ยว จัดวาง Layout ให้:
 * - รหัสออเดอร์อยู่คู่กับปุ่มรายละเอียดทางซ้ายบน
 * - ป้ายสถานะงานอยู่มุมขวาบนสุด
 * - แถวล่างประกอบด้วย ยอดชำระสุทธิ, ปุ่ม Action (ยกเลิก/ยืนยันรับของ), คอลัมน์ปุ่มรีวิว/คืนเงิน และปุ่มแชต
 * - Dropdown ขยายแสดงรายละเอียดสเปกงานพิมพ์ขนาดกะทัดรัด
 */

"use client";
import PaymentActionButton from "@/component/customer/payment/PaymentActionButton";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Ban, 
  CreditCard, 
  MessageCircle, 
  Star, 
  AlertTriangle,
  CheckCircle2,
  CalendarDays
} from "lucide-react";

interface CustomerOrderCardProps {
  order: any;
  showOrderDate?: boolean; // 🌟 เพิ่ม prop เพื่อเลือกว่าจะแสดงวันเวลาสั่งซื้อหรือไม่
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

  // Safe Guard ป้องกันกรณี order เป็น null หรือ undefined
  if (!order) return null;

  // ฟังก์ชันตรวจเช็คเวลาหมดอายุ 10 นาที
  const isOrderExpired = (expiresAtStr?: string, orderDateStr?: string) => {
    const parseSafeTime = (dateStr?: string | null) => {
      if (!dateStr) return null;
      let cleaned = dateStr.trim();
      if (!cleaned.includes("Z") && !cleaned.includes("+") && !cleaned.includes("-", 10)) {
        cleaned = `${cleaned.replace(" ", "T")}Z`;
      }
      const parsed = new Date(cleaned).getTime();
      return isNaN(parsed) ? null : parsed;
    };

    const now = Date.now();

    // 1. ถ้ามี expires_at จากฐานข้อมูล ให้เทียบตรงๆ
    if (expiresAtStr) {
      const expTime = parseSafeTime(expiresAtStr);
      if (expTime) return now > expTime;
    }

    // 2. ถ้าไม่มี ให้ใช้ order_date + 10 นาที
    if (orderDateStr) {
      const createTime = parseSafeTime(orderDateStr);
      if (createTime) return now > (createTime + 10 * 60 * 1000);
    }

    return false;
  };

  let state = 
    order?.status?.state || 
    order?.current_status?.state || 
    (typeof order?.status === "string" ? order.status : "รอการชำระเงิน");

  // ตรวจสอบว่าหมดอายุจริงหรือไม่จาก expires_at
  const expired = isOrderExpired(order?.expires_at, order?.order_date);

  if (state === "รอการชำระเงิน" && expired) {
    state = "ยกเลิกการพิมพ์";
  }

  const isPendingPayment = state === "รอการชำระเงิน" && !expired;
  const isPending = state === "รอการดำเนินงาน";
  const isPrinting = state === "กำลังพิมพ์";
  const isReady = state === "พิมพ์เสร็จสิ้น";
  const isReceived = state === "รับงานแล้ว" || state === "รายการเสร็จสิ้น";
  const isCanceled = state === "ยกเลิกการพิมพ์";

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

  // 🌟 จัดรูปแบบ "วันที่และเวลาที่สั่งซื้อ"
  const formattedOrderDate = order?.order_date
    ? new Date(order.order_date).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  const formattedOrderTime = order?.order_date
    ? new Date(order.order_date).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " น."
    : "";

  // จัดรูปแบบ "วันเวลานัดรับ"
  const formattedDate = order?.receive_date
    ? new Date(order.receive_date).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  const formattedTime = order?.appointment_time
    ? new Date(order.appointment_time).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " น."
    : "";

  const items = order?.print_order_item || order?.order_items || order?.items || [];
  
  // รวมประเภทงานพิมพ์หลักพร้อมจำนวนชุด
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

  const orderPrice = Number(order?.total_amount || order?.total_price || 0);
  const orderNumberStr = `#ORD-${order?.order_no || order?.id?.slice(0, 6) || "------"}`;
  const shopId = order?.shop?.id || order?.print_shop?.id || order?.shop_id;
  const shopName = order?.shop?.shop_name || order?.print_shop?.shop_name || "ร้านค้า";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
      
      {/* 1. Header บาร์บน: #ORD-125 | ชื่อร้านค้า + ปุ่มแชท และ สถานะอยู่ขวาสุด */}
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

        {/* ป้ายสถานะอยู่ขวาสุดด้านบน */}
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${stateBadgeStyle}`}>
          {state}
        </span>
      </div>

      {/* 2. เนื้อหาการ์ด */}
      <div className="p-4 sm:px-5 space-y-3">
        
        {/* 🌟 แถววันเวลาสั่งซื้อ (ถ้าเปิดใช้งาน) & วันเวลานัดรับแบบ Pill */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs text-slate-500">
          
          {/* วันที่และเวลาสั่งซื้อ (แสดงเฉพาะเมื่อส่ง prop showOrderDate={true}) */}
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

          {/* แถววันเวลานัดรับเดิม ใส่ Pill เรียบร้อย */}
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

        {/* แถวล่าง: [ปุ่มรายละเอียด + ประเภทงานพิมพ์ตัวบาง] VS [ปุ่ม Action + ยอดเงินสุทธิขวาสุด] */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100/80">
          
          {/* ฝั่งซ้าย: ปุ่มรายละเอียดอยู่ซ้ายสุด ตามด้วยประเภทงานพิมพ์หลัก (ตัวบาง ไม่ใส่ Pill) */}
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

          {/* ฝั่งขวา: ปุ่ม Action ต่างๆ และ ยอดชำระสุทธิอยู่ขวาสุด */}
          <div className="flex items-center justify-between md:justify-end gap-3.5">
            
            {/* กลุ่มปุ่ม Action */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 1. ปุ่มชำระเงินนับถอยหลัง */}
              <PaymentActionButton order={order} />

              {/* 2. ปุ่มยกเลิก */}
              {(isPending || isPendingPayment) && (
                <button
                  type="button"
                  onClick={() => onCancelClick?.(order.id, orderNumberStr)}
                  className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>ยกเลิก</span>
                </button>
              )}

              {/* 3. ปุ่มยืนยันรับของ */}
              {isReady && (
                <button
                  type="button"
                  onClick={() => onReceivedClick?.(order.id, orderNumberStr)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ยืนยันรับของ</span>
                </button>
              )}

              {/* 4. ปุ่มรีวิว & คืนเงิน */}
              {isReceived && (
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

            {/* ยอดชำระสุทธิ วางไว้ขวาสุด */}
            <div className="text-right pl-3.5 border-l border-slate-200/80 shrink-0">
              <span className="text-[10px] text-slate-400 block font-medium">ยอดชำระสุทธิ</span>
              <span className="text-base font-extrabold text-blue-600">
                ฿{orderPrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* 3. รายละเอียดใน Dropdown เมื่อกดเปิด */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-[#F9FAFB] p-4 text-xs space-y-3">
          <div className="space-y-2">
            {items.map((item: any, idx: number) => {
              const pageCount = Number(item?.page_count) || 1;
              const unitPrice = Number(item?.unit_price) || 0;
              const quantity = Number(item?.quantity) || 1;
              const itemSubtotal = Number(item?.subtotal) || unitPrice * pageCount * quantity;

              const specs = item?.describe
                ? item.describe.split("|").map((s: string) => s.trim()).filter(Boolean)
                : [];

              return (
                <div key={item?.id || idx} className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-xs">
                      {idx + 1}. {item?.category || "งานพิมพ์เอกสาร"}
                    </span>
                    <span className="font-bold text-slate-900">
                      ฿{itemSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {specs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {specs.map((spec: string, sIdx: number) => (
                        <span key={sIdx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex justify-between pt-0.5">
                    <span>{pageCount} หน้า × ฿{unitPrice.toFixed(2)}/หน้า</span>
                    <span className="font-medium text-slate-600">รวม {quantity} ชุด</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* สรุปราคาท้ายใบเสร็จ */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1 text-slate-600 text-[11px]">
            <div className="flex justify-between">
              <span>ค่างานพิมพ์รวม</span>
              <span className="font-semibold text-slate-800">
                ฿{Number(order?.subtotal_price || order?.total_price || 0).toFixed(2)}
              </span>
            </div>

            {Number(order?.small_order_fee) > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (&lt;50 บาท)</span>
                <span className="font-semibold">+฿{Number(order.small_order_fee).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs font-bold text-slate-900 pt-1.5 border-t border-slate-100">
              <span className="text-blue-700">ยอดชำระสุทธิ</span>
              <span className="text-sm font-extrabold text-blue-700">
                ฿{orderPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}