"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Printer, 
  Home, 
  ClipboardList, 
  MessageCircle, 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut,
  LayoutDashboard
} from "lucide-react";

interface NavBarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function CustomerNavBar({ cartCount = 0, onOpenCart }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("customer_id") || localStorage.getItem("id");
    if (id) {
      setCustomerId(id);
    }
  }, []);

  const isHomeActive = pathname === "/customer" || pathname === "/";
  const isOrdersActive = pathname.startsWith("/customer/orders") || pathname.startsWith("/customer/order");
  const isChatActive = pathname.startsWith("/customer/chat");
  const isSettingActive = pathname.startsWith("/customer/setting") || pathname.startsWith("/customer/profile");

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("customer_id");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
    }
    router.push("/login");
  };

  // ตรวจจับ active path **********************************************
  const isDashboardActive = pathname.startsWith("/customer/dashboard");


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-6xl h-16 flex items-center justify-between gap-2 px-4 sm:px-6">
        
        {/* โลโก้ PrintHub */}
        <Link
          href="/customer"
          className="flex items-center gap-2 pl-1 cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#0F2942] flex items-center justify-center">
            <Printer size={18} className="text-white" />
          </div>
          <span className="hidden sm:block text-[#0F2942] font-bold text-xl tracking-tight">
            PrintHub
          </span>
        </Link>

        {/* เมนูหลักตรงกลาง (หน้าหลัก / คำสั่งซื้อ / แชท) */}
        <div className="flex items-center gap-1.5 text-sm font-medium">
          {/* หน้าแรก */}
          <Link
            href="/customer"
            title="หน้าแรก"
            className={`flex items-center gap-2 h-10 px-3.5 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isHomeActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <Home size={16} />
            <span className={isHomeActive ? "inline" : "hidden md:inline"}>
              หน้าแรก
            </span>
          </Link>

          {/* คำสั่งซื้อของฉัน */}
          <Link
            href="/customer/orders"
            title="คำสั่งซื้อของฉัน"
            className={`flex items-center gap-2 h-10 px-3.5 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isOrdersActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={16} />
            <span className={isOrdersActive ? "inline" : "hidden md:inline"}>
              คำสั่งซื้อของฉัน
            </span>
          </Link>

          {/* แชท (เพิ่มใหม่) */}
          <Link
            href="/customer/chat"
            title="แชท"
            className={`flex items-center gap-2 h-10 px-3.5 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isChatActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <MessageCircle size={16} />
            <span className={isChatActive ? "inline" : "hidden md:inline"}>
              แชท
            </span>
          </Link>
        </div>

        {/* ฝั่งขวา: ตะกร้าสินค้า, โปรไฟล์พร้อมไอคอนฟันเฟือง, ปุ่มออกจากระบบ */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ตะกร้าสินค้า */}
          <button
            type="button"
            onClick={onOpenCart || (() => router.push("/customer/cart"))}
            title="ตะกร้าสินค้า"
            className="relative flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-[#0F2942] hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-[#0F2942] text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* โปรไฟล์ผู้ใช้ + ฟันเฟือง Settings สไตล์เดียวกับร้านค้า */}
          <Link
            href="/customer/setting"
            title="ตั้งค่าบัญชี"
            className="flex items-center gap-2 pr-1 cursor-pointer focus:outline-none group"
          >
            {/* <span className="hidden lg:block text-sm font-medium text-slate-600 group-hover:text-[#0F2942]">
              User
            </span> */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold relative shadow-xs">
              <User size={18} />
              {/* ตราฟันเฟืองซ้อนมุมขวาล่าง */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                <Settings 
                  size={13} 
                  className={isSettingActive ? "text-[#0F2942]" : "text-slate-500 group-hover:text-[#0F2942]"} 
                />
              </div>
            </div>
          </Link>


          {/* ************************************************ */}
          <Link
            href="/customer/dashboard"
            title="แดชบอร์ด"
            className={`flex items-center gap-2 h-10 px-3.5 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isDashboardActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard size={16} />
            <span className={isDashboardActive ? "inline" : "hidden md:inline"}>
              แดชบอร์ด
            </span>
          </Link>

          {/* ปุ่มออกจากระบบ */}
          <button
            type="button"
            onClick={handleLogout}
            title="ออกจากระบบ"
            className="flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold text-rose-600 bg-rose-50/80 hover:bg-rose-100 transition-colors focus:outline-none cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>

      </div>
    </nav>
  );
}