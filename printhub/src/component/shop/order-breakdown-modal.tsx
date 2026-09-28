"use client";

import { useState } from "react";
import { Clock, CheckCircle2, AlertCircle, XCircle, ChevronRight } from "lucide-react";

type Props = {
  counts: Record<string, number>;
  total: number;
  orders: any[];
  onOrderClick: (id: string) => void;
};

export default function OrderBreakdownModal({
  counts,
  total,
  orders,
  onOrderClick,
}: Props) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");

  const statusTabs = [
    { label: "ทั้งหมด", count: total, color: "bg-slate-100 text-slate-700" },
    { label: "รอการดำเนินการ", count: counts["รอการดำเนินการ"] || 0, color: "bg-amber-100 text-amber-800" },
    { label: "กำลังพิมพ์", count: counts["กำลังพิมพ์"] || 0, color: "bg-sky-100 text-sky-800" },
    { label: "พิมพ์เสร็จสิ้น", count: counts["พิมพ์เสร็จสิ้น"] || 0, color: "bg-emerald-100 text-emerald-800" },
    { label: "ยกเลิก", count: counts["ยกเลิก"] || 0, color: "bg-rose-100 text-rose-800" },
  ];

  const filteredOrders =
    selectedStatus === "ทั้งหมด"
      ? orders
      : orders.filter((o) => o.latest_status === selectedStatus);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#0F2942]">
        สัดส่วนและสถานะคำสั่งพิมพ์
      </h3>
      <p className="mb-4 text-xs text-slate-500">
        จำแนกออเดอร์ตามสถานะดำเนินงาน
      </p>

      {/* Bar แสดงสัดส่วน Percentage */}
      <div className="mb-6 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100">
        {total > 0 && (
          <>
            <div
              style={{ width: `${((counts["รอการดำเนินการ"] || 0) / total) * 100}%` }}
              className="bg-amber-400"
              title="รอการดำเนินการ"
            />
            <div
              style={{ width: `${((counts["กำลังพิมพ์"] || 0) / total) * 100}%` }}
              className="bg-sky-500"
              title="กำลังพิมพ์"
            />
            <div
              style={{ width: `${((counts["พิมพ์เสร็จสิ้น"] || 0) / total) * 100}%` }}
              className="bg-emerald-500"
              title="พิมพ์เสร็จสิ้น"
            />
            <div
              style={{ width: `${((counts["ยกเลิก"] || 0) / total) * 100}%` }}
              className="bg-rose-400"
              title="ยกเลิก"
            />
          </>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setSelectedStatus(tab.label)}
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
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* รายการคำสั่งพิมพ์ในสถานะนั้นๆ */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => onOrderClick(o.id)}
              className="group flex cursor-pointer items-center justify-between py-3 hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
            >
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Order #{o.id.slice(0, 8)}
                </p>
                <p className="text-xs text-slate-400">
                  {o.customer?.first_name} {o.customer?.last_name} •{" "}
                  {new Date(o.order_date).toLocaleDateString("th-TH")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {o.latest_status}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-xs text-slate-400">
            ไม่มีรายการในสถานะนี้
          </p>
        )}
      </div>
    </div>
  );
}