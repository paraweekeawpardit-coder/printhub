/**
 * Component: DashboardWelcomeBanner
 * หน้าที่: แสดงกล่องแบนเนอร์ยินดีต้อนรับลูกค้า แสดงตัวอักษรย่อ ชื่อ นามสกุล สิทธิ์ผู้ใช้งาน
 * และมีปุ่มลัดสำหรับนำทาง (Navigate) ไปยังหน้าค้นหาร้านพิมพ์งาน (/customer)
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface DashboardWelcomeBannerProps {
  customerName: string;
}

export default function DashboardWelcomeBanner({ customerName }: DashboardWelcomeBannerProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100 shrink-0">
          {customerName ? customerName.charAt(0).toUpperCase() : "C"}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              ยินดีต้อนรับ, คุณ {customerName || "ลูกค้า"}
            </h1>
            {/* <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              ลูกค้า (Customer)
            </span> */}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            เข้าสู่ระบบในฐานะ: ผู้สั่งพิมพ์งาน
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/customer")}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold rounded-2xl transition shadow-xs cursor-pointer shrink-0"
      >
        <Search size={14} />
        <span>ค้นหาร้านพิมพ์งาน</span>
      </button>
    </div>
  );
}