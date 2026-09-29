/**
 * Component: DashboardStatsGrid
 * หน้าที่: แสดงกล่องสรุปตัวเลขสถิติสถานะคำสั่งซื้อ 4 กล่อง (กำลังดำเนินการ, พร้อมรับงาน, รับงานแล้ว, ข้อพิพาท/ขอคืนเงิน)
 * พร้อมแสดงไอคอนกำกับแต่ละสถานะอย่างชัดเจน
 */

"use client";

import React from "react";
import { Clock, Printer, CheckCircle2, FileWarning } from "lucide-react";

interface StatsData {
  inProgress: number;
  ready: number;
  completed: number;
  reports: number;
}

interface DashboardStatsGridProps {
  stats: StatsData;
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. กำลังดำเนินการ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">กำลังดำเนินการ</span>
          <Clock className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-2xl font-black text-slate-900">{stats.inProgress}</div>
        <p className="text-[11px] text-slate-400">รอดำเนินงาน / กำลังพิมพ์</p>
      </div>

      {/* 2. พร้อมรับงาน */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">พร้อมรับงาน</span>
          <Printer className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-black text-emerald-600">{stats.ready}</div>
        <p className="text-[11px] text-emerald-600/80">พิมพ์เสร็จสิ้น</p>
      </div>

      {/* 3. รับงานแล้ว */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">รับงานแล้ว</span>
          <CheckCircle2 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-black text-slate-900">{stats.completed}</div>
        <p className="text-[11px] text-slate-400">สำเร็จเรียบร้อย</p>
      </div>

      {/* 4. ข้อพิพาท / ขอคืนเงิน */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium">ข้อพิพาท/ขอคืนเงิน</span>
          <FileWarning className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-2xl font-black text-rose-600">{stats.reports}</div>
        <p className="text-[11px] text-rose-500/80">รอการตรวจสอบ</p>
      </div>
    </div>
  );
}