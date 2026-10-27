"use client";

interface ReportStatsProps {
  total: number;
  pending: number;
  verified: number;
}

export default function ReportStats({ total, pending, verified }: ReportStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 font-sans">
      {/* ทั้งหมด */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
            รายงานทั้งหมด
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5 sm:mt-1">
            {total}
          </h3>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      {/* รอตรวจสอบ */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between bg-amber-50/30">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-amber-600 uppercase tracking-wider">
            รอดำเนินการ
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-700 mt-0.5 sm:mt-1">
            {pending}
          </h3>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* ตรวจสอบแล้ว */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between bg-emerald-50/30">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            ตรวจสอบแล้ว
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5 sm:mt-1">
            {verified}
          </h3>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}