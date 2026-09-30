/**
 * =========================================================================
 * Component: ServiceCategoryList
 * -------------------------------------------------------------------------
 * หน้าที่การทำงาน:
 * 1. แถบเลื่อนแนวนอนแสดงหมวดหมู่ประเภทบริการงานพิมพ์ (เช่น ปริ้นสี, ขาว-ดำ, ถ่ายเอกสาร, สติกเกอร์)
 * 2. แสดงไอคอนวงกลมพร้อมชื่อหมวดหมู่ด้านล่าง รองรับทั้ง Lucide Icon และ String/Emoji
 * 3. จัดการสถานะการเลือก (Active State) ด้วยกรอบแสง (Ring), เงา และสีพื้นหลังสีน้ำเงินธีมหลัก
 * 4. ส่งค่าหมวดหมู่ที่ถูกคลิกกลับไปยังหน้าหลักผ่าน Callback (onSelectService) เพื่อใช้กรองข้อมูลร้านค้าหรือบริการ
 * =========================================================================
 */

"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

// ปรับ type ของ icon ให้รองรับทั้ง Lucide Icon Component และ string
export interface ServiceCategoryItem {
  name: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }> | string;
}

interface ServiceCategoryListProps {
  categories: ServiceCategoryItem[];
  selectedService: string;
  onSelectService: (serviceName: string) => void;
}

export default function ServiceCategoryList({
  categories,
  selectedService,
  onSelectService,
}: ServiceCategoryListProps) {
  return (
    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-2 py-3">
      {categories.map((cat) => {
        const isActive = selectedService === cat.name;
        const IconComponent = cat.icon;

        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onSelectService(cat.name)}
            className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-600/20"
                  : "bg-white border border-slate-200/90 text-blue-600 hover:border-blue-400 hover:shadow-xs group-hover:scale-105"
              }`}
            >
              {typeof IconComponent === "function" || typeof IconComponent === "object" ? (
                <IconComponent
                  className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                    isActive ? "text-white" : "text-blue-600"
                  }`}
                />
              ) : (
                <span className="text-xl sm:text-2xl">{IconComponent}</span>
              )}
            </div>

            <span
              className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors text-center max-w-[80px] sm:max-w-[96px] truncate ${
                isActive ? "text-blue-600 font-bold" : "text-slate-600 group-hover:text-slate-900"
              }`}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}