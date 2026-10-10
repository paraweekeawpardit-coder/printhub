"use client";

import { TransactionItem } from "./SlipModal";

interface SlipTableProps {
  transactions: TransactionItem[];
  loading: boolean;
  onSelectSlip: (tx: TransactionItem) => void;
  formatDate: (dateString: string) => string;
}

export default function SlipTable({
  transactions,
  loading,
  onSelectSlip,
  formatDate,
}: SlipTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-4">Transaction ID</th>
              <th className="py-4 px-4">เลขที่ออเดอร์</th>
              <th className="py-4 px-4">ลูกค้า</th>
              <th className="py-4 px-4">ร้านค้า</th>
              <th className="py-4 px-4">ยอดชำระ</th>
              <th className="py-4 px-4">ค่าธรรมเนียม</th>
              <th className="py-4 px-4">ช่องทาง</th>
              <th className="py-4 px-4">วันที่-เวลา</th>
              <th className="py-4 px-4 text-center">สลิปโอนเงิน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  กำลังโหลดข้อมูลธุรกรรม...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => {
                // จัดรูปแบบ Transaction ID ให้สั้นลง ดูสบายตา (เช่น TX-FC3C4DCA)
                const shortTxId = tx.id ? `TX-${tx.id.slice(0, 8).toUpperCase()}` : "-";

                // จัดรูปแบบ Order ID ให้มี # เดียว
                const displayOrderNo = tx.order_id
                  ? `#${String(tx.order_id).replace(/^#+/, "")}`
                  : "-";

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Transaction ID */}
                    <td 
                      className="py-4 px-4 font-mono text-xs font-semibold text-slate-600" 
                      title={tx.id} // Hover เพื่อดู UUID ตัวเต็มได้
                    >
                      {shortTxId}
                    </td>

                    {/* Order ID */}
                    <td className="py-4 px-4 font-mono text-xs text-blue-600 font-medium">
                      {displayOrderNo}
                    </td>

                    {/* ชื่อลูกค้า */}
                    <td className="py-4 px-4 text-slate-800 font-medium">
                      {tx.customer_name || "-"}
                    </td>

                    {/* ชื่อร้านค้า */}
                    <td className="py-4 px-4 text-slate-700">
                      {tx.shop_name || "-"}
                    </td>

                    {/* ยอดชำระ */}
                    <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">
                      ฿{tx.amount?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                    </td>

                    {/* ค่าธรรมเนียม */}
                    <td className="py-4 px-4 text-emerald-600 font-semibold whitespace-nowrap">
                      +฿
                      {tx.platform_fee?.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      }) || "0.00"}
                    </td>

                    {/* ช่องทาง */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                        {tx.payment_method || "PromptPay"}
                      </span>
                    </td>

                    {/* วันที่-เวลา */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      {formatDate(tx.payment_date)}
                    </td>

                    {/* ปุ่มดูสลิป */}
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => onSelectSlip(tx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ดูสลิป
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  ไม่พบข้อมูลรายการสลิปชำระเงิน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}