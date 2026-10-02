/**
 * Component: FilterModalFinishingStep
 * หน้าที่: แสดงขั้นตอนที่ 2 ใน Pop-up Modal แสดงรายการสเปกย่อย (ขนาด, สี, วัสดุ, การเข้าเล่ม) 
 * ตามหมวดหมู่ที่เลือก สามารถคลิกเลือกหรือยกเลิกได้หลายข้ออย่างอิสระ พร้อมปุ่มล้างค่าสเปก
 */

"use client";

import React from "react";
import { Check, RotateCcw } from "lucide-react";
import { GROUPED_OPTIONS } from "./filterConfig";

interface FilterModalFinishingStepProps {
  modalCategory: string;
  tempFinishing: string[];
  onToggleOption: (item: string) => void;
  onClearFinishing: () => void;
}

export default function FilterModalFinishingStep({
  modalCategory,
  tempFinishing,
  onToggleOption,
  onClearFinishing,
}: FilterModalFinishingStepProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-extrabold">2</span>
          เลือกสเปกย่อยของ: <strong className="text-blue-600 font-extrabold">{modalCategory}</strong>
        </span>

        {tempFinishing.length > 0 && (
          <button
            type="button"
            onClick={onClearFinishing}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            ล้างค่าสเปก
          </button>
        )}
      </div>

      {GROUPED_OPTIONS[modalCategory]?.map((grp, gIdx) => (
        <div key={gIdx} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-blue-600 rounded-full" />
              {grp.group}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              (เลือกได้หลายข้อ หรือเว้นว่างได้)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {grp.items.map((item) => {
              const isSelected = tempFinishing.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onToggleOption(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-600/20"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}