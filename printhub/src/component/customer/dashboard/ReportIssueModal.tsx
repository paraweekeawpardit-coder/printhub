/**
 * Component: ReportIssueModal
 * หน้าที่: หน้าต่าง Pop-up ฟอร์มสำหรับลูกค้าใช้ยื่นเรื่องขอคืนเงิน หรือรายงานปัญหาของคำสั่งซื้อ (FR-8)
 * มีช่องกรอกรายละเอียดปัญหา และช่องสำหรับแนบลิงก์รูปภาพหลักฐาน
 */

"use client";

import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ReportIssueModalProps {
  isOpen: boolean;
  description: string;
  imageUrl: string;
  isSubmitting: boolean;
  onDescriptionChange: (val: string) => void;
  onImageUrlChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ReportIssueModal({
  isOpen,
  description,
  imageUrl,
  isSubmitting,
  onDescriptionChange,
  onImageUrlChange,
  onClose,
  onSubmit,
}: ReportIssueModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>แจ้งขอคืนเงิน / ร้องเรียนปัญหา</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              ระบุรายละเอียดปัญหาที่พบ
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="เช่น งานพิมพ์สีเพี้ยน ปริมาณหน้าไม่ครบถ้วน หรือร้านค้าพิมพ์ผิดสเปก..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              แนบลิงก์รูปภาพหลักฐาน (ถ้ามี)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>ส่งข้อร้องเรียน</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}