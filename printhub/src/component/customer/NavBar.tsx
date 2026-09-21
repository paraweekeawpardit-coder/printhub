"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Printer, Home, ShoppingCart, ClipboardList } from "lucide-react";

export default function NavBar() {
  const router = useRouter();

  // นำทางตรงไปยัง /customer/orders
  const handleGoToOrders = () => {
    router.push("/customer/orders");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* โลโก้ PrintHub */}
        <Link href="/customer" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Printer size={18} strokeWidth={2} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PrintHub
          </span>
        </Link>

        {/* แถบเมนูตรงกลาง */}
        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <li>
            <Link
              href="/customer"
              className="flex items-center gap-1.5 transition-colors hover:text-blue-600 font-semibold"
            >
              <Home size={16} />
              <span>หน้าแรก</span>
            </Link>
          </li>
          <li>
            <Link
              href="/customer/cart"
              className="flex items-center gap-1.5 transition-colors hover:text-blue-600 font-semibold"
            >
              <ShoppingCart size={16} />
              <span>ตะกร้าของฉัน</span>
            </Link>
          </li>
          <li>
            {/* เมนูกลาง: คำสั่งซื้อของฉัน */}
            <Link
              href="/customer/orders"
              className="flex items-center gap-1.5 transition-colors hover:text-blue-600 font-semibold text-slate-600"
            >
              <ClipboardList size={16} />
              <span>คำสั่งซื้อของฉัน</span>
            </Link>
          </li>
        </ul>

        {/* ฝั่งขวา: ปุ่มคำสั่งซื้อของฉัน และโปรไฟล์ */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGoToOrders}
            className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 text-xs font-semibold transition cursor-pointer"
          >
            คำสั่งซื้อของฉัน
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-100">
            👤
          </div>
        </div>
      </div>
    </nav>
  );
}