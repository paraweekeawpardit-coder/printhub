"use client";

export interface ReportImageModalItem {
  id: string;
  order_id?: string;
  order_no?: string;
  description?: string;
  image_url?: string | null;
}

interface ReportImageModalProps {
  report: ReportImageModalItem | null;
  onClose: () => void;
}

export default function ReportImageModal({
  report,
  onClose,
}: ReportImageModalProps) {
  if (!report || !report.image_url) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="font-bold text-slate-900 text-base">
              หลักฐานรูปถ่าย
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-mono">
            Order ID: {report.order_no || report.order_id || "-"}
          </p>
          {report.description && (
            <p className="text-xs font-medium text-slate-800 line-clamp-2">
              {report.description}
            </p>
          )}
        </div>

        {/* Image Frame */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[60vh]">
          <img
            src={report.image_url}
            alt="หลักฐานปัญหา"
            className="w-full max-h-[55vh] object-contain"
          />
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center">
          <a
            href={report.image_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            เปิดรูปถ่ายในแท็บใหม่
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-xl font-bold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}