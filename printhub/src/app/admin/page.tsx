"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock Data สำหรับกราฟ
const mockChartData = [
  { name: "Mon", income: 4000 },
  { name: "Tue", income: 3000 },
  { name: "Wed", income: 5000 },
  { name: "Thu", income: 2780 },
  { name: "Fri", income: 8900 },
  { name: "Sat", income: 2390 },
  { name: "Sun", income: 3490 },
];

export default function AdminHomePage() {
  const [stats, setStats] = useState<any>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  useEffect(() => {
    fetch(`${API_URL}/dashboard-stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => {
        console.error(err);
        // Fallback data กรณี API ยังไม่พร้อม เพื่อให้เห็น UI
        setStats({
          totalCustomers: 1250,
          totalActiveShops: 48,
          totalPlatformIncome: 154000,
          pendingReports: 5,
        });
      });
  }, []);

  if (!stats) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="admin-page-container">
      <h2 className="section-title">ผลการดำเนินงานแพลตฟอร์ม</h2>

      <section className="stats-grid">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="stat-header">
            <span>จำนวนลูกค้าทั้งหมด</span>
            <span className="arrow-icon">›</span>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">{stats.totalCustomers?.toLocaleString()}</span>
            <span className="stat-unit">คน</span>
          </div>
          <div className="stat-footer">ผู้ใช้งานในระบบทั้งหมด</div>
        </div>

        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-header">
            <span>ร้านค้าที่ใช้งานอยู่</span>
            <span className="arrow-icon">›</span>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">{stats.totalActiveShops?.toLocaleString()}</span>
            <span className="stat-unit">ร้าน</span>
          </div>
          <div className="stat-footer">เปิดให้บริการบนแพลตฟอร์ม</div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-header">
            <span>รายได้แพลตฟอร์ม</span>
            <span className="arrow-icon">›</span>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">{stats.totalPlatformIncome?.toLocaleString("th-TH")}</span>
            <span className="stat-unit">บาท</span>
          </div>
          <div className="stat-footer">รายได้รวมทั้งหมด</div>
        </div>

        {/* Card 4 */}
        <div className="stat-card stat-alert">
          <div className="stat-header">
            <span>ปัญหาที่รอตรวจสอบ</span>
            <span className="arrow-icon">›</span>
          </div>
          <div className="stat-value-container">
            <span className="stat-value">{stats.pendingReports}</span>
            <span className="stat-unit">รายการ</span>
          </div>
          <div className="stat-footer">รายงานจากผู้ใช้และร้านค้า</div>
        </div>
      </section>

      <h2 className="section-title" style={{ marginTop: "40px" }}>กราฟแสดงรายได้ย้อนหลัง 7 วัน</h2>
      
      <section className="chart-panel">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={mockChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" stroke="#64748B" tick={{ fill: '#64748B' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="#64748B" tick={{ fill: '#64748B' }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#003554" /* สีน้ำเงินเข้มให้เข้ากับธีม */
              strokeWidth={4} 
              dot={{ r: 6, fill: "#003554", strokeWidth: 2, stroke: "#fff" }} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* สไตล์ที่ปรับแต่งให้เหมือนรูปภาพอ้างอิง */}
      <style jsx>{`
        .admin-page-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Prompt', 'Kanit', sans-serif; /* แนะนำให้ใช้ Font ไทยสวยๆ */
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

        .stat-card {
          background-color: #F0F8FF; /* สีฟ้าอ่อนแบบในภาพ */
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-alert {
          background-color: #FFF5F5; /* สีแดงอ่อนสำหรับ Report แจ้งเตือน */
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }

        .arrow-icon {
          color: #94A3B8;
          font-size: 1.2rem;
        }

        .stat-value-container {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1;
        }

        .stat-unit {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0F172A;
        }

        .stat-footer {
          font-size: 0.85rem;
          color: #94A3B8;
          font-weight: 400;
        }

        .chart-panel {
          background-color: #FFFFFF;
          border: 1px solid #F1F5F9;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #F0F8FF;
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