"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Image as ImageIcon, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";

export interface ReportItem {
  id: string;
  customer_id?: string;
  customer_name?: string;
  shop_id?: string;
  shop_name?: string;
  order_id?: string;
  order_no?: string;
  order_id_display?: string;
  description?: string;
  image_url?: string | null;
  status?: string;
  issue_type?: string;
  review_id?: string;
  review_comment?: string;
  comment?: string;
  review_text?: string;
  created_at?: string;
  updated_at?: string;
}

interface ReportTableProps {
  reports?: ReportItem[];
  loading?: boolean;
  category?: "refund" | "review";
  onSelectReport: (report: ReportItem) => void;
  onAcceptReport: (id: string) => void;
  onOpenImage: (report: ReportItem) => void;
}

export default function ReportTable({
  reports = [],
  loading = false,
  category = "refund",
  onSelectReport,
  onAcceptReport,
  onOpenImage,
}: ReportTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State ระบบ Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const safeReports = Array.isArray(reports) ? reports : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [safeReports.length]);

  const totalItems = safeReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return safeReports.slice(startIndex, startIndex + itemsPerPage);
  }, [safeReports, currentPage, itemsPerPage]);

  // 🟢 ระบบ Smooth Wheel Scroll โดยใช้ requestAnimationFrame เกลี่ยน้ำหนัก
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let targetScrollLeft = el.scrollLeft;
    let currentScrollLeft = el.scrollLeft;
    let animationFrameId: number | null = null;

    const smoothScrollLoop = () => {
      const diff = targetScrollLeft - currentScrollLeft;
      if (Math.abs(diff) > 0.5) {
        currentScrollLeft += diff * 0.12;
        el.scrollLeft = currentScrollLeft;
        animationFrameId = requestAnimationFrame(smoothScrollLoop);
      } else {
        el.scrollLeft = targetScrollLeft;
        currentScrollLeft = targetScrollLeft;
        animationFrameId = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const canScroll = el.scrollWidth > el.clientWidth;
      if (!canScroll) return;

      if (e.deltaY !== 0) {
        const isAtLeft = el.scrollLeft <= 0 && e.deltaY < 0;
        const isAtRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;

        if (!isAtLeft && !isAtRight) {
          e.preventDefault();

          targetScrollLeft = Math.max(
            0,
            Math.min(el.scrollWidth - el.clientWidth, targetScrollLeft + e.deltaY * 1.2)
          );

          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(smoothScrollLoop);
          }
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [paginatedReports]);

  const handleScrollClick = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const parseDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    let formattedStr = dateString;
    const yearMatch = dateString.match(/^(\d{4})/);
    if (yearMatch && Number(yearMatch[1]) > 2400) {
      const adYear = Number(yearMatch[1]) - 543;
      formattedStr = dateString.replace(/^(\d{4})/, String(adYear));
    }
    if (formattedStr.includes("T") && !formattedStr.endsWith("Z") && !formattedStr.includes("+")) {
      formattedStr += "Z";
    }
    let d = new Date(formattedStr);
    if (isNaN(d.getTime())) {
      d = new Date(formattedStr.replace(" ", "T"));
    }
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (dateString?: string) => {
    const date = parseDate(dateString);
    if (!date) return "-";
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRemainingCountdown = (updatedAt?: string) => {
    const acceptedDate = parseDate(updatedAt);
    if (!acceptedDate) return null;

    const targetDeadlineMs = acceptedDate.getTime() + (48 * 60 * 60 * 1000);
    const nowMs = Date.now();
    const diffMs = targetDeadlineMs - nowMs;

    if (diffMs <= 0) {
      const overdueMs = Math.abs(diffMs);
      const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
      const overdueMinutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));

      return {
        text: `เกินกำหนด ${overdueHours} ชม. ${overdueMinutes} นาที`,
        isExpired: true,
      };
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      text: `เหลือเวลา ${hours} ชม. ${minutes} นาที`,
      isExpired: false,
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs sm:text-sm font-medium">
        กำลังโหลดข้อมูลรายการปัญหา...
      </div>
    );
  }

  if (safeReports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs sm:text-sm font-medium">
        ไม่พบข้อมูลรายงานตามเงื่อนไข
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans w-full max-w-full overflow-hidden">
      {/* 📱 Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {paginatedReports.map((item) => {
          const isReviewReport = item.issue_type === "รายงานรีวิวที่ไม่เหมาะสม" || Boolean(item.review_id);
          const displayOrderNo = isReviewReport
            ? "รายงานรีวิว"
            : item.order_no ||
              item.order_id_display ||
              (item.order_id ? `#${item.order_id.slice(0, 8)}` : "-");

          const displayReviewText = item.review_comment || item.comment || item.review_text;

          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-xs">
                  {displayOrderNo}
                </span>

                <div>
                  {item.status === "cancelled" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      ลูกค้ายกเลิกแล้ว
                    </span>
                  ) : item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {isReviewReport ? "จัดการเรียบร้อย" : "อนุมัติคืนเงิน"}
                    </span>
                  ) : item.status === "rejected" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      ปฏิเสธคำร้อง
                    </span>
                  ) : item.status === "investigating" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      กำลังตรวจสอบ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      รอดำเนินการ
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">ลูกค้า</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {item.customer_name || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ร้านค้า</span>
                  <span className="font-medium text-slate-700 truncate block">
                    {item.shop_name || "-"}
                  </span>
                </div>
              </div>

              {isReviewReport && (
                <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                  <span className="text-amber-800 text-[10px] font-bold block mb-0.5">
                    ข้อความรีวิวของลูกค้า
                  </span>
                  <p className="text-slate-700 italic text-[11px] line-clamp-2">
                    "{displayReviewText || "ไม่มีข้อความรีวิว (ให้เฉพาะดาว)"}"
                  </p>
                </div>
              )}

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block mb-0.5">
                  {category === "review" ? "เหตุผลการรายงาน" : "รายละเอียดปัญหา"}
                </span>
                <p className="text-slate-800 font-medium leading-relaxed line-clamp-3">
                  {item.description || "-"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                {item.image_url ? (
                  <button
                    onClick={() => onOpenImage(item)}
                    className="inline-flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-[11px] cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    ดูรูปถ่าย
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">ไม่มีรูปแนบ</span>
                )}

                <div className="flex items-center gap-1.5">
                  {item.status === "pending" && (
                    <button
                      onClick={() => onAcceptReport(item.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer"
                    >
                      รับเรื่อง
                    </button>
                  )}

                  <button
                    onClick={() => onSelectReport(item)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer ${
                      item.status === "cancelled"
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {item.status === "cancelled"
                      ? "ดูรายละเอียด"
                      : item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" || item.status === "rejected"
                      ? "ดูคำตัดสิน"
                      : "รายละเอียด"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 💻 Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs w-full max-w-full overflow-hidden">
        {/* แถบคำแนะนำ + ปุ่มเลื่อนตาราง */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 text-xs text-slate-600">
          <span className="font-medium flex items-center gap-1.5">
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScrollClick("left")}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="เลื่อนซ้าย"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleScrollClick("right")}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="เลื่อนขวา"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 🟢 Container ตารางพร้อม Smooth Wheel Animation */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto w-full rounded-b-2xl scrollbar-thin scrollbar-thumb-slate-300"
        >
          <table className="w-[1300px] min-w-[1300px] text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4 whitespace-nowrap w-[150px]">สถานะ</th>
                <th className="py-4 px-4 whitespace-nowrap w-[240px]">
                  {category === "review" ? "ข้อความรีวิว / ผู้เกี่ยวข้อง" : "ข้อมูลออเดอร์ / ผู้เกี่ยวข้อง"}
                </th>
                <th className="py-4 px-4 whitespace-nowrap w-[340px]">
                  {category === "review" ? "เหตุผลที่แจ้งรายงาน" : "รายละเอียดปัญหา"}
                </th>
                <th className="py-4 px-4 whitespace-nowrap w-[120px]">หลักฐาน</th>
                <th className="py-4 px-4 whitespace-nowrap w-[160px]">วันที่ยื่นเรื่อง</th>
                <th className="py-4 px-4 whitespace-nowrap w-[160px]">วันที่รับเรื่อง</th>
                <th className="py-4 px-4 text-center whitespace-nowrap w-[180px]">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedReports.map((item) => {
                const isReviewReport = item.issue_type === "รายงานรีวิวที่ไม่เหมาะสม" || Boolean(item.review_id);

                const displayOrderNo = isReviewReport
                  ? "รายงานรีวิว"
                  : item.order_no ||
                    item.order_id_display ||
                    (item.order_id ? `#${item.order_id.slice(0, 8)}` : "-");

                const displayReviewText = item.review_comment || item.comment || item.review_text;
                const isAccepted = item.status !== "pending" && item.status !== "cancelled" && Boolean(item.updated_at);
                const countdown = isAccepted ? getRemainingCountdown(item.updated_at) : null;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.status === "cancelled" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          ลูกค้ายกเลิกแล้ว
                        </span>
                      ) : item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {isReviewReport ? "จัดการเรียบร้อย" : "อนุมัติคืนเงิน"}
                        </span>
                      ) : item.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          ปฏิเสธคำร้อง
                        </span>
                      ) : item.status === "investigating" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          กำลังตรวจสอบ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          รอดำเนินการ
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-xs mb-1">
                        {displayOrderNo}
                      </div>

                      {isReviewReport && (
                        <div className="text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200/60 text-xs italic font-medium mb-1.5 truncate max-w-[220px]" title={displayReviewText}>
                          "{displayReviewText || "ไม่มีข้อความรีวิว"}"
                        </div>
                      )}

                      <div className="space-y-0.5 text-xs">
                        <div className="text-slate-700 font-medium flex items-center gap-1">
                          <span className="text-slate-400 text-[11px]">ลูกค้า:</span>
                          <span className="truncate">{item.customer_name || "-"}</span>
                        </div>
                        <div className="text-slate-500 flex items-center gap-1">
                          <span className="text-slate-400 text-[11px]">ร้านค้า:</span>
                          <span className="truncate">{item.shop_name || "-"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-800 truncate text-xs" title={item.description}>
                        {item.description || "-"}
                      </p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.image_url ? (
                        <button
                          onClick={() => onOpenImage(item)}
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          ดูรูปถ่าย
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">ไม่มีรูปแนบ</span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                      <div>{formatDate(item.created_at)}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                      {isAccepted ? (
                        <div>
                          <div>{formatDate(item.updated_at)}</div>
                          {item.status === "investigating" && countdown && (
                            <div
                              className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                                countdown.isExpired ? "text-rose-600 font-bold" : "text-amber-600"
                              }`}
                            >
                              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{countdown.text}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal italic">ยังไม่รับเรื่อง</span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === "pending" && (
                          <button
                            onClick={() => onAcceptReport(item.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer"
                          >
                            รับเรื่องพิจารณา
                          </button>
                        )}

                        <button
                          onClick={() => onSelectReport(item)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer ${
                            item.status === "cancelled"
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {item.status === "cancelled"
                            ? "ดูรายละเอียด"
                            : item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" || item.status === "rejected"
                            ? "ดูคำตัดสิน"
                            : "รายละเอียด"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PaginationBar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={15} />
            <span>ย้อนกลับ</span>
          </button>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  currentPage === page
                    ? "bg-sky-600 text-white shadow-2xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>ถัดไป</span>
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}