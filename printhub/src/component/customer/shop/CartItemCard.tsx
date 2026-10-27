"use client";

import React from "react";
import { Trash2, Pencil, Paperclip, ExternalLink } from "lucide-react";
import { CartItem } from "./ShopCartDrawer";
import { pageSelectionTags } from "../pageSelection";

interface CartItemCardProps {
  item: CartItem;
  itemSubtotal: number;
  itemPages: number;
  onEdit?: () => void;
  onRemove?: () => void;
}

// ชื่อไฟล์จาก URL (ตัด query string และถอดรหัสภาษาไทย)
const fileNameFromUrl = (url: string, fallback: string) => {
  try {
    const last = url.split("?")[0].split("/").pop() || "";
    return decodeURIComponent(last) || fallback;
  } catch {
    return fallback;
  }
};

export default function CartItemCard({
  item,
  itemSubtotal,
  itemPages,
  onEdit,
  onRemove,
}: CartItemCardProps) {
  const fileUrls = item.file_url
    ? item.file_url
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
    : [];

  // ไม่แสดงค่า "ไม่มี" (ลูกค้าไม่ได้เลือกตัวเลือกนั้น)
  const specs = [
    item.selected_size,
    item.color_type,
    item.paper_type,
    item.finishing_option,
    ...pageSelectionTags((item as any).page_selection),
  ].filter(
    (s) => s && String(s).trim() && String(s).trim() !== "ไม่มี"
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
      {/* หัวรายการ + ราคา */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{item.category || "งานพิมพ์"}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {itemPages} หน้า × {item.quantity} ชุด
          </p>
        </div>
        <span className="font-extrabold text-slate-900 text-base shrink-0">฿{itemSubtotal.toFixed(2)}</span>
      </div>

      {/* สเปก */}
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {specs.map((spec, i) => (
            <span key={i} className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md font-medium">
              {spec}
            </span>
          ))}
        </div>
      )}

      {/* ไฟล์ที่แนบ */}
      {fileUrls.length > 0 && (
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400">ไฟล์ที่แนบ ({fileUrls.length})</span>
          {fileUrls.map((url, fIdx) => (
            <a
              key={`${url}-${fIdx}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-[11px] text-slate-700 hover:text-blue-700 transition group"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
              <span className="truncate flex-1 min-w-0">
                {fileUrls.length > 1 && <span className="font-semibold">ไฟล์ {fIdx + 1}: </span>}
                {fileNameFromUrl(url, `ไฟล์ที่ ${fIdx + 1}`)}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
            </a>
          ))}
        </div>
      )}

      {/* ปุ่มจัดการ */}
      {(onEdit || onRemove) && (
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            แก้ไข
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ลบ
          </button>
        )}
      </div>
      )}
    </div>
  );
}
