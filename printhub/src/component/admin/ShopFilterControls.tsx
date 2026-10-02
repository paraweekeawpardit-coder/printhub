"use client";

import React from "react";
import { Search, Filter, ArrowUpDown, RotateCcw, X, ShieldCheck, ChevronDown } from "lucide-react";

interface ShopFilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: "ALL" | "APPROVED" | "SUSPENDED";
  setStatusFilter: (value: "ALL" | "APPROVED" | "SUSPENDED") => void;
  verifyFilter?: "ALL" | "VERIFIED" | "UNVERIFIED";
  setVerifyFilter?: (value: "ALL" | "VERIFIED" | "UNVERIFIED") => void;
  sortBy: "newest" | "oldest" | "name_asc" | "name_desc";
  setSortBy: (value: "newest" | "oldest" | "name_asc" | "name_desc") => void;
  onResetFilters: () => void;
}

export default function ShopFilterControls({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  verifyFilter = "ALL",
  setVerifyFilter,
  sortBy,
  setSortBy,
  onResetFilters,
}: ShopFilterControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Box */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="ค้นหาชื่อร้าน, เจ้าของ, เบอร์โทร, อีเมล..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-10 pr-9 bg-white border border-slate-300 rounded-lg text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 placeholder:text-slate-400 text-slate-800"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition hover:bg-slate-100"
            title="ล้างข้อความค้นหา"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter and Sort Group */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* 📌 ตัวกรองสถานะการอนุมัติ (is_verify) - เพิ่มมาเพื่อแก้ปัญหาเฉพาะจุด */}
        {setVerifyFilter && (
          <div className="relative">
            <ShieldCheck
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10"
            />
            <select
              value={verifyFilter}
              onChange={(e) => setVerifyFilter(e.target.value as any)}
              className="h-10 pl-9 pr-8 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-700 outline-none cursor-pointer focus:border-sky-500 focus:ring-2 focus:ring-sky-100 appearance-none relative z-0"
            >
              <option value="ALL">การอนุมัติทั้งหมด</option>
              <option value="VERIFIED">อนุมัติแล้ว (Verified)</option>
              <option value="UNVERIFIED">รออนุมัติ / Unverified</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
          </div>
        )}

        {/* ตัวกรองสถานะการใช้งาน (Status) */}
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-10 pl-9 pr-8 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-700 outline-none cursor-pointer focus:border-sky-500 focus:ring-2 focus:ring-sky-100 appearance-none relative z-0"
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="APPROVED">เปิดใช้งานปกติ</option>
            <option value="SUSPENDED">ถูกระงับการใช้งาน</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
        </div>

        {/* ตัวเลือกการจัดเรียง (Sort) */}
        <div className="relative">
          <ArrowUpDown
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 pl-9 pr-8 bg-white border border-slate-300 rounded-lg text-xs md:text-sm text-slate-700 outline-none cursor-pointer focus:border-sky-500 focus:ring-2 focus:ring-sky-100 appearance-none relative z-0"
          >
            <option value="newest">อนุมัติล่าสุด - เก่าสุด</option>
            <option value="oldest">เก่าสุด - อนุมัติล่าสุด</option>
            <option value="name_asc">ชื่อร้าน (ก-ฮ / A-Z)</option>
            <option value="name_desc">ชื่อร้าน (ฮ-ก / Z-A)</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
        </div>

        {/* ปุ่มล้างค่าตัวกรอง */}
        <button
          type="button"
          onClick={onResetFilters}
          className="h-10 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-medium rounded-lg flex items-center gap-1.5 transition active:scale-95 border border-slate-300 cursor-pointer shrink-0"
          title="ล้างคำค้นหาและตัวกรองทั้งหมด"
        >
          <RotateCcw size={15} className="text-slate-500" />
          <span>ล้างตัวกรอง</span>
        </button>
      </div>
    </div>
  );
}