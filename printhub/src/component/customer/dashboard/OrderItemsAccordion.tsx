/**
 * Component: OrderItemsAccordion
 * หน้าที่: แสดงรายการงานพิมพ์ สเปกกระดาษ จำนวนหน้า/ชุด ไฟล์ที่แนบไปพิมพ์ หมายเหตุ และสรุปราคาแบบละเอียด
 */

"use client";

import React from "react";
import { FileText, Paperclip, ExternalLink } from "lucide-react";

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

interface OrderItemsAccordionProps {
  isExpanded: boolean;
  items: any[];
  files?: any[];
  description?: string | null;
  subtotalPrice: number;
  smallOrderFee?: number;
  netTotalPrice: number;
}

export default function OrderItemsAccordion({
  isExpanded,
  items,
  files = [],
  description,
  subtotalPrice,
  smallOrderFee = 0,
  netTotalPrice,
}: OrderItemsAccordionProps) {
  if (!isExpanded) return null;

  return (
    <div className="border-t border-slate-100 bg-[#F9FAFB] p-4 text-xs space-y-3">
      {/* 1. รายการสินค้าและสเปกแต่ละชิ้น */}
      <div className="space-y-2">
        {items.map((item: any, idx: number) => {
          const pageCount = Number(item?.page_count) || 1;
          const unitPrice = Number(item?.unit_price) || 0;
          const quantity = Number(item?.quantity) || 1;
          const itemSubtotal =
            Number(item?.subtotal) || unitPrice * pageCount * quantity;

          const attachedFiles = getItemFiles(item, files, items.length);

          const specs = item?.describe
            ? item.describe
                .split("|")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [];

          return (
            <div
              key={item?.id || idx}
              className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1.5 shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-800 text-xs">
                  {idx + 1}. {item?.category || "งานพิมพ์เอกสาร"}
                </span>
                <span className="font-bold text-slate-900">
                  ฿{itemSubtotal.toFixed(2)}
                </span>
              </div>

              {specs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {specs.map((spec: string, sIdx: number) => (
                    <span
                      key={sIdx}
                      className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[11px] text-slate-400 flex justify-between pt-0.5">
                <span>
                  {pageCount} หน้า × ฿{unitPrice.toFixed(2)}/หน้า
                </span>
                <span className="font-medium text-slate-600">
                  รวม {quantity} ชุด
                </span>
              </div>

              {/* ไฟล์ที่แนบไปพิมพ์ */}
              {attachedFiles.length > 0 && (
                <div className="pt-1.5 mt-1 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">
                    ไฟล์ที่แนบ ({attachedFiles.length})
                  </span>
                  {attachedFiles.map((file, fIdx) => (
                    <a
                      key={`${file.url}-${fIdx}`}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-[11px] text-slate-700 hover:text-blue-700 transition group"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
                      <span className="truncate flex-1 min-w-0">{file.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. หมายเหตุถึงร้านค้า (ถ้ามี) */}
      {description && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-xs flex items-start gap-2 shadow-2xs">
          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-bold text-slate-700 block">หมายเหตุถึงร้าน:</span>
            <p className="text-slate-600 break-words">{description}</p>
          </div>
        </div>
      )}

      {/* 3. ตารางสรุปยอดเงินและค่าธรรมเนียม */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1 text-slate-600 text-[11px] shadow-2xs">
        <div className="flex justify-between">
          <span>ค่างานพิมพ์รวม</span>
          <span className="font-semibold text-slate-800">
            ฿{subtotalPrice.toFixed(2)}
          </span>
        </div>

        {smallOrderFee > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>ค่าธรรมเนียมสั่งซื้อขนาดเล็ก (&lt;50 บาท)</span>
            <span className="font-semibold">+฿{smallOrderFee.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs font-bold text-slate-900 pt-1.5 border-t border-slate-100">
          <span className="text-blue-700">ยอดชำระสุทธิ</span>
          <span className="text-sm font-extrabold text-blue-700">
            ฿{netTotalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}