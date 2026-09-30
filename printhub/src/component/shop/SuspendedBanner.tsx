"use client";

import React from "react";

interface SuspendedBannerProps {
  reason?: string;
}

export default function SuspendedBanner({ reason }: SuspendedBannerProps) {
  return (
    <div className="bg-red-600 text-white px-6 py-3 shadow-md flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <span className="text-xl">🚨</span>
        <div>
          <p className="font-bold text-sm">บัญชีร้านค้าของคุณถูกระงับการใช้งานชั่วคราว</p>
          <p className="text-xs text-red-100">
            เหตุผล: {reason || "เนื่องจากละเมิดเงื่อนไขการใช้งานระบบ"} (คุณจะไม่สามารถรับคำสั่งพิมพ์ใหม่ได้)
          </p>
        </div>
      </div>
      <button 
        onClick={() => alert("กรุณาติดต่อแอดมินผ่าน Line / Email support@printhub.com")} 
        className="bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded hover:bg-red-50 transition shrink-0"
      >
        ติดต่อผู้ดูแลระบบ
      </button>
    </div>
  );
}