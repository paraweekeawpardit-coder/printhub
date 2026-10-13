"use client";

import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

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
  created_at?: string;
  updated_at?: string;
}

interface ReportTableProps {
  reports: ReportItem[];
  loading: boolean;
  onSelectReport: (report: ReportItem) => void;
  onAcceptReport: (id: string) => void;
  onOpenImage: (report: ReportItem) => void;
}

export default function ReportTable({
  reports,
  loading,
  onSelectReport,
  onAcceptReport,
  onOpenImage,
}: ReportTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 🟢 ฟังก์ชันคำนวณการเลื่อนแนวนอนแบบ Smooth และลื่นไหล
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;

    // ถ้าตารางกว้างจนสามารถเลื่อนแนวนอนได้
    if (maxScrollLeft > 0) {
      // ตรวจสอบว่าตารางยังไม่ชนขอบซ้ายสุดหรือขวาสุด
      const isScrollable =
        (e.deltaY > 0 && scrollLeft < maxScrollLeft) ||
        (e.deltaY < 0 && scrollLeft > 0);

      if (isScrollable) {
        // ป้องกันไม่ให้หน้าต่างหลักเลื่อนขึ้น-ลงขณะหมุนเมาส์บนตาราง
        e.preventDefault();

        // ปรับความเร็วและใช้ scrollTo แบบ behavior: "smooth" เพื่อความนุ่มนวล
        const scrollAmount = e.deltaY * 1.5;
        container.scrollTo({
          left: container.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  // พาร์สวันเวลา รองรับทั้ง ค.ศ. และ พ.ศ. ป้องกันปีเพี้ยน
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
      <div 
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="overflow-x-auto scroll-smooth"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-4 whitespace-nowrap">สถานะ</th>
              <th className="py-4 px-4 whitespace-nowrap">ข้อมูลออเดอร์และผู้เกี่ยวข้อง</th>
              <th className="py-4 px-4 whitespace-nowrap">รายละเอียดปัญหา</th>
              <th className="py-4 px-4 whitespace-nowrap">หลักฐาน</th>
              <th className="py-4 px-4 whitespace-nowrap">วันที่ยื่นเรื่อง</th>
              <th className="py-4 px-4 whitespace-nowrap">วันที่รับเรื่อง</th>
              <th className="py-4 px-4 text-center whitespace-nowrap">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((item) => {
                const displayOrderNo =
                  item.order_no ||
                  item.order_id_display ||
                  (item.order_id ? `#${item.order_id.slice(0, 8)}` : "-");

                const isAccepted = item.status !== "pending" && Boolean(item.updated_at);
                const countdown = isAccepted ? getRemainingCountdown(item.updated_at) : null;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* สถานะ */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.status === "resolved_refund" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          อนุมัติคืนเงิน
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
                          Pending (รอดำเนินการ)
                        </span>
                      )}
                    </td>

                    {/* ข้อมูลออเดอร์และผู้เกี่ยวข้อง */}
                    <td className="py-4 px-4 whitespace-nowrap">
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

                    {/* รายละเอียดปัญหา */}
                    <td className="py-4 px-4 min-w-[220px] max-w-xs">
                      <p className="font-medium text-slate-800 truncate text-xs" title={item.description}>
                        {item.description || "-"}
                      </p>
                    </td>

                    {/* หลักฐาน */}
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

                    {/* วันที่ยื่นเรื่อง */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                      <div>{formatDate(item.created_at)}</div>
                    </td>

                    {/* วันที่รับเรื่อง / นับถอยหลัง 48 ชม. */}
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

                    {/* การจัดการ */}
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
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          {item.status === "resolved_refund" || item.status === "rejected"
                            ? "ดูคำตัดสิน"
                            : "รายละเอียด"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  ไม่พบข้อมูลรายงานตามเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}