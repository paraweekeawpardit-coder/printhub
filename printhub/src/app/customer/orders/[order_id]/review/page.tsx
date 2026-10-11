"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface OrderItem {
  id?: string | number;
  category?: string;
  describe?: string;
  quantity: number;
  unit_price?: number;
  subtotal: number;
}

interface OrderData {
  id: string;
  order_date?: string;
  customer_id?: string;
  shop_id?: string;
  description?: string;
  total_price?: number | string;
  has_reviewed?: boolean; // 👈 สถานะเช็กว่าเคยรีวิวแล้วหรือยัง
  has_reported?: boolean;
  print_shop?: {
    shop_name?: string;
    profile_image?: string;
  };
  print_order_item?: OrderItem[];
  order_item?: OrderItem[];
}

interface PreviewFileProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

function PreviewFile({ file, index, onRemove }: PreviewFileProps) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden group shadow-xs">
      {previewUrl ? (
        file.type === "application/pdf" ? (
          <div className="w-full h-full relative bg-white">
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title={file.name}
              className="w-full h-full border-0"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-1.5 pointer-events-none">
              <p className="text-[11px] text-white truncate font-medium">
                📄 {file.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-contain bg-slate-900/5"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-1.5 pointer-events-none">
              <p className="text-[11px] text-white truncate font-medium">
                {file.name}
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
          <div className="text-3xl mb-1">📄</div>
          <span className="text-xs font-medium text-slate-700 truncate max-w-xs">
            {file.name}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`ลบไฟล์ ${file.name}`}
        className="absolute top-2 right-2 z-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md transition-all active:scale-95"
      >
        ✕
      </button>
    </div>
  );
}

export default function OrderReviewPage() {
  const params = useParams();
  const router = useRouter();

  const rawOrderId = params?.order_id || params?.orderId;
  const activeOrderId = Array.isArray(rawOrderId)
    ? rawOrderId[0]
    : (rawOrderId as string);

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string>("");

  // Review State
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchOrderDetail = async (id: string) => {
    setLoading(true);
    setDbError("");

    try {
      const url = `http://localhost:5000/api/customer/order/${id}/review`;
      const res = await fetch(url);
      const text = await res.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(`Backend ส่ง Response ที่ไม่ใช่ JSON กลับมา: ${text}`);
      }

      if (res.ok && result.success) {
        setOrderData(result.data);
      } else {
        setDbError(result.message || `ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้ (HTTP ${res.status})`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setDbError(err.message);
      } else {
        setDbError("เกิดข้อผิดพลาดในการเชื่อมต่อ Backend");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeOrderId && activeOrderId !== "undefined") {
      fetchOrderDetail(activeOrderId);
    } else {
      setLoading(false);
      setDbError("ไม่พบรหัสคำสั่งซื้อ (Order ID ไม่ถูกต้อง)");
    }
  }, [activeOrderId]);

  const handleCopyUuid = () => {
    if (!orderData?.id) return;
    navigator.clipboard.writeText(orderData.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛑 บล็อกฝั่ง Frontend อีกชั้นหากเคยรีวิวไปแล้ว
    if (orderData?.has_reviewed) {
      alert("คำสั่งซื้อนี้ได้รับการรีวิวไปแล้ว ไม่สามารถส่งซ้ำได้ครับ");
      return;
    }

    if (rating === 0) {
      alert("กรุณาให้คะแนนดาวก่อนยืนยันครับ");
      return;
    }

    if (!activeOrderId || !orderData?.customer_id || !orderData?.shop_id) {
      alert("ข้อมูลคำสั่งซื้อไม่ครบถ้วน กรุณาลองใหม่อีกครั้ง");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("order_id", activeOrderId);
      formData.append("shop_id", orderData.shop_id);
      formData.append("customer_id", orderData.customer_id);
      formData.append("score", rating.toString());
      formData.append("comment", comment.trim());

      if (files.length > 0) {
        formData.append("image", files[0]);
      }

      const res = await fetch("http://localhost:5000/api/customer/review", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(`Backend ส่ง Response ที่ไม่ใช่ JSON กลับมา: ${text}`);
      }

      if (res.ok && result.success) {
        alert("บันทึกรีวิวสำเร็จเรียบร้อย!");
        router.push("/customer/orders");
      } else {
        alert("เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถบันทึกรีวิวได้"));
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("เชื่อมต่อเซิร์ฟเวอร์เพื่อบันทึกรีวิวไม่สำเร็จ");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
            <h1 className="font-bold text-lg text-slate-900">รีวิวคำสั่งพิมพ์</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-400">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
        </main>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/customer/orders"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
            >
              ← คำสั่งซื้อของฉัน
            </Link>
            <h1 className="font-bold text-lg text-slate-900">รีวิวคำสั่งพิมพ์</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{dbError}</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/customer/orders"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
            >
              ← คำสั่งซื้อของฉัน
            </Link>
            <h1 className="font-bold text-lg text-slate-900">รีวิวคำสั่งพิมพ์</h1>
          </div>

          {activeOrderId && activeOrderId !== "undefined" && (
            <span className="text-xs text-slate-400 font-mono">
              Order #{activeOrderId.slice(0, 8)}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* รายละเอียดร้านค้า */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden border border-slate-200 shrink-0">
            {orderData?.print_shop?.profile_image ? (
              <img
                src={orderData.print_shop.profile_image}
                alt={orderData.print_shop.shop_name || "ร้านค้า"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">🖨️</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-slate-900 truncate">
              {orderData?.print_shop?.shop_name || "-"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              สั่งซื้อเมื่อ:{" "}
              {orderData?.order_date
                ? new Date(orderData.order_date).toLocaleString("th-TH", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
                : "-"}
            </p>
          </div>
        </div>

        {/* Order + Review Form (Grid 5:7) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* รายละเอียดคำสั่งซื้อ (5 ส่วน) */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">หมายเลขออร์เดอร์</span>
                <span className="text-sm font-bold text-slate-800 font-mono">
                  #{orderData?.id ? orderData.id.slice(0, 8) : "-"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUuid}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "คัดลอกแล้ว" : "คัดลอก UUID"}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">รายการพิมพ์:</p>
              <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100 text-xs">
                {((orderData as any)?.print_order_item || orderData?.order_item || []).length > 0 ? (
                  ((orderData as any)?.print_order_item || orderData?.order_item || []).map(
                    (item: any, idx: number) => (
                      <div key={item.id || idx} className="flex justify-between items-center border-b border-slate-100 last:border-none pb-1.5 last:pb-0">
                        <div className="flex flex-col">
                          <span className="text-slate-700 font-medium">
                            {idx + 1}. {item.category || "งานพิมพ์"} <span className="text-slate-400 font-normal">(x{item.quantity})</span>
                          </span>
                          {item.describe && (
                            <span className="text-[10px] text-slate-400">
                              {item.describe}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-800">
                          ฿{Number(item.subtotal || 0).toFixed(2)}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-slate-400">ไม่มีรายการสินค้า</p>
                )}

                {orderData?.description && (
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                    หมายเหตุ: {orderData.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">ยอดรวมทั้งสิ้น:</span>
              <span className="text-base font-extrabold text-blue-600">
                ฿{Number(orderData?.total_price || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Review Form (7 ส่วน) */}
          <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

            {/* 🛑 บล็อกเมื่อเคยรีวิวซ้ำ */}
            {orderData?.has_reviewed ? (
              <div className="py-8 px-4 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    คุณได้รับการรีวิวคำสั่งซื้อนี้เรียบร้อยแล้ว
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    ขอบคุณสำหรับข้อเสนอแนะและรีวิวที่คุณมอบให้กับร้านค้า
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/customer/orders"
                    className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                  >
                    กลับไปยังคำสั่งซื้อของฉัน
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    เขียนรีวิวความประทับใจ
                  </h3>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* ให้คะแนนดาว */}
                  <div className="text-center space-y-2 py-1">
                    <p className="text-xs text-slate-500 font-medium">ระดับความพึงพอใจ</p>
                    <div className="flex justify-center gap-2 text-3xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="hover:scale-110 transition active:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${(hoverRating || rating) >= star
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ความคิดเห็นเพิ่มเติม */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      ความคิดเห็นเพิ่มเติม
                    </label>
                    <textarea
                      rows={3}
                      placeholder="พิมพ์ความประทับใจเกี่ยวกับบริการงานพิมพ์..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition resize-none"
                    />
                  </div>

                  {/* อัปโหลดไฟล์ (PDF/Image) พร้อมพรีวิวขนาดใหญ่ */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      แนบรูปถ่าย / ไฟล์รีวิวผลงาน (ไม่บังคับ)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      รองรับไฟล์รูปภาพ หรือ PDF (JPG, PNG, PDF)
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {files.map((file, idx) => (
                        <PreviewFile
                          key={`${file.name}-${file.lastModified}-${idx}`}
                          file={file}
                          index={idx}
                          onRemove={handleRemoveFile}
                        />
                      ))}

                      {files.length === 0 && (
                        <label className="w-full h-32 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition-all text-blue-600 text-xs font-medium gap-1">
                          <span className="text-2xl leading-none">+</span>
                          <span>แนบไฟล์ผลงานพิมพ์</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,application/pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* ปุ่มบันทึก */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/20 disabled:bg-slate-300"
                  >
                    {submitting ? "กำลังบันทึก..." : "ยืนยันรีวิว"}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}