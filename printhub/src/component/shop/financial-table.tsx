"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";

export type Transaction = {
  id: string;
  date: string;
  customer_name: string;
  gross: number;
  fee: number;
  net: number;
};

type TrendItem = { label: string; amount: number };

type Props = {
  totalGross: number;
  totalFee: number;
  totalNet: number;
  transactions: Transaction[];
  financialTrend?: {
    daily: TrendItem[];
    weekly: TrendItem[];
    monthly: TrendItem[];
    yearly: TrendItem[];
  };
  onOrderClick: (id: string) => void;
};

export default function FinancialTable({
  totalGross,
  totalFee,
  totalNet,
  transactions,
  financialTrend,
  onOrderClick,
}: Props) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("yearly");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const defaultLayout: Record<string, TrendItem[]> = {
    daily: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."].map((l) => ({ label: l, amount: 0 })),
    weekly: ["สัปดาห์ 1", "สัปดาห์ 2", "สัปดาห์ 3", "สัปดาห์ 4"].map((l) => ({ label: l, amount: 0 })),
    monthly: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."].map((l) => ({ label: l, amount: 0 })),
    yearly: ["2565", "2566", "2567", "2568", "2569"].map((l) => ({ label: l, amount: 0 })),
  };

  const currentChartData: TrendItem[] =
    financialTrend?.[timeframe] && financialTrend[timeframe].length > 0
      ? financialTrend[timeframe]
      : defaultLayout[timeframe];

  const maxAmount = Math.max(...currentChartData.map((d) => d.amount), 1);

  const filteredTransactions = transactions.filter((t) => {
    const matchId = t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCustomer = t.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchId || matchCustomer;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-bold text-[#0F2942]">
          สรุปการเงินและค่าธรรมเนียม
        </h3>
        <p className="text-xs text-slate-500">
          รายละเอียดรายได้ ยอดหักค่าธรรมเนียมแพลตฟอร์ม และยอดรับสุทธิ
        </p>
      </div>

      {/* 3 สรุปการเงิน Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-semibold">ยอดขายรวม (Gross)</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-800">
            ฿{totalGross.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-semibold">หักค่าธรรมเนียม</span>
          </div>
          <p className="mt-2 text-xl font-bold text-amber-600">
            -฿{totalFee.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-semibold">รายได้สุทธิที่ได้รับ</span>
          </div>
          <p className="mt-2 text-xl font-bold text-emerald-600">
            ฿{totalNet.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Bar Chart รายได้ */}
      <div className="relative mb-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <p className="text-xs font-semibold text-slate-700">
              กราฟแนวโน้มรายได้สุทธิ (บาท)
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-200/60 p-0.5 text-[11px] font-medium">
            <button
              onClick={() => setTimeframe("daily")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "daily" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              รายวัน
            </button>
            <button
              onClick={() => setTimeframe("weekly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              รายสัปดาห์
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              รายเดือน
            </button>
            <button
              onClick={() => setTimeframe("yearly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "yearly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              รายปี
            </button>
          </div>
        </div>

        {/* แสดงแท่งกราฟ */}
        <div className="flex h-36 items-end justify-between gap-1.5 overflow-x-auto pt-4 pb-1">
          {currentChartData.map((item, idx) => {
            const heightPercent = Math.round((item.amount / maxAmount) * 100);

            return (
              <div key={idx} className="flex flex-1 min-w-[32px] flex-col items-center gap-1.5">
                <span className={`text-[9px] font-bold ${item.amount > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                  {item.amount > 0 ? `฿${item.amount.toLocaleString()}` : "0"}
                </span>
                <div className="flex h-24 w-full items-end justify-center rounded-lg bg-slate-100/80 p-1">
                  <div
                    style={{ height: `${Math.max(heightPercent, item.amount > 0 ? 10 : 4)}%` }}
                    className={`w-full max-w-[20px] rounded-md transition-all duration-300 ${
                      item.amount > 0 ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm" : "bg-slate-200"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 truncate max-w-[50px] text-center" title={item.label}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ตารางรายการทางการเงิน */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหา Order ID หรือชื่อลูกค้า..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">ออเดอร์</th>
                <th className="p-3">วันที่/เวลา</th>
                <th className="p-3">ลูกค้า</th>
                <th className="p-3 text-right">ยอดเต็ม</th>
                <th className="p-3 text-right">ค่าธรรมเนียม</th>
                <th className="p-3 text-right">รับสุทธิ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onOrderClick(t.id)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="p-3 font-semibold text-slate-800">#{t.id.slice(0, 8)}</td>
                    <td className="p-3 text-slate-400">{new Date(t.date).toLocaleDateString("th-TH")}</td>
                    <td className="p-3">{t.customer_name}</td>
                    <td className="p-3 text-right font-medium">฿{t.gross.toFixed(2)}</td>
                    <td className="p-3 text-right text-amber-600">-฿{t.fee.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">฿{t.net.toFixed(2)}</td>
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

        {/* Pagination */}
        {filteredTransactions.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span>
              แสดง {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} จาก {filteredTransactions.length} รายการ
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 p-1 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-medium text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 p-1 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}