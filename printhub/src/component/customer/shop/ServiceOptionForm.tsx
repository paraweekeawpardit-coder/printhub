/**
 * Component: ServiceOptionForm
 * หน้าที่: แสดงตัวเลือกสเปกงานพิมพ์ฝั่งขวา โดยตรวจสอบ is_required จาก Database อย่างเคร่งครัด
 */

"use client";

import React from "react";
import { OptionItem } from "./ServiceMenuGrid";

interface ServiceOptionFormProps {
  dynamicGroups: string[];
  rawOptions: OptionItem[];
  modalOptions: Record<string, OptionItem>;
  quantity: number;
  onToggleOption: (group: string, opt: OptionItem) => void;
  onQuantityChange: (newQuantity: number) => void;
}

export default function ServiceOptionForm({
  dynamicGroups,
  rawOptions,
  modalOptions,
  quantity,
  onToggleOption,
  onQuantityChange,
}: ServiceOptionFormProps) {
  return (
    <div className="md:col-span-5 p-5 sm:p-6 overflow-y-auto space-y-4 bg-white">
      {dynamicGroups.map((group) => {
        const groupItems = rawOptions.filter((o) => o.group_type === group);
        
        // 🌟 แก้ไขตรงนี้: เช็คให้ตรงว่าเป็น true เท่านั้น (ถ้าใน DB เป็น false จะได้ isRequiredGroup = false ทันที)
        const isRequiredGroup = groupItems.some((o) => {
          const val = (o as any).is_required;
          return val === true || val === "true" || val === 1;
        });

        return (
          <div key={group} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 block">{group}</span>
              {isRequiredGroup ? (
                <span className="text-[10px] text-rose-500 font-bold">* จำเป็น</span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">(ไม่บังคับเลือก)</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {groupItems.map((opt) => {
                const isSelected = modalOptions[group]?.id === opt.id;
                const displayName = opt.detail || opt.option_name || "ตัวเลือก";
                const itemPrice = Number(opt.price ?? opt.unit_price ?? 0);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onToggleOption(group, opt)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700 bg-white"
                    }`}
                  >
                    <span className="truncate pr-2">{displayName}</span>
                    <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                      {itemPrice > 0 ? `฿${itemPrice}` : "ฟรี"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ปรับจำนวนชุด */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-700 block">จำนวนชุดที่ต้องการ</span>
          <span className="text-[10px] text-slate-400">พิมพ์ซ้ำตามจำนวนสำเนา</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 cursor-pointer text-slate-700 flex items-center justify-center transition"
          >
            -
          </button>
          <span className="text-xs font-bold w-6 text-center text-slate-800">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 cursor-pointer text-slate-700 flex items-center justify-center transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}