"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  keyword: string;
  onSearchChange: (value: string) => void;
  placeholder?: string; // เพิ่มบรรทัดนี้เพื่อไม่ให้ TypeScript ฟ้อง error
}

export default function SearchBar({
  keyword,
  onSearchChange,
  placeholder = "ค้นหาชื่อร้าน หรือบริการ...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={keyword}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 shadow-2xs transition-all"
      />
    </div>
  );
}