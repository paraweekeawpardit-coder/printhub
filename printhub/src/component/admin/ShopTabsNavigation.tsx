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
    <div className="flex gap-4 border-b border-slate-200 mb-6 overflow-x-auto">
      <button
        type="button"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === "pending"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("pending")}
      >
        <FileText size={18} />
        <span>คำขอสมัครใหม่</span>
        {pendingShopsCount > 0 && (
          <span className="bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full">
            {pendingShopsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === "bank"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("bank")}
      >
        <Landmark size={18} />
        <span>เปลี่ยนบัญชีธนาคาร</span>
        {bankRequestsCount > 0 && (
          <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
            {bankRequestsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === "appeals"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("appeals")}
      >
        <MessageSquareWarning size={18} />
        <span>คำขอปลดระงับ</span>
        {pendingAppealsCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {pendingAppealsCount}
          </span>
        )}
      </button>

      <button
        type="button"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === "all"
            ? "border-sky-600 text-sky-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
        onClick={() => onTabChange("all")}
      >
        <Store size={18} />
        <span>ร้านค้าทั้งหมดในระบบ</span>
        <span className="bg-slate-400 text-white text-xs px-2 py-0.5 rounded-full">
          {allShopsCount}
        </span>
      </button>
    </div>
  );
}