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
    <div className={`min-h-screen bg-slate-50 ${kanit.className} flex flex-col overflow-x-hidden`}>
      {/* Component Navbar */}
      <AdminNavbar />

      {/* Main Container: ปรับ Padding ให้เหมาะกับทั้งมือถือและจอคอม */}
      <main className="w-full mx-auto max-w-7xl px-2.5 sm:px-6 py-4 sm:py-8 flex-1">
        {children}
      </main>
    </div>
  );
}