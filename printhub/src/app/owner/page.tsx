"use client";

import { useState, useEffect } from "react";
import StatCard from "../../component/admin/StatCard";

interface FinanceStats {
  totalPlatformIncome: number; // รายได้ค่าธรรมเนียมแพลตฟอร์ม (5%)
  totalGrossVolume: number;    // ยอดขาย/เงินหมุนเวียนรวมในระบบ
  pendingPayout: number;       // เงินที่ต้องโอนให้ร้านค้า
}

export default function OwnerDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [finance, setFinance] = useState<FinanceStats>({
    totalPlatformIncome: 0,
    totalGrossVolume: 0,
    pendingPayout: 0,
  });

  const OWNER_PIN = process.env.NEXT_PUBLIC_OWNER_PIN || "8888";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

  // ดึงข้อมูลการเงินจริงจาก API เมื่อกรอกรหัสผ่านผ่าน
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    fetch(`${API_URL}/dashboard-stats?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch finance data");
        return res.json();
      })
      .then((data) => {
        const netIncome = data.totalPlatformIncome ?? 0;
        // คำนวณกลับหายอดขายรวม (100%) จากส่วนแบ่ง (5%)
        const grossVolume = netIncome > 0 ? netIncome / 0.05 : 0;
        const payout = grossVolume - netIncome;

        setFinance({
          totalPlatformIncome: netIncome,
          totalGrossVolume: Number(grossVolume.toFixed(2)),
          pendingPayout: Number(payout.toFixed(2)),
        });
      })
      .catch((err) => {
        console.error("Owner Dashboard Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated, API_URL]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === OWNER_PIN) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("รหัส PIN สำหรับเจ้าของระบบไม่ถูกต้อง");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <form onSubmit={handleVerify} className="pin-box">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>ยืนยันสิทธิ์เจ้าของระบบ (Owner)</h2>
          <p>กรุณากรอกรหัส PIN เพื่อเข้าดูข้อมูลการเงินและภาพรวมธุรกิจ</p>
          
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="กรอกรหัส PIN"
            maxLength={6}
            autoFocus
          />
          
          {error && <span className="error-text">{error}</span>}
          <button type="submit">ยืนยันตัวตน</button>
        </form>

        <style jsx>{`
          .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
          }
          .pin-box {
            background: #ffffff;
            padding: 32px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header-icon {
            display: flex;
            justify-content: center;
            color: #0f172a;
          }
          h2 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            text-align: center;
          }
          p {
            font-size: 0.875rem;
            color: #64748b;
            margin: 0;
            text-align: center;
          }
          input {
            padding: 12px;
            font-size: 1.25rem;
            text-align: center;
            letter-spacing: 6px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            outline: none;
          }
          input:focus {
            border-color: #0f172a;
          }
          button {
            padding: 12px;
            background: #0f172a;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          button:hover {
            background: #1e293b;
          }
          .error-text {
            color: #ef4444;
            font-size: 0.85rem;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="owner-container">
      <div className="owner-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h2>ภาพรวมการเงินระบบ PrintHub (Owner)</h2>
      </div>

      {loading ? (
        <p className="loading-text">กำลังโหลดข้อมูลการเงิน...</p>
      ) : (
        <div className="stats-grid">
          <StatCard
            title="รายได้ค่าธรรมเนียมทั้งหมด"
            value={finance.totalPlatformIncome.toLocaleString()}
            unit="บาท"
            subtitle="รายได้ส่วนแบ่ง 5% ของแพลตฟอร์ม"
          />
          <StatCard
            title="เงินหมุนเวียนในระบบ"
            value={finance.totalGrossVolume.toLocaleString()}
            unit="บาท"
            subtitle="รวมยอดสั่งซื้อทั้งหมดจากทุกร้าน"
          />
          <StatCard
            title="เงินรอโอนให้ร้านค้า"
            value={finance.pendingPayout.toLocaleString()}
            unit="บาท"
            subtitle="ยอดคงเหลือรอเคลียริ่งรอบโอนเงิน"
          />
        </div>
      )}

      <style jsx>{`
        .owner-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Prompt', 'Kanit', sans-serif;
        }
        .owner-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          color: #0f172a;
        }
        .owner-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .loading-text {
          color: #64748b;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}