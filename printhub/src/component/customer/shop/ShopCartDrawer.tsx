"use client";

import React, { useState } from "react";
import { ShoppingBag, Trash2, X, Loader2, CalendarCheck, ArrowRight } from "lucide-react";
import CartItemCard from "./CartItemCard";
import CartScheduleForm from "./CartScheduleForm";
import { formatOpenDays, isOpenOnWeekday, weekdayOfDateStr, weekdayFullName } from "../shopOpenDays";

export interface CartItem {
  id: string;
  category: string;
  selected_size: string;
  color_type: string;
  paper_type: string;
  finishing_option: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  file_url?: string;
  total_pages?: number;
  page_count?: number;
}

interface ShopCartDrawerProps {
  shop: any;
  cartItems: CartItem[];
  isOpen?: boolean;
  onClose?: () => void;
  onClearCart: () => void;
  onEditItem?: (item: CartItem) => void;
  onRemoveItem?: (itemId: string) => void;
  onProceedToPayment: (appointmentData: {
    receive_date: string;
    appointment_time: string;
    description: string;
    total_price: number;
  }) => void | string | Promise<void | string>;
  isSubmitting?: boolean;
  isBuyNow?: boolean; // โหมดสั่งทันที: สั่งเฉพาะรายการเดียว
}

const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
};

const isWithinShopHours = (selectedTime: string, openTime: string, closeTime: string) => {
  const selMin = timeToMinutes(selectedTime);
  const openMin = timeToMinutes(openTime);
  const closeMin = timeToMinutes(closeTime);
  if (closeMin < openMin) {
    return selMin >= openMin || selMin <= closeMin;
  }
  return selMin >= openMin && selMin <= closeMin;
};

const getItemSubtotal = (item: CartItem) => {
  if (item.subtotal !== undefined && item.subtotal !== null && Number(item.subtotal) > 0) {
    return Number(item.subtotal);
  }
  const pages = Number(item.total_pages || item.page_count) || 1;
  const unitPrice = Number(item.unit_price) || 0;
  const qty = Number(item.quantity) || 1;
  return unitPrice * pages * qty;
};

export default function ShopCartDrawer({
  shop,
  cartItems,
  isOpen = false,
  onClose,
  onClearCart,
  onEditItem,
  onRemoveItem,
  onProceedToPayment,
  isSubmitting = false,
  isBuyNow = false,
}: ShopCartDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [timeError, setTimeError] = useState("");

  const isDrawerOpen = isOpen || internalOpen;

  const handleOpen = () => setInternalOpen(true);
  const handleClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  if (!cartItems || cartItems.length === 0) return null;

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + getItemSubtotal(item),
    0
  );

  // ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (เหมือน backend: ยอดต่ำกว่า 50 บาท +20 บาท)
  const smallOrderFee = totalCartPrice > 0 && totalCartPrice < 50 ? 20 : 0;
  const netTotal = totalCartPrice + smallOrderFee;

  const getNowInfo = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const minTimeObj = new Date(now.getTime() + 31 * 60 * 1000);
    const minAllowedTimeStr = `${String(minTimeObj.getHours()).padStart(2, "0")}:${String(minTimeObj.getMinutes()).padStart(2, "0")}`;
    return { todayStr, minAllowedTimeStr };
  };

  // ตรวจวัน/เวลานัดรับ (ใช้ทั้งตอนเลือก และตอนกดชำระเงิน) ถ้าผ่านคืนค่า ""
  const validateSchedule = (date: string, time: string) => {
    const { todayStr, minAllowedTimeStr } = getNowInfo();

    if (date) {
      if (date < todayStr) {
        return "วันที่นัดรับต้องเป็นวันปัจจุบันหรือวันข้างหน้าเท่านั้น";
      }
      // วันนัดรับต้องเป็นวันที่ร้านเปิด
      const selectedWeekday = weekdayOfDateStr(date);
      if (!isOpenOnWeekday(shop?.open_days, selectedWeekday)) {
        return `ร้านปิดวัน${weekdayFullName(selectedWeekday)} กรุณาเลือกวันอื่น (ร้านเปิด ${formatOpenDays(shop?.open_days)})`;
      }
    }

    if (time) {
      const shopOpen = shop?.open_time ? shop.open_time.slice(0, 5) : "08:00";
      const shopClose = shop?.close_time ? shop.close_time.slice(0, 5) : "18:00";
      const selectedTime = time.slice(0, 5);

      if (!isWithinShopHours(selectedTime, shopOpen, shopClose)) {
        return `เวลานัดรับต้องอยู่ระหว่างเวลาทำการ (${shopOpen} - ${shopClose} น.)`;
      }

      if (date) {
        const selectedDateTime = new Date(`${date}T${selectedTime}:00`);
        const now = new Date();
        const nowWithoutSeconds = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0);
        const diffInMinutes = Math.round((selectedDateTime.getTime() - nowWithoutSeconds.getTime()) / (1000 * 60));
        if (diffInMinutes < 30) {
          return `กรุณาเลือกเวลานัดรับตั้งแต่ ${minAllowedTimeStr} น. เป็นต้นไป (ล่วงหน้าอย่างน้อย 30 นาที)`;
        }
      }
    }

    return "";
  };

  const handleConfirmCheckout = async () => {

    if (!appointmentDate || !appointmentTime) {
      setTimeError("กรุณาระบุวันและเวลานัดหมายให้ครบถ้วน");
      return;
    }

    if (shop?.is_open === false) {
      setTimeError(
        shop?.is_temporarily_closed
          ? "ขณะนี้ร้านค้าปิดให้บริการชั่วคราว ไม่สามารถทำการสั่งซื้อได้"
          : "ขณะนี้ร้านค้าปิดทำการ ไม่สามารถทำการสั่งซื้อได้"
      );
      return;
    }

    const scheduleError = validateSchedule(appointmentDate, appointmentTime);
    if (scheduleError) {
      setTimeError(scheduleError);
      return;
    }

    const selectedTime = appointmentTime.slice(0, 5);
    setTimeError("");
    const errorMessage = await onProceedToPayment({
      receive_date: appointmentDate,
      appointment_time: `${appointmentDate}T${selectedTime}:00`,
      description: orderNote,
      total_price: totalCartPrice,
    });
    if (typeof errorMessage === "string" && errorMessage) {
      setTimeError(errorMessage);
    }
  };

  const { todayStr } = getNowInfo();
  const shopOpen = shop?.open_time ? shop.open_time.slice(0, 5) : "08:00";
  const shopClose = shop?.close_time ? shop.close_time.slice(0, 5) : "18:00";
  const isOpenOvernight = timeToMinutes(shopClose) < timeToMinutes(shopOpen);

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 shadow-lg z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {cartItems.length} รายการที่เลือกไว้
              </p>
              <p className="text-base font-extrabold text-slate-900">
                ฿{totalCartPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            ดูตะกร้า / กำหนดวันรับงาน
          </button>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white w-full max-w-lg md:max-w-5xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {isBuyNow ? "สั่งทันที" : "ตะกร้าสินค้า"}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    ร้าน {shop?.shop_name || shop?.name || "ร้านค้า"} ·{" "}
                    {isBuyNow ? "สั่งเฉพาะรายการนี้ (ไม่รวมของในตะกร้า)" : `${cartItems.length} รายการ`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && !isBuyNow && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearCart();
                      handleClose();
                    }}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> ล้างตะกร้า
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
              {/* ซ้าย: รายการงานพิมพ์ */}
              <div className="p-5 bg-slate-50/60 space-y-2.5 md:overflow-y-auto">
                <span className="text-sm font-bold text-slate-900 block">
                  รายการงานพิมพ์ ({cartItems.length})
                </span>
                {cartItems.map((item, idx) => (
                  <CartItemCard
                    key={item.id || idx}
                    item={item}
                    itemPages={Number(item.total_pages || item.page_count) || 1}
                    itemSubtotal={getItemSubtotal(item)}
                    onEdit={
                      onEditItem
                        ? () => {
                            setInternalOpen(false); // 👈 ปิด State ภายในทันที
                            if (onClose) onClose(); // 👈 แจ้งหน้าหลักให้ปิด
                            onEditItem(item);       // 👈 เปิด Modal แก้ไข
                          }
                        : undefined
                    }
                    onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
                  />
                ))}
              </div>

              {/* ขวา: นัดรับ + หมายเหตุ + สรุปยอด */}
              <div className="flex flex-col md:min-h-0 md:border-l md:border-slate-100">
                <div className="p-5 md:flex-1 md:overflow-y-auto">
                  <CartScheduleForm
                    todayStr={todayStr}
                    shopOpen={shopOpen}
                    shopClose={shopClose}
                    isOpenOvernight={isOpenOvernight}
                    openDays={shop?.open_days}
                    appointmentDate={appointmentDate}
                    appointmentTime={appointmentTime}
                    orderNote={orderNote}
                    timeError={timeError}
                    onDateChange={(d) => {
                      setAppointmentDate(d);
                      setTimeError(validateSchedule(d, appointmentTime));
                    }}
                    onTimeChange={(t) => {
                      setAppointmentTime(t);
                      setTimeError(validateSchedule(appointmentDate, t));
                    }}
                    onNoteChange={setOrderNote}
                  />
                </div>

                <div className="p-5 border-t border-slate-100 bg-white space-y-4 shrink-0 sticky bottom-0 md:static">
                  {/* การ์ดสรุปนัดรับ */}
                  {appointmentDate && appointmentTime ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs shrink-0">
                        <CalendarCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-blue-600">นัดรับงาน</p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {(() => {
                            const [y, m, d] = appointmentDate.split("-").map(Number);
                            return new Date(y, m - 1, d).toLocaleDateString("th-TH", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            });
                          })()}{" "}
                          · {appointmentTime.slice(0, 5)} น.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500">
                      <CalendarCheck className="w-4 h-4 text-slate-400 shrink-0" />
                      เลือกวันและเวลานัดรับก่อนไปชำระเงิน
                    </div>
                  )}

                  {/* สรุปยอด */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>ค่างานพิมพ์ ({cartItems.length} รายการ)</span>
                      <span className="text-slate-700 font-medium">฿{totalCartPrice.toFixed(2)}</span>
                    </div>
                    {smallOrderFee > 0 && (
                      <div className="flex justify-between gap-3 text-orange-600">
                        <div>
                          <span>ค่าธรรมเนียมสั่งซื้อขนาดเล็ก</span>
                          <span className="block text-[11px] text-orange-500/90">
                            ยอดสั่งขั้นต่ำ 50 บาท · สั่งเพิ่มอีก ฿{(50 - totalCartPrice).toFixed(2)} เพื่อไม่เสียค่าธรรมเนียม
                          </span>
                        </div>
                        <span className="font-medium shrink-0">+฿{smallOrderFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-end justify-between pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-900">ยอดชำระสุทธิ</span>
                      <span className="text-2xl font-extrabold text-blue-600 leading-none">
                        ฿{netTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={shop?.is_open === false || isSubmitting}
                    onClick={handleConfirmCheckout}
                    className={`w-full py-3.5 rounded-2xl text-sm font-bold transition shadow-lg flex items-center justify-center gap-2 ${
                      shop?.is_open === false || isSubmitting
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                        : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-blue-500/30 cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>กำลังสร้างคำสั่งซื้อ...</span>
                      </>
                    ) : shop?.is_open === false ? (
                      "ร้านปิดทำการ (ไม่สามารถสั่งได้)"
                    ) : (
                      <>
                        <span>ไปที่หน้าชำระเงิน</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}