"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  AlertCircle,
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
  const params = useParams();
  const router = useRouter();

  // ==========================================
  // ดึง Order ID จาก URL
  //
  // /customer/orders/[order_id]/review
  // ==========================================
  const rawOrderId = params?.order_id || params?.orderId;

  const activeOrderId = Array.isArray(rawOrderId)
    ? rawOrderId[0]
    : (rawOrderId as string);

  const [orderData, setOrderData] =
    useState<OrderData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [dbError, setDbError] =
    useState<string>("");

  // ==========================================
  // Review State
  // ==========================================
  const [rating, setRating] =
    useState<number>(0);

  const [hoverRating, setHoverRating] =
    useState<number>(0);

  const [comment, setComment] =
    useState<string>("");

  const [imageUrl, setImageUrl] =
    useState<string>("");

  const [submitting, setSubmitting] =
    useState<boolean>(false);

  const [copied, setCopied] =
    useState<boolean>(false);

  // ==========================================
  // ดึงข้อมูลคำสั่งซื้อ
  //
  // GET /api/customer/order/:orderId/review
  // ==========================================
  const fetchOrderDetail = async (
    id: string
  ) => {
    setLoading(true);
    setDbError("");

    try {
      const url =
        `http://localhost:5000/api/customer/order/${id}/review`;

      console.log(
        "🔵 Review API URL:",
        url
      );

      const res = await fetch(url);

      console.log(
        "🟡 Review API Status:",
        res.status
      );

      console.log(
        "🟡 Review API OK:",
        res.ok
      );

      const text = await res.text();

      console.log(
        "🟢 Review API Response:",
        text
      );

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend ส่ง Response ที่ไม่ใช่ JSON กลับมา: ${text}`
        );
      }

      if (
        res.ok &&
        result.success
      ) {
        setOrderData(result.data);
      } else {
        setDbError(
          result.message ||
          `ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้ (HTTP ${res.status})`
        );
      }
    } catch (err) {
      console.error(
        "🔴 Review Detail API Error:",
        err
      );

      if (err instanceof Error) {
        setDbError(err.message);
      } else {
        setDbError(
          "เกิดข้อผิดพลาดในการเชื่อมต่อ Backend"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Order
  // ==========================================
  useEffect(() => {
    if (
      activeOrderId &&
      activeOrderId !== "undefined"
    ) {
      fetchOrderDetail(
        activeOrderId
      );
    } else {
      setLoading(false);

      setDbError(
        "ไม่พบรหัสคำสั่งซื้อ (Order ID ไม่ถูกต้อง)"
      );
    }
  }, [activeOrderId]);

  // ==========================================
  // Copy UUID
  // ==========================================
  const handleCopyUuid = () => {
    if (!orderData?.id) {
      return;
    }

    navigator.clipboard.writeText(
      orderData.id
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // ==========================================
  // Submit Review
  //
  // POST /api/customer/review
  // ==========================================
  const handleSubmitReview = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (rating === 0) {
      alert(
        "กรุณาให้คะแนนดาวก่อนยืนยันครับ"
      );

      return;
    }

    if (!activeOrderId) {
      alert(
        "ไม่พบรหัสคำสั่งซื้อ"
      );

      return;
    }

    if (!orderData?.customer_id) {
      console.error(
        "❌ customer_id ไม่มีค่า:",
        orderData
      );

      alert(
        "ไม่พบข้อมูลลูกค้า กรุณาโหลดหน้าคำสั่งซื้อใหม่อีกครั้ง"
      );

      return;
    }

    if (!orderData?.shop_id) {
      alert(
        "ไม่พบข้อมูลร้านค้า"
      );

      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        order_id:
          activeOrderId,

        shop_id:
          orderData.shop_id,

        customer_id:
          orderData.customer_id,

        score:
          rating,

        comment:
          comment.trim(),

        image_url:
          imageUrl || null,
      };

      console.log(
        "📤 Review Payload:",
        payload
      );

      const res = await fetch(
        "http://localhost:5000/api/customer/review",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );

      const text =
        await res.text();

      console.log(
        "🟡 Review API Status:",
        res.status
      );

      console.log(
        "🟢 Review API Response:",
        text
      );

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend ส่ง Response ที่ไม่ใช่ JSON กลับมา: ${text}`
        );
      }

      if (
        res.ok &&
        result.success
      ) {
        alert(
          "บันทึกรีวิวสำเร็จเรียบร้อย!"
        );

        router.push(
          "/customer/orders"
        );
      } else {
        alert(
          "เกิดข้อผิดพลาด: " +
          (
            result.message ||
            "ไม่สามารถบันทึกรีวิวได้"
          )
        );
      }
    } catch (err) {
      console.error(
        "❌ Submit Review Error:",
        err
      );

      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(
          "เชื่อมต่อเซิร์ฟเวอร์เพื่อบันทึกรีวิวไม่สำเร็จ"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">

        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
            <h1 className="font-bold text-lg text-slate-900">
              รีวิวคำสั่งพิมพ์
            </h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-20">

          <div className="text-center text-xs text-slate-400 space-y-2">

            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />

            <p>
              กำลังโหลดข้อมูลคำสั่งซื้อ...
            </p>

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================
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

            <h1 className="font-bold text-lg text-slate-900">
              รีวิวคำสั่งพิมพ์
            </h1>

          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">

          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center text-xs flex items-center justify-center gap-2">

            <AlertCircle className="w-4 h-4 text-rose-500" />

            <span>
              {dbError}
            </span>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-12">

      {/* ==========================================
          Header
      ========================================== */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">

        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Link
              href="/customer/orders"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
            >
              ← คำสั่งซื้อของฉัน
            </Link>

            <h1 className="font-bold text-lg text-slate-900">
              รีวิวคำสั่งพิมพ์
            </h1>

          </div>

          {activeOrderId &&
            activeOrderId !==
            "undefined" && (
              <span className="text-xs text-slate-400 font-mono">
                Order #
                {activeOrderId.slice(
                  0,
                  8
                )}
              </span>
            )}

        </div>

      </header>

      {/* ==========================================
          Main
      ========================================== */}
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">

        {/* ==========================================
            รายละเอียดร้านค้า
        ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden border border-slate-200 shrink-0">

            {orderData?.print_shop?.profile_image ? (
              <img
                src={
                  orderData.print_shop
                    .profile_image
                }
                alt={
                  orderData.print_shop
                    .shop_name ||
                  "ร้านค้า"
                }
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">
                🖨️
              </span>
            )}

          </div>

          <div className="flex-1 min-w-0">

            <h2 className="font-bold text-base text-slate-900 truncate">
              {orderData?.print_shop
                ?.shop_name ||
                "-"}
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              สั่งซื้อเมื่อ:{" "}
              {orderData?.order_date
                ? new Date(
                  orderData.order_date
                ).toLocaleString(
                  "th-TH"
                )
                : "-"}
            </p>

          </div>

        </div>

        {/* ==========================================
            Order + Review
        ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* ==========================================
              รายละเอียดคำสั่งซื้อ
          ========================================== */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

            <div className="flex justify-between items-center border-b border-slate-100 pb-3">

              <div>

                <span className="text-xs text-slate-400 block">
                  หมายเลขออร์เดอร์
                </span>

                <span className="text-sm font-bold text-slate-800 font-mono">
                  #
                  {orderData?.id
                    ? orderData.id.slice(
                      0,
                      8
                    )
                    : "-"}
                </span>

              </div>

              <button
                type="button"
                onClick={
                  handleCopyUuid
                }
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition"
              >

                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}

                {copied
                  ? "คัดลอกแล้ว"
                  : "คัดลอก UUID"}

              </button>

            </div>

            <div className="space-y-2">

              <p className="text-xs font-bold text-slate-700">
                รายการพิมพ์:
              </p>

              <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100 text-xs">

                {(orderData?.order_item || [])
                  .length > 0 ? (

                  orderData?.order_item?.map(
                    (item, idx) => (
                      <div
                        key={
                          item.id ||
                          idx
                        }
                        className="flex justify-between items-center"
                      >

                        <span className="text-slate-600">
                          • รายการที่{" "}
                          {idx + 1}{" "}
                          <span className="text-slate-400">
                            (x
                            {
                              item.quantity
                            }
                            )
                          </span>
                        </span>

                        <span className="font-semibold text-slate-800">
                          ฿
                          {Number(
                            item.subtotal ||
                            0
                          ).toFixed(
                            2
                          )}
                        </span>

                      </div>
                    )
                  )

                ) : (

                  <p className="text-slate-400">
                    ไม่มีรายการสินค้า
                  </p>

                )}

                {orderData?.description && (
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                    หมายเหตุ:{" "}
                    {
                      orderData.description
                    }
                  </p>
                )}

              </div>

            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">

              <span className="text-slate-500">
                ยอดรวมทั้งสิ้น:
              </span>

              <span className="text-base font-extrabold text-blue-600">
                ฿
                {Number(
                  orderData?.total_price ||
                  0
                ).toFixed(2)}
              </span>

            </div>

          </div>

          {/* ==========================================
              Review
          ========================================== */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

            {/* ==========================================
                Navigation
            ========================================== */}
            <div className="flex bg-slate-100 p-1 rounded-xl">

              {/* รีวิวสินค้า */}
              <div className="flex-1 py-2 text-xs font-semibold rounded-lg bg-white text-blue-600 shadow-xs flex items-center justify-center gap-1.5">

                <Star className="w-3.5 h-3.5" />

                รีวิวสินค้า

              </div>

              {/* รายงานปัญหา */}
              <Link
                href={`/customer/orders/${activeOrderId}/report`}
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 text-slate-600 hover:text-rose-600 hover:bg-white"
              >

                <AlertTriangle className="w-3.5 h-3.5" />

                รายงานปัญหา

              </Link>

            </div>

            {/* ==========================================
                Review Form
            ========================================== */}
            <div className="space-y-4 pt-1">

              <div className="text-center space-y-2 py-1">

                <p className="text-xs text-slate-500 font-medium">
                  ระดับความพึงพอใจ
                </p>

                <div className="flex justify-center gap-2 text-3xl">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setRating(
                            star
                          )
                        }
                        onMouseEnter={() =>
                          setHoverRating(
                            star
                          )
                        }
                        onMouseLeave={() =>
                          setHoverRating(
                            0
                          )
                        }
                        className="hover:scale-110 transition active:scale-125 focus:outline-none"
                      >

                        <Star
                          className={`w-8 h-8 ${(
                              hoverRating ||
                              rating
                            ) >=
                              star
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                            }`}
                        />

                      </button>
                    )
                  )}

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
                  onChange={(e) =>
                    setComment(
                      e.target.value
                    )
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition resize-none"
                />

              </div>

              <button
                type="button"
                onClick={
                  handleSubmitReview
                }
                disabled={
                  submitting
                }
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/20 disabled:bg-slate-300"
              >

                {submitting
                  ? "กำลังบันทึก..."
                  : "ยืนยันรีวิว"}

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
