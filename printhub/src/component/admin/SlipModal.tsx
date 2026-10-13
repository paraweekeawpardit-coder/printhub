"use client";

import { useState, useEffect } from "react";

export interface TransactionItem {
  id: string;
  order_id: string;
  amount: number;
  net_amount?: number;
  platform_fee: number;
  shop_income?: number;
  payment_date: string;
  payout_date?: string; // 🟢 วันที่แอดมินโอนเงินคืน
  updated_at?: string;  // 🟢 วันที่อัปเดตสถานะล่าสุด
  status?: string;
  slip_url?: string;
  refund_slip_url?: string;
  customer_name?: string;
  shop_name?: string;
}

interface SlipModalProps {
  transaction: TransactionItem | null;
  onClose: () => void;
  formatDate?: (dateString?: string | null) => string;
}

// 🟢 Helper Function แปลงเวลาเป็น Thai Local Time (Asia/Bangkok +7)
export const formatThaiDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok", // 🟢 บังคับ Timezone ประเทศไทย (+7)
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function SlipModal({ transaction, onClose, formatDate: propFormatDate }: SlipModalProps) {
  const [activeTab, setActiveTab] = useState<"customer" | "refund">("customer");

  const formatDate = (dateString?: string | null) => {
    return formatThaiDate(dateString);
  };

  useEffect(() => {
    if (transaction) {
      // หากเป็นรายการคืนเงินและมีสลิปคืนเงิน ให้เปิดแท็บสลิปคืนเงินเป็น default
      const isRefunded = String(transaction.status || "").toUpperCase() === "REFUNDED";
      if (isRefunded && transaction.refund_slip_url) {
        setActiveTab("refund");
      } else {
        setActiveTab("customer");
      }
    }
  }, [transaction]);

  if (!transaction) return null;

  const isRefunded = String(transaction.status || "").toUpperCase() === "REFUNDED";
  const currentImageUrl = activeTab === "refund" ? transaction.refund_slip_url : transaction.slip_url;

  // คำนวณวันที่โอนคืน (ดึงจาก payout_date หรือ updated_at)
  const refundDate = transaction.payout_date || transaction.updated_at;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-slate-900">หลักฐานการชำระเงิน / คืนเงิน</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ข้อมูลสรุป */}
        <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <p className="flex justify-between items-center">
            <span className="font-semibold text-slate-500">สถานะรายการ:</span>
            {isRefunded ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                คืนเงินแล้ว (Refunded)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ชำระเงินเรียบร้อย
              </span>
            )}
          </p>
          <p className="flex justify-between">
            <span className="font-semibold text-slate-500">Transaction ID:</span>
            <span className="font-mono text-slate-700">{transaction.id ? `TX-${transaction.id.slice(0, 8).toUpperCase()}` : "-"}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold text-slate-500">Order ID:</span>
            <span className="font-mono text-blue-600 font-medium">{transaction.order_id}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold text-slate-500">ลูกค้า:</span>
            <span className="text-slate-800 font-medium">{transaction.customer_name || "-"}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold text-slate-500">ร้านค้า:</span>
            <span className="text-slate-800 font-medium">{transaction.shop_name || "-"}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold text-slate-500">ยอดเงินชำระ:</span>
            <span className="font-bold text-slate-900">฿{transaction.amount?.toFixed(2)}</span>
          </p>

          {/* 🟢 แสดงวันที่-เวลา ชำระเงินของลูกค้า */}
          <p className="flex justify-between">
            <span className="font-semibold text-slate-500">วันที่-เวลา (รับชำระ):</span>
            <span className="text-slate-700 font-medium">{formatDate(transaction.payment_date)}</span>
          </p>

          {/* 🟢 แสดงวันที่โอนคืน (แสดงเฉพาะเมื่อรายการมีสถานะคืนเงินแล้ว) */}
          {isRefunded && (
            <p className="flex justify-between text-amber-800 pt-1 border-t border-slate-200/60">
              <span className="font-semibold">วันที่โอนคืนสำเร็จ:</span>
              <span className="font-bold">{refundDate ? formatDate(refundDate) : "-"}</span>
            </p>
          )}
        </div>

        {/* ปุ่มสลับแท็บดูสลิปลูกค้า vs สลิปคืนเงิน (ถ้าเป็นรายการคืนเงิน) */}
        {isRefunded && (
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("customer")}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "customer" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              สลิปเดิมลูกค้า
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("refund")}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "refund" ? "bg-amber-500 text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              สลิปโอนคืน (แอดมิน)
            </button>
          </div>
        )}

        {/* แสดงรูปภาพสลิป */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex justify-center p-1">
          {currentImageUrl ? (
            <div className="relative group w-full rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={currentImageUrl}
                alt="สลิปหลักฐาน"
                className="max-h-80 w-full object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
              <a
                href={currentImageUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                เปิดดูรูปขนาดเต็ม
              </a>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs py-8">
              {activeTab === "refund" ? "ไม่มีสลิปโอนเงินคืน (โอนในระบบเดิม)" : "ไม่พบรูปภาพสลิป"}
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-xl font-medium transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}