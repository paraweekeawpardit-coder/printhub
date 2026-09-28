'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PaymentTimer } from '../../../../component/customer/payment/payment_timer';
import { PaymentQrCode } from '../../../../component/customer/payment/payment_qr_code';
import { SlipUploader } from '../../../../component/customer/payment/slip_uploader';
import { PaymentSuccessModal } from '../../../../component/customer/payment/payment_success_modal';
import { OrderSummary, OrderDetails } from '../../../../component/customer/payment/order_summary';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  // รองรับทั้ง [orderid] และ [orderId]
  const rawOrderId = params?.orderid || params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : (rawOrderId as string);

  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(true);

  // เวลานับถอยหลัง 10 นาที (600 วินาที)
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // ดึงข้อมูล Order โดยเช็คจาก sessionStorage ก่อน
  useEffect(() => {
    let isMounted = true;

    async function fetchOrderDetails() {
      setIsLoadingOrder(true);

      // 1. เช็คข้อมูลตะกร้าที่เพิ่งส่งมาจาก sessionStorage เป็นอันดับแรก
      try {
        const savedSessionData = sessionStorage.getItem('pending_order_data');
        if (savedSessionData) {
          const parsedData = JSON.parse(savedSessionData);
          if (isMounted) {
            setOrderData(parsedData);
            setIsLoadingOrder(false);
          }
          return; // ดึงสำเร็จแล้วให้ออกจากฟังก์ชันทันที ไม่ต้องรอ API
        }
      } catch (e) {
        console.error('Error reading pending_order_data from sessionStorage:', e);
      }

      // ข้อมูล Fallback สำรองกรณีไม่มีข้อมูลใน Storage และ Fetch API ไม่ผ่าน
      const fallbackData: OrderDetails = {
        id: orderId || 'MOCK-ORDER-001',
        items: [
          {
            fileName: 'REQ_UPDATE_PRINTHUB.pdf',
            paperSize: 'A4',
            colorType: 'ขาว-ดำ 80 แกรม',
            printSide: 'ไม่มี',
            pagesPerSet: 1,
            pricePerPage: 13.50,
            quantity: 1,
            totalPrice: 13.50,
          },
        ],
        services: [],
        smallOrderFeeThreshold: 50,
      };

      // 2. ถ้าไม่มีข้อมูลใน sessionStorage ให้ลองดึงจาก API
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`/api/orders/${orderId}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (isMounted) setOrderData(data);
        } else {
          if (isMounted) setOrderData(fallbackData);
        }
      } catch (err) {
        if (isMounted) setOrderData(fallbackData);
      } finally {
        if (isMounted) setIsLoadingOrder(false);
      }
    }

    fetchOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  // Countdown timer 10 นาที
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
    try {
      const formData = new FormData();
      formData.append('slip', selectedFile);
      formData.append('orderId', orderId || '');

      await fetch(`/api/payments/upload-slip`, {
        method: 'POST',
        body: formData,
      });

      setShowSuccessModal(true);
    } catch (err) {
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Left Column: Order Summary & QR Code */}
          <div className="space-y-4">
            <OrderSummary orderData={orderData} isLoading={isLoadingOrder} />
            <PaymentQrCode />
          </div>

          {/* Right Column: Slip Upload & Action */}
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

      {/* Pop-up แสดงสถานะหลังจ่ายเงิน */}
      <PaymentSuccessModal 
        isOpen={showSuccessModal}
        onGoHome={() => router.push('/customer')}
        onGoOrders={() => router.push('/customer/orders')}
      />
    </div>
  );
}