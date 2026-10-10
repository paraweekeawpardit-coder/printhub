import React from "react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  subtitle: string;
  href?: string;
  isAlert?: boolean; // ส่ง true เมื่อต้องการเน้นว่าเร่งด่วน
}

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  href,
  isAlert = false,
}: StatCardProps) {
  const CardContent = (
    <div
      className={`h-full flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
        isAlert
          ? "border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 hover:border-amber-400 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* 1. หัวข้อการ์ด (ขยายขนาดใหญ่ขึ้น ปรับ font-bold ชัดเจน) */}
      <div>
        <h3
          className={`text-sm sm:text-base font-bold leading-snug min-h-[2.5rem] flex items-center ${
            isAlert ? "text-amber-900" : "text-slate-800"
          }`}
        >
          {title}
        </h3>
      </div>

      {/* 2. ตัวเลขสถิติ (ถ้า Alert จะตัวใหญ่และสีเข้มชัดเจน) */}
      <div className="my-2 flex items-baseline gap-1.5">
        <span
          className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
            isAlert ? "text-amber-700" : "text-slate-900"
          }`}
        >
          {value}
        </span>
        <span
          className={`text-xs font-bold ${
            isAlert ? "text-amber-700" : "text-slate-500"
          }`}
        >
          {unit}
        </span>
      </div>

      {/* 3. คำอธิบายด้านล่าง */}
      <div
        className={`pt-2.5 border-t ${
          isAlert ? "border-amber-200/80" : "border-slate-100"
        }`}
      >
        <p
          className={`text-xs leading-tight line-clamp-1 ${
            isAlert ? "text-amber-800 font-bold" : "text-slate-500 font-medium"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="h-full block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}