"use client";

export interface ReportItem {
  id: string;
  customer_id: string;
  shop_id: string;
  admin_id: string | null;
  order_id: string;
  description: string;
  image_url: string | null;
  is_verified: boolean;
  created_at: string;
}

interface ReportTableProps {
  reports: ReportItem[];
  loading: boolean;
  onSelectReport: (report: ReportItem) => void;
  onToggleVerify: (id: string, currentStatus: boolean) => void;
}

export default function ReportTable({
  reports,
  loading,
  onSelectReport,
  onToggleVerify,
}: ReportTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-4">สถานะ</th>
              <th className="py-4 px-4">Order ID / Ticket ID</th>
              <th className="py-4 px-4">รายละเอียดปัญหา</th>
              <th className="py-4 px-4">หลักฐาน</th>
              <th className="py-4 px-4">วันที่แจ้งเรื่อง</th>
              <th className="py-4 px-4 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">
                    {item.is_verified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-mono font-medium text-slate-900">
                      {item.order_id ? `${item.order_id.substring(0, 13)}...` : "-"}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      ID: {item.id ? item.id.substring(0, 8) : "-"}
                    </div>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <p className="font-medium text-slate-800 truncate" title={item.description}>
                      {item.description}
                    </p>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {item.image_url ? (
                      <button
                        onClick={() => onSelectReport(item)}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ดูรูปถ่าย
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">ไม่มีรูปแนบ</span>
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(item.created_at)}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onToggleVerify(item.id, item.is_verified)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm ${
                        item.is_verified
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                      }`}
                    >
                      {item.is_verified ? "ยกเลิกยืนยัน" : "ยืนยันตรวจสอบ"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
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