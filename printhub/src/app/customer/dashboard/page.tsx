"use client";

import React from "react";
import NavBar from "../../../component/customer/NavBar";
import CustomerDashboardView from "../../../component/customer/dashboard/CustomerDashboardView";

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-800 pb-20 relative">
      <NavBar />
      {/* Dashboard แสดงครบทั้ง Banner และ Stats Grid */}
      <CustomerDashboardView showBanner={true} showStats={true} />
    </div>
  );
}