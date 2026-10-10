"use client";

import { useState } from "react";

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
  getOrderDate: (item: RefundItem) => string;
}

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
}: RefundsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAcc = (accNo?: string, id?: string) => {
    if (!accNo || !id) return;
    navigator.clipboard.writeText(accNo);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // คำนวณสถานะกำหนดการคืนเงิน (SLA) ตามวันในปฏิทิน
  const getRefundUrgency = (dateString?: string) => {
    if (!dateString) {
      return { label: "อยู่ในกำหนด", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    }

    const cancelDateObj = new Date(dateString);
    const todayObj = new Date();

    const cancelDateOnly = new Date(cancelDateObj.getFullYear(), cancelDateObj.getMonth(), cancelDateObj.getDate());
    const todayDateOnly = new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());

    const diffTime = todayDateOnly.getTime() - cancelDateOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 2) {
      return { label: `เกินกำหนด ${diffDays} วัน`, color: "text-rose-700 bg-rose-50 border-rose-200" };
    } else if (diffDays === 1) {
      return { label: "ครบกำหนดวันนี้", color: "text-amber-700 bg-amber-50 border-amber-200" };
    }

    return { label: "อยู่ในกำหนด", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  };

  const getPaymentObj = (item: RefundItem): PaymentDetail | null => {
    if (!item.payment) return null;
    return Array.isArray(item.payment) ? item.payment[0] : item.payment;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        กำลังโหลดรายการคืนเงิน...
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium">
        {searchTerm
          ? `ไม่พบรายการที่ตรงกับคำค้นหา "${searchTerm}"`
          : activeTab === "PENDING"
          ? "ไม่มีรายการที่รอคืนเงินในขณะนี้"
          : "ยังไม่มีประวัติการคืนเงิน"}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto font-sans">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <th className="py-4 px-4 whitespace-nowrap">ออเดอร์</th>
            <th className="py-4 px-4 whitespace-nowrap min-w-[250px]">ผู้รับเงินคืน / ช่องทาง</th>
            <th className="py-4 px-4 whitespace-nowrap">ร้านค้า</th>
            <th className="py-4 px-4 whitespace-nowrap">ยอดเงินคืน</th>
            <th className="py-4 px-4 whitespace-nowrap">หลักฐานการชำระ</th>
            <th className="py-4 px-4 whitespace-nowrap">วันที่ยกเลิก</th>
            {activeTab === "REFUNDED" ? (
              <th className="py-4 px-4 whitespace-nowrap">วันที่โอนคืนสำเร็จ</th>
            ) : (
              <th className="py-4 px-4 whitespace-nowrap">สถานะกำหนดการ</th>
            )}
            <th className="py-4 px-4 text-center whitespace-nowrap min-w-[140px]">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {refunds.map((item) => {
            const payObj = getPaymentObj(item);
            const originalSlip = item.original_slip_url || payObj?.slip_url;
            const refundSlip = item.refund_slip_url || payObj?.refund_slip_url;
            
            // ใช้วันที่ยกเลิกจริงเป็นหลัก
            const canceledDate = item.canceled_at || item.order_date || item.created_at;
            const completedRefundDate = item.refunded_at || payObj?.payment_date || payObj?.payout_date || canceledDate;
            const urgency = getRefundUrgency(canceledDate);

            // ข้อมูลบัญชีรับเงินของลูกค้า
            const accNo = item.bank_account_no || item.customer?.bank_account_no;
            const bankName = item.bank_name || item.customer?.bank_name || "PromptPay";
            const accName = item.bank_account_name || getCustomerName(item);

            return (
              <tr
                key={item.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {/* ออเดอร์ */}
                <td className="py-4 px-4 font-mono font-bold text-blue-600 text-xs whitespace-nowrap">
                  #{item.order_no || item.id.slice(0, 8)}
                </td>

                {/* ผู้รับเงินคืน / ช่องทาง */}
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-800 text-xs mb-1">
                    {getCustomerName(item)}
                  </div>
                  {accNo ? (
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="font-semibold text-slate-700">{bankName}:</span>
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-800">
                          {accNo}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAcc(accNo, item.id)}
                          className="text-[10px] text-blue-600 hover:bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 transition-all cursor-pointer font-medium shrink-0"
                        >
                          {copiedId === item.id ? "คัดลอกแล้ว!" : "คัดลอก"}
                        </button>
                      </div>
                      {accName && (
                        <div className="text-slate-500 text-[11px] whitespace-nowrap">
                          <span className="font-medium text-slate-600">ชื่อบัญชี:</span> {accName}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      {item.customer?.contact || "ไม่ระบุช่องทางติดต่อ"}
                    </div>
                  )}
                </td>

                {/* ร้านค้า */}
                <td className="py-4 px-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                  {item.shop?.shop_name || "-"}
                </td>

                {/* ยอดเงินคืน */}
                <td className="py-4 px-4 font-bold text-emerald-600 text-base whitespace-nowrap">
                  ฿{getOrderAmount(item).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </td>

                {/* หลักฐานการชำระ */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {originalSlip ? (
                    <button
                      type="button"
                      onClick={() => onViewSlip(originalSlip)}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-all font-medium cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      สลิปเดิมลูกค้า
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">ไม่มีสลิปเดิม</span>
                  )}
                </td>

                {/* วันที่ยกเลิก (ส่ง canceledDate ไปโชว์โดยตรง) */}
                <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                  {getOrderDate({ ...item, order_date: canceledDate, created_at: canceledDate })}
                </td>

                {/* SLA คืนเงิน / วันที่โอนคืนสำเร็จ */}
                {activeTab === "REFUNDED" ? (
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                    {getOrderDate({ ...item, order_date: completedRefundDate, created_at: completedRefundDate })}
                  </td>
                ) : (
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${urgency.color}`}>
                      {urgency.label}
                    </span>
                  </td>
                )}

                {/* ดำเนินการ */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  {activeTab === "PENDING" ? (
                    <button
                      type="button"
                      onClick={() => onSelectRefund(item)}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95 cursor-pointer"
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
  );
}