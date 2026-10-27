"use client";

import React, { useState, useEffect } from "react";
import NavBar from "../../../component/customer/NavBar";
import CustomerDashboardView from "../../../component/customer/dashboard/CustomerDashboardView";

export default function CustomerOrdersPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ป้องกันการเรนเดอร์ฝั่ง Server (ตอน build / deploy) ไม่ให้ชนกับ localStorage หรือ window
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pb-20 relative">
      <NavBar />
      {/* หน้าคำสั่งซื้อของฉัน ปิด Banner และ Stats ออก */}
      <CustomerDashboardView 
        showBanner={false} 
        showStats={false} 
        pageTitle="คำสั่งซื้อของฉัน" 
      />
    </div>
  );
}
