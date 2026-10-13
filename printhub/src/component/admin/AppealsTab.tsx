"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Filter,
  Eye,
  Search,
  X,
  History,
  ShieldAlert,
} from "lucide-react";
import { ShopAppeal } from "@/app/admin/shops/page";
import AppealDetailModal from "@/component/admin/AppealDetailModal";
import PaginationBar from "@/component/admin/PaginationBar";

export type AppealSlaFilterType = "ALL" | "NEW" | "WAITING" | "OVERDUE";

interface AppealsTabProps {
  appeals: ShopAppeal[];
  appealSlaFilter?: AppealSlaFilterType;
  setAppealSlaFilter?: React.Dispatch<React.SetStateAction<AppealSlaFilterType>>;
  onApproveUnsuspend?: (shopId: string | number) => void;
  onRejectAppeal?: (appealId: string | number) => void;
  onToggleSuspend?: (
    shopId: string | number,
    currentStatus: string,
  ) => void;
}

const getAppealUrgencyBadge = (createdAtStr: string, status: string) => {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        ปลดระงับแล้ว
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
        <ShieldAlert size={13} />
        ปฏิเสธคำขอ
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
  onRejectAppeal,
  onToggleSuspend,
}: AppealsTabProps) {
  const [selectedAppeal, setSelectedAppeal] = useState<ShopAppeal | null>(null);

  // 🟢 1. State สลับแท็บ "PENDING" (รอตรวจสอบ) vs "COMPLETED" (ประวัติที่ทำแล้ว)
  const [statusTab, setStatusTab] = useState<"PENDING" | "COMPLETED">("PENDING");

  // 🟢 2. State ค้นหาชื่อร้านค้า
  const [searchTerm, setSearchTerm] = useState("");

  // 🟢 3. State การแบ่งหน้า (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // แสดงหน้าละ 8 รายการ

  const [internalSlaFilter, setInternalSlaFilter] = useState<AppealSlaFilterType>("ALL");
  const slaFilter = externalSlaFilter ?? internalSlaFilter;
  const handleSetSlaFilter = externalSetSlaFilter ?? setInternalSlaFilter;

  // รีเซ็ตหน้าเมื่อเปลี่ยนตัวกรอง
  useEffect(() => {
    setCurrentPage(1);
  }, [statusTab, searchTerm, slaFilter]);

  const handleApproveAction = (shopId: string | number) => {
    if (onApproveUnsuspend) {
      onApproveUnsuspend(shopId);
    } else if (onToggleSuspend) {
      onToggleSuspend(shopId, "suspended");
    }
  };

  // 🟢 กรองข้อมูล 3 ชั้น: (1) สถานะงาน -> (2) คำค้นหา -> (3) ตัวกรอง SLA
  const filteredAppeals = useMemo(() => {
    return appeals.filter((appeal) => {
      // (1) แยกตามแท็บ PENDING หรือ COMPLETED
      const isPending = appeal.status === "pending";
      if (statusTab === "PENDING" && !isPending) return false;
      if (statusTab === "COMPLETED" && isPending) return false;

      // (2) ค้นหาจากชื่อร้าน, อีเมล หรือเรื่องที่ยื่น
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const shopName = String(appeal.shop?.shop_name || "").toLowerCase();
        const email = String(appeal.shop?.email || "").toLowerCase();
        const subject = String(appeal.subject || "").toLowerCase();

        if (
          !shopName.includes(term) &&
          !email.includes(term) &&
          !subject.includes(term)
        ) {
          return false;
        }
      }

      // (3) กรองตาม SLA (เฉพาะแท็บ PENDING)
      if (statusTab === "PENDING" && slaFilter !== "ALL") {
        const createdTime = new Date(appeal.created_at).getTime();
        const now = Date.now();
        const diffHours =
          (now - (isNaN(createdTime) ? now : createdTime)) / (1000 * 60 * 60);

        if (slaFilter === "NEW" && diffHours >= 24) return false;
        if (slaFilter === "WAITING" && (diffHours < 24 || diffHours >= 72)) return false;
        if (slaFilter === "OVERDUE" && diffHours < 72) return false;
      }

      return true;
    });
  }, [appeals, statusTab, searchTerm, slaFilter]);

  // คำนวณจำนวนไอเทมแบ่งหน้า
  const totalItems = filteredAppeals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedAppeals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAppeals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAppeals, currentPage]);

  const pendingCount = appeals.filter((a) => a.status === "pending").length;
  const completedCount = appeals.filter((a) => a.status !== "pending").length;

  return (
    <div className="space-y-4 font-sans">
      {/* 🟢 คอนโทรลบาร์ด้านบน: แท็บหลัก + ช่องค้นหา */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* ปุ่มสลับแท็บ PENDING vs COMPLETED */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setStatusTab("PENDING")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              statusTab === "PENDING"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock size={15} />
            <span>รอการตรวจสอบ</span>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setStatusTab("COMPLETED")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              statusTab === "COMPLETED"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <History size={15} />
            <span>ประวัติการดำเนินการ ({completedCount})</span>
          </button>
        </div>

        {/* ช่องค้นหาชื่อร้านค้า */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อร้านค้า หรือเรื่องที่ยื่น..."
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 🟢 ตัวกรอง SLA (แสดงเฉพาะตอนอยู่แท็บ "รอการตรวจสอบ") */}
      {statusTab === "PENDING" && (
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
              ทั้งหมด ({appeals.filter((a) => a.status === "pending").length})
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
      )}

      {/* 🟢 รายการ การ์ด Appeals */}
      {paginatedAppeals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">
            {searchTerm
              ? `ไม่พบคำขอที่ตรงกับคำค้นหา "${searchTerm}"`
              : statusTab === "PENDING"
              ? "ไม่มีคำขอปลดระงับที่รอการตรวจสอบในขณะนี้"
              : "ยังไม่มีประวัติการดำเนินการคำขอปลดระงับ"}
          </h3>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paginatedAppeals.map((appeal) => (
            <div
              key={appeal.id}
              onClick={() => setSelectedAppeal(appeal)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-sky-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base group-hover:text-sky-600 transition">
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
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100 line-clamp-2">
                    {appeal.message}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    วันที่ยื่นเรื่อง:{" "}
                    {new Date(appeal.created_at).toLocaleString("th-TH")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAppeal(appeal);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 hover:border-sky-200 transition cursor-pointer"
                >
                  <Eye size={15} className="text-slate-500" />
                  ดูรายละเอียดคำขอ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟢 ปุ่มเปลี่ยนหน้า Pagination (แสดงเมื่อมีรายการมากกว่า 1 หน้า) */}
      {totalPages > 1 && (
        <div className="pt-2">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Render Modal ดูรายละเอียดคำขอ */}
      <AppealDetailModal
        appeal={selectedAppeal}
        onClose={() => setSelectedAppeal(null)}
        onApprove={(shopId) => {
          handleApproveAction(shopId);
          setSelectedAppeal(null);
        }}
        onReject={(appealId) => {
          if (onRejectAppeal) onRejectAppeal(appealId);
          setSelectedAppeal(null);
        }}
      />
    </div>
  );
}