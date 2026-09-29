/**
 * Component: DashboardStatusFilter
 * หน้าที่: แถบปุ่มเลื่อนแนวนอน (Filter Pills) สำหรับคลิกสลับกรองสถานะของคำสั่งซื้อ 
 * เช่น ทั้งหมด, รอการชำระเงิน, กำลังพิมพ์ พร้อม Badge แสดงจำนวนออเดอร์ในสถานะนั้นๆ
 */

"use client";

import React from "react";

interface DashboardStatusFilterProps {
  filters: string[];
  selectedFilter: string;
  counts: Record<string, number>;
  onSelectFilter: (filter: string) => void;
}

// ชุดสีตามสถานะใน CustomerOrderCard พร้อมสี hover ที่เข้มขึ้น
const STATUS_THEMES: Record<
  string,
  {
    active: string;
    activeCount: string;
    inactive: string;
    inactiveCount: string;
  }
> = {
  ทั้งหมด: {
    active: "bg-[#0F2942] text-white border-[#0F2942] shadow-sm hover:bg-[#1a3d5e] hover:border-[#1a3d5e]",
    activeCount: "bg-white/20 text-white",
    inactive: "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800",
    inactiveCount: "bg-slate-100 text-slate-500",
  },
  รอการชำระเงิน: {
    active: "bg-amber-600 text-white border-amber-600 shadow-sm hover:bg-amber-700 hover:border-amber-700",
    activeCount: "bg-white/20 text-white",
    inactive: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-900",
    inactiveCount: "bg-amber-100/80 text-amber-800",
  },
  รอการดำเนินงาน: {
    active: "bg-slate-700 text-white border-slate-700 shadow-sm hover:bg-slate-800 hover:border-slate-800",
    activeCount: "bg-white/20 text-white",
    inactive: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-150 hover:border-slate-300 hover:text-slate-800",
    inactiveCount: "bg-slate-200/70 text-slate-600",
  },
  กำลังพิมพ์: {
    active: "bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700 hover:border-blue-700",
    activeCount: "bg-white/20 text-white",
    inactive: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-900",
    inactiveCount: "bg-blue-100/80 text-blue-800",
  },
  พิมพ์เสร็จสิ้น: {
    active: "bg-emerald-600 text-white border-emerald-600 shadow-sm hover:bg-emerald-700 hover:border-emerald-700",
    activeCount: "bg-white/20 text-white",
    inactive: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-900",
    inactiveCount: "bg-emerald-100/80 text-emerald-800",
  },
  รายการเสร็จสิ้น: {
    active: "bg-slate-600 text-white border-slate-600 shadow-sm hover:bg-slate-700 hover:border-slate-700",
    activeCount: "bg-white/20 text-white",
    inactive: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:border-slate-300 hover:text-slate-800",
    inactiveCount: "bg-slate-200/70 text-slate-600",
  },
  ยกเลิกการพิมพ์: {
    active: "bg-rose-600 text-white border-rose-600 shadow-sm hover:bg-rose-700 hover:border-rose-700",
    activeCount: "bg-white/20 text-white",
    inactive: "bg-rose-50 text-rose-600 border-rose-200/80 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-800",
    inactiveCount: "bg-rose-100/80 text-rose-700",
  },
};

export default function DashboardStatusFilter({
  filters,
  selectedFilter,
  counts,
  onSelectFilter,
}: DashboardStatusFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {filters.map((st) => {
        const isActive = selectedFilter === st;
        const count = counts[st] || 0;
        
        // ดึงโทนสีของสถานะนั้นๆ ถ้าไม่มีให้ fallback ไปที่ค่าเริ่มต้น
        const theme = STATUS_THEMES[st] || STATUS_THEMES["ทั้งหมด"];

        return (
          <button
            key={st}
            type="button"
            onClick={() => onSelectFilter(st)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-2 shrink-0 cursor-pointer border ${
              isActive ? theme.active : theme.inactive
            }`}
          >
            <span>{st}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                isActive ? theme.activeCount : theme.inactiveCount
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}