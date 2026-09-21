"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Printer, Home, ShoppingCart, ClipboardList, LogOut } from "lucide-react";

interface NavBarProps {
  onOpenCart?: () => void;
  cartCount?: number;
}

export default function NavBar({ onOpenCart, cartCount = 0 }: NavBarProps) {
  const router = useRouter();

  // ฟังก์ชันสำหรับการออกจากระบบ
  const handleLogout = () => {
    // 1. ล้างข้อมูล Session / Token ทั้งหมดที่เก็บไว้ใน Browser
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // 2. เปลี่ยนเส้นทางกลับไปที่หน้า Landing Page ( / )
    router.push("/");
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

        {/* เมนูหลักกลาง Navbar */}
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
              href="/customer/orders"
              className="flex items-center gap-1.5 transition-colors hover:text-blue-600 font-semibold text-slate-600"
            >
              <ClipboardList size={16} />
              <span>คำสั่งซื้อของฉัน</span>
            </Link>
          </li>
        </ul>

        {/* ฝั่งขวา: ปุ่มตะกร้าสินค้า + ไอคอนโปรไฟล์ + ปุ่มออกจากระบบ */}
        <div className="flex items-center gap-3">
          {/* ปุ่มตะกร้าสินค้า */}
          {onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
              title="ดูตะกร้าสินค้า"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* ไอคอนโปรไฟล์ */}
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-100">
            👤
          </div>

          {/* ปุ่มออกจากระบบ (Logout) -> ไปที่หน้า Landing Page */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-full transition cursor-pointer ml-1"
            title="ออกจากระบบ"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </nav>
  );
}