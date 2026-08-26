"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Star,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";

interface OrderItem {
  id?: string | number;
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
  print_shop?: {
    shop_name?: string;
    profile_image?: string;
  };
  order_item?: OrderItem[];
}

export default function OrderReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ดึง orderId จาก Query Parameter
  const orderIdFromUrl = searchParams.get("orderId");
  const activeOrderId = orderIdFromUrl || "0d8dd81e-16e0-4f70-8802-41dc1d97ac7c";

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string>("");

  const [formTab, setFormTab] = useState<"review" | "report">("review");

  // Review State
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Report State
  const [reportRating, setReportRating] = useState<number>(0);
  const [reportHoverRating, setReportHoverRating] = useState<number>(0);
  const [reportComment, setReportComment] = useState<string>("");
  const [reportImageUrl, setReportImageUrl] = useState<string>("");
  const [reportImagePreview, setReportImagePreview] = useState<string>("");
  const [submittingReport, setSubmittingReport] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // ดึงข้อมูลคำสั่งซื้อจาก Backend
  const fetchOrderDetail = async (id: string) => {
    setLoading(true);
    setDbError("");
    try {
      const res = await fetch(`http://localhost:5000/api/customer/orders/${id}/review-detail`);
      const result = await res.json();

      if (res.ok && result.success) {
        setOrderData(result.data);
      } else {
        setDbError(result.message || "ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
      }
    } catch (err: any) {
      setDbError("เชื่อมต่อกับเซิร์ฟเวอร์ Backend ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeOrderId) {
      fetchOrderDetail(activeOrderId);
    }
  }, [activeOrderId]);

  const handleCopyUuid = () => {
    if (orderData?.id) {
      navigator.clipboard.writeText(orderData.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ส่งรีวิวไปยัง Backend
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("กรุณาให้คะแนนดาวก่อนยืนยันครับ");
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:5000/api/customer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: activeOrderId,
          shop_id: orderData?.shop_id,
          customer_id: orderData?.customer_id,
          score: rating,
          comment,
          image_url: imageUrl,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSuccess(true);
        alert("บันทึกรีวิวสำเร็จเรียบร้อย!");
        setRating(0);
        setComment("");
        setImageUrl("");
        setImagePreview("");
        router.push("/customer/orders");
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (err) {
      alert("เชื่อมต่อเซิร์ฟเวอร์เพื่อบันทึกรีวิวไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  // ส่งรายงานปัญหาไปยัง Backend
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportRating === 0) {
      alert("กรุณาระบุระดับความรุนแรงของปัญหาก่อนยืนยันครับ");
      return;
    }

    setSubmittingReport(true);
    setReportSuccess(false);

    try {
      const res = await fetch("http://localhost:5000/api/customer/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: activeOrderId,
          shop_id: orderData?.shop_id,
          customer_id: orderData?.customer_id,
          severity: reportRating,
          comment: reportComment,
          image_url: reportImageUrl,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setReportSuccess(true);
        alert("ส่งรายงานปัญหาเรียบร้อยแล้ว ทีมงานจะตรวจสอบโดยเร็วที่สุด");
        setReportRating(0);
        setReportComment("");
        setReportImageUrl("");
        setReportImagePreview("");
        router.push("/customer/orders");
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (err) {
      alert("เชื่อมต่อเซิร์ฟเวอร์เพื่อส่งรายงานไม่สำเร็จ");
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">
      {/* 🌟 Header Bar ด้านบนเหมือนหน้าคำสั่งซื้อของฉัน 100% */}
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
          <span className="text-xs text-slate-400">Order #{activeOrderId.slice(0, 8)}</span>
        </div>
      </header>

      {/* เนื้อหาหลัก */}
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
          </div>
        ) : dbError ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs">
            {dbError}
          </div>
        ) : (
          <>
            {/* กล่องข้อมูลร้านค้า */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden border border-slate-200 shrink-0">
                {orderData?.print_shop?.profile_image ? (
                  <img
                    src={orderData.print_shop.profile_image}
                    alt={orderData.print_shop.shop_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "🖨️"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-base text-slate-900 truncate">
                  {orderData?.print_shop?.shop_name || "ร้านพิมพ์เอกสาร"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  สั่งซื้อเมื่อ: {orderData?.order_date ? new Date(orderData.order_date).toLocaleString("th-TH") : "-"}
                </p>
              </div>
            </div>

            {/* รายละเอียดคำสั่งซื้อ และ ฟอร์มรีวิว */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* ฝั่งซ้าย: รายละเอียดคำสั่งซื้อ */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 block">หมายเลขออร์เดอร์</span>
                    <span className="text-sm font-bold text-slate-800 font-mono">
                      #{orderData?.id.slice(0, 8)}
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
                    {(orderData?.order_item || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600">
                          • รายการที่ {idx + 1} <span className="text-slate-400">(x{item.quantity})</span>
                        </span>
                        <span className="font-semibold text-slate-800">฿{Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
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
                    ฿{Number(orderData?.total_price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* ฝั่งขวา: แท็บ Review / Report */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormTab("review")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      formTab === "review" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" /> รีวิวสินค้า
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTab("report")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      formTab === "report" ? "bg-white text-rose-600 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> รายงานปัญหา
                  </button>
                </div>

                {/* ฟอร์มรีวิว */}
                {formTab === "review" && (
                  <div className="space-y-4 pt-1">
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
                              className={`w-8 h-8 ${
                                (hoverRating || rating) >= star
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

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

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/20 disabled:bg-slate-300"
                    >
                      {submitting ? "กำลังบันทึก..." : "ยืนยันรีวิว"}
                    </button>
                  </div>
                )}

                {/* ฟอร์มรายงานปัญหา */}
                {formTab === "report" && (
                  <div className="space-y-4 pt-1">
                    <div className="text-center space-y-2 py-1">
                      <p className="text-xs text-slate-500 font-medium">ระดับความรุนแรงของปัญหา</p>
                      <div className="flex justify-center gap-2 text-3xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReportRating(star)}
                            onMouseEnter={() => setReportHoverRating(star)}
                            onMouseLeave={() => setReportHoverRating(0)}
                            className="hover:scale-110 transition active:scale-125 focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                (reportHoverRating || reportRating) >= star
                                  ? "text-rose-500 fill-rose-500"
                                  : "text-slate-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        อธิบายปัญหาที่พบ
                      </label>
                      <textarea
                        rows={3}
                        placeholder="เช่น สีเพี้ยน, ได้รับของล่าช้า, หน้าเอกสารไม่ครบ..."
                        value={reportComment}
                        onChange={(e) => setReportComment(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500 transition resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitReport}
                      disabled={submittingReport}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-rose-500/20 disabled:bg-slate-300"
                    >
                      {submittingReport ? "กำลังส่งรายงาน..." : "ยืนยันรายงานปัญหา"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}