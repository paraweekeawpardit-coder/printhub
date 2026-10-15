"use client";

/**
 * Component: CustomerCartCard
 * หน้าที่: การ์ดตะกร้าของแต่ละร้าน ในหน้า /customer/cart
 * - แถวหลัก: ข้อมูลร้าน + สรุปรายการ | ยอดสุทธิ + ปุ่มสั่งซื้อ
 * - กด "ดูรายละเอียด" เพื่อขยายรายการงานพิมพ์ (สเปก, จำนวน, ไฟล์ที่แนบ) และสรุปยอด
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Clock, ChevronDown, Trash2, ArrowRight, Paperclip } from "lucide-react";
import { formatOpenDays, isEveryDay } from "./shopOpenDays";

interface CartGroupedShop {
  shop_id: string;
  shop_name: string;
  is_open?: boolean;
  open_time?: string;
  open_days?: unknown;
  close_time?: string;
  items: any[];
  total_price: number;
}

interface CustomerCartCardProps {
  group: CartGroupedShop;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClearCart?: (shopId: string) => void;
}

const SMALL_ORDER_LIMIT = 50; // เหมือน backend: ยอดต่ำกว่า 50 บาท
const SMALL_ORDER_FEE = 20; // +20 บาท
const SIDE_LABEL: Record<string, string> = { SINGLE: "หน้าเดียว", DOUBLE: "สองหน้า" };

const baht = (n: number) =>
  `฿${n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fileNameFromUrl = (url: string, fallback: string) => {
  try {
    const last = url.split("?")[0].split("/").pop() || "";
    return decodeURIComponent(last) || fallback;
  } catch {
    return fallback;
  }
};

export default function CustomerCartCard({
  group,
  isExpanded: controlledExpanded,
  onToggleExpand: controlledToggle,
  onClearCart,
}: CustomerCartCardProps) {
  const router = useRouter();
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpand = controlledToggle || (() => setInternalExpanded(!internalExpanded));

  if (!group) return null;

  const isOpen = Boolean(group.is_open);
  const items = group.items || [];
  const subtotal = Number(group.total_price || 0);
  const smallOrderFee = subtotal > 0 && subtotal < SMALL_ORDER_LIMIT ? SMALL_ORDER_FEE : 0;
  const netTotal = subtotal + smallOrderFee;

  const openTime = group.open_time?.slice(0, 5);
  const closeTime = group.close_time?.slice(0, 5);
  const timeLabel =
    openTime === "00:00" && (closeTime === "23:59" || closeTime === "24:00")
      ? "เปิด 24 ชม."
      : openTime && closeTime
      ? `${openTime} - ${closeTime} น.`
      : null;
  const hoursLabel = isEveryDay(group.open_days)
    ? timeLabel
    : `${formatOpenDays(group.open_days)}${timeLabel ? ` · ${timeLabel.replace("เปิด ", "")}` : ""}`;

  // สรุปรายการ เช่น "เอกสาร x1, นามบัตร x1"
  const summary = (() => {
    const totals: Record<string, number> = {};
    items.forEach((it: any) => {
      const cat = it?.category || "เอกสาร";
      totals[cat] = (totals[cat] || 0) + (Number(it?.quantity) || 1);
    });
    return Object.entries(totals)
      .map(([cat, qty]) => `${cat} x${qty}`)
      .join(", ");
  })();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* 1. แถวหลัก */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* ข้อมูลร้าน */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-slate-900 text-base truncate">{group.shop_name}</h2>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isOpen ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-rose-500"}`} />
                {isOpen ? "เปิดอยู่" : "ปิดอยู่"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">{summary}</p>
            {hoursLabel && (
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {hoursLabel}
              </p>
            )}
          </div>
        </div>

        {/* ยอด + ปุ่มสั่งซื้อ */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <div className="sm:text-right">
            <p className="text-[11px] text-slate-400">ยอดชำระสุทธิ</p>
            <p className="text-xl font-extrabold text-blue-600 leading-tight">{baht(netTotal)}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/customer/shop/${group.shop_id}?openCart=true`)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isOpen
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {isOpen ? "สั่งซื้อ" : "ไปที่ร้าน"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. แถบควบคุม: ดูรายละเอียด | ลบร้าน */}
      <div className="px-5 py-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleExpand}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-700 transition cursor-pointer"
        >
          {isExpanded ? "ซ่อนรายละเอียด" : `ดูรายละเอียด (${items.length} รายการ)`}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">ลบตะกร้าร้านนี้?</span>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                onClearCart?.(group.shop_id);
              }}
              className="px-2.5 py-1 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition cursor-pointer"
            >
              ลบ
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ลบ
          </button>
        )}
      </div>

      {/* 3. รายละเอียด (dropdown) */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/80 p-4 sm:p-5 space-y-3">
          {items.map((item: any, idx: number) => {
            const quantity = Number(item?.quantity) || 1;
            const pageCount = Number(item?.page_count || item?.total_pages) || 1;
            const unitPrice = Number(item?.price_per_page) || Number(item?.unit_price) || 0;
            const itemSubtotal = Number(item?.subtotal) || unitPrice * pageCount * quantity;

            const specs = [
              item?.selected_size,
              item?.color_type,
              item?.paper_type,
              item?.side_type ? SIDE_LABEL[String(item.side_type).toUpperCase()] || item.side_type : null,
              item?.finishing_option,
            ].filter((s) => s && String(s).trim());

            const fileUrls = String(item?.file_url || "")
              .split(",")
              .map((u: string) => u.trim())
              .filter(Boolean);

            return (
              <div key={item?.id || idx} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{item?.category || "เอกสาร"}</p>
                      <p className="text-xs text-slate-500">
                        {pageCount} หน้า × {quantity} ชุด · {baht(unitPrice)}/หน้า
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-sm shrink-0">{baht(itemSubtotal)}</span>
                </div>

                {(specs.length > 0 || fileUrls.length > 0) && (
                  <div className="pl-8 space-y-2">
                    {specs.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {specs.map((spec: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {fileUrls.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {fileUrls.map((url: string, fIdx: number) => (
                          <a
                            key={`${url}-${fIdx}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="เปิดดูไฟล์"
                            className="inline-flex items-center gap-1 max-w-[240px] px-2 py-1 rounded-lg border border-blue-100 bg-blue-50/60 hover:bg-blue-100 text-[11px] font-medium text-blue-700 transition"
                          >
                            <Paperclip className="w-3 h-3 shrink-0" />
                            <span className="truncate">{fileNameFromUrl(url, `ไฟล์ที่ ${fIdx + 1}`)}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* สรุปยอด */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>ค่างานพิมพ์ ({items.length} รายการ)</span>
                <span className="text-slate-700 font-medium">{baht(subtotal)}</span>
              </div>
              {smallOrderFee > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>ค่าธรรมเนียมสั่งซื้อขนาดเล็ก</span>
                  <span className="font-medium">+{baht(smallOrderFee)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                <span className="text-sm font-semibold text-slate-900">ยอดชำระสุทธิ</span>
                <span className="text-base font-extrabold text-blue-600">{baht(netTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
