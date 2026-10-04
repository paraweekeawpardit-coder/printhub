"use client";

import { Check, X, Printer, Loader2, Eye, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

type Order = {
  id: string;
  order_no?: string;
  customer_id: string;
  shop_id: string;
  description: string | null;
  order_date: string;
  appointment_time?: string | null;
  receive_date?: string | null;
  total_price: number;
  latest_status?: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  current_status?: {
    id: string;
    state: string;
  };
  payment?: {
    id?: string;
    slip_url?: string | null;
    is_verified?: boolean | null;
  } | null;
};

type Props = {
  order: Order;
  onClick?: () => void;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  disabled?: boolean;
};

const API_BASE = "http://localhost:5000";

const STATUS = {
  PENDING: "รอการดำเนินงาน",
  PRINTING: "กำลังพิมพ์",
  DONE: "พิมพ์เสร็จสิ้น",
  COMPLETED: "รายการเสร็จสิ้น",
  CANCELLED: "ยกเลิกการพิมพ์",
  AWAITING_PAYMENT: "รอการชำระเงิน",
} as const;

const STATUS_STYLE: Record<string, { badge: string; dot: string }> = {
  [STATUS.PENDING]: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  [STATUS.PRINTING]: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  [STATUS.DONE]: {
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    dot: "bg-blue-700",
  },
  [STATUS.COMPLETED]: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  [STATUS.CANCELLED]: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const FALLBACK_STYLE = {
  badge: "bg-slate-50 text-slate-600 border-slate-200",
  dot: "bg-slate-400",
};

export default function OrderCard({
  order,
  onClick,
  onUpdateStatus,
  disabled = false,
}: Props) {
  const initialStatus =
    order.latest_status || order.current_status?.state || STATUS.PENDING;

  const [currentState, setCurrentState] = useState<string>(initialStatus);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isVerified, setIsVerified] = useState<boolean | null>(
    order.payment?.is_verified ?? null
  );
  const [verifyingSlip, setVerifyingSlip] = useState<boolean>(false);
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);

  const updating = pendingAction !== null;

  useEffect(() => {
    setCurrentState(
      order.latest_status || order.current_status?.state || STATUS.PENDING
    );
    setIsVerified(order.payment?.is_verified ?? null);
  }, [order]);

  async function updateState(newStatus: string) {
    if (updating || disabled) return;

    setPendingAction(newStatus);
    setErrorMsg(null);

    const url = `${API_BASE}/shop/orders/${order.id}/status`;

    try {
      await axios.patch(
        url,
        { status_name: newStatus },
        { params: { shop_id: order.shop_id } }
      );

      setCurrentState(newStatus);
      onUpdateStatus?.(order.id, newStatus);
    } catch (err: any) {
      console.error("[OrderCard] request failed:", err);
      const backendMessage =
        err.response?.data?.error || "ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง";
      setErrorMsg(backendMessage);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleVerifySlip(isApproved: boolean) {
    if (verifyingSlip || updating || disabled) return;

    setVerifyingSlip(true);
    setErrorMsg(null);

    const newStatus = isApproved ? STATUS.PRINTING : STATUS.AWAITING_PAYMENT;
    const params = { params: { shop_id: order.shop_id } };

    try {
      await axios.patch(
        `${API_BASE}/shop/orders/${order.id}/verify-payment`,
        { is_verified: isApproved },
        params
      );
      setIsVerified(isApproved);

      await axios.patch(
        `${API_BASE}/shop/orders/${order.id}/status`,
        { status_name: newStatus },
        params
      );

      setCurrentState(newStatus);
      setShowSlipModal(false);
      onUpdateStatus?.(order.id, newStatus);
    } catch (err: any) {
      console.error("[OrderCard] slip verification failed:", err);
      const backendMessage =
        err.response?.data?.error || "ไม่สามารถตรวจสอบสลิปได้";
      setErrorMsg(backendMessage);
    } finally {
      setVerifyingSlip(false);
    }
  }

  const customerName = order.customer
    ? `${order.customer.first_name || ""} ${order.customer.last_name || ""}`.trim()
    : "ลูกค้าทั่วไป";
  const initialLetter = order.customer?.first_name?.charAt(0) || "U";

  const style = STATUS_STYLE[currentState] ?? FALLBACK_STYLE;

  // ฟังก์ชันจัดฟอร์แมตวันเวลาสั่งซื้อ
  const formatOrderDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dateFormatted = d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    const timeFormatted = d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateFormatted} (${timeFormatted} น.)`;
  };

  // ฟังก์ชันจัดฟอร์แมตวันเวลานัดรับ
  const formatPickupDateTime = () => {
    const timeStr = order.appointment_time || order.receive_date;
    if (!timeStr) return null;
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return timeStr;

    const dateFormatted = d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    const timeFormatted = d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dateFormatted} เวลา ${timeFormatted} น.`;
  };

  const pickupFormatted = formatPickupDateTime();

  return (
    <>
      <div
        onClick={() => {
          if (!disabled) onClick?.();
        }}
        className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-base tracking-tight">
                Order #{order.order_no || order.id.slice(0, 8)}
              </h3>
              {/* แสดงวันเวลาสั่งซื้อ */}
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span>สั่งเมื่อ: {formatOrderDateTime(order.order_date)}</span>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${style.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {currentState}
            </span>
          </div>

          {/* แสดงวันเวลานัดรับ */}
          {pickupFormatted && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1.5 rounded-lg">
              <Clock size={14} className="text-amber-600 shrink-0" />
              <span>เวลานัดรับ: {pickupFormatted}</span>
            </div>
          )}

          {/* Info */}
          <div className="mt-5 mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-medium text-slate-600 text-sm">
                {initialLetter}
              </div>

              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">
                  {customerName}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {order.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>
              </div>
            </div>

            <p className="shrink-0 text-slate-900 font-semibold text-base tabular-nums">
              {Number(order.total_price || 0).toLocaleString()}
              <span className="ml-1 text-xs font-normal text-slate-400">บาท</span>
            </p>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <p role="alert" className="mb-3 text-xs text-rose-600 font-medium">
            {errorMsg}
          </p>
        )}

        {/* Footer */}
        <div onClick={(e) => e.stopPropagation()}>
          {currentState === STATUS.PENDING && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-600 font-medium">
                  สลิปชำระเงิน:{" "}
                  {isVerified === true && (
                    <span className="text-emerald-600 font-semibold">ถูกต้องแล้ว</span>
                  )}
                  {isVerified === false && (
                    <span className="text-rose-600 font-semibold">สลิปไม่ถูกต้อง</span>
                  )}
                  {isVerified === null && (
                    <span className="text-amber-600 font-semibold">ยังไม่ได้ตรวจสอบ</span>
                  )}
                </span>

                {order.payment?.slip_url ? (
                  <button
                    type="button"
                    onClick={() => setShowSlipModal(true)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    <Eye size={14} /> ตรวจสอบสลิป
                  </button>
                ) : (
                  <span className="text-slate-400">ไม่มีสลิป</span>
                )}
              </div>

              <div className={isVerified === true ? "grid grid-cols-2 gap-2" : ""}>
                <button
                  type="button"
                  onClick={() => updateState(STATUS.CANCELLED)}
                  disabled={updating || verifyingSlip}
                  className="flex w-full items-center justify-center gap-1.5 h-10 rounded-xl border border-rose-200 bg-white text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pendingAction === STATUS.CANCELLED ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <X size={15} />
                  )}
                  ปฏิเสธ
                </button>

                {isVerified === true && (
                  <button
                    type="button"
                    onClick={() => updateState(STATUS.PRINTING)}
                    disabled={updating}
                    className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {pendingAction === STATUS.PRINTING ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    ยืนยัน
                  </button>
                )}
              </div>
            </div>
          )}

          {currentState === STATUS.PRINTING && (
            <button
              type="button"
              onClick={() => updateState(STATUS.DONE)}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pendingAction === STATUS.DONE ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Printer size={15} />
              )}
              พิมพ์เสร็จสิ้น
            </button>
          )}

          {currentState === STATUS.DONE && (
            <p className="text-sm text-blue-600 font-medium text-center">
              เสร็จสิ้นเรียบร้อยแล้ว
            </p>
          )}

          {currentState === STATUS.COMPLETED && (
            <p className="text-sm text-emerald-600 font-medium text-center">
              เสร็จสิ้นเรียบร้อยแล้ว
            </p>
          )}

          {currentState === STATUS.CANCELLED && (
            <p className="text-sm text-rose-500 font-medium text-center">
              ยกเลิกแล้ว
            </p>
          )}
        </div>
      </div>

      {/* Pop-up Modal แสดงรูปภาพสลิป */}
      {showSlipModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowSlipModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h4 className="font-semibold text-slate-800 text-base">
                หลักฐานการชำระเงิน (Order #{order.order_no || order.id.slice(0, 8)})
              </h4>
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-50 max-h-[60vh] overflow-auto">
              {order.payment?.slip_url ? (
                <img
                  src={order.payment.slip_url}
                  alt="สลิปชำระเงิน"
                  className="max-h-[55vh] w-auto object-contain rounded-lg shadow-md"
                />
              ) : (
                <p className="text-slate-400 text-sm py-10">ไม่พบรูปภาพสลิป</p>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ปิด
              </button>

              {isVerified === null && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleVerifySlip(false)}
                    disabled={verifyingSlip}
                    className="px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    สลิปไม่ถูกต้อง
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerifySlip(true)}
                    disabled={verifyingSlip}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {verifyingSlip ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    ยืนยันสลิปถูกต้อง
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}