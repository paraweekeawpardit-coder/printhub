'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { PaymentTimer } from '../../../../../component/customer/payment/payment_timer';
import { PaymentQrCode } from '../../../../../component/customer/payment/payment_qr_code';
import { SlipUploader } from '../../../../../component/customer/payment/slip_uploader';
import { PriceSummary } from '../../../../../component/customer/payment/price_summary';
import { PaymentSuccessModal } from '../../../../../component/customer/payment/payment_success_modal';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = params?.orderId as string;
  const queryTotalPrice = Number(searchParams.get('totalPrice')) || 0;

  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // คำนวณราคา
  const printPrice = queryTotalPrice;
  const minOrderThreshold = 20.00;
  const minOrderFee = printPrice < minOrderThreshold && printPrice > 0 ? minOrderThreshold - printPrice : 0;
  const totalPrice = printPrice + minOrderFee;

  // Countdown timer
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // แสดง Pop-up ตามความต้องการของ PO แทนการ redirect อัตโนมัติ
      setShowSuccessModal(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50"
          >
            ‹ ย้อนกลับ
          </button>
          <h1 className="text-xl font-bold text-gray-800">PrintHub ชำระเงินค่าบริการ</h1>
          <PaymentTimer timeLeft={timeLeft} />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <PaymentQrCode />

          {/* Slip Upload & Summary Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">แนบหลักฐานการโอนเงิน (สลิป)</h2>
              <SlipUploader 
                previewUrl={previewUrl} 
                isExpired={isExpired} 
                onFileChange={handleFileChange} 
              />
            </div>

            <div className="mt-6 border-t pt-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">รายละเอียดราคา</span>
              
              <PriceSummary 
                printPrice={printPrice} 
                minOrderFee={minOrderFee} 
                minOrderThreshold={minOrderThreshold} 
                totalPrice={totalPrice} 
              />

              <button
                onClick={handleSubmit}
                disabled={isExpired || !selectedFile || isSubmitting}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  isExpired || !selectedFile || isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการชำระเงิน'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up แสดงสถานะหลังจ่ายเงิน ตาม Requirement ของ PO */}
      <PaymentSuccessModal 
        isOpen={showSuccessModal}
        onGoHome={() => router.push('/customer')}
        onGoOrders={() => router.push('/customer/orders')}
      />
    </div>
  );
}