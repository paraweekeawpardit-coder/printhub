/**
 * Component: FilterModalCategoryStep
 * หน้าที่: แสดงขั้นตอนที่ 1 ใน Pop-up Modal ให้ผู้ใช้เลือกประเภทงานพิมพ์หลัก 
 * ในรูปแบบการ์ด Grid 5 ช่อง พร้อมระบุข้อความแจ้งเตือนการรีเซ็ตสเปกย่อย
 */

"use client";

import React from "react";
import { Check } from "lucide-react";
import { CATEGORIES } from "./filterConfig";

interface FilterModalCategoryStepProps {
  modalCategory: string;
  onCategoryChange: (newCat: string) => void;
}

export default function FilterModalCategoryStep({
  modalCategory,
  onCategoryChange,
}: FilterModalCategoryStepProps) {
  return (
    <div className="px-5 py-3 bg-white border-b border-slate-100 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">1</span>
          เลือกประเภทงานพิมพ์หลัก
        </span>
        <span className="text-[10px] text-amber-600 font-medium">
          * เปลี่ยนประเภทแล้วสเปกย่อยจะถูกรีเซ็ต
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = modalCategory === cat.name;
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onCategoryChange(cat.name)}
              className={`flex flex-col items-start p-2 rounded-2xl border transition-all text-left cursor-pointer relative ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-600/30"
                  : "bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`p-1 rounded-lg ${isActive ? "bg-white/20" : "bg-blue-50 text-blue-600"}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                {isActive && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
              </div>
              <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-800"}`}>
                {cat.name}
              </span>
              <span className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                {cat.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}