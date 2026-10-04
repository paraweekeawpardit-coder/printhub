'use client';

export function PaymentQrCode() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">สแกน QR Code เพื่อชำระเงิน</h2>
      <p className="text-xs text-gray-500 mb-4">
        บัญชีกลางระบบ PrintHub (ระบบจะโอนให้ร้านค้าเมื่อได้รับงานเรียบร้อย)
      </p>

      <div className="w-56 h-56 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 mb-4 overflow-hidden">
        <img
          src="/qr_code_for_pay.png"
          alt="PromptPay QR Code"
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      <div className="w-full bg-blue-50 p-4 rounded-xl text-left border border-blue-100 space-y-1 text-sm text-gray-700">
        <p><span className="font-semibold">ธนาคาร:</span> กสิกรไทย (KBANK)</p>
        <p><span className="font-semibold">ชื่อบัญชี:</span> บจก. พริ้นท์ฮับ (บัญชีกลาง)</p>
        <p><span className="font-semibold">เลขที่บัญชี:</span> 123-4-56789-0</p>
      </div>
    </div>
  );
}