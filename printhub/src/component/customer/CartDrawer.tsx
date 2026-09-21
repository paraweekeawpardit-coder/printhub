'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, X } from 'lucide-react';

interface CartItem {
  fileName: string;
  paperSize: string;
  colorType: string;
  printSide: string;
  pagesPerSet: number;
  pricePerPage: number;
  quantity: number;
  totalPrice: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
}

export default function CartDrawer({ isOpen, onClose, items }: CartDrawerProps) {
  const router = useRouter();

  if (!isOpen) return null;

  // รายการสินค้าในตะกร้า (ถ้าไม่มีส่งมา ให้ใช้รายการสติ๊กเกอร์ 82 บาท)
  const cartItems: CartItem[] = items && items.length > 0 ? items : [
    {
      fileName: 'logo_printhub.png',
      paperSize: 'แผ่นสติ๊กเกอร์ (เนื้อ PP)',
      colorType: '5x5 ซม.',
      printSide: 'ไม่มี',
      pagesPerSet: 1,
      pricePerPage: 82.00,
      quantity: 1,
      totalPrice: 82.00,
    }
  ];

  // คำนวณราคารวม
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // ฟังก์ชันกด "ไปที่หน้าชำระเงิน"
  const handleGoToPayment = () => {
    const orderPayload = {
      id: 'ORDER-' + Date.now(),
      items: cartItems,
      services: [],
      smallOrderFeeThreshold: 50,
    };

    // 1. ฝากข้อมูลตะกร้าไว้ใน sessionStorage
    sessionStorage.setItem('pending_order_data', JSON.stringify(orderPayload));

    // 2. ปิด Drawer แล้วย้ายไปหน้า Payment
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
            {cartItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="font-bold text-sm text-slate-800">{item.fileName}</div>
                <div className="text-xs text-slate-500">
                  {item.paperSize} ({item.colorType})
                </div>
                <div className="flex justify-between items-center pt-2 text-xs font-semibold text-slate-700 border-t border-slate-200/60">
                  <span>จำนวน {item.quantity} ชุด</span>
                  <span className="text-blue-600 text-sm font-bold">฿{item.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
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
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>ไปที่หน้าชำระเงิน</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </div>
  );
}