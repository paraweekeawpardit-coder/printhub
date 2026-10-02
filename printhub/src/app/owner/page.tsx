"use client";

import { useState } from "react";
import OwnerDashboard from "../../component/owner/OwnerDashboard";

export default function OwnerDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const res = await fetch("/api/owner/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.message || "รหัส PIN สำหรับเจ้าของระบบไม่ถูกต้อง");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <form onSubmit={handleVerify} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 w-full max-w-md">
          <div className="flex justify-center text-slate-900">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 text-center">ยืนยันสิทธิ์เจ้าของระบบ (Owner)</h2>
          <p className="text-xs text-slate-500 text-center">กรุณากรอกรหัส PIN เพื่อเข้าดูข้อมูลการเงินและภาพรวมธุรกิจ</p>
          
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="กรอกรหัส PIN"
            maxLength={6}
            autoFocus
            className="p-3 text-xl text-center tracking-[6px] border border-slate-300 rounded-xl outline-none focus:border-slate-900 transition-all font-mono"
          />
          
          {error && <span className="text-xs text-red-500 text-center font-medium">{error}</span>}
          
          <button 
            type="submit" 
            disabled={verifying}
            className="p-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm"
          >
            {verifying ? "กำลังตรวจสอบ..." : "ยืนยันตัวตน"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <OwnerDashboard onLogout={handleLogout} />
    </div>
  );
}