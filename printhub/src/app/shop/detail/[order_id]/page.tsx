"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  CheckCircle, XCircle, Download, MessageSquare, 
  Clock, FileText, User, MapPin, ChevronLeft, 
  RefreshCw, Loader2, AlertCircle 
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const orderId = (params?.id || params?.order_id) as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      
      if (res.data && res.data.order) {
        setOrder(res.data.order);
      } else {
        throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
      }
    } catch (err: any) {
      console.error("Axios Error:", err);
      const message = err.response?.data?.error || err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (nextStatus: string) => {
    try {
      setIsUpdating(true);
      
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
        status_state: nextStatus
      });

      await fetchOrder();
    } catch (err: any) {
      const message = err.response?.data?.error || "อัปเดตสถานะไม่สำเร็จ";
      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <span className="text-sm font-medium">กำลังโหลดข้อมูลคำสั่งพิมพ์...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-sm w-full">
          <AlertCircle className="mx-auto text-rose-500 mb-3" size={40} />
          <h2 className="text-lg font-bold text-slate-800 mb-1">เกิดข้อผิดพลาด</h2>
          <p className="text-xs text-slate-500 mb-6">{error || "ไม่พบคำสั่งพิมพ์"}</p>
          <button 
            onClick={() => router.back()} 
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  // ปรับเงื่อนไขให้ตรงกับ "รอการดำเนินงาน"
  const isConfirmed = order.status_state !== "รอการดำเนินงาน" && order.status_state !== "ยกเลิกการพิมพ์";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ChevronLeft size={20} />
            <span className="font-medium text-sm">ย้อนกลับ</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">หมายเลขออเดอร์:</span>
            <span className="text-base font-bold text-blue-950">#{order.order_no}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* Header Action & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">รายละเอียดคำสั่งพิมพ์</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.status_state === "รอการดำเนินงาน" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                order.status_state === "กำลังพิมพ์" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                order.status_state === "พิมพ์เสร็จสิ้น" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                "bg-rose-100 text-rose-700 border border-rose-200"
              }`}>
                {order.status_state}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {order.status_state === "รอการดำเนินงาน" && (
              <>
                <button 
                  onClick={() => handleUpdateStatus("ยกเลิกการพิมพ์")}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-sm font-medium"
                >
                  <XCircle size={18} /> ปฏิเสธ
                </button>
                <button 
                  onClick={() => handleUpdateStatus("กำลังพิมพ์")}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                >
                  <CheckCircle size={18} /> ยืนยันออเดอร์
                </button>
              </>
            )}

            {order.status_state === "กำลังพิมพ์" && (
              <button 
                onClick={() => handleUpdateStatus("พิมพ์เสร็จสิ้น")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium"
              >
                <RefreshCw size={18} className={isUpdating ? "animate-spin" : ""} /> อัปเดตสถานะเป็น "พิมพ์เสร็จสิ้น"
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Download Files */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                ไฟล์สำหรับพิมพ์ ({order.files?.length || 0} ไฟล์)
              </h2>

              {!isConfirmed ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed text-center text-sm text-slate-500">
                  🔒 กรุณา<span className="font-semibold text-blue-600">ยืนยันออเดอร์</span>ก่อน จึงจะดาวน์โหลดไฟล์ได้
                </div>
              ) : (
                <div className="space-y-3">
                  {order.files?.map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-sm font-medium text-slate-700 truncate">{file.filename}</span>
                      <a href={file.file_url} download target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                        <Download size={14} /> โหลดไฟล์
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4">รายการบริการที่สั่งพิมพ์</h2>
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 border-b">
                  <tr>
                    <th className="py-2.5 px-4">รายละเอียด</th>
                    <th className="py-2.5 px-4 text-center">จำนวน</th>
                    <th className="py-2.5 px-4 text-right">ราคา/หน่วย</th>
                    <th className="py-2.5 px-4 text-right">ราคารวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{item.group_name}</p>
                        <p className="text-xs text-slate-400">{item.detail}</p>
                      </td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">฿{Number(item.unit_price).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold">฿{Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-slate-500 font-medium">ราคารวมทั้งหมด</span>
                <span className="text-xl font-bold text-blue-900">฿{Number(order.total_price).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Time Side Bar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" /> ข้อมูลลูกค้า
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">ชื่อ-นามสกุล</p>
                  <p className="font-semibold text-slate-800">{order.customer?.first_name} {order.customer?.last_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">เบอร์ติดต่อ</p>
                  <p className="font-medium text-slate-700">{order.customer?.contact || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} /> ที่อยู่จัดส่ง</p>
                  <p className="text-slate-600 mt-1 text-xs leading-relaxed">
                    {order.customer?.address ? `${order.customer.address.detail} ต.${order.customer.address.subdistrict || ''} อ.${order.customer.address.district || ''} จ.${order.customer.address.province || ''} ${order.customer.address.postcode || ''}` : "ไม่ได้ระบุที่อยู่"}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <button 
                  disabled={!isConfirmed}
                  onClick={() => router.push(`/chat?customer_id=${order.customer?.id}`)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm ${
                    isConfirmed ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <MessageSquare size={16} />
                  {isConfirmed ? "แชทติดต่อลูกค้า" : "แชท (ยืนยันออเดอร์ก่อน)"}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" /> เวลานัดหมาย
              </h2>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-400">วันที่สั่งซื้อ:</span>
                <span className="font-medium text-slate-700">{order.order_date ? new Date(order.order_date).toLocaleString("th-TH") : "-"}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-400">เวลานัดรับงาน:</span>
                <span className="font-semibold text-blue-700">{order.receive_date ? new Date(order.receive_date).toLocaleString("th-TH") : "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}