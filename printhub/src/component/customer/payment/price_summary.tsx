'use client';

interface PriceSummaryProps {
  printPrice: number;
  minOrderFee: number;
  minOrderThreshold: number;
  totalPrice: number;
}

export function PriceSummary({ printPrice, minOrderFee, minOrderThreshold, totalPrice }: PriceSummaryProps) {
  return (
    <div className="space-y-1.5 mt-2 mb-4 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>ค่าบริการงานพิมพ์</span>
        <span>฿{printPrice.toFixed(2)}</span>
      </div>

      {minOrderFee > 0 && (
        <div className="flex justify-between text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 text-xs">
          <div>
            <span className="font-semibold block">ค่าธรรมเนียมขั้นต่ำ</span>
            <span className="text-[10px] text-amber-500">(ขั้นต่ำของร้าน ฿{minOrderThreshold.toFixed(2)})</span>
          </div>
          <span className="font-semibold text-sm">+฿{minOrderFee.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t font-bold text-gray-800">
        <span>ยอดชำระสุทธิ</span>
        <span className="text-2xl text-blue-600">฿{totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}