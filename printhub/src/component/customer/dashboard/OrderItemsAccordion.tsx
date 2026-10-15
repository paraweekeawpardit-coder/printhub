/**
 * Component: OrderItemsAccordion
 * หน้าที่: popup รายละเอียดคำสั่งซื้อ (เปิดจากปุ่ม "ดูรายละเอียด" ในการ์ดออเดอร์)
 * - หัว: เลขออเดอร์, ร้าน, สถานะ, วันนัดรับ
 * - กลาง: รายการงานพิมพ์ทั้งหมด (สเปก, จำนวนหน้า/ชุด, ไฟล์ที่แนบ) เลื่อนดูได้
 * - ท้าย: หมายเหตุถึงร้าน + สรุปยอด
 */

"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FileText, Paperclip, X, Store, CalendarDays } from "lucide-react";

type AttachedFile = { name: string; url: string };

// ชื่อไฟล์จาก URL (ใช้เมื่อไม่มี filename ในตาราง print_file)
const fileNameFromUrl = (url: string, fallback: string) => {
  try {
    const last = url.split("?")[0].split("/").pop() || "";
    return decodeURIComponent(last) || fallback;
  } catch {
    return fallback;
  }
};

// รวมไฟล์ของแต่ละรายการ: ใช้ตาราง print_file ก่อน ถ้าไม่มีค่อยใช้ print_order_item.file_url (คั่นด้วย ,)
const getItemFiles = (item: any, files: any[], itemCount: number): AttachedFile[] => {
  const fromTable = files.filter(
    (f) => f?.file_url && (f.item_id === item?.id || (!f.item_id && itemCount === 1))
  );
  if (fromTable.length > 0) {
    return fromTable.map((f, i) => ({
      url: f.file_url,
      name: f.filename || fileNameFromUrl(f.file_url, `ไฟล์ที่ ${i + 1}`),
    }));
  }
  const urls = String(item?.file_url || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  return urls.map((url, i) => ({ url, name: fileNameFromUrl(url, `ไฟล์ที่ ${i + 1}`) }));
};

// สเปกจากคอลัมน์ describe (คั่นด้วย |) ตัดค่าที่ไม่มีความหมายสำหรับลูกค้าออก
const getSpecs = (item: any): string[] =>
  item?.describe
    ? String(item.describe)
        .split("|")
        .map((s: string) => s.trim())
        // SINGLE/DOUBLE = side_type ที่เลิกใช้แล้ว (ข้อมูลเก่า)
        .filter((s: string) => s && !/^(SINGLE|DOUBLE)$/i.test(s))
    : [];

interface OrderItemsAccordionProps {
  isExpanded: boolean;
  onClose: () => void;
  orderNo?: string;
  shopName?: string;
  stateLabel?: string;
  stateBadgeStyle?: string;
  appointmentText?: string;
  items: any[];
  files?: any[];
  description?: string | null;
  subtotalPrice: number;
  smallOrderFee?: number;
  netTotalPrice: number;
}

/** แถวรายการงานพิมพ์ 1 รายการ (กะทัดรัด) */
function ItemRow({ item, idx, files, itemCount }: { item: any; idx: number; files: any[]; itemCount: number }) {
  const pageCount = Number(item?.page_count) || 1;
  const quantity = Number(item?.quantity) || 1;
  const unitPrice = Number(item?.unit_price) || 0;
  const itemSubtotal = Number(item?.subtotal) || unitPrice * quantity;
  const specs = getSpecs(item);
  const attachedFiles = getItemFiles(item, files, itemCount);

  return (
    <div className="bg-white px-3 py-2.5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1.5">
      <div className="flex items-start gap-2.5">
        <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-px">
          {idx + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold text-slate-800 text-xs truncate">{item?.category || "งานพิมพ์เอกสาร"}</p>
            <span className="font-bold text-slate-900 text-xs shrink-0">฿{itemSubtotal.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {specs.length > 0 && <span className="text-slate-600">{specs.join(" · ")}</span>}
            {specs.length > 0 && <span className="text-slate-300"> | </span>}
            <span>
              {pageCount} หน้า × {quantity} ชุด
            </span>
          </p>
        </div>
      </div>

      {attachedFiles.length > 0 && (
        <div className="pl-7 flex flex-wrap gap-1.5">
          {attachedFiles.map((file, fIdx) => (
            <a
              key={`${file.url}-${fIdx}`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              title="เปิดดูไฟล์"
              className="inline-flex items-center gap-1 max-w-[260px] px-2 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-[11px] text-slate-600 hover:text-blue-700 transition"
            >
              <Paperclip className="w-3 h-3 shrink-0" />
              <span className="truncate">{file.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/** หมายเหตุ + สรุปยอด (ใช้ทั้งในการ์ดและใน popup) */
function OrderSummary({
  description,
  subtotalPrice,
  smallOrderFee,
  netTotalPrice,
}: {
  description?: string | null;
  subtotalPrice: number;
  smallOrderFee: number;
  netTotalPrice: number;
}) {
  return (
    <>
      {description && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-xs flex items-start gap-2 shadow-2xs">
          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed min-w-0">
            <span className="font-bold text-slate-700 block">หมายเหตุถึงร้าน:</span>
            <p className="text-slate-600 break-words">{description}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1 text-slate-600 text-[11px] shadow-2xs">
        <div className="flex justify-between">
          <span>ค่างานพิมพ์รวม</span>
          <span className="font-semibold text-slate-800">฿{subtotalPrice.toFixed(2)}</span>
        </div>
        {smallOrderFee > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (&lt;50 บาท)</span>
            <span className="font-semibold">+฿{smallOrderFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-xs font-bold pt-1.5 border-t border-slate-100">
          <span className="text-blue-700">ยอดชำระสุทธิ</span>
          <span className="text-sm font-extrabold text-blue-700">฿{netTotalPrice.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
}

export default function OrderItemsAccordion({
  isExpanded,
  onClose,
  orderNo,
  shopName,
  stateLabel,
  stateBadgeStyle = "",
  appointmentText,
  items,
  files = [],
  description,
  subtotalPrice,
  smallOrderFee = 0,
  netTotalPrice,
}: OrderItemsAccordionProps) {
  // กด Esc เพื่อปิด + ล็อกการเลื่อนหน้าหลักระหว่างเปิด popup
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isExpanded, onClose]);

  if (!isExpanded || typeof document === "undefined") return null;

  const list = items || [];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl max-h-[88vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* หัว popup */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">{orderNo}</span>
              {shopName && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 text-sm min-w-0">
                    <Store className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">{shopName}</span>
                  </span>
                </>
              )}
              {stateLabel && (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${stateBadgeStyle}`}>
                  {stateLabel}
                </span>
              )}
            </div>
            {appointmentText && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                นัดรับ <span className="font-semibold text-slate-700">{appointmentText}</span>
                <span className="text-slate-300">·</span>
                {list.length} รายการ
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* รายการทั้งหมด */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 space-y-2 text-xs">
          {list.map((item: any, idx: number) => (
            <ItemRow key={item?.id || idx} item={item} idx={idx} files={files} itemCount={list.length} />
          ))}
        </div>

        {/* หมายเหตุ + สรุปยอด */}
        <div className="border-t border-slate-100 bg-[#F9FAFB] p-4 space-y-2 text-xs">
          <OrderSummary
            description={description}
            subtotalPrice={subtotalPrice}
            smallOrderFee={smallOrderFee}
            netTotalPrice={netTotalPrice}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
