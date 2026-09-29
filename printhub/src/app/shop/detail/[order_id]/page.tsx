"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Download,
  MessageSquare,
  Clock,
  FileText,
  User,
  MapPin,
  ChevronLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Lock,
  Layers,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = (params?.id || params?.order_id) as string;

  const [shopId, setShopId] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.get(
        `http://localhost:5000/shop/orders/${orderId}`
      );

      if (res.data && res.data.order) {
        setOrder(res.data.order);
      } else {
        throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
      }
    } catch (err: any) {
      console.error("Axios Error:", err);
      const message =
        err.response?.data?.error ||
        err.message ||
        "เกิดข้อผิดพลาดในการดึงข้อมูล";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!shopId && typeof window !== "undefined") {
      const storedShopId =
        localStorage.getItem("shop_id") || localStorage.getItem("id");
      if (storedShopId) setShopId(storedShopId);
    }
  }, [shopId]);

  const handleUpdateStatus = async (nextStatus: string) => {
    try {
      setIsUpdating(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const headers = {
        shop_id: String(shopId),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      await axios.patch(
        `http://localhost:5000/shop/orders/${orderId}/status`,
        { status_name: nextStatus },
        { headers }
      );

      await fetchOrder();
    } catch (err: any) {
      const message = err.response?.data?.error || "อัปเดตสถานะไม่สำเร็จ";
      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  // ฟังก์ชันช่วยดาวน์โหลดไฟล์โดยตรง ไม่เปิดหน้าใหม่
  const handleDownloadFile = async (
    fileUrl: string,
    filename: string,
    fileId: string
  ) => {
    try {
      setDownloadingId(fileId);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "download-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback ลิงก์ตรงหาก fetch ติด CORS
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename;
      link.click();
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="animate-spin text-blue-600" size={28} />
          <span className="text-sm font-medium">
            กำลังโหลดข้อมูลคำสั่งพิมพ์...
          </span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={22} />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {error || "ไม่พบคำสั่งพิมพ์"}
          </p>
          <button
            onClick={() => router.back()}
            className="w-full py-2.5 bg-[#12356b] text-white rounded-xl text-sm font-medium hover:bg-[#0e2b57] transition-colors"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  const isConfirmed =
    order.status_state !== "รอการดำเนินงาน" &&
    order.status_state !== "ยกเลิกการพิมพ์";

  const statusStyles: Record<string, string> = {
    รอการดำเนินงาน: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    กำลังพิมพ์: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    พิมพ์เสร็จสิ้น: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    ยกเลิกการพิมพ์: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };

  const allFiles = order.files || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-16">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors -ml-2 px-2 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
            <span className="font-medium text-sm">ย้อนกลับ</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">
              หมายเลขออเดอร์
            </span>
            <span className="text-sm font-semibold text-[#12356b] bg-blue-50 px-2.5 py-1 rounded-lg">
              #{order.order_no}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              รายละเอียดคำสั่งพิมพ์
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusStyles[order.status_state] ||
                "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
              }`}
            >
              {order.status_state}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {order.status_state === "รอการดำเนินงาน" && (
              <>
                <button
                  onClick={() => handleUpdateStatus("ยกเลิกการพิมพ์")}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  ปฏิเสธ
                </button>

                <button
                  onClick={() => handleUpdateStatus("กำลังพิมพ์")}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors shadow-xs shadow-blue-600/20 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  ยืนยันออเดอร์
                </button>
              </>
            )}

            {order.status_state === "กำลังพิมพ์" && (
              <button
                onClick={() => handleUpdateStatus("พิมพ์เสร็จสิ้น")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium transition-colors shadow-xs shadow-emerald-600/20 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={isUpdating ? "animate-spin" : ""}
                />
                อัปเดตสถานะเป็น "พิมพ์เสร็จสิ้น"
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Sub-Orders & Files */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers size={18} className="text-blue-600" />
                  รายการออเดอร์ย่อย ({order.items?.length || 0} รายการ)
                </h2>
                <span className="text-xs text-gray-400">
                  รวมทั้งหมด {allFiles.length} ไฟล์
                </span>
              </div>

              {/* แสดงแต่ละ Sub-Order */}
              <div className="space-y-6">
                {order.items?.map((item: any, index: number) => {
                  // กรองไฟล์เฉพาะของ item นี้ (ถ้าไม่มี item_id จะพิจารณาไฟล์ตามลำดับหรือ item.file_url)
                  const itemFiles = allFiles.filter(
                    (f: any) =>
                      f.item_id === item.id ||
                      (!f.item_id && f.file_url === item.file_url)
                  );

                  return (
                    <div
                      key={item.id || index}
                      className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4.5 space-y-4"
                    >
                      {/* Header ของออเดอร์ย่อย */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                              #รายการที่ {index + 1}
                            </span>
                            <h3 className="font-semibold text-gray-900 text-base">
                              {item.category}
                            </h3>
                          </div>
                          {item.describe && (
                            <p className="text-xs text-gray-500 mt-1 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60">
                              {item.describe}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-400">ราคารวมย่อย</p>
                          <p className="text-base font-bold text-slate-800">
                            ฿{Number(item.subtotal || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* รายละเอียดคุณลักษณะ (Quantity / Unit Price) */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200/60">
                        <div>
                          <span className="text-gray-400 block">จำนวน</span>
                          <span className="font-semibold text-gray-700">
                            {item.quantity} ชุด
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">ราคา/หน่วย</span>
                          <span className="font-semibold text-gray-700">
                            ฿{Number(item.unit_price || 0).toLocaleString()}
                          </span>
                        </div>
                        {item.page_count && (
                          <div>
                            <span className="text-gray-400 block">จำนวนหน้า</span>
                            <span className="font-semibold text-gray-700">
                              {item.page_count} หน้า
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ไฟล์งานของออเดอร์ย่อยนี้ */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <FileText size={14} className="text-blue-600" />
                            ไฟล์สำหรับรายการนี้ ({itemFiles.length} ไฟล์)
                          </span>
                        </div>

                        {!isConfirmed ? (
                          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60 text-center text-xs text-amber-700 flex items-center justify-center gap-1.5">
                            <Lock size={14} />
                            ยืนยันออเดอร์ก่อนดาวน์โหลดไฟล์
                          </div>
                        ) : itemFiles.length === 0 ? (
                          <p className="text-xs text-gray-400 italic bg-white p-2.5 rounded-lg border border-slate-200/60 text-center">
                            ไม่มีไฟล์แนบในรายการนี้
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {itemFiles.map((file: any) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-xs"
                              >
                                <div className="truncate pr-2">
                                  <p className="text-xs font-medium text-gray-800 truncate">
                                    {file.filename || "ไฟล์สิ่งพิมพ์"}
                                  </p>
                                  <p className="text-[11px] text-gray-400">
                                    {file.file_size_mb
                                      ? `${file.file_size_mb} MB`
                                      : ""}{" "}
                                    {file.page_count
                                      ? `• ${file.page_count} หน้า`
                                      : ""}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDownloadFile(
                                      file.file_url,
                                      file.filename,
                                      file.id
                                    )
                                  }
                                  disabled={downloadingId === file.id}
                                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors shrink-0 disabled:opacity-50"
                                >
                                  {downloadingId === file.id ? (
                                    <Loader2 size={13} className="animate-spin" />
                                  ) : (
                                    <Download size={13} />
                                  )}
                                  โหลดไฟล์
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* สรุปยอดเงินรวม */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-2 text-sm">
                {order.subtotal_price > 0 && (
                  <div className="flex justify-between items-center text-gray-500">
                    <span>ราคาสินค้า/บริการรวม</span>
                    <span>฿{Number(order.subtotal_price).toFixed(2)}</span>
                  </div>
                )}
                {order.small_order_fee > 0 && (
                  <div className="flex justify-between items-center text-gray-500">
                    <span>ค่าธรรมเนียมออเดอร์ขนาดเล็ก</span>
                    <span>฿{Number(order.small_order_fee).toFixed(2)}</span>
                  </div>
                )}
                {order.platform_fee > 0 && (
                  <div className="flex justify-between items-center text-gray-500">
                    <span>ค่าบริการแพลตฟอร์ม</span>
                    <span>฿{Number(order.platform_fee).toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    ราคารวมทั้งหมด
                  </span>
                  <span className="text-xl font-bold text-[#12356b]">
                    ฿{Number(order.total_amount || order.subtotal_price || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Customer & Schedule Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={17} className="text-blue-600" />
                ข้อมูลลูกค้า
              </h2>

              <div className="space-y-3.5 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">ชื่อ-นามสกุล</p>
                  <p className="font-medium text-gray-800">
                    {order.customer?.first_name || "-"}{" "}
                    {order.customer?.last_name || ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-0.5">เบอร์ติดต่อ</p>
                  <p className="font-medium text-gray-700">
                    {order.customer?.contact || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                    <MapPin size={11} />
                    ที่อยู่จัดส่ง
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {order.customer?.address
                      ? `${order.customer.address.detail} ต.${order.customer.address.subdistrict || ""} อ.${order.customer.address.district || ""} จ.${order.customer.address.province || ""} ${order.customer.address.postcode || ""}`
                      : "ไม่ได้ระบุที่อยู่"}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  disabled={!isConfirmed}
                  onClick={() =>
                    router.push(
                      `/shop/order/${order.id}/chat?order_id=${order.id}`
                    )
                  }
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isConfirmed
                      ? "bg-[#12356b] text-white hover:bg-[#0e2b57]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <MessageSquare size={15} />
                  {isConfirmed
                    ? "แชทติดต่อลูกค้า"
                    : "แชท (ยืนยันออเดอร์ก่อน)"}
                </button>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Clock size={17} className="text-blue-600" />
                เวลานัดหมาย
              </h2>

              <div className="flex justify-between items-center text-sm py-1.5">
                <span className="text-gray-400 text-xs">วันที่สั่งซื้อ</span>
                <span className="font-medium text-gray-700 text-xs">
                  {order.order_date
                    ? new Date(order.order_date).toLocaleString("th-TH")
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm py-1.5 border-t border-gray-100">
                <span className="text-gray-400 text-xs">เวลานัดรับงาน</span>
                <span className="font-semibold text-blue-700 text-xs">
                  {order.receive_date
                    ? new Date(order.receive_date).toLocaleString("th-TH")
                    : "-"}
                </span>
              </div>
            </div>

            {/* Payment Slip Section (เพิ่มส่วนสลิปโอนเงินตรงนี้) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ImageIcon size={17} className="text-blue-600" />
                หลักฐานการชำระเงิน (สลิป)
              </h2>

              {slipUrl ? (
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center p-2">
                    <img
                      src={slipUrl}
                      alt="สลิปการโอนเงิน"
                      className="max-h-72 w-auto object-contain rounded-lg"
                    />
                  </div>

                  <a
                    href={slipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <Download size={14} />
                    ดูรูปขนาดใหญ่ / ดาวน์โหลด
                  </a>
                </div>
              ) : (
                <div className="py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">
                    ยังไม่มีหลักฐานการชำระเงิน
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}