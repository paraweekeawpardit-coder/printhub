"use client";

import React from "react";
import { Receipt, XCircle, AlertTriangle, ShieldCheck, Eye, Loader2, X } from "lucide-react";

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

interface WarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewSlip: () => void;
  slipUrl: string | null;
  slipVerdict: boolean | null;
}

export function WarnModal({ isOpen, onClose, onViewSlip, slipUrl, slipVerdict }: WarnModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-amber-600" size={22} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">ยังไม่สามารถดำเนินการได้</h3>
        <p className="text-sm text-gray-500 mb-6">
          {slipVerdict === false
            ? "สลิปถูกทำเครื่องหมายว่าไม่ถูกต้อง ระบบจะเปลี่ยนสถานะเป็น 'รอการชำระเงิน' เพื่อรอสลิปใหม่"
            : "คุณยังไม่ได้ตรวจสอบสลิปโอนเงิน กรุณาเปิดดูสลิปและเลือกผลการตรวจสอบก่อน"}
        </p>
        {slipVerdict === false ? (
          <button type="button" onClick={onClose} className="w-full py-2.5 rounded-xl bg-[#12356b] text-white text-sm font-medium">
            รับทราบ
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" onClick={onClose} className="py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium">
              ปิด
            </button>
            <button type="button" onClick={() => { onClose(); onViewSlip(); }} disabled={!slipUrl} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#12356b] text-white text-sm font-medium disabled:opacity-50">
              <Eye size={15} /> ดูสลิป
            </button>
          </div>
        )}
      </div>
    </div>
  );
}