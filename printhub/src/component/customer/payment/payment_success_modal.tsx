'use client';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onGoHome: () => void;
  onGoOrders: () => void;
}

export function PaymentSuccessModal({ isOpen, onGoHome, onGoOrders }: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h3 className="text-lg font-bold text-gray-800">แจ้งชำระเงินเรียบร้อยแล้ว</h3>
        <p className="text-xs text-gray-500">
          ระบบได้ส่งหลักฐานการโอนเงินให้ทางร้านค้าตรวจสอบแล้ว คุณสามารถติดตามสถานะออเดอร์ได้ตลอดเวลา
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={onGoOrders}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all"
          >
            ดูรายการคำสั่งซื้อของฉัน
          </button>
          <button
            onClick={onGoHome}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}