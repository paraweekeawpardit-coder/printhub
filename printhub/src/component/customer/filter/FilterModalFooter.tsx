/**
 * Component: FilterModalFooter
 * หน้าที่: ส่วนท้ายของ Pop-up Modal สรุปข้อความเงื่อนไขที่เลือก (สเปกย่อย และช่วงราคา) 
 * พร้อมปุ่มกดยืนยันเพื่อนำเงื่อนไขไปใช้งาน
 */

"use client";

import React from "react";

interface FilterModalFooterProps {
  tempFinishing: string[];
  tempMinPrice: number | string | undefined;
  tempMaxPrice: number | string | undefined;
  onConfirm: () => void;
}

export default function FilterModalFooter({
  tempFinishing,
  tempMinPrice,
  tempMaxPrice,
  onConfirm,
}: FilterModalFooterProps) {
  const activeCount = tempFinishing.length + (tempMinPrice || tempMaxPrice ? 1 : 0);

  return (
    <div className="px-5 py-3 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2 text-xs text-slate-500 truncate max-w-md w-full sm:w-auto">
        <span className="font-bold text-slate-700 shrink-0">เงื่อนไข:</span>
        <span className="text-blue-600 truncate font-semibold">
          {tempFinishing.length > 0 ? tempFinishing.join(", ") : "ไม่ระบุสเปก"}
          {(tempMinPrice || tempMaxPrice) &&
            ` • ฿${tempMinPrice || "0"} - ฿${tempMaxPrice || "ไม่จำกัด"}`}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onConfirm}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
        >
          นำเงื่อนไขไปใช้ ({activeCount})
        </button>
      </div>
    </div>
  );
}