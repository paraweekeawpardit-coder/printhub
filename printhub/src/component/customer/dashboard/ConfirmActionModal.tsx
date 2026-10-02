/**
 * Component: ConfirmActionModal
 * หน้าที่: Pop-up Modal ยืนยันการทำรายการแบบมีเงื่อนไข (Action Confirmation) 
 * รองรับทั้งการ 'ยืนยันยกเลิกคำสั่งซื้อ' (สีแดง) และ 'ยืนยันการรับงานพิมพ์' (สีเขียว)
 */

"use client";

import React from "react";
import { Ban, CheckCircle2 } from "lucide-react";

interface ConfirmActionModalProps {
  isOpen: boolean;
  type: "cancel" | "received";
  orderNo: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmActionModal({
  isOpen,
  type,
  orderNo,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 text-center">
        <div
          className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${
            type === "cancel" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {type === "cancel" ? <Ban size={24} /> : <CheckCircle2 size={24} />}
        </div>

        <div>
          <h3 className="font-extrabold text-base text-slate-900">
            {type === "cancel" ? "ยืนยันการยกเลิกคำสั่งซื้อ?" : "ยืนยันการรับงานพิมพ์?"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {type === "cancel"
              ? `คุณต้องการยกเลิกคำสั่งซื้อ ${orderNo} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`
              : `คุณได้รับเอกสารงานพิมพ์ ${orderNo} และตรวจสอบความเรียบร้อยแล้วใช่หรือไม่?`}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition cursor-pointer flex-1"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex-1 ${
              type === "cancel" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}