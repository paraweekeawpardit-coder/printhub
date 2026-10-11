/**
 * Component: ServiceOptionFooter
 * หน้าที่: แถบสรุปยอดเงินด้านล่าง แจ้งเตือนสเปกที่จำเป็นที่ยังเลือกไม่ครบ และปุ่มกดยืนยันใส่ตะกร้า
 */

"use client";

import React from "react";
import { Plus, Loader2 } from "lucide-react";

interface ServiceOptionFooterProps {
  isMultiPageService: boolean;
  totalPages: number;
  quantity: number;
  finalTotalPrice: number;
  hasUploadedFiles: boolean;
  missingGroups: string[];
  canAddToCart: boolean;
  isUploading: boolean;
  onSubmit: () => void;
}

export default function ServiceOptionFooter({
  isMultiPageService,
  totalPages,
  quantity,
  finalTotalPrice,
  hasUploadedFiles,
  missingGroups,
  canAddToCart,
  isUploading,
  onSubmit,
}: ServiceOptionFooterProps) {
  return (
    <div className="p-4 sm:px-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      <div>
        <span className="text-[11px] text-slate-400 block">
          {isMultiPageService
            ? `ราคาคำนวณ (${totalPages} หน้า × ${quantity} ชุด)`
            : "ราคาคำนวณสุทธิ"}
        </span>
        <span className="text-base font-extrabold text-blue-600">
          ฿{finalTotalPrice.toFixed(2)}
        </span>
        {hasUploadedFiles && missingGroups.length > 0 && (
          <span className="text-[10px] text-amber-600 font-medium block mt-0.5">
            * กรุณาเลือก: {missingGroups.join(", ")}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={!canAddToCart}
        onClick={onSubmit}
        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer ${
          canAddToCart
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>กำลังอัปโหลดไฟล์ขึ้นเซิร์ฟเวอร์...</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>ใส่ตะกร้า</span>
          </>
        )}
      </button>
    </div>
  );
}