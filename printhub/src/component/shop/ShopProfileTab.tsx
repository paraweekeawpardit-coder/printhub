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
      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 p-6">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-blue-500 ring-1 ring-gray-100">
              <Landmark size={19} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {bankName || "-"}
              </p>
              <p className="truncate text-xs text-gray-400">
                {accountName || "-"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleEdit}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
          >
            <Pencil size={13} /> แก้ไขข้อมูล
          </button>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            เลขที่บัญชี
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="text-base font-semibold tabular-nums tracking-wide text-gray-900">
              {accountNumber || "-"}
            </p>
            {accountNumber && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-50 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
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
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="space-y-5 p-6">
        <p className="text-xs leading-relaxed text-gray-400">
          ข้อมูลบัญชีนี้จะถูกใช้เป็นช่องทางหลักสำหรับการโอนเงินรายได้จากคำสั่งพิมพ์เข้าสู่ร้านค้าของคุณ
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-gray-500">
              ธนาคาร
            </label>
            <div className="relative mt-1.5">
              <Landmark
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="เช่น ธนาคารกสิกรไทย"
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">
              ชื่อบัญชี
            </label>
            <div className="relative mt-1.5">
              <User
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-500">
              เลขที่บัญชี
            </label>
            <div className="relative mt-1.5">
              <Hash
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="xxx-x-xxxxx-x"
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3.5 text-sm tabular-nums text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/15"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
        {hasData && (
          <button
            type="button"
            onClick={onToggleEdit}
            disabled={saving}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            ยกเลิก
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? "กำลังบันทึก..." : "บันทึกบัญชีธนาคาร"}
        </button>
      </div>
    </div>
  );
}