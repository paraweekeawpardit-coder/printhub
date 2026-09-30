/**
 * =========================================================================
 * Component: ShopCartBottomBar
 * หน้าที่: แถบสรุปตะกร้าสินค้าแบบ Sticky Floating ด้านล่างหน้าจอ
 * - แสดงจำนวนไอเทมที่เลือกไว้ และยอดรวมราคาของร้านค้านี้
 * - มีปุ่ม "ดูตะกร้า / กำหนดวันรับงาน" เพื่อเปิด Drawer นัดรับงานของร้านนี้
 * =========================================================================
 */

import React from "react";
import { ShoppingBag } from "lucide-react";

interface ShopCartBottomBarProps {
  totalItems: number;
  totalPrice: number;
  onOpenCart: () => void;
}

export default function ShopCartBottomBar({
  totalItems,
  totalPrice,
  onOpenCart,
}: ShopCartBottomBarProps) {
  if (totalItems <= 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:px-6 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {totalItems}
          </div>
          <div>
            <span className="text-xs text-slate-500 block">
              {totalItems} รายการที่เลือกไว้
            </span>
            <span className="text-base font-extrabold text-blue-600">
              ฿{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCart}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ดูตะกร้า / กำหนดวันรับงาน</span>
        </button>
      </div>
    </div>
  );
}