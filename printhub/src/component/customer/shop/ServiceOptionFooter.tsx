/**
 * Component: ServiceOptionFooter
 * หน้าที่: แถบสรุปยอดเงินด้านล่าง แจ้งเตือนสเปกที่จำเป็นที่ยังเลือกไม่ครบ ปุ่มใส่ตะกร้า และปุ่มสั่งทันที
 */

"use client";

import React from "react";
import { Plus, Loader2, ArrowRight } from "lucide-react";

interface ServiceOptionFooterProps {
  isMultiPageService: boolean;
  totalPages: number;
  quantity: number;
  finalTotalPrice: number;
  hasUploadedFiles: boolean;
  missingGroups: string[];
  canAddToCart: boolean;
  blockingMessage?: string; // เงื่อนไขอื่นที่ยังไม่ครบ (เช่น หน้าที่ต้องการพิมพ์กรอกผิด)
  isUploading: boolean;
  onSubmit: () => void;
  onBuyNow?: () => void; // ไม่ส่งมา = ไม่แสดงปุ่มสั่งทันที (เช่น ตอนแก้ไขรายการในตะกร้า)
  submittingMode?: "cart" | "buy" | null;
}

export default function ServiceOptionFooter({
  isMultiPageService,
  totalPages,
  quantity,
  finalTotalPrice,
  hasUploadedFiles,
  missingGroups,
  canAddToCart,
  blockingMessage = "",
  isUploading,
  onSubmit,
  onBuyNow,
  submittingMode = null,
}: ServiceOptionFooterProps) {
  // คำนวณราคาเมื่อเลือกสเปกที่จำเป็นครบ และอัปโหลดไฟล์แล้วเท่านั้น (TC14)
  const isPriceReady = hasUploadedFiles && missingGroups.length === 0 && !blockingMessage;
  const pendingHint = hasUploadedFiles && missingGroups.length === 0 && blockingMessage
    ? blockingMessage
    : !hasUploadedFiles
    ? missingGroups.length > 0
      ? `อัปโหลดไฟล์ และเลือก ${missingGroups.join(", ")} ให้ครบเพื่อดูราคา`
      : "อัปโหลดไฟล์เพื่อคำนวณราคา"
    : `กรุณาเลือก ${missingGroups.join(", ")} ให้ครบเพื่อดูราคา`;

  return (
    <div className="p-4 sm:px-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      <div>
        {isPriceReady ? (
          <>
            <span className="text-[11px] text-slate-400 block">
              {isMultiPageService
                ? `ราคาคำนวณ (${totalPages} หน้า × ${quantity} ชุด)`
                : "ราคาคำนวณสุทธิ"}
            </span>
            <span className="text-base font-extrabold text-blue-600">
              ฿{finalTotalPrice.toFixed(2)}
            </span>
          </>
        ) : (
          <>
            <span className="text-[11px] text-slate-400 block">ราคาคำนวณ</span>
            <span className="text-base font-extrabold text-slate-300">฿ -</span>
            <span className="text-[10px] text-amber-600 font-medium block mt-0.5">
              * {pendingHint}
            </span>
          </>
        )}
      </div>

      <div className="w-full sm:w-auto flex items-center gap-2">
        {/* ใส่ตะกร้า: ถ้ามีปุ่มสั่งทันที จะเป็นปุ่มรอง (ขอบ) */}
        <button
          type="button"
          disabled={!canAddToCart}
          onClick={onSubmit}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            !canAddToCart
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : onBuyNow
              ? "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          }`}
        >
          {isUploading && submittingMode !== "buy" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังอัปโหลดไฟล์...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>ใส่ตะกร้า</span>
            </>
          )}
        </button>

        {onBuyNow && (
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={onBuyNow}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer ${
              canAddToCart
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            {isUploading && submittingMode === "buy" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังอัปโหลดไฟล์...</span>
              </>
            ) : (
              <>
                <span>สั่งทันที</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}