"use client";

interface ReportItem {
  id: string;
  order_id: string;
  description: string;
  image_url: string | null;
}

interface ReportImageModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export default function ReportImageModal({ report, onClose }: ReportImageModalProps) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-slate-900">หลักฐานรูปถ่าย</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-mono">
            Order ID: {report.order_id}
          </p>
          <p className="text-sm font-medium text-slate-800">
            {report.description}
          </p>
        </div>

        {report.image_url && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={report.image_url}
              alt="หลักฐาน"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-xl font-medium transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}