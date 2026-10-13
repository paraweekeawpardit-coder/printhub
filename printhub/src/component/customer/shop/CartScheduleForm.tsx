"use client";

import React from "react";
import { AlertCircle, CalendarDays, Clock, Store, Info } from "lucide-react";

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

const NOTE_MAX = 200;

// เวลาที่เร็วที่สุดที่นัดได้ของวันนี้ (ปัจจุบัน + 30 นาที) ในรูปแบบ HH:MM
const earliestTimeToday = () => {
  const t = new Date(Date.now() + 30 * 60 * 1000);
  return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
};

const StepTitle = ({ no, title, hint }: { no: number; title: string; hint?: string }) => (
  <div className="flex items-center gap-2">
    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
      {no}
    </span>
    <span className="text-sm font-bold text-slate-900">{title}</span>
    {hint && <span className="text-xs text-slate-400">{hint}</span>}
  </div>
);

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
  const isToday = appointmentDate === todayStr;
  const isOpenAllDay = shopOpen === "00:00" && (shopClose === "23:59" || shopClose === "24:00");

  const fieldClass =
    "w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition";

  return (
    <div className="space-y-6">
      {/* ขั้นที่ 1: นัดรับงาน */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <StepTitle no={1} title="นัดรับงาน" />
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
            <Store className="w-3 h-3" />
            {isOpenAllDay ? "เปิด 24 ชม." : `เปิด ${shopOpen} - ${shopClose} น.`}
          </span>
        </div>

        <div className={`rounded-2xl border p-3.5 space-y-3 transition ${timeError ? "border-rose-200 bg-rose-50/40" : "border-slate-200 bg-slate-50/70"}`}>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                วันที่รับ
              </span>
              <input
                type="date"
                min={todayStr}
                value={appointmentDate}
                onChange={(e) => onDateChange(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                เวลารับ
              </span>
              <input
                type="time"
                max={isOpenOvernight ? undefined : shopClose}
                value={appointmentTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-px" />
            <span>
              นัดล่วงหน้าอย่างน้อย 30 นาที
              {isToday && (
                <>
                  {" "}· วันนี้เลือกได้ตั้งแต่ <strong className="text-slate-700">{earliestTimeToday()} น.</strong>
                </>
              )}
            </span>
          </p>
        </div>

        {timeError && (
          <p className="text-xs text-rose-600 flex items-start gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {timeError}
          </p>
        )}
      </section>

      {/* ขั้นที่ 2: หมายเหตุ */}
      <section className="space-y-3">
        <StepTitle no={2} title="หมายเหตุถึงร้าน" hint="(ไม่บังคับ)" />
        <textarea
          rows={3}
          maxLength={NOTE_MAX}
          placeholder="เช่น พิมพ์หน้าปกเป็นกระดาษการ์ด, เย็บมุมซ้ายบน"
          value={orderNote}
          onChange={(e) => onNoteChange(e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white resize-none transition"
        />
      </section>
    </div>
  );
}
