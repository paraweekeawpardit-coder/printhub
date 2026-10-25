"use client";

import React, { useEffect, useState } from "react";
import { Receipt, XCircle, AlertTriangle, ShieldCheck, Loader2, X } from "lucide-react";

interface SlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slipUrl: string | null;
}

export function SlipModal({ isOpen, onClose, slipUrl }: SlipModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Receipt size={18} className="text-blue-600" />
            สลิปโอนเงิน
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          {slipUrl && <img src={slipUrl} alt="สลิปโอนเงิน" className="w-full h-auto rounded-xl border border-slate-200" />}
        </div>
        <div className="p-5 border-t border-gray-100">
          <button type="button" onClick={onClose} className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium">
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  isDanger?: boolean;
  isUpdating: boolean;
}

export function ActionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  isDanger = false,
  isUpdating,
}: ActionConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !isUpdating && onClose()}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
          {isDanger ? <XCircle size={22} /> : <ShieldCheck size={22} />}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={onClose} disabled={isUpdating} className="py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUpdating}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50 ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// แจ้งเตือน: ต้องตรวจสลิปก่อนจึงจะยืนยันออเดอร์ได้
// ==========================================
interface SlipRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlipRequiredModal({ isOpen, onClose }: SlipRequiredModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-amber-50 text-amber-600">
          <AlertTriangle size={22} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">ยังไม่ได้ตรวจสอบสลิป</h3>
        <p className="text-sm text-gray-500 mb-6">
          กรุณาตรวจสอบสลิปโอนเงินว่าถูกต้องก่อน จึงจะยืนยันออเดอร์ได้
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Reject Order Modal (เลือกเหตุผล / พิมพ์เอง)
// ==========================================
export const REJECT_REASON_OTHER = "อื่นๆ";

export const REJECT_REASON_OPTIONS = [
  "วัสดุ/กระดาษหมด",
  "เครื่องพิมพ์ขัดข้อง",
  "ไฟล์งานมีปัญหา หรือเปิดไม่ได้",
  "ไม่สามารถทำงานให้เสร็จตามเวลานัดรับได้",
  "ร้านไม่สะดวกรับงานในช่วงเวลานี้",
  REJECT_REASON_OTHER,
] as const;

const REJECT_OTHER_MAX_LENGTH = 200;

interface RejectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** ส่งเหตุผลสุดท้าย (ถ้าเลือก "อื่นๆ" จะเป็นข้อความที่ร้านพิมพ์เอง) */
  onConfirm: (reason: string) => void | Promise<void>;
  isUpdating?: boolean;
  orderLabel?: string;
}

export function RejectOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isUpdating = false,
  orderLabel,
}: RejectOrderModalProps) {
  const [selected, setSelected] = useState<string>("");
  const [otherText, setOtherText] = useState<string>("");

  // รีเซ็ตฟอร์มทุกครั้งที่เปิดใหม่
  useEffect(() => {
    if (isOpen) {
      setSelected("");
      setOtherText("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isOther = selected === REJECT_REASON_OTHER;
  const finalReason = isOther ? otherText.trim() : selected;
  const canSubmit = finalReason.length > 0 && !isUpdating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        e.stopPropagation();
        if (!isUpdating) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <XCircle size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              ปฏิเสธคำสั่งพิมพ์{orderLabel ? ` ${orderLabel}` : ""}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              กรุณาระบุเหตุผลในการปฏิเสธ เพื่อแจ้งให้ลูกค้าทราบ
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {REJECT_REASON_OPTIONS.map((reason) => (
            <label
              key={reason}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                selected === reason
                  ? "border-red-300 bg-red-50 text-red-700 font-medium"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="reject-reason"
                value={reason}
                checked={selected === reason}
                onChange={() => setSelected(reason)}
                disabled={isUpdating}
                className="accent-red-600"
              />
              {reason}
            </label>
          ))}
        </div>

        {isOther && (
          <div className="mt-3">
            <textarea
              value={otherText}
              onChange={(e) =>
                setOtherText(e.target.value.slice(0, REJECT_OTHER_MAX_LENGTH))
              }
              disabled={isUpdating}
              rows={3}
              autoFocus
              placeholder="พิมพ์เหตุผลในการปฏิเสธ..."
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none"
            />
            <p className="mt-1 text-right text-[11px] text-gray-400">
              {otherText.length}/{REJECT_OTHER_MAX_LENGTH}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => canSubmit && onConfirm(finalReason)}
            disabled={!canSubmit}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : "ยืนยันการปฏิเสธ"}
          </button>
        </div>
      </div>
    </div>
  );
}