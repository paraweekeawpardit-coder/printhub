"use client";

import { useState } from "react";
import Link from "next/link";
import OwnerDashboard from "../../component/owner/OwnerDashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OwnerDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/owner/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.message || "อีเมลหรือรหัสผ่านสำหรับเจ้าของระบบไม่ถูกต้อง");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend ได้");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col gap-2">
          {/* ปุ่มย้อนกลับอยู่นอกการ์ดมุมซ้ายบนแบบเดียวกับ Admin */}
          <div className="flex justify-start">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span>ย้อนกลับไปหน้าเข้าสู่ระบบ</span>
            </Link>
          </div>

          <form onSubmit={handleVerify} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 w-full">
            <div className="flex justify-center text-slate-900">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 text-center">ยืนยันสิทธิ์เจ้าของระบบ (Owner)</h2>
            <p className="text-xs text-slate-500 text-center">กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าดูข้อมูลการเงินและภาพรวมธุรกิจ</p>
            
            <div className="flex flex-col gap-3 mt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">อีเมลผู้ดูแลระบบ</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 text-sm transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">รหัสผ่าน</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-slate-900 text-sm transition-all"
                />
              </div>
            </div>
            
            {error && <span className="text-xs text-red-500 text-center font-medium">{error}</span>}
            
            <button 
              type="submit" 
              disabled={verifying}
              className="p-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm mt-2"
            >
              {verifying ? "กำลังตรวจสอบ..." : "ยืนยันตัวตน"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <OwnerDashboard onLogout={handleLogout} />
    </div>
  );
}