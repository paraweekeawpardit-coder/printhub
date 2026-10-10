"use client";

import { Loader2, AlertTriangle } from "lucide-react";

type Props = {
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ShopBankConfirmModal({
  saving,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-600/20">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F2942]">
              ยืนยันการเปลี่ยนข้อมูลบัญชีธนาคาร
            </h3>
            <p className="text-xs text-slate-400">
              การเปลี่ยนแปลงข้อมูลธุรกรรมทางการเงิน
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          คุณยืนยันที่จะเปลี่ยนข้อมูลธุรกรรมทางการเงินใช่หรือไม่ หากยืนยันคุณจะไม่สามารถแก้ไขข้อมูลอะไรได้จนกว่าจะได้รับการยืนยันจากแอดมิน
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "กำลังบันทึก..." : "ยืนยันการเปลี่ยนแปลง"}
          </button>
        </div>
      </div>
    </div>
  );
}