"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  ShoppingBag 
} from "lucide-react";

interface CartGroupedShop {
  shop_id: string;
  shop_name: string;
  is_open?: boolean;
  open_time?: string;
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

export default function CustomerCartCard({
  group,
  isExpanded: controlledExpanded,
  onToggleExpand: controlledToggle,
  onClearCart,
}: CustomerCartCardProps) {
  const router = useRouter();
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpand = controlledToggle || (() => setInternalExpanded(!internalExpanded));

  if (!group) return null;

  const isOpen = Boolean(group.is_open);
  const items = group.items || [];
  const totalPrice = Number(group.total_price || 0);

  // สรุปรายการสินค้าในตะกร้า (เช่น เอกสาร x2 ชุด, ป้ายไวนิล x1 ชุด)
  const itemCategorySummary = (() => {
    if (!items || items.length === 0) return "ไม่มีรายการในตะกร้า";

    const categoryTotals: Record<string, number> = {};
    items.forEach((it: any) => {
      const cat = it?.category || "เอกสาร";
      const qty = Number(it?.quantity) || 1;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + qty;
    });

    return Object.entries(categoryTotals)
      .map(([cat, totalQty]) => `${cat} x${totalQty} ชุด`)
      .join(", ");
  })();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
      
      {/* 1. Header บาร์บน: [ชื่อร้าน + ป้ายเวลาทำการ + จำนวนรายการ] (ฝั่งซ้าย) | [ปุ่มสถานะ + ปุ่มลบร้าน] (ฝั่งขวา) */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          {/* ชื่อร้านค้า */}
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm sm:text-base truncate">
            <Store className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">{group.shop_name}</span>
          </div>

          {/* 🌟 เวลาทำการ (ย้ายมาไว้ข้างชื่อร้าน) */}
          <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              เวลาทำการ:{" "}
              <strong className="text-slate-700 font-semibold">
                {group.open_time && group.close_time
                  ? `${group.open_time.slice(0, 5)} - ${group.close_time.slice(0, 5)} น.`
                  : "เปิดทำการ"}
              </strong>
            </span>
          </div>

          {/* จำนวนรายการ */}
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
            {items.length} รายการ
          </span>
        </div>

        {/* ปุ่มสถานะเปิด/ปิดบริการ และปุ่มลบร้าน */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 shrink-0 ${
              isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                : "bg-rose-50 text-rose-600 border-rose-200/80"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            {isOpen ? "เปิดทำการ" : "ปิดทำการ"}
          </span>

          <button
            type="button"
            onClick={() => onClearCart?.(group.shop_id)}
            className="px-2.5 py-1 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition text-xs font-semibold flex items-center gap-1 cursor-pointer border border-rose-200/80 shrink-0"
            title="ลบร้านนี้"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ลบร้านนี้</span>
          </button>
        </div>
      </div>

      {/* 2. เนื้อหาการ์ดหลัก */}
      <div className="p-4 sm:px-5">
        
        {/* แถวหลัก: [ปุ่มรายละเอียด + สรุปรายการสินค้า] VS [ปุ่มดูร้านค้า + ยอดรวมร้านนี้] */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* ฝั่งซ้าย: ปุ่มรายละเอียด และสรุปประเภทงานพิมพ์ */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={toggleExpand}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer border ${
                isExpanded
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{isExpanded ? "ซ่อนรายละเอียด" : "รายละเอียด"}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <span className="text-[11px] font-normal text-slate-500">
              {itemCategorySummary}
            </span>
          </div>

          {/* ฝั่งขวา: ปุ่ม Action สั่งซื้อ และ ยอดรวมสุทธิขวาสุด */}
          <div className="flex items-center justify-between md:justify-end gap-3.5">
            <button
              type="button"
              onClick={() => router.push(`/customer/shop/${group.shop_id}?openCart=true`)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-xs cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ดูร้านค้า / สั่งซื้อ</span>
            </button>

            <div className="text-right pl-3.5 border-l border-slate-200/80 shrink-0">
              <span className="text-[10px] text-slate-400 block font-medium">ยอดรวมร้านนี้</span>
              <span className="text-base font-extrabold text-blue-600">
                ฿{totalPrice.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. รายละเอียดใน Dropdown เมื่อกดขยาย */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-[#F9FAFB] p-4 text-xs space-y-3">
          <div className="space-y-2.5">
            {items.map((item: any, idx: number) => {
              const quantity = Number(item?.quantity) || 1;
              const pageCount = Number(item?.page_count) || 1;
              const pricePerPage = Number(item?.price_per_page) || Number(item?.unit_price) || 0;
              const itemSubtotal = Number(item?.subtotal) || (pricePerPage * pageCount * quantity);

              const specs = [
                item?.selected_size,
                item?.color_type,
                item?.paper_type,
                item?.print_side || item?.print_type,
                item?.binding_option
              ].filter(Boolean);

              return (
                <div key={item?.id || idx} className="bg-white p-3.5 rounded-2xl border border-slate-200/70 space-y-2 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {idx + 1}. {item?.category || "เอกสาร"}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      ฿{itemSubtotal.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {specs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {specs.map((spec: string, sIdx: number) => (
                        <span key={sIdx} className="bg-slate-100 text-slate-600 text-[11px] px-2.5 py-0.5 rounded-md font-semibold">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                    <span>
                      {pageCount} หน้า × ฿{pricePerPage.toFixed(2)}/หน้า
                    </span>
                    <span className="font-semibold text-slate-600">
                      รวม {quantity} ชุด
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
              <span>ค่างานพิมพ์รวม</span>
              <span className="text-slate-800 font-bold">
                ฿{totalPrice.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold pt-1 border-t border-slate-100">
              <span className="text-blue-700">ยอดชำระสุทธิ</span>
              <span className="text-base text-blue-600">
                ฿{totalPrice.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}