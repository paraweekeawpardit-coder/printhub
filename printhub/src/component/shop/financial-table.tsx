"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Calendar, Search, Eye, Clock, X } from "lucide-react";

export type Transaction = {
  id: string; // uuid สำหรับคลิก
  order_no?: number | string; // แสดงเลข order_no
  date: string;
  gross: number;
  fee: number;
  net: number;
  payout_slip_url?: string | null; // มีค่า = โอนเงินให้ร้านแล้ว
  payout_date?: string | null;
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
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [searchTerm, setSearchTerm] = useState("");
  const [slip, setSlip] = useState<{ url: string; orderLabel: string } | null>(null);

  // ปิดหน้าต่างสลิปด้วยปุ่ม Esc
  useEffect(() => {
    if (!slip) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSlip(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slip]);

  const defaultLayout: Record<string, TrendItem[]> = {
    daily: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."].map((l) => ({ label: l, amount: 0 })),
    weekly: ["สัปดาห์ 1", "สัปดาห์ 2", "สัปดาห์ 3", "สัปดาห์ 4"].map((l) => ({ label: l, amount: 0 })),
    monthly: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."].map((l) => ({ label: l, amount: 0 })),
  };

  const currentChartData: TrendItem[] =
    financialTrend?.[timeframe] && financialTrend[timeframe].length > 0
      ? financialTrend[timeframe]
      : defaultLayout[timeframe];

  const maxAmount = Math.max(...currentChartData.map((d) => d.amount), 1);

  const filteredTransactions = transactions.filter((t) => {
    const orderNoStr = t.order_no ? String(t.order_no) : t.id;
    return orderNoStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ใช้ colgroup เดียวกันทั้งหัวตารางและตัวตาราง เพื่อให้คอลัมน์ตรงกัน
  const Cols = () => (
    <colgroup>
      <col style={{ width: "17%" }} />
      <col style={{ width: "17%" }} />
      <col style={{ width: "16%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "16%" }} />
      <col style={{ width: "16%" }} />
    </colgroup>
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
          </div>
        </div>

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

      {/* ตารางรายการทางการเงิน (Scrollable แนวตั้ง แสดงครั้งละประมาณ 3-4 แถว) */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขออเดอร์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full table-fixed text-left text-xs">
            <Cols />
            <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
              <tr>
                <th className="p-3">ออเดอร์</th>
                <th className="p-3">วันที่/เวลา</th>
                <th className="p-3 text-right">ยอดเต็ม</th>
                <th className="p-3 text-right">ค่าธรรมเนียม</th>
                <th className="p-3 text-right">รับสุทธิ</th>
                <th className="p-3 text-center">สถานะการโอน</th>
              </tr>
            </thead>
          </table>

          {/* คอนเทนเนอร์ scrollbar จำกัดความสูงของตารางไม่ให้ล้นยาวเกินไป */}
          <div className="max-h-[180px] overflow-y-auto">
            <table className="w-full table-fixed text-left text-xs">
              <Cols />
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => {
                    const orderLabel = `#${t.order_no || t.id.slice(0, 8)}`;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => onOrderClick(t.id)}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <td className="p-3 font-semibold text-slate-800">{orderLabel}</td>
                        <td className="p-3 text-slate-400">{new Date(t.date).toLocaleDateString("th-TH")}</td>
                        <td className="p-3 text-right font-medium">฿{t.gross.toFixed(2)}</td>
                        <td className="p-3 text-right text-amber-600">-฿{t.fee.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">฿{t.net.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          {t.payout_slip_url ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // ไม่ให้เปิดหน้า order detail
                                setSlip({ url: t.payout_slip_url!, orderLabel });
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              ดูสลิป
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              กำลังดำเนินการ
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
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
      </div>

      {/* หน้าต่างแสดงสลิปการโอนเงิน */}
      {slip && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`สลิปการโอนเงิน ออเดอร์ ${slip.orderLabel}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSlip(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-[#0F2942]">
                สลิปการโอนเงิน {slip.orderLabel}
              </p>
              <button
                onClick={() => setSlip(null)}
                aria-label="ปิด"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slip.url}
                alt={`สลิปการโอนเงิน ${slip.orderLabel}`}
                className="mx-auto max-h-[78vh] w-auto max-w-full object-contain"
              />
            </div>
            <a
              href={slip.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 self-center text-xs font-medium text-[#2f6fed] hover:underline"
            >
              เปิดรูปเต็มในแท็บใหม่
            </a>
          </div>
        </div>
      )}
    </div>
  );
}