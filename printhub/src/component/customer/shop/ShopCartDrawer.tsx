"use client";

import React, { useState } from "react";
import { ShoppingBag, Trash2, X, Loader2 } from "lucide-react";
import CartItemCard from "./CartItemCard";
import CartScheduleForm from "./CartScheduleForm";

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
  }) => void;
  isSubmitting?: boolean;
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

  const getNowInfo = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const minTimeObj = new Date(now.getTime() + 31 * 60 * 1000);
    const minAllowedTimeStr = `${String(minTimeObj.getHours()).padStart(2, "0")}:${String(minTimeObj.getMinutes()).padStart(2, "0")}`;
    return { todayStr, minAllowedTimeStr };
  };

  const handleConfirmCheckout = () => {
    const { todayStr, minAllowedTimeStr } = getNowInfo();

    if (!appointmentDate || !appointmentTime) {
      setTimeError("กรุณาระบุวันและเวลานัดหมายให้ครบถ้วน");
      return;
    }

    if (shop?.is_open === false) {
      setTimeError("ขณะนี้ร้านค้าปิดให้บริการชั่วคราว ไม่สามารถทำการสั่งซื้อได้");
      return;
    }

    if (appointmentDate < todayStr) {
      setTimeError("วันที่นัดรับต้องเป็นวันปัจจุบันหรือวันข้างหน้าเท่านั้น");
      return;
    }

    const shopOpen = shop?.open_time ? shop.open_time.slice(0, 5) : "08:00";
    const shopClose = shop?.close_time ? shop.close_time.slice(0, 5) : "18:00";
    const selectedTime = appointmentTime.slice(0, 5);

    if (!isWithinShopHours(selectedTime, shopOpen, shopClose)) {
      setTimeError(`เวลานัดรับต้องอยู่ระหว่างเวลาทำการ (${shopOpen} - ${shopClose} น.)`);
      return;
    }

    const selectedDateTime = new Date(`${appointmentDate}T${selectedTime}:00`);
    const now = new Date();
    const nowWithoutSeconds = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0);
    const diffInMinutes = Math.round((selectedDateTime.getTime() - nowWithoutSeconds.getTime()) / (1000 * 60));

    if (diffInMinutes < 30) {
      setTimeError(`กรุณาเลือกเวลานัดรับตั้งแต่ ${minAllowedTimeStr} น. เป็นต้นไป (ล่วงหน้าอย่างน้อย 30 นาที)`);
      return;
    }

    setTimeError("");
    onProceedToPayment({
      receive_date: appointmentDate,
      appointment_time: `${appointmentDate}T${selectedTime}:00`,
      description: orderNote,
      total_price: totalCartPrice,
    });
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
            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  ตะกร้าสินค้า ({shop?.shop_name || shop?.name || "ร้านค้า"})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
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

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
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
                    onRemove={() => onRemoveItem && onRemoveItem(item.id)}
                  />
                ))}
              </div>

              <CartScheduleForm
                todayStr={todayStr}
                shopOpen={shopOpen}
                shopClose={shopClose}
                isOpenOvernight={isOpenOvernight}
                appointmentDate={appointmentDate}
                appointmentTime={appointmentTime}
                orderNote={orderNote}
                timeError={timeError}
                onDateChange={(d) => {
                  setAppointmentDate(d);
                  setTimeError("");
                }}
                onTimeChange={(t) => {
                  setAppointmentTime(t);
                  setTimeError("");
                }}
                onNoteChange={setOrderNote}
              />
            </div>

            <div className="p-4 border-t border-slate-100 bg-white space-y-3 shrink-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">ยอดรวมทั้งหมด</span>
                <span className="text-xl font-extrabold text-blue-600">
                  ฿{totalCartPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                disabled={shop?.is_open === false || isSubmitting}
                onClick={handleConfirmCheckout}
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center gap-2 ${
                  shop?.is_open === false || isSubmitting
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 cursor-pointer"
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
                  "ไปที่หน้าชำระเงิน →"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}