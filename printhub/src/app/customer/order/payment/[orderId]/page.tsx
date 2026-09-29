'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import NavBar from '../../../../../component/customer/NavBar';
import { PaymentTimer } from '../../../../../component/customer/payment/payment_timer';
import { PaymentQrCode } from '../../../../../component/customer/payment/payment_qr_code';
import { SlipUploader } from '../../../../../component/customer/payment/slip_uploader';
import { PaymentSuccessModal } from '../../../../../component/customer/payment/payment_success_modal';
import { OrderSummary, OrderDetails } from '../../../../../component/customer/payment/order_summary';

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawOrderId = params?.orderid || params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : (rawOrderId as string);
  const paramTotalPrice = searchParams.get('totalPrice') ? Number(searchParams.get('totalPrice')) : 0;

  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(true);

  // 🟢 1. ระบบเวลานับถอยหลังต่อ (Sync กับ timestamp ใน sessionStorage)
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (typeof window === 'undefined' || !orderId) return 600;
    const key = `payment_expiry_${orderId}`;
    const savedExpiry = sessionStorage.getItem(key);

    if (savedExpiry) {
      const remaining = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    } else {
      const newExpiry = Date.now() + 600 * 1000; // 10 นาที
      sessionStorage.setItem(key, newExpiry.toString());
      return 600;
    }
  });

  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🔴 2. ฟังก์ชันยกเลิกออเดอร์อัตโนมัติเมื่อหมดเวลา 10 นาที (เปลี่ยนเป็น "ยกเลิกการพิมพ์")
  const handleTimeoutCancelOrder = async () => {
    if (!orderId) return;
    try {
      // รหัสสถานะ "ยกเลิกการพิมพ์" จากตาราง status: 9aee439b-3d24-4b4e-8d68-d9b63081b80c
      await fetch(`http://localhost:5000/api/customer/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_id: '9aee439b-3d24-4b4e-8d68-d9b63081b80c',
          reason: 'หมดเวลาชำระเงิน (เกิน 10 นาที)',
        }),
      });
      // ล้างเวลาหมดอายุออก
      sessionStorage.removeItem(`payment_expiry_${orderId}`);
      sessionStorage.removeItem('pending_order_data');
    } catch (err) {
      console.error('Error auto-cancelling order:', err);
    }
  };

  // 🟢 3. Timer Effect ตรวจสอบการนับถอยหลัง
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      handleTimeoutCancelOrder();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          handleTimeoutCancelOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, orderId]);

  // 🟢 4. โหลดข้อมูลรายละเอียดคำสั่งซื้อ
  useEffect(() => {
    let isMounted = true;

    async function fetchOrderDetails() {
      setIsLoadingOrder(true);

      // 4.1 ตรวจสอบข้อมูลจาก sessionStorage ที่ตรงกับ orderId ปัจจุบัน
      try {
        const savedSessionData = sessionStorage.getItem('pending_order_data');
        if (savedSessionData) {
          const parsedData = JSON.parse(savedSessionData);
          if (parsedData && (parsedData.id === orderId || !orderId) && parsedData.items?.length > 0) {
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
            pricePerPage: paramTotalPrice,
            quantity: 1,
            totalPrice: paramTotalPrice,
          },
        ],
        services: [],
        smallOrderFeeThreshold: 50,
      };

      // 4.2 ดึงข้อมูลคำสั่งซื้อจาก API
      try {
        const customerId = localStorage.getItem('customer_id') || localStorage.getItem('id') || '';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`http://localhost:5000/api/customer/orders?customer_id=${customerId}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const result = await res.json();
          const orderList = Array.isArray(result.data) ? result.data : [];
          const apiOrder = orderList.find((o: any) => String(o.id) === String(orderId));

          if (apiOrder) {
            // ถ้าออเดอร์นี้ถูกยกเลิกไปแล้วจากหลังบ้าน ให้ตัดสเตทเป็นหมดเวลาทันที
            const statusState = apiOrder.status?.state || apiOrder.current_status?.state || '';
            if (statusState === 'ยกเลิกการพิมพ์' || statusState === 'ยกเลิก') {
              setIsExpired(true);
            }

            const formattedItems = (apiOrder.print_order_item || []).map((item: any) => {
              const qty = Number(item.quantity) || 1;
              const subtotal = Number(item.subtotal || item.unit_price * qty || 0);

              return {
                fileName: item.category || 'งานพิมพ์เอกสาร',
                paperSize: item.describe || 'A4',
                colorType: 'มาตรฐาน',
                printSide: 'ไม่มี',
                pagesPerSet: item.page_count || 1,
                pricePerPage: Number(item.unit_price) || 0,
                quantity: qty,
                totalPrice: subtotal,
              };
            });

            if (isMounted) {
              setOrderData({
                id: apiOrder.id || orderId,
                items: formattedItems.length > 0 ? formattedItems : emptyFallbackData.items,
                services: [],
                smallOrderFeeThreshold: 50,
              });
              setIsLoadingOrder(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Cannot fetch order list from backend:', err);
      }

      if (isMounted) {
        setOrderData(emptyFallbackData);
        setIsLoadingOrder(false);
      }
    }

    if (orderId) {
      fetchOrderDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [orderId, paramTotalPrice]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  // 🟢 5. ยืนยันการชำระเงินและส่งสลิป
  const handleSubmit = async () => {
    if (!selectedFile || !orderId || isExpired) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const customerId = localStorage.getItem('customer_id') || localStorage.getItem('id') || '';
      const formData = new FormData();
      formData.append('slip', selectedFile);
      formData.append('order_id', orderId);
      formData.append('orderId', orderId);
      formData.append('customer_id', customerId);

      const res = await fetch(`http://localhost:5000/api/customer/payment/upload-slip`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // เคลียร์ข้อมูลเวลาและแคชของออเดอร์นี้
        sessionStorage.removeItem('pending_order_data');
        sessionStorage.removeItem(`payment_expiry_${orderId}`);

        // ล้างตะกร้าในฐานข้อมูลหลังจากชำระเงินสำเร็จ
        if (customerId) {
          fetch('http://localhost:5000/api/customer/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id: customerId }),
          }).catch(console.error);
        }

        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.message || data.error || 'เกิดข้อผิดพลาดในการอัปโหลดสลิป');
      }
    } catch (err: any) {
      console.error('Upload slip error:', err);
      setErrorMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
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
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-6">
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 cursor-pointer"
            >
              ‹ ย้อนกลับ
            </button>
            <h1 className="text-xl font-bold text-gray-800">PrintHub ชำระเงินค่าบริการ</h1>
            <PaymentTimer timeLeft={timeLeft} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ฝั่งซ้าย: สรุปรายการ & QR Code */}
            <div className="space-y-4">
              <OrderSummary orderData={orderData} isLoading={isLoadingOrder} />
              <PaymentQrCode />
            </div>

            {/* ฝั่งขวา: แนบสลิป & สถานะการชำระเงิน */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">แนบหลักฐานการโอนเงิน (สลิป)</h2>

                {isExpired ? (
                  <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
                    <p className="font-bold text-rose-700 text-base">หมดเวลาในการชำระเงิน</p>
                    <p className="text-xs text-rose-600 leading-relaxed">
                      คำสั่งซื้อนี้ถูกเปลี่ยนสถานะเป็น <b>"ยกเลิกการพิมพ์"</b> โดยอัตโนมัติเนื่องจากเกินระยะเวลา 10 นาทีที่กำหนด
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/customer')}
                      className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
                    >
                      กลับสู่หน้าหลัก
                    </button>
                  </div>
                ) : (
                  <SlipUploader 
                    previewUrl={previewUrl} 
                    isExpired={isExpired} 
                    onFileChange={handleFileChange} 
                  />
                )}

                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="mt-6 border-t pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isExpired || !selectedFile || isSubmitting}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isExpired || !selectedFile || isSubmitting
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {isSubmitting ? 'กำลังส่งข้อมูล...' : isExpired ? 'หมดเวลาการชำระเงิน' : 'ยืนยันการชำระเงิน'}
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