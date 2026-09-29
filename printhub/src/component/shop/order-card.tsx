"use client";

import { Check, X, Printer, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

type Order = {
  id: string;
  customer_id: string;
  shop_id: string;
  description: string | null;
  order_date: string;
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
};

type Props = {
  order: Order;
  onClick?: () => void;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  disabled?: boolean; // เพิ่ม prop disabled เพื่อรองรับการบล็อกการทำงานกรณีร้านถูกระงับ
};

const API_BASE = "http://localhost:5000";

const STATUS = {
  PENDING: "รอการดำเนินงาน",
  PRINTING: "กำลังพิมพ์",
  DONE: "พิมพ์เสร็จสิ้น",
  COMPLETED: "รายการเสร็จสิ้น",
  CANCELLED: "ยกเลิกการพิมพ์",
} as const;

// สีของสถานะ: ป้ายพื้นอ่อน + จุดสีเข้ม
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
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
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
  // เก็บว่ากำลังกดปุ่มไหนอยู่ เพื่อให้หมุนเฉพาะปุ่มที่กด
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updating = pendingAction !== null;

  useEffect(() => {
    setCurrentState(
      order.latest_status || order.current_status?.state || STATUS.PENDING
    );
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
    } catch (err) {
      console.error("[OrderCard] request failed:", err);
      setErrorMsg("ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setPendingAction(null);
    }
  }

  const customerName = order.customer
    ? `${order.customer.first_name || ""} ${order.customer.last_name || ""}`.trim()
    : "ลูกค้าทั่วไป";
  const initialLetter = order.customer?.first_name?.charAt(0) || "U";

  const style = STATUS_STYLE[currentState] ?? FALLBACK_STYLE;

  const handleCardClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white border border-slate-200 rounded-2xl p-6 transition-all flex flex-col justify-between ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-slate-300 hover:shadow-sm cursor-pointer"
      }`}
    >
      <div>
        {/* Header: Order ID + สถานะ */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 text-base tracking-tight">
              Order #{order.id.slice(0, 8)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(order.order_date).toLocaleDateString("th-TH")}
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${style.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {currentState}
          </span>
        </div>

        {/* Info: ลูกค้า + รายละเอียด + ยอดชำระ */}
        <div className="mt-6 mb-6 flex items-center justify-between gap-3">
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
        <p role="alert" className="mb-3 text-xs text-rose-600">
          {errorMsg}
        </p>
      )}

      {/* Footer: ปุ่มดำเนินการ */}
      <div onClick={(e) => e.stopPropagation()}>
        {currentState === STATUS.PENDING && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateState(STATUS.CANCELLED)}
              disabled={updating || disabled}
              className="flex items-center justify-center gap-1.5 h-10 rounded-xl border border-rose-200 bg-white text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pendingAction === STATUS.CANCELLED ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <X size={15} />
              )}
              ปฏิเสธ
            </button>
            <button
              type="button"
              onClick={() => updateState(STATUS.PRINTING)}
              disabled={updating || disabled}
              className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pendingAction === STATUS.PRINTING ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              ยืนยัน
            </button>
          </div>
        )}

        {currentState === STATUS.PRINTING && (
          <button
            type="button"
            onClick={() => updateState(STATUS.DONE)}
            disabled={updating || disabled}
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

        {(currentState === STATUS.DONE ||
          currentState === STATUS.COMPLETED) && (
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
  );
}