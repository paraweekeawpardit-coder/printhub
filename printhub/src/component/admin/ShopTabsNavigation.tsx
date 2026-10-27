"use client";

import React from "react";
import { FileText, Landmark, MessageSquareWarning, Store } from "lucide-react";

export type TabType = "pending" | "bank" | "all" | "appeals";

interface ShopTabsNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingShopsCount: number;
  bankRequestsCount: number;
  pendingAppealsCount: number;
  allShopsCount: number;
}

export default function ShopTabsNavigation({
  activeTab,
  onTabChange,
  pendingShopsCount,
  bankRequestsCount,
  pendingAppealsCount,
  allShopsCount,
}: ShopTabsNavigationProps) {
  return (
    <div className="flex gap-1 sm:gap-4 border-b border-slate-200 mb-4 sm:mb-6 overflow-x-auto scrollbar-none pb-0.5">
      <button
        type="button"
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          activeTab === "pending"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("pending")}
      >
        <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        <span>คำขอสมัครใหม่</span>
        {pendingShopsCount > 0 && (
          <span className="bg-sky-600 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
            {pendingShopsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          activeTab === "bank"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("bank")}
      >
        <Landmark className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        <span>เปลี่ยนบัญชีธนาคาร</span>
        {bankRequestsCount > 0 && (
          <span className="bg-amber-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
            {bankRequestsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          activeTab === "appeals"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("appeals")}
      >
        <MessageSquareWarning className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        <span>คำขอปลดระงับ</span>
        {pendingAppealsCount > 0 && (
          <span className="bg-rose-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
            {pendingAppealsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          activeTab === "all"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("all")}
      >
        <Store className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        <span>ร้านค้าทั้งหมด</span>
        <span className="bg-slate-400 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
          {allShopsCount}
        </span>
      </button>
    </div>
  );
}