"use client";

import React, { useState } from "react";
import { ShoppingBag, Trash2, X, AlertCircle, Loader2 } from "lucide-react";

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
}

interface ShopCartDrawerProps {
  shop: any;
  cartItems: CartItem[];
  isOpen?: boolean;
  onClose?: () => void;
  onClearCart: () => void;
  onProceedToPayment: (appointmentData: {
    receive_date: string;
    appointment_time: string;
    description: string;
    total_price: number;
  }) => void;
  isSubmitting?: boolean;
}

export default function ShopCartDrawer({
  shop,
  cartItems,
  isOpen = false,
  onClose,
  onClearCart,
  onProceedToPayment,
  isSubmitting = false,
}: ShopCartDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [timeError, setTimeError] = useState("");

  const isDrawerOpen = isOpen || internalOpen;

  const handleOpen = () => {
    setInternalOpen(true);
  };

  const handleClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  if (!cartItems || cartItems.length === 0) return null;

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.subtotal || item.quantity * item.unit_price),
    0
  );

  const getNowInfo = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return { todayStr, currentTimeStr };
  };

  const handleConfirmCheckout = () => {
    const { todayStr, currentTimeStr } = getNowInfo();

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

    if (selectedTime < shopOpen || selectedTime > shopClose) {
      setTimeError(`เวลานัดรับต้องอยู่ระหว่างเวลาทำการ (${shopOpen} - ${shopClose} น.)`);
      return;
    }

    if (appointmentDate === todayStr && selectedTime < currentTimeStr) {
      setTimeError(`เวลานัดรับต้องมากกว่าหรือเท่ากับเวลาปัจจุบัน (ขณะนี้เวลา ${currentTimeStr} น.)`);
      return;
    }

    setTimeError("");
    onProceedToPayment({
      receive_date: appointmentDate,
      appointment_time: `${appointmentDate}T${appointmentTime}:00`,
      description: orderNote,
      total_price: totalCartPrice,
    });
  };

  const { todayStr, currentTimeStr } = getNowInfo();
  const shopOpen = shop?.open_time ? shop.open_time.slice(0, 5) : "08:00";
  const shopClose = shop?.close_time ? shop.close_time.slice(0, 5) : "18:00";

  return (
    <>
      {/* 🌟 1. แถบบาร์ด้านล่างเต็มจอ */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 shadow-lg z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {/* 🖼️ ไอคอนแสดงจำนวน + ราคา (เป็นรูปประกอบเฉยๆ กดไม่ได้) */}
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{cartItems.length} รายการที่เลือกไว้</p>
              <p className="text-base font-extrabold text-slate-900">
                ฿{totalCartPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* 🔘 ปุ่มเดียวที่กดเพื่อเปิด Drawer */}
          <button
            type="button"
            onClick={handleOpen}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            ดูตะกร้า / กำหนดวันรับงาน
          </button>
        </div>
      </div>

      {/* 🌟 2. Pop-up Modal */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs"
          onClick={handleClose}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">ตะกร้าสินค้า ({shop?.shop_name || shop?.name || "ร้านค้า"})</h3>
              </div>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearCart();
                      handleClose();
                    }}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
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

            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">รายการบริการ</span>
                {cartItems.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 text-xs">ไม่มีสินค้าในตะกร้า</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {item.category} ({item.selected_size})
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {item.color_type} • {item.paper_type} • {item.finishing_option}
                        </span>
                        {item.file_url && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                            {item.file_url}
                          </span>
                        )}
                        <span className="text-blue-600 font-bold mt-0.5 block">จำนวน {item.quantity} ชุด</span>
                      </div>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ฿{Number(item.subtotal || item.quantity * item.unit_price).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 block">นัดหมายวันและเวลารับเอกสาร</span>
                  <span className="text-[11px] text-slate-500">
                    เวลาเปิด: {shopOpen} - {shopClose} น.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">วันที่รับ</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={appointmentDate}
                      onChange={(e) => {
                        setAppointmentDate(e.target.value);
                        setTimeError("");
                      }}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">เวลารับ</label>
                    <input
                      type="time"
                      min={
                        appointmentDate === todayStr
                          ? currentTimeStr > shopOpen
                            ? currentTimeStr
                            : shopOpen
                          : shopOpen
                      }
                      max={shopClose}
                      value={appointmentTime}
                      onChange={(e) => {
                        setAppointmentTime(e.target.value);
                        setTimeError("");
                      }}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {timeError && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 bg-rose-50 p-2 rounded-lg border border-rose-100">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {timeError}
                  </p>
                )}

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">หมายเหตุเพิ่มเติมถึงร้าน</label>
                  <input
                    type="text"
                    placeholder="เช่น ต้องการรับด่วนก่อนเที่ยง"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
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
                className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 ${
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