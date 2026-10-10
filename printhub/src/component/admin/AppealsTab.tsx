"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Filter,
  ShieldCheck,
} from "lucide-react";
import { ShopAppeal } from "@/app/admin/shops/page";

export type AppealSlaFilterType = "ALL" | "NEW" | "WAITING" | "OVERDUE";

interface AppealsTabProps {
  appeals: ShopAppeal[];
  appealSlaFilter?: AppealSlaFilterType;
  setAppealSlaFilter?: React.Dispatch<React.SetStateAction<AppealSlaFilterType>>;
  onApproveUnsuspend?: (shopId: string | number) => void;
  onToggleSuspend?: (
    shopId: string | number,
    currentStatus: string,
  ) => void;
}

const getAppealUrgencyBadge = (createdAtStr: string, status: string) => {
  if (status !== "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        อนุมัติเรียบร้อย
      </span>
    );
  }

  const createdTime = new Date(createdAtStr).getTime();
  const now = Date.now();
  const diffHours =
    (now - (isNaN(createdTime) ? now : createdTime)) / (1000 * 60 * 60);

  if (diffHours >= 72) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 animate-pulse">
        <AlertTriangle size={13} />
        เกินกำหนด (ล่าช้า)
      </span>
    );
  } else if (diffHours >= 24) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock size={13} />
        รอการตรวจสอบ
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
        <Sparkles size={13} />
        ยื่นมาใหม่
      </span>
    );
  }
};

export default function AppealsTab({
  appeals,
  appealSlaFilter: externalSlaFilter,
  setAppealSlaFilter: externalSetSlaFilter,
  onApproveUnsuspend,
  onToggleSuspend,
}: AppealsTabProps) {
  // State ภายในกรณีไม่ได้ส่ง Props ตัวกรองมาจาก page.tsx
  const [internalSlaFilter, setInternalSlaFilter] =
    useState<AppealSlaFilterType>("ALL");

  const slaFilter = externalSlaFilter ?? internalSlaFilter;
  const handleSetSlaFilter = externalSetSlaFilter ?? setInternalSlaFilter;

  const handleAction = (shopId: string | number) => {
    if (onApproveUnsuspend) {
      onApproveUnsuspend(shopId);
    } else if (onToggleSuspend) {
      onToggleSuspend(shopId, "suspended");
    }
  };

  const filteredAppeals = useMemo(() => {
    if (slaFilter === "ALL") return appeals;

    const now = Date.now();
    return appeals.filter((appeal) => {
      if (appeal.status !== "pending") return false;

      const createdTime = new Date(appeal.created_at).getTime();
      const diffHours =
        (now - (isNaN(createdTime) ? now : createdTime)) / (1000 * 60 * 60);

      if (slaFilter === "NEW") return diffHours < 24;
      if (slaFilter === "WAITING")
        return diffHours >= 24 && diffHours < 72;
      if (slaFilter === "OVERDUE") return diffHours >= 72;
      return true;
    });
  }, [appeals, slaFilter]);

  return (
    <div className="space-y-4">
      {/* ตัวกรอง SLA */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Filter size={16} className="text-sky-600" />
          <span>กรองตามระยะเวลาดำเนินการ:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleSetSlaFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              slaFilter === "ALL"
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ทั้งหมด ({appeals.length})
          </button>
          <button
            type="button"
            onClick={() => handleSetSlaFilter("NEW")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              slaFilter === "NEW"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100"
            }`}
          >
            <Sparkles size={13} /> ยื่นมาใหม่ (&lt; 24 ชม.)
          </button>
          <button
            type="button"
            onClick={() => handleSetSlaFilter("WAITING")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              slaFilter === "WAITING"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100"
            }`}
          >
            <Clock size={13} /> รอการตรวจสอบ (1-3 วัน)
          </button>
          <button
            type="button"
            onClick={() => handleSetSlaFilter("OVERDUE")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              slaFilter === "OVERDUE"
                ? "bg-rose-600 text-white shadow-sm animate-pulse"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100"
            }`}
          >
            <AlertTriangle size={13} /> เกินกำหนด (&gt; 3 วัน)
          </button>
        </div>
      </div>

      {/* รายการ Appeals */}
      {filteredAppeals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">
            ไม่พบคำขอปลดระงับในหมวดหมู่นี้
          </h3>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAppeals.map((appeal) => (
            <div
              key={appeal.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      {appeal.shop?.shop_name || `ร้านค้า ID: ${appeal.shop_id}`}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {appeal.shop?.email || ""}
                    </p>
                  </div>
                  {getAppealUrgencyBadge(appeal.created_at, appeal.status)}
                </div>

                <div className="my-3 space-y-1.5 text-sm">
                  <p className="font-semibold text-slate-700">
                    เรื่อง: {appeal.subject}
                  </p>
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                    {appeal.message}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    วันที่ยื่นเรื่อง:{" "}
                    {new Date(appeal.created_at).toLocaleString("th-TH")}
                  </p>
                </div>
              </div>

              {appeal.status === "pending" && (
                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleAction(appeal.shop_id)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <ShieldCheck size={16} />
                    อนุมัติปลดระงับร้านค้า
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}