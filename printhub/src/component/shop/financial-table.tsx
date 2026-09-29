import { ArrowUpRight, DollarSign, Receipt, CreditCard } from "lucide-react";

export type Transaction = {
  paymentId: string;
  orderId: string;
  customerName: string;
  paymentDate: string;
  grossAmount: number;
  feeAmount: number;
  netIncome: number;
  status: string;
};

type Props = {
  totalGross: number;
  totalFee: number;
  totalNet: number;
  transactions: Transaction[];
  onOrderClick?: (orderId: string) => void;
};

export default function FinancialTable({
  totalGross,
  totalFee,
  totalNet,
  transactions,
  onOrderClick,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#0F2942]">
            สรุปการเงินและค่าธรรมเนียม
          </h3>
          <p className="text-xs text-slate-500">
            รายละเอียดรายได้ ยอดหักค่าธรรมเนียมแพลตฟอร์ม และยอดรับสุทธิ
          </p>
        </div>
      </div>

      {/* สรุปตัวเลขทางการเงิน 3 ก้อนย่อย */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Receipt className="h-4 w-4 text-slate-600" /> ยอดขายรวม (Gross)
          </div>
          <p className="mt-2 text-lg font-bold text-slate-800">
            ฿{totalGross.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2 text-xs text-amber-700">
            <CreditCard className="h-4 w-4 text-amber-600" /> หักค่าธรรมเนียม
          </div>
          <p className="mt-2 text-lg font-bold text-amber-700">
            -฿{totalFee.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 text-xs text-emerald-700">
            <DollarSign className="h-4 w-4 text-emerald-600" /> รายได้สุทธิที่ได้รับ
          </div>
          <p className="mt-2 text-xl font-extrabold text-emerald-600">
            ฿{totalNet.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* ตารางรายการ */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 rounded-l-lg">ออเดอร์</th>
              <th className="px-4 py-3">วันที่/เวลา</th>
              <th className="px-4 py-3">ลูกค้า</th>
              <th className="px-4 py-3 text-right">ยอดเต็ม</th>
              <th className="px-4 py-3 text-right">ค่าธรรมเนียม</th>
              <th className="px-4 py-3 text-right rounded-r-lg">รับสุทธิ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <tr key={item.paymentId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    <button
                      onClick={() => onOrderClick?.(item.orderId)}
                      className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                    >
                      #{item.orderId.slice(0, 8)}
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {new Date(item.paymentDate).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3.5">{item.customerName}</td>
                  <td className="px-4 py-3.5 text-right font-medium">
                    ฿{item.grossAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-amber-600">
                    -฿{item.feeAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                    ฿{item.netIncome.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  ยังไม่มีประวัติรายการการเงิน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}