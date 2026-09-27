"use client";

export interface TransactionItem {
  id: string;
  order_id: string;
  amount: number;
  net_amount: number;
  platform_fee: number;
  payment_method: string;
  payment_date: string;
  status: string;
  slip_url?: string;
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
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-1 text-xs text-slate-600">
          <p>
            <span className="font-semibold text-slate-800">Order ID:</span>{" "}
            {transaction.order_id}
          </p>
          <p>
            <span className="font-semibold text-slate-800">ยอดเงิน:</span> ฿
            {transaction.amount?.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold text-slate-800">วันที่:</span>{" "}
            {formatDate(transaction.payment_date)}
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
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-xl font-medium transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}