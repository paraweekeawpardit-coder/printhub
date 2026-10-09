"use client";

import { useState } from "react";
import { Star, AlertTriangle, Printer, User, FileText, Calendar, Layers } from "lucide-react";

export type PrintOrderItem = {
  id?: string;
  category?: string;
  quantity?: number;
  describe?: string;
};

export type ReviewItem = {
  id: string;
  rating?: number;
  score?: number;
  comment: string;
  created_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  print_order?: {
    id: string; // uuid สำหรับใช้งาน
    order_no?: number | string; // เลขโชว์
    description?: string | null;
    items?: PrintOrderItem[];
    total_price?: number;
  };
};

export type ComplaintItem = {
  id: string;
  issue_type?: string;
  description: string;
  is_verified?: boolean;
  status?: string | null;
  admin_note?: string | null;
  created_at: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  print_order?: {
    id: string; // uuid สำหรับใช้งาน
    order_no?: number | string; // เลขโชว์
    description?: string | null;
    items?: PrintOrderItem[];
  };
};

export type ReviewSummary = {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: { stars: number; count: number; percentage: number }[];
};

type ReportStatusConfig = {
  label: string;
  className: string;
  showDisputeNote?: boolean;
};

const REPORT_STATUS_MAP: Record<string, ReportStatusConfig> = {
  investigating: {
    label: "กำลังตรวจสอบ",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    showDisputeNote: true,
  },
  resolved_refund: {
    label: "คำร้องเรียนสำเร็จ",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  resolved_payout: {
    label: "ปฏิเสธคำร้องเรียน",
    className: "bg-slate-200 text-slate-700 border-slate-300",
  },
  rejected: {
    label: "คำร้องเรียนถูกยกเลิก",
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

// pending / null / ค่าที่ไม่รู้จัก => คืน null (ไม่แสดง)
const getReportStatus = (status?: string | null): ReportStatusConfig | null => {
  const key = (status ?? "").toLowerCase().trim();
  if (key === "investigation") return REPORT_STATUS_MAP.investigating;
  return REPORT_STATUS_MAP[key] ?? null;
};

type Props = {
  reviews: ReviewItem[];
  complaints: ComplaintItem[];
  summary?: ReviewSummary;
  ratingCounts?: Record<number, number>;
  onOrderClick?: (id: string) => void;
};

export default function ReviewComplaintModal({
  reviews = [],
  complaints = [],
  summary,
  ratingCounts,
  onOrderClick,
}: Props) {
  const [tab, setTab] = useState<"reviews" | "complaints">("reviews");
  const [selectedStar, setSelectedStar] = useState<number | "all">("all");

  const visibleComplaints = complaints.filter((c) => getReportStatus(c.status));

  const getRatingValue = (r: ReviewItem) => Number(r.rating ?? r.score ?? 0);

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

  const filteredReviews =
    selectedStar === "all"
      ? reviews
      : reviews.filter((r) => Math.round(getRatingValue(r)) === selectedStar);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderOrderItemsDetail = (order: ReviewItem["print_order"] | ComplaintItem["print_order"]) => {
    if (!order) return null;

    if (order.items && order.items.length > 0) {
      return (
        <div className="mt-2 space-y-1">
          {order.items.map((item, idx) => (
            <div key={item.id || idx} className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100">
              <span className="font-semibold text-slate-800">
                • {item.category || "สิ่งพิมพ์"} {item.quantity ? `(จำนวน ${item.quantity} ชิ้น)` : ""}
              </span>
              {item.describe && <p className="text-[10px] text-slate-500 pl-2 pt-0.5">{item.describe}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (order.description) {
      return <p className="text-[11px] text-slate-600 mt-1 pl-1">{order.description}</p>;
    }

    return <p className="text-[11px] text-slate-400 mt-1 italic pl-1">ไม่พบข้อมูลสิ่งพิมพ์</p>;
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
            <span>รายการร้องเรียน ({visibleComplaints.length})</span>
          </button>
        </div>
      </div>

      {tab === "reviews" ? (
        <div className="space-y-6">
          {/* Summary Rating Header */}
          <div className="grid grid-cols-1 gap-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4 md:grid-cols-3">
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

          {/* Filter Star Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500">กรองดาว:</span>
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
                <span className="text-[10px] opacity-80">({counts[star] || 0})</span>
              </button>
            ))}
          </div>

          {/* 🟢 คอนเทนเนอร์แสดงผลแบบ Scroll แนวตั้ง จำกัดสูงคงที่ประมาณ 3 รายการ */}
          {filteredReviews.length > 0 ? (
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {filteredReviews.map((r) => {
                const scoreVal = getRatingValue(r);
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 font-bold border border-amber-100">
                          {r.customer?.first_name ? r.customer.first_name.charAt(0) : <User className="h-4 w-4" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">
                            {r.customer ? `${r.customer.first_name} ${r.customer.last_name}` : "ลูกค้าทั่วไป"}
                          </h4>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${
                                  s <= scoreVal ? "fill-amber-400 text-amber-400" : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(r.created_at)}</span>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/60">
                      {r.comment || "ไม่ได้ระบุความคิดเห็นเพิ่มเติม"}
                    </p>

                    {r.print_order && (
                      <div
                        onClick={() => onOrderClick?.(r.print_order!.id)}
                        className="mt-2.5 rounded-lg bg-emerald-50/40 p-2.5 border border-emerald-100/70 text-emerald-900 cursor-pointer hover:bg-emerald-100/50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <Printer className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          Order <strong className="text-emerald-950">#{r.print_order.order_no || r.print_order.id.slice(0, 8)}</strong>
                        </div>
                        {renderOrderItemsDetail(r.print_order)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">ยังไม่มีรีวิวในระดับดาวนี้</div>
          )}
        </div>
      ) : (
        /* 🟢 ข้อร้องเรียน Scroll แนวตั้ง */
        <div className="space-y-4">
          {visibleComplaints.length > 0 ? (
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {visibleComplaints.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-rose-100 bg-rose-50/20 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-rose-100/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        {c.issue_type || "ข้อร้องเรียน/ปัญหา"}
                      </span>
                      {(() => {
                        const st = getReportStatus(c.status);
                        return st ? (
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${st.className}`}
                          >
                            {st.label}
                          </span>
                        ) : null;
                      })()}
                      {c.print_order && (
                        <span
                          onClick={() => onOrderClick?.(c.print_order!.id)}
                          className="text-xs font-bold text-slate-800 hover:text-blue-600 cursor-pointer underline underline-offset-2"
                        >
                          Order #{c.print_order.order_no || c.print_order.id.slice(0, 8)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(c.created_at)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <User size={13} className="text-slate-500" />
                      ผู้แจ้งเรื่อง:{" "}
                      <span className="font-normal text-slate-600">
                        {c.customer ? `${c.customer.first_name} ${c.customer.last_name}` : "ไม่ระบุชื่อ"}
                      </span>
                    </p>

                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                        <FileText size={13} className="text-slate-500" />
                        รายละเอียดปัญหาร้องเรียน:
                      </p>
                      <p className="bg-white p-2.5 rounded-lg border border-rose-100 text-slate-700 whitespace-pre-line leading-relaxed text-[11px]">
                        {c.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                      </p>
                    </div>

                    {c.print_order && (
                      <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100">
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px] text-rose-900 mb-1">
                          <Layers size={13} className="text-rose-600" /> รายการที่สั่งซื้อ:
                        </p>
                        {renderOrderItemsDetail(c.print_order)}
                      </div>
                    )}

                    {getReportStatus(c.status)?.showDisputeNote && (
                      <p className="text-[11px] font-medium text-amber-700">
                        * หากท่านมีข้อโต้แย้งกรุณาติดต่อแอดมิน
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">ไม่มีรายการร้องเรียน</div>
          )}
        </div>
      )}
    </div>
  );
}