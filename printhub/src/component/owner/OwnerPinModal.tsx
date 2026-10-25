"use client";

import { useState } from "react";
import Link from "next/link";

interface OwnerPinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OwnerPinModal({ isOpen, onSuccess, onCancel }: OwnerPinModalProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

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
        setEmail("");
        setPassword("");
        onSuccess();
      } else {
        setError(result.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend ได้");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
        {/* ปุ่มย้อนกลับอยู่นอกการ์ดมุมซ้ายบน */}
        <div className="flex justify-start">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors py-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>ย้อนกลับไปหน้าเข้าสู่ระบบ</span>
          </Link>
        </div>

        <form
          onSubmit={handleVerify}
          className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-4 w-full"
        >
          <div className="flex justify-center text-slate-900">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">ยืนยันสิทธิ์เจ้าของระบบ (Owner)</h2>
            <p className="text-xs text-slate-500 mt-1">กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน</p>
          </div>

          <div className="flex flex-col gap-3">
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

          <div className="flex gap-2 mt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all cursor-pointer text-sm"
              >
                ยกเลิก
              </button>
            )}
            <button
              type="submit"
              disabled={verifying}
              className="flex-1 p-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-sm"
            >
              {verifying ? "กำลังตรวจสอบ..." : "ยืนยัน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}