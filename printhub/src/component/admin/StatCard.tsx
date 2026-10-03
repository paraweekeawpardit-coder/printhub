import React from "react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  subtitle: string;
  href?: string;
  isAlert?: boolean;
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
      className={`rounded-xl border p-5 transition-all duration-200 ${
        isAlert
          ? "border-amber-300 bg-amber-50/50 hover:bg-amber-50"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      } ${href ? "cursor-pointer" : ""}`}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={`text-2xl font-bold ${
            isAlert ? "text-amber-600" : "text-slate-900"
          }`}
        >
          {value}
        </span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
      <p
        className={`mt-1 text-xs ${
          isAlert ? "text-amber-600 font-semibold" : "text-slate-400"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
}