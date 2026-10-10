"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Download,
  Clock,
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
  FileText,
  AlertTriangle,
} from "lucide-react";
import { SlipModal, ActionConfirmModal, WarnModal } from "@/component/shop/OrderModals";

// 🟢 ปรับ API_BASE ให้มี /api นำหน้าเสมอ
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${rawApiUrl.replace(/\/+$/, "")}/api`;

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // ดึง order_id หรือ id จาก params
  const orderId = (params?.order_id || params?.id) as string;

  const [shopId, setShopId] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showSlipModal, setShowSlipModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Modals สำหรับยืนยันผลตรวจสลิป
  const [showVerifyValidModal, setShowVerifyValidModal] = useState<boolean>(false);
  const [showVerifyInvalidModal, setShowVerifyInvalidModal] = useState<boolean>(false);

  // ดึง shop_id จาก localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedShopId =
        localStorage.getItem("shop_id") || localStorage.getItem("id");
      if (storedShopId) setShopId(storedShopId);
    }
  }, []);

  // 🟢 ดึงข้อมูลออเดอร์โดยชี้ไปที่ /api/shop/orders/:orderId
  const fetchOrder = useCallback(async (silent = false) => {
    if (!orderId) return;

    try {
      if (!silent) {
        setIsLoading(true);
        setError(null);
      }
      
      const res = await axios.get(`${API_BASE}/shop/orders/${orderId}`, {
        headers: shopId ? { shop_id: shopId } : {},
      });

      if (res.data && res.data.order) {
        setOrder(res.data.order);
      } else if (res.data) {
        setOrder(res.data);
      } else {
        throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "เกิดข้อผิดพลาดในการดึงข้อมูล";
      if (silent) setActionError(message);
      else setError(message);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [orderId, shopId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // 🟢 อัปเดตสถานะออเดอร์
  const handleUpdateStatus = async (nextStatus: string) => {
    try {
      setIsUpdating(true);
      setActionError(null);
      await axios.patch(
        `${API_BASE}/shop/orders/${orderId}/status`,
        { status_name: nextStatus },
        { params: { shop_id: shopId } }
      );
      await fetchOrder(true);
    } catch (err: any) {
      setActionError(err.response?.data?.error || "อัปเดตสถานะไม่สำเร็จ");
    } finally {
      setIsUpdating(false);
    }
  };

  // 🟢 ตรวจสลิปการชำระเงิน
  const handleVerifySlip = async (isVerified: boolean) => {
    try {
      setIsUpdating(true);
      setActionError(null);
      await axios.patch(
        `${API_BASE}/shop/orders/${orderId}/verify-payment`,
        { is_verified: isVerified },
        { params: { shop_id: shopId } }
      );
      await fetchOrder(true);
    } catch (err: any) {
      setActionError(err.response?.data?.error || "บันทึกผลตรวจสลิปไม่สำเร็จ");
      await fetchOrder(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadFile = async (fileUrl: string, filename: string, fileId: string) => {
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
          <span className="text-sm font-medium">กำลังโหลดข้อมูลคำสั่งพิมพ์...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs text-center max-w-sm w-full">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={32} />
          <p className="text-sm text-gray-500 mb-6">{error || "ไม่พบคำสั่งพิมพ์"}</p>
          <button onClick={() => router.back()} className="w-full py-2.5 bg-[#12356b] text-white rounded-xl text-sm font-medium">
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  const statusState = order.status_state;
  const isCancelled = statusState === "ยกเลิกการพิมพ์";
  const isCompleted = statusState === "รายการเสร็จสิ้น";
  const isConfirmed = statusState !== "รอการดำเนินงาน" && !isCancelled && statusState !== "รอการชำระเงิน";

  const allFiles = order.files || [];
  const payment = order.payment;
  const slipUrl: string | null = payment?.slip_url || null;
  const slipVerdict: boolean | null = payment?.is_verified ?? null;

  // 🔒 กำหนดให้สามารถกด "กดตรวจสลิป" ได้เฉพาะเมื่อ:
  // 1. สถานะออเดอร์อยู่ใน "รอการดำเนินงาน"
  // 2. ยังไม่เคยตรวจสลิป (slipVerdict === null)
  // 3. มี URL สลิปแนบมา
  const canVerifySlip = statusState === "รอการดำเนินงาน" && slipVerdict === null && !!slipUrl;

  const renderStatusBadge = () => {
    switch (statusState) {
      case "รอการดำเนินงาน":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">{statusState}</span>;
      case "กำลังพิมพ์":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">{statusState}</span>;
      case "พิมพ์เสร็จสิ้น":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">{statusState}</span>;
      case "รายการเสร็จสิ้น":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">{statusState}</span>;
      case "ยกเลิกการพิมพ์":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200">{statusState}</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 ring-1 ring-gray-200">{statusState}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-16">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 -ml-2 px-2 py-1.5 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={18} />
            <span className="font-medium text-sm">ย้อนกลับ</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">หมายเลขออเดอร์</span>
            <span className="text-sm font-semibold text-[#12356b] bg-blue-50 px-2.5 py-1 rounded-lg">#{order.order_no || order.id}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">รายละเอียดคำสั่งพิมพ์</h1>
            {renderStatusBadge()}
          </div>

          <div className="flex items-center gap-2.5">
            {statusState === "รอการดำเนินงาน" && (
              <>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-red-600 hover:bg-red-50 text-sm font-medium disabled:opacity-50"
                >
                  <XCircle size={16} /> ปฏิเสธ
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium shadow-xs disabled:opacity-50"
                >
                  <CheckCircle size={16} /> ยืนยันออเดอร์
                </button>
              </>
            )}

            {statusState === "กำลังพิมพ์" && (
              <button
                onClick={() => handleUpdateStatus("พิมพ์เสร็จสิ้น")}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw size={16} className={isUpdating ? "animate-spin" : ""} /> พิมพ์เสร็จสิ้น
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)}><X size={16} /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (ฝั่งซ้าย) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 1. รายการออเดอร์ย่อย */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                <Layers size={18} className="text-blue-600" /> รายการออเดอร์ย่อย ({order.items?.length || 0} รายการ)
              </h2>

              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => {
                  const itemFiles = allFiles.filter(
                    (f: any) => f.item_id === item.id || (!f.item_id && f.file_url === item.file_url)
                  );

                  return (
                    <div key={item.id || index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                            #รายการที่ {index + 1}
                          </span>
                          <h3 className="font-semibold text-gray-900 text-base mt-1">{item.category}</h3>
                        </div>
                        <p className="font-bold text-slate-800">฿{item.subtotal?.toLocaleString() ?? 0}</p>
                      </div>

                      {item.describe && (
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-gray-700 space-y-1.5">
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            <FileText size={14} className="text-blue-600" /> รายละเอียดการพิมพ์:
                          </p>
                          <p className="whitespace-pre-line text-gray-600 pl-1">{item.describe}</p>
                          
                          <div className="flex flex-wrap gap-4 pt-2 text-gray-500 text-[11px] border-t border-gray-100 mt-2">
                            {item.quantity && <span>จำนวน: <strong className="text-gray-800">{item.quantity}</strong> ชิ้น/ชุด</span>}
                            {item.page_count && <span>จำนวนหน้า: <strong className="text-gray-800">{item.page_count}</strong> หน้า</span>}
                            {item.unit_price && <span>ราคาต่อหน่วย: <strong className="text-gray-800">฿{item.unit_price}</strong></span>}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200">
                        {!isConfirmed ? (
                          <div className="p-2.5 bg-amber-50 rounded-lg text-center text-xs text-amber-700 flex items-center justify-center gap-1.5">
                            <Lock size={14} /> ยืนยันออเดอร์ก่อนดาวน์โหลดไฟล์
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {itemFiles.map((file: any) => (
                              <div key={file.id} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-200 text-xs">
                                <span className="truncate pr-2">{file.filename || "ไฟล์สิ่งพิมพ์"}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(file.file_url, file.filename, file.id)}
                                  disabled={downloadingId === file.id}
                                  className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 hover:bg-blue-100"
                                >
                                  <Download size={13} /> โหลดไฟล์
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
            </div>

            {/* 2. หลักฐานการชำระเงิน / ตรวจสอบสลิป */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="bg-[#12356b] p-5 text-white flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-100 flex items-center gap-1.5"><Receipt size={14} /> หลักฐานการชำระเงิน</p>
                  <p className="text-2xl font-bold mt-1">฿{Number(payment?.amount ?? order.total_amount ?? 0).toLocaleString()}</p>
                </div>
                {/* ปุ่มดูสลิปเปิดให้กดดูได้เสมอตามคำขอ */}
                <button
                  type="button"
                  onClick={() => setShowSlipModal(true)}
                  disabled={!slipUrl}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  <Eye size={15} className="inline mr-1.5" /> {slipUrl ? "ดูสลิปโอนเงิน" : "ยังไม่มีสลิป"}
                </button>
              </div>

              <div className="p-5 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-3">ผลการตรวจสอบสลิปโอนเงิน</p>
                
                {/* 🔴 หากออเดอร์ยกเลิกการพิมพ์แล้ว ล็อกทันที */}
                {isCancelled ? (
                  <div className="w-full py-2.5 rounded-xl text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 text-center flex items-center justify-center gap-1.5">
                    <Lock size={15} /> ออเดอร์นี้ถูกยกเลิกแล้ว ไม่สามารถตรวจสอบสลิปได้
                  </div>
                ) : slipVerdict === true ? (
                  /* สถานะ 1: สลิปถูกต้องแล้ว */
                  <div className="w-full py-2.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck size={16} /> สลิปถูกต้อง (ยืนยันรับออเดอร์แล้ว)
                  </div>
                ) : slipVerdict === false ? (
                  /* สถานะ 2: สลิปถูกปฏิเสธแล้ว (is_verified === false) */
                  <div className="w-full py-2.5 rounded-xl text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 text-center flex items-center justify-center gap-1.5">
                    <AlertTriangle size={16} /> ปฏิเสธหลักฐานแล้ว (รอผู้ใช้อัปโหลดสลิปใหม่)
                  </div>
                ) : (
                  /* สถานะ 3: สลิปยังไม่ได้ตรวจ (is_verified === null) */
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowVerifyInvalidModal(true)}
                      disabled={!canVerifySlip || isUpdating}
                      className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      หลักฐานไม่ถูกต้อง
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVerifyValidModal(true)}
                      disabled={!canVerifySlip || isUpdating}
                      className="flex-1 py-2.5 rounded-xl bg-[#12356b] text-white text-xs font-semibold hover:bg-[#0e2b57] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
                    >
                      สลิปถูกต้อง
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={17} className="text-blue-600" /> ข้อมูลลูกค้า
              </h2>
              <p className="text-sm font-medium text-gray-800">{order.customer?.first_name} {order.customer?.last_name}</p>
              <p className="text-xs text-gray-500 mt-1">{order.customer?.contact || "-"}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Clock size={17} className="text-blue-600" /> เวลานัดหมาย
              </h2>
              <div className="space-y-3 text-sm">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-xs text-gray-400">วันที่สั่งซื้อ</p>
                  <p className="font-medium text-gray-800 mt-0.5">{order.order_date ? new Date(order.order_date).toLocaleString("th-TH") : "-"}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-xs text-gray-400">เวลานัดรับงาน</p>
                  <p className="font-semibold text-blue-700 mt-0.5">{order.receive_date ? new Date(order.receive_date).toLocaleString("th-TH") : "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SlipModal isOpen={showSlipModal} onClose={() => setShowSlipModal(false)} slipUrl={slipUrl} />

      <ActionConfirmModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={async () => { await handleUpdateStatus("ยกเลิกการพิมพ์"); setShowRejectModal(false); }}
        title="ปฏิเสธออเดอร์"
        description="คุณต้องการปฏิเสธรายการคำสั่งพิมพ์นี้ใช่หรือไม่?"
        confirmText="ปฏิเสธ"
        isDanger
        isUpdating={isUpdating}
      />

      <ActionConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={async () => { await handleUpdateStatus("กำลังพิมพ์"); setShowConfirmModal(false); }}
        title="ยืนยันการรับงาน"
        description="ยืนยันรับรายงานคำสั่งพิมพ์นี้ใช่หรือไม่?"
        confirmText="ยืนยัน"
        isUpdating={isUpdating}
      />

      <ActionConfirmModal
        isOpen={showVerifyValidModal}
        onClose={() => setShowVerifyValidModal(false)}
        onConfirm={async () => {
          await handleVerifySlip(true);
          setShowVerifyValidModal(false);
        }}
        title="ยืนยันสลิปถูกต้อง"
        description="หากยืนยันสลิปถูกต้อง ระบบจะทำการยืนยันรายการคำสั่งพิมพ์นี้ทันทีคุณยืนยันใช่หรือไม่"
        confirmText="ยืนยันสลิปถูกต้อง"
        isUpdating={isUpdating}
      />

      <ActionConfirmModal
        isOpen={showVerifyInvalidModal}
        onClose={() => setShowVerifyInvalidModal(false)}
        onConfirm={async () => {
          await handleVerifySlip(false);
          setShowVerifyInvalidModal(false);
        }}
        title="ยืนยันปฏิเสธสลิป"
        description="คุณยืนยันว่าหลักฐานไม่ถูกต้องใช่หรือไม่? หากยืนยันแล้วคุณจะไม่สามารถเปลี่ยนแปลงผลได้จนกว่าลูกค้าจะส่งสลิปมาใหม่"
        confirmText="ยืนยันปฏิเสธ"
        isDanger
        isUpdating={isUpdating}
      />
    </div>
  );
}