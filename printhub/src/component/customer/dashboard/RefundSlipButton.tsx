/**
 * Component: RefundSlipButton
 * Path: src/component/customer/dashboard/RefundSlipButton.tsx
 * หน้าที่: ปุ่ม "ดูสลิปคืนเงิน" กดแล้วเปิดรูปสลิปที่แอดมินโอนคืน (report.refund_slip_url) เป็นหน้าต่างซ้อน
 */

"use client";

import React, { useEffect, useState } from "react";
import { Receipt, X, ExternalLink } from "lucide-react";

interface RefundSlipButtonProps {
  slipUrl?: string | null;
  size?: "sm" | "md";
}

export default function RefundSlipButton({ slipUrl, size = "md" }: RefundSlipButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!slipUrl) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl transition cursor-pointer ${
          size === "sm" ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-1.5 text-xs"
        }`}
      >
        <Receipt className="w-3.5 h-3.5" />
        ดูสลิปคืนเงิน
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                สลิปคืนเงิน
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                aria-label="ปิด"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slipUrl}
                alt="สลิปคืนเงิน"
                className="max-h-[70vh] w-auto rounded-xl border border-slate-200 bg-white object-contain"
              />
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
              <a
                href={slipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                เปิดในแท็บใหม่
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
