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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <h3 className="text-md font-bold text-slate-900">
          หลักฐานการโอนเงินคืน
        </h3>

        {/* 🟢 แสดงรูปภาพพร้อม Overlay ปุ่มเปิดดูรูปขนาดเต็ม */}
        <div className="border rounded-xl p-1 bg-slate-50 max-h-[60vh] overflow-hidden">
          {imageUrl ? (
            <div className="relative group w-full rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Refund Slip"
                className="w-full h-auto max-h-[55vh] rounded-lg object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
              />
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1.5 cursor-pointer"
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

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 cursor-pointer transition-colors"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
}