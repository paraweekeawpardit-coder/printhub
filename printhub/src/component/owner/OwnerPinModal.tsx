"use client";

import { useState } from "react";

interface OwnerPinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OwnerPinModal({ isOpen, onSuccess, onCancel }: OwnerPinModalProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/owner/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setPin("");
        onSuccess();
      } else {
        setError(result.message || "รหัส PIN ไม่ถูกต้อง");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend ได้");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <form
        onSubmit={handleVerify}
        className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-4 w-full max-w-md animate-in fade-in zoom-in duration-200"
      >
        <div className="flex justify-center text-slate-900">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">ยืนยันสิทธิ์เจ้าของระบบ (Owner)</h2>
          <p className="text-xs text-slate-500 mt-1">กรุณากรอกรหัส PIN เพื่อเข้าใช้งาน</p>
        </div>

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
  );
}