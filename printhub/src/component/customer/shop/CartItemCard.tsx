"use client";

import React from "react";
import { Trash2, Edit3, FileText, ExternalLink } from "lucide-react";
import { CartItem } from "./ShopCartDrawer";

interface CartItemCardProps {
  item: CartItem;
  itemSubtotal: number;
  itemPages: number;
  onEdit?: () => void;
  onRemove: () => void;
}

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

  return (
    <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-slate-50 transition">
      {/* ส่วนบน: หัวข้อ, จำนวน และปุ่มแก้ไข/ลบ */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm block">
            {item.category} ({item.selected_size})
          </span>
          <span className="text-xs text-blue-600 font-bold block mt-0.5">
            {itemPages > 1 ? `${itemPages} หน้า • ` : ""}จำนวน {item.quantity} ชุด
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-extrabold text-slate-900 text-sm mr-1">
            ฿{itemSubtotal.toFixed(2)}
          </span>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
              title="แก้ไขสเปกรายการนี้"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600" />
            </button>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            title="ลบรายการนี้"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </button>
        </div>
      </div>

      {/* สเปกย่อยแบบแนวนอน กะทัดรัด */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
        <span className="bg-white border border-slate-200/80 px-2 py-0.5 rounded-md">
          {item.color_type || "ขาว-ดำ"}
        </span>
        <span className="bg-white border border-slate-200/80 px-2 py-0.5 rounded-md">
          {item.paper_type || "มาตรฐาน"}
        </span>
        <span className="bg-white border border-slate-200/80 px-2 py-0.5 rounded-md">
          {item.finishing_option || "ไม่เข้าเล่ม"}
        </span>
      </div>

      {/* ปุ่มเปิดดูไฟล์ตัวอย่าง */}
      {fileUrls.length > 0 && (
        <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            แนบ {fileUrls.length} ไฟล์
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {fileUrls.map((url, fIdx) => (
              <a
                key={fIdx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[10px] font-semibold transition"
              >
                <span>ไฟล์ {fIdx + 1}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}