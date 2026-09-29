'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import NavBar from '../../../../../component/customer/NavBar';
import { PaymentTimer } from '../../../../../component/customer/payment/payment_timer';
import { PaymentQrCode } from '../../../../../component/customer/payment/payment_qr_code';
import { SlipUploader } from '../../../../../component/customer/payment/slip_uploader';
import { PaymentSuccessModal } from '../../../../../component/customer/payment/payment_success_modal';
import { OrderSummary, OrderDetails } from '../../../../../component/customer/payment/order_summary';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  const rawOrderId = params?.orderid || params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : (rawOrderId as string);

  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(true);

  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrderDetails() {
      setIsLoadingOrder(true);

      try {
        const savedSessionData = sessionStorage.getItem('pending_order_data');
        if (savedSessionData) {
          const parsedData = JSON.parse(savedSessionData);
          if (parsedData && parsedData.items && parsedData.items.length > 0) {
            if (isMounted) {
              setOrderData(parsedData);
              setIsLoadingOrder(false);
            }
            return;
          }
        }
      } catch (e) {
        console.error('Error reading sessionStorage:', e);
      }

      const emptyFallbackData: OrderDetails = {
        id: orderId || 'ORDER-PENDING',
        items: [
          {
            fileName: 'รายการเอกสารสั่งพิมพ์',
            paperSize: 'A4',
            colorType: 'ขาว-ดำ / สี',
            printSide: 'ไม่มี',
            pagesPerSet: 1,
            pricePerPage: 0,
            quantity: 1,
            totalPrice: 0,
          },
        ],
        services: [],
        smallOrderFeeThreshold: 50,
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        // ดึงข้อมูลคำสั่งซื้อแบบ GET
        const res = await fetch(`http://localhost:5000/api/orders`, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const result = await res.json();
          if (isMounted && result.success && Array.isArray(result.data)) {
            const apiOrder = result.data.find((o: any) => o.id === orderId);

            if (apiOrder) {
              const formattedItems = (apiOrder.print_order_item || []).map((item: any) => {
                const qty = Number(item.quantity) || 1;
                const unitPrice = Number(item.unit_price) || 0;
                const subtotal = Number(item.subtotal);

                const calculatedTotalPrice = !isNaN(subtotal) && subtotal > 0 
                  ? subtotal 
                  : (unitPrice * qty);

                return {
                  fileName: item.category || 'งานพิมพ์เอกสาร',
                  paperSize: 'A4',
                  colorType: 'สี/ขาวดำ',
                  printSide: 'ไม่มี',
                  pagesPerSet: item.page_count || 1,
                  pricePerPage: qty > 0 ? (calculatedTotalPrice / qty) : unitPrice,
                  quantity: qty,
                  totalPrice: calculatedTotalPrice,
                };
              });

              setOrderData({
                id: apiOrder.id || orderId,
                items: formattedItems.length > 0 ? formattedItems : emptyFallbackData.items,
                services: [],
                smallOrderFeeThreshold: 50,
              });
            } else {
              if (isMounted) setOrderData(emptyFallbackData);
            }
          } else {
            if (isMounted) setOrderData(emptyFallbackData);
          }
        } else {
          if (isMounted) setOrderData(emptyFallbackData);
        }
      } catch (err) {
        if (isMounted) setOrderData(emptyFallbackData);
      } finally {
        if (isMounted) setIsLoadingOrder(false);
      }
    }

    if (orderId) {
      fetchOrderDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [orderId]);

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
      setErrorMessage(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !orderId) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('slip', selectedFile);
      formData.append('order_id', orderId);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`http://localhost:5000/api/customer/payment/upload-slip`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await res.text();
        console.error('Server returned non-JSON response:', errorText);
        setErrorMessage(`ไม่สามารถเชื่อมต่อกับระบบชำระเงินได้ (Status: ${res.status})`);
        return;
      }

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.removeItem('pending_order_data');
        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.message || data.error || 'เกิดข้อผิดพลาดในการอัปโหลดสลิป');
      }
    } catch (err: any) {
      console.error('Upload slip error:', err);
      if (err.name === 'AbortError') {
        setErrorMessage('การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง');
      } else {
        setErrorMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavBar 
        cartCount={orderData?.items?.length || 0} 
        onOpenCart={() => router.push('/customer')} 
      />

      <div className="p-6 flex-1 flex justify-center items-start">
        <div className="w-full max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 cursor-pointer"
            >
              ‹ ย้อนกลับ
            </button>
            <h1 className="text-xl font-bold text-gray-800">PrintHub ชำระเงินค่าบริการ</h1>
            <PaymentTimer timeLeft={timeLeft} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <OrderSummary orderData={orderData} isLoading={isLoadingOrder} />
              <PaymentQrCode />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">แนบหลักฐานการโอนเงิน (สลิป)</h2>
                <SlipUploader 
                  previewUrl={previewUrl} 
                  isExpired={isExpired} 
                  onFileChange={handleFileChange} 
                />

                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="mt-6 border-t pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isExpired || !selectedFile || isSubmitting}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isExpired || !selectedFile || isSubmitting
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการชำระเงิน'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentSuccessModal 
        isOpen={showSuccessModal}
        onGoHome={() => router.push('/customer')}
        onGoOrders={() => router.push('/customer/orders')}
      />
    </div>
  );
}