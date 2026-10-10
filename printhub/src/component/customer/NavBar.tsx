"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Printer, 
  Home, 
  ClipboardList, 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Headset, // 👈 เพิ่ม Headset Icon สำหรับ Support Chat
  Bell
} from "lucide-react";
import NotificationBell from "@/component/NotificationBell";
import { supabase } from "@/config/supabase";

interface NavBarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function CustomerNavBar({ cartCount = 0, onOpenCart }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      // 1. ลองดึงจาก localStorage ตรงๆ
      const directCustomerId =
        localStorage.getItem("customer_id") ||
        localStorage.getItem("user_id") ||
        localStorage.getItem("userId") ||
        localStorage.getItem("id");

      if (directCustomerId) {
        setCustomerId(directCustomerId);
        return;
      }

      // 2. แกะจาก object 'user' หรือ 'customer'
      const userStr = localStorage.getItem("user") || localStorage.getItem("customer");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const actualId =
            user.customer_id ||
            user.id ||
            user.user_id ||
            user.customer?.id ||
            user.customer?.customer_id;

          if (actualId) {
            setCustomerId(String(actualId));
            return;
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      // 3. สำรอง: ดึงตรงจาก Supabase Auth Session เผื่อไม่ได้ลง localStorage
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setCustomerId(data.session.user.id);
      }
    };

    getUserId();
  }, []);

  // ตรวจจับ active path
  const isHomeActive = pathname === "/customer" || pathname === "/";
  const isOrdersActive = pathname.startsWith("/customer/orders") || pathname.startsWith("/customer/order");
  const isSupportActive = pathname.startsWith("/customer/support"); // 👈 เช็ก active state ของหน้า support
  const isSettingActive = pathname.startsWith("/customer/setting") || pathname.startsWith("/customer/profile");
  const isDashboardActive = pathname.startsWith("/customer/dashboard");

  // ฟังก์ชันสำหรับการออกจากระบบ
  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("customer_id");
      localStorage.removeItem("id");
      localStorage.removeItem("user_id");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.clear();
    }
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur shadow-xs">
      <div className="mx-auto max-w-6xl h-16 flex items-center justify-between gap-2 px-4">
        
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

        {/* เมนูหลักตรงกลาง (หน้าแรก / คำสั่งซื้อของฉัน / ติดต่อแอดมิน) */}
        <div className="flex items-center gap-1 text-sm font-medium">
          {/* หน้าแรก */}
          <Link
            href="/customer"
            title="หน้าแรก"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isHomeActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <Home size={15} />
            <span className={isHomeActive ? "inline" : "hidden md:inline"}>
              หน้าแรก
            </span>
          </Link>

          {/* คำสั่งซื้อของฉัน */}
          <Link
            href="/customer/orders"
            title="คำสั่งซื้อของฉัน"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isOrdersActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={15} />
            <span className={isOrdersActive ? "inline" : "hidden md:inline"}>
              คำสั่งซื้อของฉัน
            </span>
          </Link>

          {/* 🟢 ติดต่อแอดมิน (Support Chat) */}
          <Link
            href="/customer/support"
            title="ติดต่อแอดมิน"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isSupportActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <Headset size={16} />
            <span className={isSupportActive ? "inline" : "hidden md:inline"}>
              ติดต่อแอดมิน
            </span>
          </Link>
        </div>

        {/* ฝั่งขวา: การแจ้งเตือน, ตะกร้า, แดชบอร์ด (ข้างซ้ายรูปโปรไฟล์), รูปโปรไฟล์, ออกจากระบบ */}
        <div className="flex items-center gap-2">
          
          {/* กระดิ่งแจ้งเตือนสำหรับลูกค้า */}
          {customerId ? (
            <NotificationBell userId={customerId} role="customer" />
          ) : (
            <button
              type="button"
              title="การแจ้งเตือน"
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:text-[#0F2942] hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            >
              <Bell size={18} />
            </button>
          )}

          {/* ตะกร้าสินค้า */}
          <button
            type="button"
            onClick={onOpenCart || (() => router.push("/customer/cart"))}
            title="ตะกร้าสินค้า"
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:text-[#0F2942] hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#0F2942] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* แดชบอร์ด (ย้ายมาอยู่ข้างซ้ายของรูปโปรไฟล์) */}
          <Link
            href="/customer/dashboard"
            title="แดชบอร์ด"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full text-sm font-medium transition-colors cursor-pointer focus:outline-none ${
              isDashboardActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard size={15} />
            <span className={isDashboardActive ? "inline" : "hidden md:inline"}>
              แดชบอร์ด
            </span>
          </Link>

          {/* Setting / Profile Button */}
          <Link
            href="/customer/setting"
            title="ตั้งค่าบัญชี"
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold relative shrink-0">
              <User size={16} />
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs">
                <Settings
                  size={12}
                  className={
                    isSettingActive ? "text-[#0F2942]" : "text-slate-500"
                  }
                />
              </div>
            </div>
          </Link>

          {/* เส้นคั่นแบ่งสัดส่วน */}
          <div className="h-5 w-[1px] bg-slate-200 my-auto" />

          {/* ปุ่มออกจากระบบ (Logout Button) */}
          <button
            type="button"
            onClick={handleLogout}
            title="ออกจากระบบ"
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer focus:outline-none"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>

      </div>
    </nav>
  );
}