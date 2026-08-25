'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ดึง orderId จาก Dynamic Path (/customer/order/payment/[orderId])
  const orderId = params?.orderId as string;

  // ✅ ดึงราคาทั้งหมดที่ส่งมาจากหน้า Order ผ่าน Query Params
  const queryTotalPrice = Number(searchParams.get('totalPrice')) || 0;

  // Countdown timer 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PENDING' | 'REJECTED'>('IDLE');

  // ==========================================
  // คำนวณค่าธรรมเนียมขั้นต่ำจากยอดจริง
  // ==========================================
  const printPrice = queryTotalPrice; // ยอดรวมงานพิมพ์จริงจากหน้า Order
  const minOrderThreshold = 20.00; // ยอดสั่งซื้อขั้นต่ำของร้าน (ตั้งค่าตามต้องการ)

  // คำนวณค่าธรรมเนียมส่วนต่างขั้นต่ำ
  const minOrderFee = printPrice < minOrderThreshold && printPrice > 0 ? minOrderThreshold - printPrice : 0;
  // ยอดสุทธิรวมทั้งหมด
  const totalPrice = printPrice + minOrderFee;

  // Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    // Mock Send to Admin
    setTimeout(() => {
      setIsSubmitting(false);
      setPaymentStatus('PENDING');
      setErrorMessage(null);

      // 🚀 เพิ่มส่วนนี้: รอให้ผู้ใช้เห็นสถานะ "กำลังรอ Admin ตรวจสอบ" 2 วินาที แล้วกลับหน้าหลัก
      setTimeout(() => {
        router.push('/customer'); // เปลี่ยนเป็น Path หน้าหลักของระบบคุณ เช่น '/customer' หรือ '/'
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50"
          >
            ‹ ย้อนกลับ
          </button>
          <h1 className="text-xl font-bold text-gray-800">PrintHub ชำระเงินค่าบริการ</h1>
          <div className="text-sm text-gray-500">
            เวลารอการชำระเงิน: <span className="font-bold text-red-500">{formatTime(timeLeft)} น.</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: QR Code & Bank Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-2">สแกน QR Code เพื่อชำระเงิน</h2>
            <p className="text-xs text-gray-500 mb-4">บัญชีกลางระบบ PrintHub (ระบบจะโอนให้ร้านค้าเมื่อได้รับงานเรียบร้อย)</p>
            
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

          {/* Right Column: Slip Upload & Detailed Price Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">แนบหลักฐานการโอนเงิน (สลิป)</h2>

              {paymentStatus === 'PENDING' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                  ⏳ ส่งหลักฐานเรียบร้อยแล้ว กำลังรอ Admin ตรวจสอบความถูกต้อง...
                </div>
              )}

              {paymentStatus === 'REJECTED' && errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                  ⚠️ {errorMessage}
                </div>
              )}

              {isExpired ? (
                <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl text-center">
                  <p className="font-bold text-base">หมดเวลาในการชำระเงิน</p>
                  <p className="text-xs mt-1">คำสั่งซื้อนี้ถูกยกเลิกโดยอัตโนมัติแล้ว กรุณาทำรายการใหม่อีกครั้ง</p>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 min-h-[200px]">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg" 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={isExpired}
                  />
                  {previewUrl ? (
                    <div className="relative w-full h-44">
                      <img src={previewUrl} alt="Slip Preview" className="w-full h-full object-contain rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 font-bold text-xl">
                        ↑
                      </div>
                      <p className="text-sm font-semibold text-gray-700">คลิกเพื่ออัปโหลดสลิปโอนเงิน</p>
                      <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ JPG, PNG (สูงสุด 5MB)</p>
                    </>
                  )}
                </label>
              )}
            </div>

            {/* Bottom Actions: Price Details Breakdown */}
            <div className="mt-6 border-t pt-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">รายละเอียดราคา</span>
              
              <div className="space-y-1.5 mt-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>ค่าบริการงานพิมพ์</span>
                  <span>฿{printPrice.toFixed(2)}</span>
                </div>

                {/* แสดงส่วนต่างค่าธรรมเนียมขั้นต่ำเฉพาะเมื่อไม่ถึงเกณฑ์ */}
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

              <button
                onClick={handleSubmit}
                disabled={isExpired || !selectedFile || isSubmitting}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  isExpired || !selectedFile || isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'กำลังส่งข้อมูลให้ Admin ตรวจสอบ...' : 'ยืนยันการชำระเงิน'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}