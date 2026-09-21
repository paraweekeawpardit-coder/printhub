"use client";

import React, { useMemo } from "react";
import { 
  Layers, 
  FileText, 
  Sticker, 
  Flag, 
  IdCard, 
  Image as ImageIcon 
} from "lucide-react";

interface CategoryItem {
  name: string;
  icon?: string;
}

interface ServiceCategoryListProps {
  categories: CategoryItem[];
  selectedService: string;
  onSelectService: (serviceName: string) => void;
}

// กำหนดลำดับที่ต้องการให้เรียงตามโจทย์
const CATEGORY_ORDER = [
  "ทั้งหมด",
  "เอกสาร",
  "แผ่นสติกเกอร์",
  "สติกเกอร์",      // ดักกรณีชื่อส่งมาเป็นสติกเกอร์
  "ป้ายไวนิล",
  "นามบัตร",
  "โปสเตอร์",
];

const getCategoryIcon = (categoryName: string, isSelected: boolean) => {
  const iconClass = `w-7 h-7 ${isSelected ? "text-white" : "text-blue-600"}`;

  switch (categoryName) {
    case "ทั้งหมด":
      return <Layers className={iconClass} />;
    case "เอกสาร":
      return <FileText className={iconClass} />;
    case "แผ่นสติกเกอร์":
    case "สติกเกอร์":
      return <Sticker className={iconClass} />;
    case "ป้ายไวนิล":
      return <Flag className={iconClass} />;
    case "นามบัตร":
      return <IdCard className={iconClass} />;
    case "โปสเตอร์":
      return <ImageIcon className={iconClass} />;
    default:
      return <Layers className={iconClass} />;
  }
};

export default function ServiceCategoryList({
  categories,
  selectedService,
  onSelectService,
}: ServiceCategoryListProps) {
  // จัดเรียงลำดับ categories ตาม CATEGORY_ORDER อัตโนมัติ แม้ API จะส่งมาสลับตำแหน่ง
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.name);
      const indexB = CATEGORY_ORDER.indexOf(b.name);

      const orderA = indexA !== -1 ? indexA : 999;
      const orderB = indexB !== -1 ? indexB : 999;

      return orderA - orderB;
    });
  }, [categories]);

  return (
    <div className="space-y-3.5 pt-1">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">เลือกประเภทงานพิมพ์</h2>
        {/* <span className="text-xs text-slate-400 font-medium">เลื่อนดูเพิ่มเติม →</span> */}
      </div>

      <div className="flex items-start gap-5 overflow-x-auto pb-3 pt-2 px-1 no-scrollbar scroll-smooth">
        {sortedCategories.map((cat, idx) => {
          const isSelected = selectedService === cat.name;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectService(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none w-[78px] cursor-pointer"
            >
              <div
                className={`w-15 h-15 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-offset-2 ring-blue-600"
                    : "bg-white text-slate-700 border border-slate-200/80 shadow-xs group-hover:border-blue-400 group-hover:bg-blue-50/40 group-hover:scale-105"
                }`}
              >
                {getCategoryIcon(cat.name, isSelected)}
              </div>
              <span
                className={`text-xs leading-snug text-center transition-colors line-clamp-2 h-7 flex items-center justify-center whitespace-pre-line ${
                  isSelected
                    ? "font-bold text-blue-600"
                    : "font-medium text-slate-700 group-hover:text-slate-900"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}