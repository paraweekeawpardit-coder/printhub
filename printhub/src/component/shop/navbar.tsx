"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, CircleUserRound } from "lucide-react";

export default function ShopNavbar() {
  const [username, setUsername] = useState("");
  const [shopId, setShopId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedShopId =
        localStorage.getItem("shop_id") ||
        localStorage.getItem("id") ||
        "2a1e1ec6-1abd-49df-bcfe-cc66e64521d9";
      const storedName = localStorage.getItem("shop_name") || "PrintHub ลาดกระบัง";

      setShopId(storedShopId);
      setUsername(storedName);
    }
  }, []);

  return (
    <nav className="bg-white h-20 flex items-center px-10 border-b border-slate-200">
      {/* Logo */}
      <Link href="/shop" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-[#0F2942] flex items-center justify-center">
          <Printer size={18} className="text-white" />
        </div>

        <span className="text-[#0F2942] font-bold text-2xl tracking-tight">
          PrintHub
        </span>
      </Link>

      {/* Menu ภาษาไทย */}
      <div className="flex gap-10 mx-auto text-[15px] font-medium">
        <Link
          href="/shop"
          className="text-slate-500 hover:text-[#0F2942] transition-colors"
        >
          หน้าแรก
        </Link>

        <Link
          href={shopId ? `/shop/order/${shopId}` : "/shop"}
          className="text-slate-500 hover:text-[#0F2942] transition-colors"
        >
          คำสั่งพิมพ์
        </Link>

        {/* ✅ แก้ไขจุดนี้: ใส่ path ให้ตรงตามโครงสร้างไฟล์จริง */}
        <Link
          href={shopId ? `/shop/order/${shopId}/chat` : "/shop"}
          className="text-slate-500 hover:text-[#0F2942] transition-colors"
        >
          แชท
        </Link>

        <Link
          href={shopId ? `/shop/setting/${shopId}` : "/shop"}
          className="text-slate-500 hover:text-[#0F2942] transition-colors"
        >
          ตั้งค่าร้านค้า
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-slate-600">
          {username || "ร้านค้า"}
        </span>

        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
          <CircleUserRound size={20} className="text-slate-500" />
        </div>
      </div>
    </nav>
  );
}