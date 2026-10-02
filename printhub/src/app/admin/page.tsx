"use client";

import { useState, useEffect } from "react";
import StatCard from "../../component/admin/StatCard";
import IncomeChart from "../../component/admin/IncomeChart";

interface ChartDataItem {
  name: string;
  income: number;
}

interface DashboardStats {
  totalCustomers: number;
  totalActiveShops: number;
  pendingReports: number;
  pendingAppeals: number;
  pendingRefunds?: number;
  overdueAppeals: number;
  totalPlatformIncome: number;
  dailyIncome?: ChartDataItem[];
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/dashboard-stats?t=${Date.now()}`);
      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      setStats({
        totalCustomers: data.totalCustomers ?? 0,
        totalActiveShops: data.totalActiveShops ?? 0,
        pendingReports: data.pendingReports ?? 0,
        pendingAppeals: data.pendingAppeals ?? 0,
        pendingRefunds: data.pendingRefunds ?? 0,
        overdueAppeals: data.overdueAppeals ?? 0,
        totalPlatformIncome: data.totalPlatformIncome ?? 0,
        dailyIncome: data.dailyIncome ?? [],
      });
    } catch (error) {
      console.error("Fetch dashboard error:", error);
      setStats({
        totalCustomers: 0,
        totalActiveShops: 0,
        pendingReports: 0,
        pendingAppeals: 0,
        pendingRefunds: 0,
        overdueAppeals: 0,
        totalPlatformIncome: 0,
        dailyIncome: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500 font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto text-slate-900 font-sans p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-5">
        ผลการดำเนินงานแพลตฟอร์ม
      </h2>

      {/* 💡 ปรับ grid-cols บังคับให้การ์ดเรียงแถวละ 5 ใบในจอใหญ่ (xl) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="จำนวนลูกค้าทั้งหมด"
          value={stats.totalCustomers?.toLocaleString()}
          unit="คน"
          subtitle="ผู้ใช้งานในระบบทั้งหมด"
          href="/admin/customers"
        />
        <StatCard
          title="ร้านค้าที่ใช้งานอยู่"
          value={stats.totalActiveShops?.toLocaleString()}
          unit="ร้าน"
          subtitle="เปิดให้บริการบนแพลตฟอร์ม"
          href="/admin/shops?tab=all"
        />
        <StatCard
          title="คำร้องขอปลดระงับร้านค้า"
          value={stats.pendingAppeals}
          unit="รายการ"
          subtitle={
            stats.overdueAppeals > 0
              ? `⚠️️ เกินกำหนด 3 วัน: ${stats.overdueAppeals} รายการ`
              : "คำร้องขอปลดระงับที่รอตรวจสอบ"
          }
          href="/admin/shops?tab=appeals"
          isAlert={stats.pendingAppeals > 0}
        />
        <StatCard
          title="ปัญหาที่รอตรวจสอบ"
          value={stats.pendingReports}
          unit="รายการ"
          subtitle="รายงานจากผู้ใช้และร้านค้า"
          href="/admin/reports"
          isAlert={stats.pendingReports > 0}
        />
        <StatCard
          title="รายการรอโอนเงินคืน"
          value={stats.pendingRefunds ?? 0}
          unit="รายการ"
          subtitle="ออเดอร์ที่ยกเลิกและรอดำเนินการคืนเงิน"
          href="/admin/refunds"
          isAlert={(stats.pendingRefunds ?? 0) > 0}
        />
      </section>

      <h2 className="text-xl font-bold text-slate-800 mt-10 mb-5">
        รายได้แพลตฟอร์มย้อนหลัง 7 วัน (รวม: ฿{stats.totalPlatformIncome.toLocaleString()})
      </h2>

      <IncomeChart data={stats.dailyIncome || []} />
    </div>
  );
}