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
          {/* ปุ่มย้อนกลับ */}
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

          <form onSubmit={handleVerify} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-4 w-full">
            {/* โลโก้ PrintHub */}
            <div className="flex justify-center">
              <img
                src="/logo_printhub.png"
                alt="PrintHub Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-[#353A4C] text-center">ยืนยันสิทธิ์เจ้าของระบบ (Owner)</h2>
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
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-[#367ADF] text-sm transition-all"
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
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-[#367ADF] text-sm transition-all"
                />
              </div>
            </div>
            
            {error && <span className="text-xs text-red-500 text-center font-medium">{error}</span>}
            
            <button 
              type="submit" 
              disabled={verifying}
              className="p-3 bg-[#353A4C] hover:bg-[#394988] text-white rounded-xl font-semibold active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm mt-2 shadow-2xs"
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