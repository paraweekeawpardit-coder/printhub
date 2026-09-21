"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Printer, Home, ShoppingCart, ClipboardList, CircleUserRound } from "lucide-react";

export default function Navbar() {
  // เมนูนำทางเฉพาะของลูกค้า
  const navLinks = [
    { href: "/customer", label: "หน้าแรก", icon: <Home size={16} /> },
    { href: "/customer/cart", label: "ตะกร้าของฉัน", icon: <ShoppingCart size={16} /> },
    { href: "/customer/orders", label: "คำสั่งซื้อของฉัน", icon: <ClipboardList size={16} /> },
  ];
  const [userName, setUserName] = useState<string>("กำลังโหลด...");

  useEffect(() => {
    // ดึงค่าตาม Key "username" ที่เซฟไว้ตอน Login[cite: 12]
    const savedName = localStorage.getItem("username");

    if (savedName) {
      setUserName(savedName);
    } else {
      setUserName("ไม่ได้เข้าสู่ระบบ");
    }
  }, []);
  
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

        {/* แถบเมนูภาษาไทยตรงกลาง */}
        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-1.5 transition-colors hover:text-blue-600 font-semibold"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* โปรไฟล์ผู้ใช้งานฝั่งขวา */}
        <div className="flex items-center gap-3">
          {/* ชื่อ User */}
          <span className="text-sm font-medium text-blue-400">
            {userName}
          </span>

          {/* ปุ่มไอคอน CircleUserRound พร้อมกรอบวงกลมสีสว่าง */}
          <div className="w-9 h-9 rounded-full bg-slate-100/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer">
            <CircleUserRound size={22} />
          </div>
        </div>
      </div>
    </nav>
  );
}