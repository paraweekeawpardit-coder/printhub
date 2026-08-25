"use client";

import { Pencil, Landmark } from "lucide-react";

type Props = {
  bankName: string;
  setBankName: (v: string) => void;
  accountName: string;
  setAccountName: (v: string) => void;
  accountNumber: string;
  setAccountNumber: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  hasData: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
};

export default function ShopBankTab({
  bankName,
  setBankName,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  onSave,
  saving,
  hasData,
  isEditing,
  onToggleEdit,
}: Props) {
  if (hasData && !isEditing) {
    return (
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2F6FED]">
              <Landmark size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F2942]">{bankName || "-"}</p>
              <p className="text-xs text-slate-400">{accountName || "-"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleEdit}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#0F2942] hover:border-[#0F2942] transition-colors"
          >
            <Pencil size={14} /> แก้ไขข้อมูล
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400">เลขที่บัญชี</p>
          <p className="mt-1 text-sm text-[#0F2942] tabular-nums">{accountNumber || "-"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs text-slate-400">
        ข้อมูลบัญชีนี้จะถูกใช้เป็นช่องทางหลักสำหรับการโอนเงินรายได้จากคำสั่งพิมพ์เข้าสู่ร้านค้าของคุณ
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">ธนาคาร</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="เช่น ธนาคารกสิกรไทย"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">ชื่อบัญชี</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">เลขที่บัญชี</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="xxx-x-xxxxx-x"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] tabular-nums outline-none focus:border-[#2F6FED]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {hasData && (
          <button
            type="button"
            onClick={onToggleEdit}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 hover:border-slate-300 transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#16385c] transition-colors disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกบัญชีธนาคาร"}
        </button>
      </div>
    </div>
  );
}