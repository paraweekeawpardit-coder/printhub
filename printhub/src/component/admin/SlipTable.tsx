"use client";

import { TransactionItem } from "./SlipModal";

interface SlipTableProps {
  transactions: TransactionItem[];
  loading: boolean;
  onSelectSlip: (tx: TransactionItem) => void;
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

export default function SlipTable({
  transactions,
  loading,
  onSelectSlip,
  formatDate: propFormatDate,
}: SlipTableProps) {
  // ใช้วันที่แบบ +7 เสมอ
  const formatDate = (dateString?: string | null) => {
    return formatThaiDate(dateString);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Transaction ID</th>
            <th className="py-3.5 px-4">เลขที่ออเดอร์</th>
            <th className="py-3.5 px-4">ลูกค้า</th>
            <th className="py-3.5 px-4">ร้านค้า</th>
            <th className="py-3.5 px-4">ยอดชำระ</th>
            <th className="py-3.5 px-4">ค่าธรรมเนียม</th>
            <th className="py-3.5 px-4">สถานะ</th>
            <th className="py-3.5 px-4">วันที่-เวลา</th>
            <th className="py-3.5 px-4 text-center">สลิปโอนเงิน</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {loading ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-slate-400">
                กำลังโหลดข้อมูลประวัติการชำระเงิน...
              </td>
            </tr>
          ) : transactions.length > 0 ? (
            transactions.map((tx) => {
              const shortTxId = tx.id ? `TX-${tx.id.slice(0, 8).toUpperCase()}` : "-";

              const displayOrderNo = tx.order_id
                ? `#${String(tx.order_id).replace(/^#+/, "")}`
                : "-";

              const isRefunded = tx.status === "REFUNDED";

              return (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Transaction ID */}
                  <td 
                    className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600" 
                    title={tx.id}
                  >
                    {shortTxId}
                  </td>

                  {/* Order ID */}
                  <td className="py-3.5 px-4 font-mono text-xs text-blue-600 font-medium">
                    {displayOrderNo}
                  </td>

                  {/* ลูกค้า */}
                  <td className="py-3.5 px-4 text-slate-800 font-medium">
                    {tx.customer_name || "-"}
                  </td>

                  {/* ร้านค้า */}
                  <td className="py-3.5 px-4 text-slate-700">
                    {tx.shop_name || "-"}
                  </td>

                  {/* ยอดชำระ */}
                  <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                    ฿{tx.amount?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                  </td>

                  {/* ค่าธรรมเนียม */}
                  <td className="py-3.5 px-4 text-emerald-600 font-semibold whitespace-nowrap">
                    +฿
                    {tx.platform_fee?.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                    }) || "0.00"}
                  </td>

                  {/* สถานะ */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isRefunded ? (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        คืนเงินแล้ว
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ชำระสำเร็จ
                      </span>
                    )}
                  </td>

                  {/* วันที่-เวลา */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(tx.payment_date)}
                  </td>

                  {/* ปุ่มดูสลิป */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    {tx.slip_url ? (
                      <button
                        onClick={() => onSelectSlip(tx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ดูสลิป
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-normal">ไม่มีสลิป</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="py-12 text-center text-slate-400">
                ไม่พบข้อมูลประวัติรายการชำระเงินตามเงื่อนไข
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}