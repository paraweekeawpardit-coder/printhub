"use client";

import { useState } from "react";
import { Pencil, Landmark, User, Hash, Check, Copy, Loader2 } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!accountNumber) return;
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable, ignore */
    }
  };

  // ---------- View mode ----------
  if (hasData && !isEditing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2F6FED] ring-1 ring-[#2F6FED]/15">
              <Landmark size={20} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#0F2942]">
                {bankName || "-"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {accountName || "-"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleEdit}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#0F2942] transition-colors hover:border-[#0F2942] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FED]/40"
          >
            <Pencil size={14} /> แก้ไขข้อมูล
          </button>
        </div>

        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs font-semibold text-slate-400">เลขที่บัญชี</p>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="text-base font-semibold tabular-nums tracking-wide text-[#0F2942]">
              {accountNumber || "-"}
            </p>
            {accountNumber && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#2F6FED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FED]/40"
              >
                {copied ? (
                  <>
                    <Check size={13} /> คัดลอกแล้ว
                  </>
                ) : (
                  <>
                    <Copy size={13} /> คัดลอก
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Edit / empty mode ----------
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-5 p-6">
        <p className="text-xs leading-relaxed text-slate-400">
          ข้อมูลบัญชีนี้จะถูกใช้เป็นช่องทางหลักสำหรับการโอนเงินรายได้จากคำสั่งพิมพ์เข้าสู่ร้านค้าของคุณ
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              ธนาคาร
            </label>
            <div className="relative mt-1.5">
              <Landmark
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
              />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="เช่น ธนาคารกสิกรไทย"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              ชื่อบัญชี
            </label>
            <div className="relative mt-1.5">
              <User
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
              />
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-600">
              เลขที่บัญชี
            </label>
            <div className="relative mt-1.5">
              <Hash
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
              />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="xxx-x-xxxxx-x"
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3.5 text-sm tabular-nums text-[#0F2942] outline-none transition-colors placeholder:text-slate-300 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/15"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
        {hasData && (
          <button
            type="button"
            onClick={onToggleEdit}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            ยกเลิก
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16385c] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FED]/40"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? "กำลังบันทึก..." : "บันทึกบัญชีธนาคาร"}
        </button>
      </div>
    </div>
  );
}