"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

// 1. ปรับ type ของ icon ให้รองรับทั้ง Lucide Icon Component และ string เผื่อไว้
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
    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2">
      {categories.map((cat) => {
        const isActive = selectedService === cat.name;
        const IconComponent = cat.icon;

        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onSelectService(cat.name)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-600/20"
                  : "bg-white border border-slate-200 text-blue-600 hover:border-blue-400 group-hover:scale-105"
              }`}
            >
              {/* 2. ตรวจสอบถ้าเป็น Component ให้เรนเดอร์เป็นแท็ก JSX */}
              {typeof IconComponent === "function" || typeof IconComponent === "object" ? (
                <IconComponent
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${
                    isActive ? "text-white" : "text-blue-600"
                  }`}
                />
              ) : (
                <span className="text-xl">{IconComponent}</span>
              )}
            </div>

            <span
              className={`text-xs font-semibold tracking-tight transition-colors ${
                isActive ? "text-blue-600" : "text-slate-600 group-hover:text-slate-900"
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