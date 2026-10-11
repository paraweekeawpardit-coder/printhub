"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface CartScheduleFormProps {
  todayStr: string;
  shopOpen: string;
  shopClose: string;
  isOpenOvernight: boolean;
  appointmentDate: string;
  appointmentTime: string;
  orderNote: string;
  timeError: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNoteChange: (note: string) => void;
}

export default function CartScheduleForm({
  todayStr,
  shopOpen,
  shopClose,
  isOpenOvernight,
  appointmentDate,
  appointmentTime,
  orderNote,
  timeError,
  onDateChange,
  onTimeChange,
  onNoteChange,
}: CartScheduleFormProps) {
  return (
    <div className="space-y-3 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 block">
          นัดหมายวันและเวลารับเอกสาร
        </span>
        <span className="text-[11px] text-slate-500">
          เวลาเปิด: {shopOpen} - {shopClose} น.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">
            วันที่รับ
          </label>
          <input
            type="date"
            min={todayStr}
            value={appointmentDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 bg-white"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-400 block mb-1">
            เวลารับ <span className="text-blue-600">(ล่วงหน้าอย่างน้อย 30 นาที)</span>
          </label>
          <input
            type="time"
            max={isOpenOvernight ? undefined : shopClose}
            value={appointmentTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 bg-white"
          />
        </div>
      </div>

      {timeError && (
        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 bg-rose-50 p-2 rounded-lg border border-rose-100">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {timeError}
        </p>
      )}

      <div>
        <label className="text-[11px] text-slate-400 block mb-1">
          หมายเหตุเพิ่มเติมถึงร้าน (ไม่บังคับ)
        </label>
        <input
          type="text"
          placeholder="เช่น ต้องการรับด่วนก่อนเที่ยง"
          value={orderNote}
          onChange={(e) => onNoteChange(e.target.value)}
          className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 bg-white"
        />
      </div>
    </div>
  );
}