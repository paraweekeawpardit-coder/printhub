"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
  issue_type?: string;   // รองรับประเภทรายงาน
  review_id?: string;    // รองรับไอดีรีวิว
  review_comment?: string; // ข้อความในรีวิว (ถ้ามีส่งมา)
  created_at?: string;
  updated_at?: string;
}

interface ReportTableProps {
  reports: ReportItem[];
  loading: boolean;
  category?: "refund" | "review";
  onSelectReport: (report: ReportItem) => void;
  onAcceptReport: (id: string) => void;
  onOpenImage: (report: ReportItem) => void;
}

export default function ReportTable({
  reports,
  loading,
  category = "refund",
  onSelectReport,
  onAcceptReport,
  onOpenImage,
}: ReportTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State สำหรับคลิกลากเมาส์เลื่อน (Drag to Scroll)
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // State ระบบ Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // แสดงผลหน้าละ 10 รายการ

  // รีเซ็ตหน้ากลับไปหน้า 1 เมื่อข้อมูลรายงานเปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [reports.length]);

  const totalItems = reports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // ตัดแบ่งข้อมูลเฉพาะของหน้าปัจจุบัน
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return reports.slice(startIndex, startIndex + itemsPerPage);
  }, [reports, currentPage, itemsPerPage]);

  // 🟢 เพิ่มระบบ Smooth Wheel Scroll ด้วย requestAnimationFrame เพื่อความลื่นไหลระดับสูง
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number | null = null;
    let targetScrollLeft = container.scrollLeft;

    const smoothScrollStep = () => {
      if (!container) return;
      // คำนวณความต่างเพื่อทำต้านทานความเร็ว (Ease Out Interpolation)
      const diff = targetScrollLeft - container.scrollLeft;
      if (Math.abs(diff) > 0.5) {
        container.scrollLeft += diff * 0.15; // ปรับค่า 0.15 เพื่อเพิ่ม/ลดความนุ่มนวล
        animationFrameId = requestAnimationFrame(smoothScrollStep);
      } else {
        container.scrollLeft = targetScrollLeft;
        animationFrameId = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // ตรวจสอบว่าตารางสามารถเลื่อนซ้าย-ขวาได้ไหม
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();

        // ปรับทิศทางและความเร็วตามการหมุนลูกกลิ้ง
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        
        // กำหนดขอบเขตไม่ให้ Scroll เกินความกว้างจริง
        const maxScroll = container.scrollWidth - container.clientWidth;
        targetScrollLeft = Math.min(Math.max(0, targetScrollLeft + delta * 1.8), maxScroll);

        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(smoothScrollStep);
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ฟังก์ชันสำหรับการคลิกลากเมาส์เพื่อเลื่อนตาราง (Mouse Drag Scroll)
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsMouseDown(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.8;
    container.scrollLeft = scrollLeft - walk;
  };

  // พาร์สวันเวลา
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

  // คำนวณเวลานับถอยหลัง 48 ชม.
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

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs sm:text-sm font-medium">
        ไม่พบข้อมูลรายงานตามเงื่อนไข
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* 📱 Mobile Card View (สำหรับจอมือถือ) */}
      <div className="block md:hidden space-y-3">
        {paginatedReports.map((item) => {
          const isReviewReport = item.issue_type === "รายงานรีวิวที่ไม่เหมาะสม" || Boolean(item.review_id);
          const displayOrderNo = isReviewReport
            ? "รายงานรีวิว"
            : item.order_no ||
              item.order_id_display ||
              (item.order_id ? `#${item.order_id.slice(0, 8)}` : "-");

          const isAccepted = item.status !== "pending" && Boolean(item.updated_at);
          const countdown = isAccepted ? getRemainingCountdown(item.updated_at) : null;

          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 text-xs"
            >
              {/* Header: Order ID / Category & Status */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-xs">
                  {displayOrderNo}
                </span>

                <div>
                  {item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" ? (
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

              {/* Customer & Shop */}
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

              {/* Description Box */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] block mb-0.5">
                  {category === "review" ? "เหตุผลการรายงาน" : "รายละเอียดปัญหา"}
                </span>
                <p className="text-slate-800 font-medium leading-relaxed line-clamp-3">
                  {item.description || "-"}
                </p>
              </div>

              {/* Dates & SLA Countdown */}
              <div className="flex flex-col gap-1 text-[11px] text-slate-500 pt-0.5">
                <div className="flex justify-between items-center">
                  <span>ยื่นเรื่องเมื่อ:</span>
                  <span className="font-medium text-slate-700">{formatDate(item.created_at)}</span>
                </div>
                {isAccepted && (
                  <div className="flex justify-between items-center">
                    <span>รับเรื่องเมื่อ:</span>
                    <span className="font-medium text-slate-700">{formatDate(item.updated_at)}</span>
                  </div>
                )}
                {item.status === "investigating" && countdown && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="font-semibold text-slate-600">กำหนดเวลาพิจารณา:</span>
                    <span
                      className={`font-bold ${
                        countdown.isExpired ? "text-rose-600" : "text-amber-600"
                      }`}
                    >
                      {countdown.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions & Image Link */}
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
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  >
                    {item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" || item.status === "rejected"
                      ? "ดูคำตัดสิน"
                      : "รายละเอียด"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 💻 Desktop Table View (สำหรับจอใหญ่) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`overflow-x-auto w-full select-none ${
            isMouseDown ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* 🟢 กำหนดความกว้าง min-w-[1500px] เพื่อสร้างพื้นที่ให้ Scroll แนวนอนได้อย่างสมบูรณ์ */}
          <table className="w-full min-w-[1500px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4 whitespace-nowrap min-w-[160px]">สถานะ</th>
                <th className="py-4 px-4 whitespace-nowrap min-w-[220px]">
                  {category === "review" ? "ข้อความรีวิว / ผู้เกี่ยวข้อง" : "ข้อมูลออเดอร์ / ผู้เกี่ยวข้อง"}
                </th>
                <th className="py-4 px-4 whitespace-nowrap min-w-[320px]">
                  {category === "review" ? "เหตุผลที่แจ้งรายงาน" : "รายละเอียดปัญหา"}
                </th>
                <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">หลักฐาน</th>
                <th className="py-4 px-4 whitespace-nowrap min-w-[180px]">วันที่ยื่นเรื่อง</th>
                <th className="py-4 px-4 whitespace-nowrap min-w-[180px]">วันที่รับเรื่อง</th>
                <th className="py-4 px-4 text-center whitespace-nowrap min-w-[200px]">การจัดการ</th>
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

                const isAccepted = item.status !== "pending" && Boolean(item.updated_at);
                const countdown = isAccepted ? getRemainingCountdown(item.updated_at) : null;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* สถานะ */}
                    <td className="py-4 px-4 whitespace-nowrap min-w-[160px]">
                      {item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" ? (
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

                    {/* ข้อมูลออเดอร์ / ข้อความรีวิว และผู้เกี่ยวข้อง */}
                    <td className="py-4 px-4 whitespace-nowrap min-w-[220px]">
                      <div className="font-bold text-slate-900 text-xs mb-1">
                        {displayOrderNo}
                      </div>
                      <div className="space-y-0.5 text-xs">
                        <div className="text-slate-700 font-medium flex items-center gap-1">
                          <span className="text-slate-400 text-[11px]">ลูกค้า:</span>
                          <span>{item.customer_name || "-"}</span>
                        </div>
                        <div className="text-slate-500 flex items-center gap-1">
                          <span className="text-slate-400 text-[11px]">ร้านค้า:</span>
                          <span>{item.shop_name || "-"}</span>
                        </div>
                      </div>
                    </td>

                    {/* รายละเอียดปัญหา / เหตุผลรายงาน */}
                    <td className="py-4 px-4 min-w-[320px] max-w-xs">
                      <p className="font-medium text-slate-800 truncate text-xs" title={item.description}>
                        {item.description || "-"}
                      </p>
                    </td>

                    {/* หลักฐาน */}
                    <td className="py-4 px-4 whitespace-nowrap min-w-[140px]">
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

                    {/* วันที่ยื่นเรื่อง */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 min-w-[180px]">
                      <div>{formatDate(item.created_at)}</div>
                    </td>

                    {/* วันที่รับเรื่อง / นับถอยหลัง 48 ชม. */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 min-w-[180px]">
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

                    {/* การจัดการ */}
                    <td className="py-4 px-4 whitespace-nowrap text-center min-w-[200px]">
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
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                          {item.status === "resolved_refund" || item.status === "resolved_payout" || item.status === "resolved" || item.status === "rejected"
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

      {/* 🟢 แสดงปุ่ม PaginationBar เมื่อรายการมีมากกว่า 1 หน้า */}
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