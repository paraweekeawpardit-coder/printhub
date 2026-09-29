/**
 * Component: FilterPillButtonList
 * หน้าที่: แสดงแถบปุ่ม Pills ตัวกรองด้านนอกในแนวนอน (Horizontal Scroll)
 * ประกอบด้วย ปุ่มระยะทางใกล้ที่สุด, เปิดให้บริการ, คะแนนสูงสุด, ปุ่มเปิด Pop-up สเปก และปุ่มล้างตัวกรอง
 */

"use client";

import React from "react";
import { MapPin, Star, SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterPillButtonListProps {
  isNearest: boolean;
  onToggleNearest: () => void;
  isOpenOnly: boolean;
  onToggleOpenOnly: () => void;
  isTopRated: boolean;
  onToggleTopRated: () => void;
  hasActiveSpecs: boolean;
  filterCount: number;
  onOpenModal: () => void;
  onResetAll: () => void;
}

export default function FilterPillButtonList({
  isNearest,
  onToggleNearest,
  isOpenOnly,
  onToggleOpenOnly,
  isTopRated,
  onToggleTopRated,
  hasActiveSpecs,
  filterCount,
  onOpenModal,
  onResetAll,
}: FilterPillButtonListProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 text-xs font-medium relative z-30">
      <button
        type="button"
        onClick={onToggleNearest}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
          isNearest
            ? "bg-blue-50 text-blue-600 border-blue-500 shadow-2xs font-semibold"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        <MapPin className="w-3.5 h-3.5 text-blue-600" />
        <span>ระยะทางใกล้ที่สุด</span>
      </button>

      <button
        type="button"
        onClick={onToggleOpenOnly}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
          isOpenOnly
            ? "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-2xs font-semibold"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isOpenOnly ? "bg-emerald-500" : "bg-slate-300"}`} />
        <span>เปิดให้บริการ</span>
      </button>

      <button
        type="button"
        onClick={onToggleTopRated}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
          isTopRated
            ? "bg-amber-50 text-amber-600 border-amber-500 shadow-2xs font-semibold"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span>คะแนนสูงสุด</span>
      </button>

      <button
        type="button"
        onClick={onOpenModal}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border shrink-0 cursor-pointer ${
          hasActiveSpecs
            ? "bg-blue-50 text-blue-600 border-blue-500 shadow-2xs font-semibold"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
        }`}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>
          {hasActiveSpecs ? `ตัวกรองสเปก (${filterCount})` : "สเปกงานพิมพ์และช่วงราคา"}
        </span>
        {hasActiveSpecs && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
      </button>

      <button
        type="button"
        onClick={onResetAll}
        className="px-3.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 text-xs font-bold shrink-0 transition-all shadow-2xs cursor-pointer ml-auto flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
        <span>ล้างตัวกรอง</span>
      </button>
    </div>
  );
}