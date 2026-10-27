"use client";

import { useState, useMemo, useEffect } from "react";
import PaginationBar from "./PaginationBar";

export interface PaymentDetail {
  id?: string;
  slip_url?: string;
  refund_slip_url?: string;
  amount?: number;
  status?: string;
  payment_date?: string;
  payout_date?: string;
}

export interface RefundItem {
  id: string;
  order_no?: number;
  total_price?: number;
  total_amount?: number;
  order_date?: string;
  canceled_at?: string;
  refunded_at?: string;
  created_at?: string;
  status?: string;
  refund_status?: string;
  refund_slip_url?: string;
  original_slip_url?: string;
  payment_status?: string;
  bank_account_no?: string;
  bank_name?: string;
  bank_account_name?: string;
  customer?: {
    id: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    contact?: string;
    bank_account_no?: string;
    bank_name?: string;
  };
  shop?: {
    id?: string;
    shop_name?: string;
  };
  payment?: PaymentDetail | PaymentDetail[];
}

interface RefundsTableProps {
  refunds: RefundItem[];
  loading: boolean;
  activeTab: "PENDING" | "REFUNDED";
  searchTerm: string;
  onSelectRefund: (item: RefundItem) => void;
  onViewSlip: (url: string) => void;
  getOrderAmount: (item: RefundItem) => number;
  getCustomerName: (item: RefundItem) => string;
  getOrderDate?: (item: RefundItem) => string;
  itemsPerPage?: number;
}

// 🟢 พาร์สวันเวลา รองรับทั้ง ค.ศ. และ พ.ศ.
export const parseThaiDate = (dateString?: string | null): Date | null => {
  if (!dateString) return null;

  let formattedStr = String(dateString);
  const yearMatch = formattedStr.match(/^(\d{4})/);
  if (yearMatch && Number(yearMatch[1]) > 2400) {
    const adYear = Number(yearMatch[1]) - 543;
    formattedStr = formattedStr.replace(/^(\d{4})/, String(adYear));
  }

  if (formattedStr.includes("T") && !formattedStr.endsWith("Z") && !formattedStr.includes("+")) {
    formattedStr += "Z";
  }

  let d = new Date(formattedStr);
  if (isNaN(d.getTime())) {
    d = new Date(formattedStr.replace(" ", "T"));
  }
  return isNaN(d.getTime()) ? null : d;
};

// 🟢 Helper Function แปลงเวลาเป็น Local Time ประเทศไทย (+7)
export const formatThaiDate = (dateString?: string | null) => {
  const date = parseThaiDate(dateString);
  if (!date) return "-";

  return date.toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function RefundsTable({
  refunds,
  loading,
  activeTab,
  searchTerm,
  onSelectRefund,
  onViewSlip,
  getOrderAmount,
  getCustomerName,
  getOrderDate,
  itemsPerPage = 10,
}: RefundsTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [refunds.length, activeTab, searchTerm]);

  const totalItems = refunds.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedRefunds = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return refunds.slice(startIndex, startIndex + itemsPerPage);
  }, [refunds, currentPage, itemsPerPage]);

  const getRefundUrgency = (dateString?: string) => {
    if (!dateString) {
      return {
        label: "อยู่ในกำหนด",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      };
    }

    const cancelDateObj = parseThaiDate(dateString) || new Date(dateString);
    const todayObj = new Date();

    const cancelDateOnly = new Date(
      cancelDateObj.getFullYear(),
      cancelDateObj.getMonth(),
      cancelDateObj.getDate()
    );
    const todayDateOnly = new Date(
      todayObj.getFullYear(),
      todayObj.getMonth(),
      todayObj.getDate()
    );

    const diffTime = todayDateOnly.getTime() - cancelDateOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 2) {
      return {
        label: `เกินกำหนด ${diffDays} วัน`,
        color: "text-rose-700 bg-rose-50 border-rose-200",
      };
    } else if (diffDays === 1) {
      return {
        label: "ครบกำหนดวันนี้",
        color: "text-amber-700 bg-amber-50 border-amber-200",
      };
    }

    return {
      label: "อยู่ในกำหนด",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
  };

  const getPaymentObj = (item: RefundItem): PaymentDetail | null => {
    if (!item.payment) return null;
    return Array.isArray(item.payment) ? item.payment[0] : item.payment;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium text-xs sm:text-sm">
        กำลังโหลดรายการคืนเงิน...
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium text-xs sm:text-sm">
        {searchTerm
          ? `ไม่พบรายการที่ตรงกับคำค้นหา "${searchTerm}"`
          : activeTab === "PENDING"
          ? "ไม่มีรายการที่รอคืนเงินในขณะนี้"
          : "ยังไม่มีประวัติการคืนเงิน"}
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans p-2 sm:p-0">
      {/* 📱 Mobile Card View (แสดงเฉพาะจอมือถือ) */}
      <div className="block md:hidden space-y-3">
        {paginatedRefunds.map((item) => {
          const payObj = getPaymentObj(item);
          const originalSlip = item.original_slip_url || payObj?.slip_url;
          const refundSlip = item.refund_slip_url || payObj?.refund_slip_url;
          const canceledDate = item.canceled_at || item.order_date || item.created_at;
          const completedRefundDate = item.refunded_at || payObj?.payout_date || null;
          const urgency = getRefundUrgency(canceledDate);
          const customerContact = item.customer?.contact;

          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              {/* Header Card */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-mono font-bold text-blue-600 text-xs">
                  #{item.order_no || item.id.slice(0, 8)}
                </span>
                {activeTab === "REFUNDED" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    คืนเงินแล้ว
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${urgency.color}`}
                  >
                    {urgency.label}
                  </span>
                )}
              </div>

              {/* Customer & Shop Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">ลูกค้า</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {getCustomerName(item)}
                  </span>
                  {customerContact && (
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {customerContact}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ร้านค้า</span>
                  <span className="font-medium text-slate-700 truncate block">
                    {item.shop?.shop_name || "-"}
                  </span>
                </div>
              </div>

              {/* Refund Amount Box */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">ยอดเงินคืน</span>
                  <span className="font-extrabold text-emerald-600 text-base">
                    ฿{getOrderAmount(item).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">
                    {activeTab === "REFUNDED" ? "วันที่คืนเงินสำเร็จ" : "วันที่ยกเลิก"}
                  </span>
                  <span className="text-[11px] font-medium text-slate-600">
                    {formatThaiDate(activeTab === "REFUNDED" ? completedRefundDate : canceledDate)}
                  </span>
                </div>
              </div>

              {/* Actions & Slips */}
              <div className="flex items-center justify-between pt-1">
                {originalSlip ? (
                  <button
                    type="button"
                    onClick={() => onViewSlip(originalSlip)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 font-medium cursor-pointer"
                  >
                    สลิปเดิมลูกค้า
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">ไม่มีสลิปเดิม</span>
                )}

                {activeTab === "PENDING" ? (
                  <button
                    type="button"
                    onClick={() => onSelectRefund(item)}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    โอนเงินคืน
                  </button>
                ) : (
                  refundSlip && (
                    <button
                      type="button"
                      onClick={() => onViewSlip(refundSlip)}
                      className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                      ดูสลิปโอนคืน
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 💻 Desktop Table View (แสดงบนจอคอม) */}
      <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th className="py-4 px-4 whitespace-nowrap">ออเดอร์</th>
              <th className="py-4 px-4 whitespace-nowrap min-w-[250px]">
                ผู้รับเงินคืน / ช่องทาง
              </th>
              <th className="py-4 px-4 whitespace-nowrap">ร้านค้า</th>
              <th className="py-4 px-4 whitespace-nowrap">ยอดเงินคืน</th>
              <th className="py-4 px-4 whitespace-nowrap">หลักฐานการชำระ</th>
              <th className="py-4 px-4 whitespace-nowrap">วันที่ยกเลิก</th>
              {activeTab === "REFUNDED" ? (
                <th className="py-4 px-4 whitespace-nowrap">
                  วันที่โอนคืนสำเร็จ
                </th>
              ) : (
                <th className="py-4 px-4 whitespace-nowrap">สถานะกำหนดการ</th>
              )}
              <th className="py-4 px-4 text-center whitespace-nowrap min-w-[140px]">
                ดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRefunds.map((item) => {
              const payObj = getPaymentObj(item);
              const originalSlip = item.original_slip_url || payObj?.slip_url;
              const refundSlip = item.refund_slip_url || payObj?.refund_slip_url;

              const canceledDate =
                item.canceled_at || item.order_date || item.created_at;

              const completedRefundDate =
                item.refunded_at || payObj?.payout_date || null;

              const urgency = getRefundUrgency(canceledDate);
              const customerContact = item.customer?.contact;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 px-4 font-mono font-bold text-blue-600 text-xs whitespace-nowrap">
                    #{item.order_no || item.id.slice(0, 8)}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800 text-xs mb-1">
                      {getCustomerName(item)}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        <svg
                          className="w-3.5 h-3.5 text-blue-600 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>โอนคืนตามสลิปเดิมลูกค้า</span>
                      </div>
                      {customerContact && (
                        <p className="text-[11px] text-slate-500 font-mono">
                          {customerContact}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                    {item.shop?.shop_name || "-"}
                  </td>

                  <td className="py-4 px-4 font-bold text-emerald-600 text-base whitespace-nowrap">
                    ฿
                    {getOrderAmount(item).toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {originalSlip ? (
                      <button
                        type="button"
                        onClick={() => onViewSlip(originalSlip)}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-all font-medium cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        สลิปเดิมลูกค้า
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        ไม่มีสลิปเดิม
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                    {formatThaiDate(canceledDate)}
                  </td>

                  {activeTab === "REFUNDED" ? (
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                      {formatThaiDate(completedRefundDate)}
                    </td>
                  ) : (
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${urgency.color}`}
                      >
                        {urgency.label}
                      </span>
                    </td>
                  )}

                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {activeTab === "PENDING" ? (
                      <button
                        type="button"
                        onClick={() => onSelectRefund(item)}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                      >
                        โอนเงินคืน
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          คืนเงินแล้ว
                        </span>
                        {refundSlip && (
                          <button
                            type="button"
                            onClick={() => onViewSlip(refundSlip)}
                            className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                          >
                            ดูสลิปโอนคืน
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="pt-2">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}