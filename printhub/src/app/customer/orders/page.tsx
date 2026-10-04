"use client";

import React from "react";
import NavBar from "../../../component/customer/NavBar";
import CustomerDashboardView from "../../../component/customer/dashboard/CustomerDashboardView";

export default function CustomerOrdersPage() {
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