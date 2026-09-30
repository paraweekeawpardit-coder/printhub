/**
 * =========================================================================
 * Component: ShopBackButton
 * หน้าที่: ปุ่มกดย้อนกลับไปยังหน้าหลัก (/customer)
 * - จอใหญ่ (XL ขึ้นไป): ลอยอยู่ด้านซ้ายนอกการ์ดร้านค้า ไม่ดันเนื้อหาข้างใน
 * - จอมือถือ/แท็บเล็ต: แสดงอยู่ด้านบนเหนือการ์ดร้านค้าอย่างเป็นระเบียบ
 * =========================================================================
 */

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopBackButton() {
  const router = useRouter();

  return (
    <>
      {/* ปุ่มลอยด้านซ้ายสำหรับจอ Desktop XL */}
      <button
        type="button"
        onClick={() => router.push("/customer")}
        title="กลับสู่หน้าหลัก"
        className="hidden xl:flex absolute -left-14 top-6 w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:bg-slate-50 items-center justify-center text-slate-700 hover:text-blue-600 transition-all cursor-pointer group"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* ปุ่มขนาดกะทัดรัดสำหรับจอมือถือ/แท็บเล็ต */}
      <div className="xl:hidden pb-3">
        <button
          type="button"
          onClick={() => router.push("/customer")}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </button>
      </div>
    </>
  );
}