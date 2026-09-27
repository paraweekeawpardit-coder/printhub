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
  totalPlatformIncome: number;
  pendingReports: number;
  dailyIncome?: ChartDataItem[];
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  useEffect(() => {
    fetch(`${API_URL}/dashboard-stats`)
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("API route not found or did not return JSON");
        }
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => {
        console.warn("API Error, using fallback data:", err.message);
        setStats({
          totalCustomers: 1250,
          totalActiveShops: 48,
          totalPlatformIncome: 154000,
          pendingReports: 5,
          dailyIncome: [
            { name: "Mon", income: 0 },
            { name: "Tue", income: 0 },
            { name: "Wed", income: 0 },
            { name: "Thu", income: 0 },
            { name: "Fri", income: 0 },
            { name: "Sat", income: 0 },
            { name: "Sun", income: 0 },
          ],
        });
      });
  }, [API_URL]);

  if (!stats) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <style jsx>{`
          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 50vh;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f0f8ff;
            border-top: 4px solid #003554;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
        />
        <StatCard
          title="ร้านค้าที่ใช้งานอยู่"
          value={stats.totalActiveShops?.toLocaleString()}
          unit="ร้าน"
          subtitle="เปิดให้บริการบนแพลตฟอร์ม"
        />
        <StatCard
          title="รายได้แพลตฟอร์ม"
          value={stats.totalPlatformIncome?.toLocaleString("th-TH")}
          unit="บาท"
          subtitle="รายได้รวมทั้งหมด"
        />
        <StatCard
          title="ปัญหาที่รอตรวจสอบ"
          value={stats.pendingReports}
          unit="รายการ"
          subtitle="รายงานจากผู้ใช้และร้านค้า"
          isAlert={true}
        />
      </section>

      <h2 className="section-title" style={{ marginTop: "40px" }}>
        กราฟแสดงรายได้ย้อนหลัง 7 วัน
      </h2>

      {/* ใช้ข้อมูล dailyIncome จาก API แทน mockChartData */}
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