"use client";

export interface TransactionItem {
  id: string;
  order_id: string;
  amount: number;
  net_amount?: number;
  platform_fee: number;
  shop_income?: number;
  payment_method?: string;
  payment_date: string;
  status?: string;
  slip_url?: string;
  customer_name?: string; // 👈 เพิ่มรองรับชื่อลูกค้า
  shop_name?: string;     // 👈 เพิ่มรองรับชื่อร้านค้า
}

interface SlipModalProps {
  transaction: TransactionItem | null;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}

export default function SlipModal({ transaction, onClose, formatDate }: SlipModalProps) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-slate-900">หลักฐานการโอนเงิน (สลิป)</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
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
          <p className="flex justify-between">
            <span className="font-semibold text-slate-500">วันที่-เวลา:</span>
            <span className="text-slate-700">{formatDate(transaction.payment_date)}</span>
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex justify-center p-2">
          <img
            src={
              transaction.slip_url ||
              "https://via.placeholder.com/300x500?text=No+Slip+Image"
            }
            alt="สลิปการชำระเงิน"
            className="max-h-96 object-contain rounded-lg"
          />
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