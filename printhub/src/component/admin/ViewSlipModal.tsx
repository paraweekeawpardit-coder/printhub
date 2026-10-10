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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <h3 className="text-md font-bold text-slate-900">
          หลักฐานการโอนเงินคืน
        </h3>
        <div className="border rounded-xl p-2 bg-slate-50 max-h-[60vh] overflow-y-auto">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Refund Slip"
              className="w-full h-auto rounded-lg object-contain mx-auto"
            />
          ) : (
            <p className="text-xs text-slate-400 py-8">ไม่พบรูปภาพสลิป</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 cursor-pointer"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
}