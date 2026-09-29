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
        dailyIncome: data.dailyIncome ?? [],
      });
    } catch (error) {
      console.error("Fetch dashboard error:", error);
      setStats({
        totalCustomers: 0,
        totalActiveShops: 0,
        pendingReports: 0,
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
    <div className="admin-page-container">
      <h2 className="section-title">ผลการดำเนินงานแพลตฟอร์ม</h2>

      <section className="stats-grid">
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
          title="ปัญหาที่รอตรวจสอบ"
          value={stats.pendingReports}
          unit="รายการ"
          subtitle="รายงานจากผู้ใช้และร้านค้า"
          href="/admin/reports"
          isAlert={true}
        />
      </section>

      <h2 className="section-title" style={{ marginTop: "40px" }}>
        ปริมาณคำสั่งซื้อย้อนหลัง 7 วัน
      </h2>

      <IncomeChart data={stats.dailyIncome || []} />

      <style jsx>{`
        .admin-page-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Prompt', 'Kanit', sans-serif;
          color: #0F172A;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
      `}</style>
    </div>
  );
}