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
  ChevronLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  Lock,
  Layers,
  Receipt,
  Eye,
  ShieldCheck,
  X,
  AlertTriangle,
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
  const [actionError, setActionError] = useState<string | null>(null);

  // ตรวจสอบสลิปโอนเงิน
  const [slipViewed, setSlipViewed] = useState<boolean>(false); // เปิดดูสลิปแล้วหรือยัง
  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [showWarnModal, setShowWarnModal] = useState<boolean>(false);

  const fetchOrder = async (silent = false) => {
    if (!orderId) return;

    try {
      // refresh หลังกดปุ่ม: ไม่ต้องสลับทั้งหน้าเป็น loading
      if (!silent) {
        setIsLoading(true);
        setError(null);
      }

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
      if (silent) setActionError(message);
      else setError(message);
    } finally {
      if (!silent) setIsLoading(false);
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
      setActionError(null);

      await axios.patch(
        `http://localhost:5000/shop/orders/${orderId}/status`,
        { status_name: nextStatus },
        { headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await fetchOrder(true);
    } catch (err: any) {
      setActionError(err.response?.data?.error || "อัปเดตสถานะไม่สำเร็จ");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewSlip = () => {
    setShowSlipModal(true);
    setSlipViewed(true);
  };

  // ผลตรวจสลิป: true = ถูกต้อง, false = ไม่ถูกต้อง (บันทึกที่ payment.is_verified)
  const handleVerifySlip = async (isVerified: boolean) => {
    if (!slipViewed) return;

    try {
      setIsUpdating(true);
      setActionError(null);
      await axios.patch(
        `http://localhost:5000/shop/orders/${orderId}/verify-payment`,
        { is_verified: isVerified }
      );
      await fetchOrder(true);
    } catch (err: any) {
      setActionError(err.response?.data?.error || "บันทึกผลตรวจสลิปไม่สำเร็จ");
      await fetchOrder(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmReject = async () => {
    await handleUpdateStatus("ยกเลิกการพิมพ์");
    setShowRejectModal(false);
  };

  const handleConfirmAccept = async () => {
    await handleUpdateStatus("กำลังพิมพ์");
    setShowConfirmModal(false);
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

  // ✅ รวม Logic ตัวแปรสลิปและการชำระเงินไว้จุดเดียว
  const payment = order.payment;
  const slipUrl: string | null =
    payment?.slip_url ||
    order.slip_url ||
    order.payment_slip ||
    order.slipUrl ||
    order.slip_image ||
    order.slip ||
    null;

  const allFiles = order.files || [];

  const isConfirmed =
    order.status_state !== "รอการดำเนินงาน" &&
    order.status_state !== "ยกเลิกการพิมพ์";

  const isPending = order.status_state === "รอการดำเนินงาน";
  const slipVerdict: boolean | null = payment?.is_verified ?? null;

  const statusStyles: Record<string, string> = {
    รอการดำเนินงาน: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    กำลังพิมพ์: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    พิมพ์เสร็จสิ้น: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    ยกเลิกการพิมพ์: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };

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
                  onClick={() => setShowRejectModal(true)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  ปฏิเสธ
                </button>

                <button
                  onClick={() =>
                    slipVerdict === true
                      ? setShowConfirmModal(true)
                      : setShowWarnModal(true)
                  }
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
                อัปเดตสถานะเป็น &quot;พิมพ์เสร็จสิ้น&quot;
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="flex-1">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Sub-Orders & Files */}
          <div className="lg:col-span-2 flex flex-col gap-6">
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

            {/* Schedule Info */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex-1">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                <Clock size={18} className="text-blue-600" />
                เวลานัดหมาย
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">วันที่สั่งซื้อ</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.order_date
                      ? new Date(order.order_date).toLocaleString("th-TH")
                      : "-"}
                  </p>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">เวลานัดรับงาน</p>
                  <p className="text-sm font-semibold text-blue-700">
                    {order.receive_date
                      ? new Date(order.receive_date).toLocaleString("th-TH")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Customer & Payment */}
          <div className="flex flex-col gap-6">
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
                  <p className="text-xs text-gray-400 mb-0.5">ติดต่อ</p>
                  <p className="font-medium text-gray-700">
                    {order.customer?.contact || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  disabled={!isConfirmed}
                  onClick={() => {
                    router.push(`/shop/order/${shopId}/chat?order_id=${order.id}`);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isConfirmed
                      ? "bg-[#12356b] text-white hover:bg-[#0e2b57]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <MessageSquare size={15} />
                  {isConfirmed ? "แชทติดต่อลูกค้า" : "แชท (ยืนยันออเดอร์ก่อน)"}
                </button>
              </div>
            </div>

            {/* Payment Slip */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col flex-1">
              {/* Header: ยอดเงิน */}
              <div className="bg-[#12356b] px-5 sm:px-6 py-4 text-white">
                <p className="text-xs text-blue-100/80 flex items-center gap-1.5">
                  <Receipt size={14} />
                  หลักฐานการชำระเงิน
                </p>
                <p className="text-2xl font-bold mt-1">
                  ฿{Number(payment?.amount ?? order.total_amount ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-blue-100/70 mt-1">
                  {payment?.payment_date
                    ? new Date(payment.payment_date).toLocaleString("th-TH")
                    : "ยังไม่มีเวลาที่ชำระ"}
                </p>
              </div>

              <div className="p-5 sm:p-6 flex-1">
                {isPending || slipVerdict !== null ? (
                  <ol>
                    {/* Step 1: ดูสลิป */}
                    <li className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                            slipViewed || slipVerdict !== null
                              ? "bg-emerald-500 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {slipViewed || slipVerdict !== null ? (
                            <CheckCircle size={15} />
                          ) : (
                            "1"
                          )}
                        </span>
                        <span
                          className={`w-px flex-1 my-1 ${
                            slipViewed || slipVerdict !== null
                              ? "bg-emerald-300"
                              : "bg-gray-200"
                          }`}
                        />
                      </div>
                      <div className="flex-1 pb-5">
                        <p className="text-sm font-medium text-gray-900">
                          ตรวจสอบสลิปโอนเงิน
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 mb-2.5">
                          เปิดดูสลิปและเทียบยอดกับออเดอร์
                        </p>
                        <button
                          type="button"
                          onClick={handleViewSlip}
                          disabled={!slipUrl}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors text-blue-600 bg-blue-50/80 border border-blue-200 hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                        >
                          <Eye size={15} />
                          {slipUrl ? "ดูสลิปโอนเงิน" : "ยังไม่มีสลิปโอนเงิน"}
                        </button>
                      </div>
                    </li>

                    {/* Step 2: ผลการตรวจสลิป */}
                    <li className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                            slipVerdict === true
                              ? "bg-emerald-500 text-white"
                              : slipVerdict === false
                              ? "bg-red-500 text-white"
                              : slipViewed
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {slipVerdict === true ? (
                            <CheckCircle size={15} />
                          ) : slipVerdict === false ? (
                            <X size={15} />
                          ) : (
                            "2"
                          )}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            slipViewed || slipVerdict !== null
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          ผลการตรวจสอบสลิป
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 mb-2.5">
                          {slipVerdict === true
                            ? "ตรวจสอบแล้ว ไม่สามารถแก้ไขผลได้"
                            : slipVerdict === false
                            ? "ตรวจสอบแล้ว ไม่สามารถแก้ไขผลได้ จนกว่าลูกค้าจะส่งสลิปใหม่"
                            : slipViewed
                            ? "สลิปถูกต้องหรือไม่? เลือกผลการตรวจสอบ (เลือกแล้วแก้ไม่ได้)"
                            : "ต้องเปิดดูสลิปก่อนจึงจะเลือกผลการตรวจสอบได้"}
                        </p>

                        {slipVerdict === true ? (
                          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                            <ShieldCheck size={15} />
                            สลิปถูกต้อง
                            <Lock size={12} className="opacity-60" />
                          </div>
                        ) : slipVerdict === false ? (
                          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-700 ring-1 ring-red-200">
                            <XCircle size={15} />
                            สลิปไม่ถูกต้อง
                            <Lock size={12} className="opacity-60" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleVerifySlip(false)}
                              disabled={!slipViewed || !slipUrl || isUpdating}
                              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 text-sm font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:hover:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <XCircle size={15} />
                              ไม่ถูกต้อง
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerifySlip(true)}
                              disabled={!slipViewed || !slipUrl || isUpdating}
                              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium text-sm transition-colors bg-[#12356b] text-white hover:bg-[#0e2b57] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              <ShieldCheck size={15} />
                              ถูกต้อง
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  </ol>
                ) : (
                  <button
                    type="button"
                    onClick={handleViewSlip}
                    disabled={!slipUrl}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors text-blue-600 bg-blue-50/80 border border-blue-200 hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                  >
                    <Eye size={15} />
                    {slipUrl ? "ดูสลิปโอนเงิน" : "ยังไม่มีสลิปโอนเงิน"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: ดูสลิปโอนเงิน */}
      {showSlipModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowSlipModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Receipt size={18} className="text-blue-600" />
                สลิปโอนเงิน
              </h3>
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {slipUrl ? (
                <img
                  src={slipUrl}
                  alt="สลิปโอนเงิน"
                  className="w-full h-auto rounded-xl border border-slate-200/80"
                />
              ) : (
                <p className="text-center text-sm text-gray-400 py-8">
                  ไม่พบรูปภาพสลิป
                </p>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-2">
              {slipUrl && (
                <a
                  href={slipUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                >
                  <Download size={15} />
                  เปิดรูปเต็ม/โหลด
                </a>
              )}
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: ยืนยันการปฏิเสธออเดอร์ */}
      {showRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !isUpdating && setShowRejectModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <XCircle className="text-red-600" size={22} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              ยืนยันการปฏิเสธรายการ
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              คุณต้องการปฏิเสธรายการนี้จริงหรือไม่?
              <br />
              หากยืนยันการยกเลิก
              จะไม่สามารถย้อนกลับได้
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                disabled={isUpdating}
                className="py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                ปฏิเสธออเดอร์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: เตือนให้ตรวจสลิปก่อนยืนยันออเดอร์ */}
      {showWarnModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowWarnModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-amber-600" size={22} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              ยังไม่สามารถยืนยันออเดอร์ได้
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {slipVerdict === false
                ? "สลิปถูกทำเครื่องหมายว่าไม่ถูกต้อง จึงยืนยันออเดอร์ไม่ได้ ต้องรอลูกค้าส่งสลิปใหม่ หรือปฏิเสธออเดอร์"
                : "คุณยังไม่ได้ตรวจสอบสลิปโอนเงิน กรุณาเปิดดูสลิปและเลือกผลการตรวจสอบก่อน"}
            </p>

            {slipVerdict === false ? (
              <button
                type="button"
                onClick={() => setShowWarnModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#12356b] text-white hover:bg-[#0e2b57] text-sm font-medium transition-colors"
              >
                รับทราบ
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowWarnModal(false)}
                  className="py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWarnModal(false);
                    handleViewSlip();
                  }}
                  disabled={!slipUrl}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#12356b] text-white hover:bg-[#0e2b57] text-sm font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Eye size={15} />
                  ไปดูสลิป
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: ยืนยันการรับงาน */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !isUpdating && setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-blue-600" size={22} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              ยืนยันการรับงาน
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              คุณได้ตรวจสอบหลักฐานการชำระเงินว่าถูกต้องแล้ว
              ยืนยันหรือไม่?
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isUpdating}
                className="py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors shadow-xs shadow-blue-600/20 disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}