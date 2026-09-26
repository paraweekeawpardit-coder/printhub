'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, X } from 'lucide-react';

interface CartItem {
  id?: string;
  fileName?: string;
  file_url?: string;
  paperSize?: string;
  selected_size?: string;
  paper_type?: string;
  category?: string;
  colorType?: string;
  color_type?: string;
  printSide?: string;
  side_type?: string;
  pagesPerSet?: number;
  page_count?: number;
  pricePerPage?: number;
  unit_price?: number;
  price?: number;
  quantity?: number;
  totalPrice?: number;
  subtotal?: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
}

export default function CartDrawer({ isOpen, onClose, items = [] }: CartDrawerProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const cartItems = items;

  // ฟังก์ชันคำนวณราคาต่อรายการอย่างปลอดภัย
  const getItemPrice = (item: CartItem) => {
    if (typeof item.totalPrice === 'number' && item.totalPrice > 0) return item.totalPrice;
    if (typeof item.subtotal === 'number' && item.subtotal > 0) return item.subtotal;

    const unitPrice = Number(item.unit_price || item.price || item.pricePerPage || 0);
    const quantity = Number(item.quantity || 1);
    const pageCount = Number(item.page_count || item.pagesPerSet || 1);

    return unitPrice * quantity * pageCount;
  };

  // คำนวณราคารวมทั้งหมด
  const subtotal = cartItems.reduce((sum, item) => sum + getItemPrice(item), 0);

  // ฟังก์ชันกด "ไปที่หน้าชำระเงิน"
  const handleGoToPayment = () => {
    const orderPayload = {
      id: 'ORDER-' + Date.now(),
      items: cartItems,
      services: [],
      smallOrderFeeThreshold: 50,
    };

    sessionStorage.setItem('pending_order_data', JSON.stringify(orderPayload));
    onClose();
    router.push(`/customer/order/payment/${orderPayload.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300">
        
        {/* Header ตะกร้า */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-800 text-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span>ตะกร้าสินค้าของคุณ</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* รายการสินค้า */}
          <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                ยังไม่มีสินค้าในตะกร้า
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const itemTitle = item.category || item.fileName || item.file_url?.split('/').pop() || 'รายการงานพิมพ์';
                const itemDetail = [
                  item.paperSize || item.selected_size,
                  item.paper_type,
                  item.colorType || item.color_type
                ].filter(Boolean).join(' • ');

                const itemPrice = getItemPrice(item);

                return (
                  <div key={item.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="font-bold text-sm text-slate-800">{itemTitle}</div>
                    {itemDetail && (
                      <div className="text-xs text-slate-500">
                        {itemDetail}
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 text-xs font-semibold text-slate-700 border-t border-slate-200/60">
                      <span>จำนวน {item.quantity || 1} ชุด</span>
                      <span className="text-blue-600 text-sm font-bold">฿{itemPrice.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer สรุปราคา + ปุ่มไปชำระเงิน */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">ราคารวมสเปกงาน:</span>
            <span className="text-xl font-extrabold text-blue-600">฿{subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleGoToPayment}
            disabled={cartItems.length === 0}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>ไปที่หน้าชำระเงิน</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </div>
  );
}