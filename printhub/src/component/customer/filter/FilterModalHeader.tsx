/**
 * Component: FilterModalHeader
 * หน้าที่: ส่วนหัวของหน้าต่าง Pop-up Modal แสดงไอคอน ชื่อหัวข้อ คำอธิบายย่อย และปุ่มกากบาทปิดหน้าต่าง
 */

"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterModalHeaderProps {
  onClose: () => void;
}

export default function FilterModalHeader({ onClose }: FilterModalHeaderProps) {
  return (
    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30 shrink-0">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
            <SlidersHorizontal className="w-4 h-4" />
          </span>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
            กำหนดสเปกและช่วงราคารวม
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 pl-8">
          เลือกประเภทงานพิมพ์ ระบุสเปกย่อย และกำหนดงบประมาณราคาที่ต้องการ
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
        title="ปิดหน้าต่าง"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}