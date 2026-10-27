"use client";

import { useState } from "react";
import {
  Star,
  AlertTriangle,
  Printer,
  User,
  FileText,
  Calendar,
  Layers,
  X,
  MessageSquare,
  Flag,
  Send,
} from "lucide-react";

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
  shop_reply?: string | null;
  reply_at?: string | null;
  image_url?: string | null;
  created_at: string;
  has_reported?: boolean;
  customer?: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  print_order?: {
    id: string;
    order_no?: number | string;
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
  image_url?: string | null;
  created_at: string;
  updated_at?: string | null;
  shop_name?: string | null;
  shop?: {
    id?: string;
    name?: string;
    shop_name?: string;
  } | null;
  customer?: {
    first_name: string;
    last_name: string;
  };
  print_order?: {
    id: string;
    order_no?: number | string;
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
  showDeadline?: boolean;
};

const REPORT_STATUS_MAP: Record<string, ReportStatusConfig> = {
  pending: {
    label: "ยังไม่ได้รับการตรวจสอบ",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    showDisputeNote: true,
  },
  investigating: {
    label: "กำลังตรวจสอบ",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    showDisputeNote: true,
    showDeadline: true,
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

const getReportStatus = (status?: string | null): ReportStatusConfig | null => {
  const key = (status ?? "").toLowerCase().trim();
  if (key === "") return REPORT_STATUS_MAP.pending;
  if (key === "investigation") return REPORT_STATUS_MAP.investigating;
  return REPORT_STATUS_MAP[key] ?? null;
};

const REVIEW_DEADLINE_DAYS = 2;
const getReviewDeadline = (updatedAt?: string | null): string | null => {
  if (!updatedAt) return null;
  const t = new Date(updatedAt).getTime();
  if (isNaN(t)) return null;
  return new Date(t + REVIEW_DEADLINE_DAYS * 24 * 60 * 60 * 1000).toISOString();
};

const parseImageUrls = (raw?: string | null): string[] => {
  const text = (raw ?? "").trim();
  if (!text) return [];
  let list: unknown[] = [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
  } else {
    list = text.split(/[,\n]/);
  }
  return list
    .map((u) => String(u).trim().replace(/^"|"$/g, ""))
    .filter((u) => u.length > 0);
};

function ImageThumbs({
  raw,
  onPreview,
}: {
  raw?: string | null;
  onPreview: (url: string) => void;
}) {
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const urls = parseImageUrls(raw).filter((u) => !failed.has(u));
  if (urls.length === 0) return null;

  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      {urls.map((url) => (
        <button
          key={url}
          type="button"
          onClick={() => onPreview(url)}
          className="h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition hover:border-slate-400"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="รูปที่แนบ"
            onError={() => setFailed((prev) => new Set(prev).add(url))}
            className="h-full w-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}

type Props = {
  reviews: ReviewItem[];
  complaints: ComplaintItem[];
  summary?: ReviewSummary;
  ratingCounts?: Record<number, number>;
  onOrderClick?: (id: string) => void;
  onReplyReview?: (reviewId: string, replyText: string) => Promise<void>;
  onReportReview?: (reviewId: string, reason: string) => Promise<void>;
};

export default function ReviewComplaintModal({
  reviews = [],
  complaints = [],
  summary,
  ratingCounts,
  onOrderClick,
  onReplyReview,
  onReportReview,
}: Props) {
  const [tab, setTab] = useState<"reviews" | "complaints">("reviews");
  const [selectedStar, setSelectedStar] = useState<number | "all">("all");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState<string>("");
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>("");
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);

  // 🟢 State สำหรับจำรีวิวที่ถูกรายงานไปแล้วในฝั่งหน้าบ้าน
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

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

  const handleSendReply = async (reviewId: string) => {
    if (!replyInputText.trim() || !onReplyReview) return;
    try {
      setIsSubmittingReply(true);
      await onReplyReview(reviewId, replyInputText.trim());
      setReplyingReviewId(null);
      setReplyInputText("");
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการตอบกลับ");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // 🟢 เมื่อกดส่งรายงานสำเร็จ ให้บันทึกไอดีลง State ทันที
  const handleSendReport = async () => {
    if (!reportingReviewId || !reportReason.trim() || !onReportReview) return;
    try {
      setIsSubmittingReport(true);
      await onReportReview(reportingReviewId, reportReason.trim());

      // บันทึกว่ารีวิวนี้ถูกรายงานแล้ว
      setReportedIds((prev) => new Set(prev).add(reportingReviewId));

      setReportingReviewId(null);
      setReportReason("");
      alert("ส่งรายงานรีวิวที่ไม่เหมาะสมเรียบร้อยแล้ว");
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการส่งรายงาน");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const renderOrderItemsDetail = (
    order: ReviewItem["print_order"] | ComplaintItem["print_order"]
  ) => {
    if (!order) return null;

    if (order.items && order.items.length > 0) {
      return (
        <div className="mt-2 space-y-1">
          {order.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded border border-slate-100 bg-white p-2 text-[11px] text-slate-600"
            >
              <span className="font-semibold text-slate-800">
                - {item.category || "สิ่งพิมพ์"}{" "}
                {item.quantity ? `(จำนวน ${item.quantity} ชิ้น)` : ""}
              </span>
              {item.describe && (
                <p className="pl-2 pt-0.5 text-[10px] text-slate-500">
                  {item.describe}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (order.description) {
      return (
        <p className="mt-1 pl-1 text-[11px] text-slate-600">
          {order.description}
        </p>
      );
    }

    return (
      <p className="mt-1 pl-1 text-[11px] italic text-slate-400">
        ไม่พบข้อมูลสิ่งพิมพ์
      </p>
    );
  };

  const currentReportingReview = reviews.find((r) => r.id === reportingReviewId);

  // 🟢 เช็คว่ารีวิวนี้ถูกรายงานหรือยัง (เช็คจากทั้ง API และเช็คเทียบกับรายการร้องเรียน complaints)
  const isAlreadyReported = (reviewId: string) => {
    const rev = reviews.find((r) => r.id === reviewId);
    if (!rev) return false;

    // 1. เช็คจากฟิลด์ has_reported (ถ้า Backend ส่งมาแล้ว) หรือ State ที่เพิ่งกด
    if (rev.has_reported || reportedIds.has(reviewId)) return true;

    // 2. เช็คจากรายการ complaints (ถ้า order_id ของรีวิวนี้ ไปตรงกับ order_id ใน complaints แสดงว่ารายงานแล้ว)
    const orderId = rev.print_order?.id;
    if (orderId) {
      const foundComplaint = complaints.some(
        (c) => c.print_order?.id === orderId || (c as any).order_id === orderId
      );
      if (foundComplaint) return true;
    }

    return false;
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
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${tab === "reviews"
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
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${tab === "complaints"
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
                    className={`h-4 w-4 ${star <= Math.round(Number(avgRating))
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
                    <span className="w-16 font-mono text-right text-slate-400">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Star Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-500">
              กรองดาว:
            </span>
            <button
              type="button"
              onClick={() => setSelectedStar("all")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${selectedStar === "all"
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
                className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all ${selectedStar === star
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <span>{star}</span>
                <Star
                  className={`h-3 w-3 ${selectedStar === star
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

          {/* รายการรีวิว */}
          {filteredReviews.length > 0 ? (
            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {filteredReviews.map((r) => {
                const scoreVal = getRatingValue(r);
                const reported = isAlreadyReported(r.id);

                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-100 bg-amber-50 font-bold text-amber-600">
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
                          <div className="mt-0.5 flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${s <= scoreVal
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">
                          {formatDate(r.created_at)}
                        </span>

                        {/* 🟢 ปุ่มรายงานรีวิว */}
                        {onReportReview && (
                          <button
                            type="button"
                            onClick={() => {
                              setReportingReviewId(r.id);
                              setReportReason("");
                            }}
                            className={`rounded p-1 transition ${isAlreadyReported(r.id) // 🟢 เปลี่ยนมาเช็คผ่านฟังก์ชันเช็คร่วมกับ state ที่กดรายงานแล้ว
                              ? "text-rose-600 bg-rose-50 hover:bg-rose-100" // 🔴 สีแดงเมื่อรายงานแล้ว
                              : "text-slate-400 hover:bg-rose-50 hover:text-rose-600" // ⚪ สีปกติ
                              }`}
                            title={isAlreadyReported(r.id) ? "คุณได้รายงานรีวิวนี้แล้ว" : "รายงานรีวิวนี้"}
                          >
                            <Flag className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-2.5 rounded-lg border border-slate-100/60 bg-slate-50/50 p-2.5 text-xs leading-relaxed text-slate-700">
                      {r.comment || "ไม่ได้ระบุความคิดเห็นเพิ่มเติม"}
                    </p>

                    <ImageThumbs raw={r.image_url} onPreview={setPreviewUrl} />

                    {r.print_order && (
                      <div
                        onClick={() => onOrderClick?.(r.print_order!.id)}
                        className="mt-2.5 cursor-pointer rounded-lg border border-emerald-100/70 bg-emerald-50/40 p-2.5 text-emerald-900 transition-colors hover:bg-emerald-100/50"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <Printer className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          Order{" "}
                          <strong className="text-emerald-950">
                            #{r.print_order.order_no || r.print_order.id.slice(0, 8)}
                          </strong>
                        </div>
                        {renderOrderItemsDetail(r.print_order)}
                      </div>
                    )}

                    {r.shop_reply && (
                      <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 p-2.5 text-xs text-blue-900">
                        <div className="flex items-center justify-between font-semibold text-blue-700">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                            คำตอบรับจากร้านค้า
                          </span>
                          {r.reply_at && (
                            <span className="text-[10px] font-normal text-blue-400">
                              {formatDate(r.reply_at)}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-slate-700">{r.shop_reply}</p>
                      </div>
                    )}

                    {onReplyReview && (
                      <div className="mt-3 flex justify-end">
                        {replyingReviewId === r.id ? (
                          <div className="w-full space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <textarea
                              rows={2}
                              value={replyInputText}
                              onChange={(e) => setReplyInputText(e.target.value)}
                              placeholder="พิมพ์ข้อความตอบกลับลูกค้าที่นี่..."
                              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:border-blue-500 focus:outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingReviewId(null);
                                  setReplyInputText("");
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                              >
                                ยกเลิก
                              </button>
                              <button
                                type="button"
                                disabled={isSubmittingReply || !replyInputText.trim()}
                                onClick={() => handleSendReply(r.id)}
                                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                              >
                                <Send className="h-3 w-3" />
                                {isSubmittingReply ? "กำลังส่ง..." : "ส่งคำตอบ"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingReviewId(r.id);
                              setReplyInputText(r.shop_reply || "");
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                            {r.shop_reply ? "แก้ไขการตอบกลับ" : "ตอบกลับรีวิว"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              ยังไม่มีรีวิวในระดับดาวนี้
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleComplaints.length > 0 ? (
            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {visibleComplaints.map((c) => (
                <div
                  key={c.id}
                  className="space-y-2.5 rounded-xl border border-rose-100 bg-rose-50/20 p-4"
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
                          className="cursor-pointer text-xs font-bold text-slate-800 underline underline-offset-2 hover:text-blue-600"
                        >
                          Order #{c.print_order.order_no || c.print_order.id.slice(0, 8)}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar size={12} /> {formatDate(c.created_at)}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <User size={13} className="text-slate-500" />
                      ผู้แจ้งเรื่อง:{" "}
                      <span className="font-normal text-slate-600">
                        {c.shop?.name || c.shop?.shop_name || c.shop_name || "ไม่ระบุชื่อร้าน"}
                      </span>
                    </p>

                    <div>
                      <p className="mb-1 flex items-center gap-1.5 font-semibold text-slate-800">
                        <FileText size={13} className="text-slate-500" />
                        รายละเอียดปัญหาร้องเรียน:
                      </p>
                      <p className="whitespace-pre-line rounded-lg border border-rose-100 bg-white p-2.5 text-[11px] leading-relaxed text-slate-700">
                        {c.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                      </p>
                      <ImageThumbs raw={c.image_url} onPreview={setPreviewUrl} />
                    </div>

                    {c.print_order && (
                      <div className="rounded-lg border border-rose-100 bg-white/80 p-2.5">
                        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-rose-900">
                          <Layers size={13} className="text-rose-600" /> รายการที่สั่งซื้อ:
                        </p>
                        {renderOrderItemsDetail(c.print_order)}
                      </div>
                    )}

                    {getReportStatus(c.status)?.showDisputeNote && (
                      <p className="text-[11px] font-medium text-amber-700">
                        - หากท่านมีข้อโต้แย้งกรุณาติดต่อแอดมินภายในวันที่{" "}
                        {formatDate(getReviewDeadline(c.updated_at)!)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              ไม่มีรายการร้องเรียน
            </div>
          )}
        </div>
      )}

      {/* Modal รูปภาพเต็มจอ */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-700 hover:bg-white"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="รูปที่แนบ"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}

      {/* 🟢 Modal สำหรับรายงานรีวิว: ถ้าเคยรายงานแล้วจะสลับเป็นกล่องเตือนทันที */}
      {reportingReviewId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
          onClick={() => setReportingReviewId(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="flex items-center gap-2 text-sm font-bold text-rose-600">
                <Flag className="h-4 w-4" /> รายงานรีวิวที่ไม่เหมาะสม
              </h4>
              <button
                type="button"
                onClick={() => setReportingReviewId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {isAlreadyReported(reportingReviewId) ? (
              // 🛑 ถ้ารายงานแล้ว แสดงกล่องข้อความเตือน
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                  <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
                  <p className="text-xs font-semibold leading-relaxed">
                    คุณได้รายงานรีวิวไม่เหมาะสมนี้ไปแล้ว ไม่สามารถรายงานซ้ำได้
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setReportingReviewId(null)}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-900"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            ) : (
              /* 🟢 ถ่ายังไม่รายงาน ให้แสดงฟอร์มกรอกเหตุผลปกติ */
              <>
                <p className="mt-3 text-xs text-slate-600">
                  โปรดระบุเหตุผลในการรายงานรีวิวนี้ เพื่อให้แอดมินดำเนินการตรวจสอบ:
                </p>

                <textarea
                  rows={4}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="ระบุเหตุผล เช่น ใช้ถ้อยคำหยาบคาย, ข้อมูลเท็จ, ไม่เกี่ยวกับสินค้า..."
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-500 focus:outline-none"
                />

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportingReviewId(null)}
                    className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingReport || !reportReason.trim()}
                    onClick={handleSendReport}
                    className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isSubmittingReport ? "กำลังส่ง..." : "ส่งรายงาน"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}