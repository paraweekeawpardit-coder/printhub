"use client";

import { ReactNode } from "react";
import { Kanit } from "next/font/google";
import AdminNavbar from "../../component/admin/Navbar";
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-screen bg-slate-50 ${kanit.className}`}>
      {/* Component Navbar ที่เช็คซ่อนตัวเองในหน้า /admin/login อัตโนมัติ */}
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}