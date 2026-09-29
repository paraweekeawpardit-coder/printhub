/**
 * Component: FilterModalPriceStep
 * หน้าที่: แสดงขั้นตอนที่ 3 ใน Pop-up Modal สำหรับกรอกระบุงบประมาณราคาต่อชิ้น (ราคาต่ำสุด - สูงสุด) 
 * พร้อมคำอธิบาย ข้อมูลแนะนำ และข้อความเตือนเมื่อกรอกราคาผิดเงื่อนไข
 */

"use client";

import React from "react";
import { Info } from "lucide-react";

interface FilterModalPriceStepProps {
  tempMinPrice: number | string | undefined;
  tempMaxPrice: number | string | undefined;
  priceError: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onClearPrice: () => void;
}

export default function FilterModalPriceStep({
  tempMinPrice,
  tempMaxPrice,
  priceError,
  onMinPriceChange,
  onMaxPriceChange,
  onClearPrice,
}: FilterModalPriceStepProps) {
  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">3</span>
          งบประมาณราคารวมต่อชิ้น (บาท)
        </span>
        {(tempMinPrice || tempMaxPrice) && (
          <button
            type="button"
            onClick={onClearPrice}
            className="text-xs text-rose-500 hover:underline cursor-pointer"
          >
            ล้างช่วงราคา
          </button>
        )}
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-blue-50/60 p-2 rounded-xl border border-blue-100">
        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
        <span>
          ราคารวมต่อชิ้นงานที่ต้องการ (คำนวณรวมค่าพิมพ์ สเปก และการเข้าเล่ม)
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1 max-w-sm">
        <div className="flex-1 relative">
          <span className="absolute left-2.5 top-2 text-xs text-slate-400">฿</span>
          <input
            type="number"
            min="1"
            placeholder="ราคาต่ำสุด"
            value={tempMinPrice ?? ""}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className={`w-full pl-6 pr-2.5 py-1.5 bg-slate-50 border rounded-xl text-xs outline-none transition ${
              priceError ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-blue-600 focus:bg-white"
            }`}
          />
        </div>
        <span className="text-slate-400 font-bold">-</span>
        <div className="flex-1 relative">
          <span className="absolute left-2.5 top-2 text-xs text-slate-400">฿</span>
          <input
            type="number"
            min="1"
            placeholder="ราคาสูงสุด"
            value={tempMaxPrice ?? ""}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className={`w-full pl-6 pr-2.5 py-1.5 bg-slate-50 border rounded-xl text-xs outline-none transition ${
              priceError ? "border-red-500 bg-red-50/30" : "border-slate-200 focus:border-blue-600 focus:bg-white"
            }`}
          />
        </div>
      </div>

      {priceError && (
        <p className="text-red-500 text-[11px] font-semibold mt-1 animate-in fade-in duration-150">
          ⚠️ {priceError}
        </p>
      )}
    </div>
  );
}