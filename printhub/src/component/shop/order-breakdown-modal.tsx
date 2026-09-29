"use client";

import { useState } from "react";
import { ChevronRight, BarChart2, Calendar, Search, ChevronLeft } from "lucide-react";

type TrendItem = { label: string; count: number };

type Props = {
  counts: Record<string, number>;
  total: number;
  orders: any[];
  trendData?: {
    daily: TrendItem[];
    weekly: TrendItem[];
    monthly: TrendItem[];
    yearly: TrendItem[];
  };
  onOrderClick: (id: string) => void;
};

export default function OrderBreakdownModal({
  counts,
  total,
  orders,
  trendData,
  onOrderClick,
}: Props) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("yearly");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getPercent = (count: number) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const statusConfig = [
    { label: "รอการดำเนินงาน", key: "รอการดำเนินงาน", color: "bg-amber-400", textColor: "text-amber-800", bgColor: "bg-amber-100" },
    { label: "กำลังพิมพ์", key: "กำลังพิมพ์", color: "bg-sky-500", textColor: "text-sky-800", bgColor: "bg-sky-100" },
    { label: "พิมพ์เสร็จสิ้น", key: "พิมพ์เสร็จสิ้น", color: "bg-blue-500", textColor: "text-blue-800", bgColor: "bg-blue-100" },
    { label: "รายการเสร็จสิ้น", key: "รายการเสร็จสิ้น", color: "bg-emerald-500", textColor: "text-emerald-800", bgColor: "bg-emerald-100" },
    { label: "ยกเลิกการพิมพ์", key: "ยกเลิกการพิมพ์", color: "bg-rose-400", textColor: "text-rose-800", bgColor: "bg-rose-100" },
  ];

  const statusTabs = [
    { label: "ทั้งหมด", count: total, percent: 100, color: "bg-slate-100 text-slate-700" },
    ...statusConfig.map((item) => ({
      label: item.label,
      count: counts[item.key] || 0,
      percent: getPercent(counts[item.key] || 0),
      color: `${item.bgColor} ${item.textColor}`,
    })),
  ];

  const filteredOrders = orders.filter((o) => {
    const matchStatus = selectedStatus === "ทั้งหมด" || o.latest_status === selectedStatus;
    const customerName = `${o.customer?.first_name || ""} ${o.customer?.last_name || ""}`.toLowerCase();
    const orderId = (o.id || "").toLowerCase();
    const matchSearch =
      customerName.includes(searchTerm.toLowerCase()) ||
      orderId.includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const defaultLayout: Record<string, TrendItem[]> = {
    daily: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."].map((l) => ({ label: l, count: 0 })),
    weekly: ["สัปดาห์ 1", "สัปดาห์ 2", "สัปดาห์ 3", "สัปดาห์ 4"].map((l) => ({ label: l, count: 0 })),
    monthly: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."].map((l) => ({ label: l, count: 0 })),
    yearly: ["2565", "2566", "2567", "2568", "2569"].map((l) => ({ label: l, count: 0 })),
  };

  const currentChartData: TrendItem[] =
    trendData?.[timeframe] && trendData[timeframe].length > 0
      ? trendData[timeframe]
      : defaultLayout[timeframe];

  const maxChartCount = Math.max(...currentChartData.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0F2942]">
            สัดส่วนและแนวโน้มคำสั่งพิมพ์
          </h3>
          <p className="text-xs text-slate-500">
            สัดส่วนตามสถานะ และสถิติจำนวนออเดอร์ย้อนหลัง
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
          <BarChart2 className="h-4 w-4 text-sky-600" />
          <span>รวมทั้งหมด {total} รายการ</span>
        </div>
      </div>

      {/* Progress Bar สัดส่วน % */}
      <div className="relative mb-2 flex h-6 w-full overflow-hidden rounded-xl bg-slate-100 p-1">
        {total > 0 ? (
          statusConfig.map((item) => {
            const pct = getPercent(counts[item.key] || 0);
            if (pct === 0) return null;
            return (
              <div
                key={item.key}
                style={{ width: `${pct}%` }}
                className={`${item.color} flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 first:rounded-l-lg last:rounded-r-lg`}
                title={`${item.label}: ${pct}%`}
              >
                {pct >= 8 && `${pct}%`}
              </div>
            );
          })
        ) : (
          <div className="flex w-full items-center justify-center text-[11px] font-medium text-slate-400">
            ยังไม่มีข้อมูลสัดส่วน
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 px-1">
        {statusConfig.map((item) => {
          const pct = getPercent(counts[item.key] || 0);
          return (
            <div key={item.key} className="flex items-center gap-1.5 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="text-slate-500">{item.label}</span>
              <span className="font-bold text-slate-700">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Bar Chart Container */}
      <div className="relative mb-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-600" />
            <p className="text-xs font-semibold text-slate-700">
              กราฟจำนวนคำสั่งพิมพ์
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-200/60 p-0.5 text-[11px] font-medium">
            <button
              onClick={() => setTimeframe("daily")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "daily" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              วัน
            </button>
            <button
              onClick={() => setTimeframe("weekly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              สัปดาห์
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              เดือน
            </button>
            <button
              onClick={() => setTimeframe("yearly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                timeframe === "yearly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              รายปี (5 ปีย้อนหลัง)
            </button>
          </div>
        </div>

        {/* แสดงแท่งกราฟตลอดเวลาโดยไม่ซ้อน Overlay */}
        <div className="flex h-36 items-end justify-between gap-1.5 overflow-x-auto pt-4 pb-1">
          {currentChartData.map((item, idx) => {
            const heightPercent = Math.round((item.count / maxChartCount) * 100);

            return (
              <div key={idx} className="flex flex-1 min-w-[28px] flex-col items-center gap-1.5">
                <span className={`text-[10px] font-bold ${item.count > 0 ? "text-sky-600" : "text-slate-400"}`}>
                  {item.count}
                </span>
                <div className="flex h-24 w-full items-end justify-center rounded-lg bg-slate-100/80 p-1">
                  <div
                    style={{ height: `${Math.max(heightPercent, item.count > 0 ? 10 : 4)}%` }}
                    className={`w-full max-w-[20px] rounded-md transition-all duration-300 ${
                      item.count > 0 ? "bg-sky-500 hover:bg-sky-600 shadow-sm" : "bg-slate-200"
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

      {/* Filter Tabs ตามสถานะ */}
      <div className="mb-4 flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setSelectedStatus(tab.label);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              selectedStatus === tab.label
                ? "bg-[#0F2942] text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                selectedStatus === tab.label
                  ? "bg-white/20 text-white"
                  : tab.color
              }`}
            >
              {tab.count} ({tab.percent}%)
            </span>
          </button>
        ))}
      </div>

      {/* ช่องค้นหา + รายการออเดอร์ */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลข Order หรือชื่อลูกค้า..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-700 outline-none focus:border-sky-500"
          />
        </div>

        {/* List ของออเดอร์ */}
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((o) => (
              <div
                key={o.id}
                onClick={() => onOrderClick(o.id)}
                className="group flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Order #{o.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {o.customer?.first_name} {o.customer?.last_name} •{" "}
                    {new Date(o.order_date).toLocaleDateString("th-TH")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      o.latest_status === "รายการเสร็จสิ้น"
                        ? "bg-emerald-100 text-emerald-800"
                        : o.latest_status === "พิมพ์เสร็จสิ้น"
                        ? "bg-blue-100 text-blue-800"
                        : o.latest_status === "กำลังพิมพ์"
                        ? "bg-sky-100 text-sky-800"
                        : o.latest_status === "รอการดำเนินการ"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {o.latest_status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-xs text-slate-400">
              ไม่พบรายการออเดอร์
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > itemsPerPage && (
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span>
              แสดง {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} จาก {filteredOrders.length} รายการ
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