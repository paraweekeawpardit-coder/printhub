/**
 * =========================================================================
 * Component: SearchBar
 * -------------------------------------------------------------------------
 * หน้าที่การทำงาน:
 * 1. ช่องป้อนคำค้นหา (Search Input) สำหรับค้นหารายชื่อร้านค้าหรือบริการงานพิมพ์
 * 2. รับค่าคำค้นหา (keyword) และส่งค่ากลับผ่าน Callback (onSearchChange) แบบ Real-time
 * 3. รองรับการกำหนดข้อความ Placeholder ให้ยืดหยุ่นตามบริบทของแต่ละหน้า
 * 4. จัดวางไอคอนแว่นขยาย (Search Icon) พร้อมสถานะ Focus/Ring ให้สอดคล้องกับธีมหลัก
 * =========================================================================
 */

"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  keyword: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  keyword,
  onSearchChange,
  placeholder = "ค้นหาชื่อร้าน หรือบริการ...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={keyword}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 placeholder:text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 shadow-2xs hover:border-slate-300 transition-all"
      />
    </div>
  );
}