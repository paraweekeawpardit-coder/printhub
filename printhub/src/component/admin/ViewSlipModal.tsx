"use client";

interface ViewSlipModalProps {
  slipUrl?: string;
  viewSlipUrl?: string;
  onClose: () => void;
}

export default function ViewSlipModal({
  slipUrl,
  viewSlipUrl,
  onClose,
}: ViewSlipModalProps) {
  const imageUrl = slipUrl || viewSlipUrl || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 font-sans overflow-hidden">
      <div className="bg-white rounded-2xl max-w-sm w-full p-4 sm:p-5 shadow-2xl border border-slate-100 space-y-3.5 text-center flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            หลักฐานการโอนเงินคืน
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 🟢 แสดงรูปภาพสลิป */}
        <div className="border border-slate-200 rounded-xl p-1 bg-slate-50 overflow-hidden flex-1 flex items-center justify-center min-h-0">
          {imageUrl ? (
            <div className="relative group w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Refund Slip"
                className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] rounded-lg object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
              />
              {/* Overlay สำหรับ Desktop Hover */}
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                เปิดดูรูปขนาดเต็ม
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-8">ไม่พบรูปภาพสลิป</p>
          )}
        </div>

        {/* ลิงก์กดดูรูปเต็มสำหรับมือถือ */}
        {imageUrl && (
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="sm:hidden inline-flex items-center justify-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline pt-1 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            เปิดดูรูปขนาดเต็ม
          </a>
        )}

        {/* Footer */}
        <div className="pt-1 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer transition-colors shadow-2xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}