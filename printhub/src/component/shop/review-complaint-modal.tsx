"use client";

import { useState } from "react";
import { Star, AlertTriangle, Printer, User } from "lucide-react";

export type ReviewItem = {
  id: string;
  rating?: number;
  score?: number; // รองรับกรณีฟิลด์ใน DB ชื่อ score
  comment: string;
  created_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  print_order?: {
    id: string;
    description: string | null;
    total_price?: number;
  };
};

export type ComplaintItem = {
  id: string;
  title?: string;
  detail: string;
  status?: string;
  created_at: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  print_order?: {
    id: string;
    description: string | null;
  };
};

export type ReviewSummary = {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: { stars: number; count: number; percentage: number }[];
};

type Props = {
  reviews: ReviewItem[];
  complaints: ComplaintItem[];
  summary?: ReviewSummary;
  ratingCounts?: Record<number, number>;
};

export default function ReviewComplaintModal({
  reviews = [],
  complaints = [],
  summary,
  ratingCounts,
}: Props) {
  const [tab, setTab] = useState<"reviews" | "complaints">("reviews");
  const [selectedStar, setSelectedStar] = useState<number | "all">("all");

  // ฟังก์ชันช่วยดึงค่าดาวของแต่ละรีวิว (รองรับทั้ง rating และ score)
  const getRatingValue = (r: ReviewItem) => Number(r.rating ?? r.score ?? 0);

  // คำนวณจำนวนดาวถ้าไม่ได้ส่งมาจาก Backend
  const counts =
    ratingCounts || {
      5: reviews.filter((r) => Math.round(getRatingValue(r)) === 5).length,
      4: reviews.filter((r) => Math.round(getRatingValue(r)) === 4).length,
      3: reviews.filter((r) => Math.round(getRatingValue(r)) === 3).length,
      2: reviews.filter((r) => Math.round(getRatingValue(r)) === 2).length,
      1: reviews.filter((r) => Math.round(getRatingValue(r)) === 1).length,
    };

  const totalReviews = summary?.total_reviews ?? reviews.length;
  const avgRating =
    summary?.average_rating?.toFixed(1) ??
    (totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + getRatingValue(r), 0) / totalReviews
        ).toFixed(1)
      : "0.0");

  // กรองรีวิวตามดาวที่เลือก
  const filteredReviews =
    selectedStar === "all"
      ? reviews
      : reviews.filter((r) => Math.round(getRatingValue(r)) === selectedStar);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Header & Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#0F2942]">
            ความคิดเห็นและการร้องเรียน
          </h3>
          <p className="text-xs text-slate-500">
            รีวิวจากลูกค้าและข้อเสนอแนะที่ต้องปรับปรุง
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100/80 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("reviews")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              tab === "reviews"
                ? "bg-white text-amber-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>รีวิว ({totalReviews})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("complaints")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              tab === "complaints"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            <span>รายการร้องเรียน ({complaints.length})</span>
          </button>
        </div>
      </div>

      {tab === "reviews" ? (
        <div className="space-y-6">
          {/* Summary & Rating Breakdown Chart */}
          <div className="grid grid-cols-1 gap-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:grid-cols-3">
            {/* คะแนนเฉลี่ย */}
            <div className="flex flex-col items-center justify-center border-b border-slate-200/60 pb-4 md:border-b-0 md:border-r md:pb-0">
              <span className="text-4xl font-extrabold text-slate-800">
                {avgRating}
              </span>
              <div className="my-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(Number(avgRating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">
                จากทั้งหมด {totalReviews} รีวิว
              </span>
            </div>

            {/* กราฟสัดส่วนดาว */}
            <div className="col-span-2 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const breakdownItem = summary?.rating_breakdown?.find(
                  (b) => b.stars === star
                );
                const count = breakdownItem?.count ?? counts[star] ?? 0;
                const percentage =
                  breakdownItem?.percentage ??
                  (totalReviews > 0 ? (count / totalReviews) * 100 : 0);

                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="flex w-12 items-center gap-1 font-semibold text-slate-600">
                      {star}{" "}
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="h-full rounded-full bg-amber-400 transition-all duration-300"
                      />
                    </div>
                    <span className="w-16 text-right text-slate-400 font-mono">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter By Star Buttons */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500">
              กรองตามดาว:
            </span>
            <button
              type="button"
              onClick={() => setSelectedStar("all")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                selectedStar === "all"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ทั้งหมด
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedStar(star)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  selectedStar === star
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{star}</span>
                <Star
                  className={`h-3 w-3 ${
                    selectedStar === star
                      ? "fill-white text-white"
                      : "fill-amber-400 text-amber-400"
                  }`}
                />
                <span className="text-[10px] opacity-80">
                  ({counts[star] || 0})
                </span>
              </button>
            ))}
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r) => {
                const scoreVal = getRatingValue(r);
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600 font-bold border border-amber-100">
                          {r.customer?.first_name ? (
                            r.customer.first_name.charAt(0)
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">
                            {r.customer
                              ? `${r.customer.first_name} ${r.customer.last_name}`
                              : "ลูกค้าทั่วไป"}
                          </h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${
                                  s <= scoreVal
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(r.created_at)}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="mt-3 text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100/60">
                      {r.comment || "ไม่ได้ระบุความคิดเห็นเพิ่มเติม"}
                    </p>

                    {/* Order detail */}
                    {r.print_order && (
                      <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-emerald-50/40 px-3 py-2 text-[11px] text-emerald-800 border border-emerald-100/50">
                        <Printer className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold text-emerald-900">
                          รายการที่สั่ง:
                        </span>
                        <span className="truncate">
                          {r.print_order.description ||
                            `ออเดอร์ #${r.print_order.id.slice(0, 8)}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                ยังไม่มีรีวิวในระดับดาวนี้
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Complaint List */
        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-rose-100 bg-rose-50/20 p-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-700">
                    {c.title || "ข้อร้องเรียน/เสนอแนะ"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-700">{c.detail}</p>
                {c.print_order && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    จากออเดอร์: #{c.print_order.id.slice(0, 8)} -{" "}
                    {c.print_order.description}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              ไม่มีรายการร้องเรียน
            </div>
          )}
        </div>
      )}
    </div>
  );
}