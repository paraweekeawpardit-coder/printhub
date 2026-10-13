"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import axios from "axios";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.replace(/\/+\$/, "");

export default function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Failed to send reset email:", error);
      setErrorMessage(error.response?.data?.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ตรวจสอบอีเมลของคุณ</h2>
        <p className="text-sm text-gray-600 mb-6">
          หากอีเมล <span className="font-semibold text-gray-800">{email}</span> มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว
        </p>
        <button
          onClick={onBackToLogin}
          className="w-full rounded-lg bg-[#001B3A] py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 transition-all cursor-pointer"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">ลืมรหัสผ่าน?</h2>
        <p className="mt-1 text-sm text-gray-500">
          กรอกอีเมลที่ใช้ลงทะเบียน เพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน
        </p>
      </div>

      {errorMessage && (
        <p className="mb-4 text-center text-sm font-medium text-red-500">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-[#001B3A] focus:outline-none focus:ring-1 focus:ring-[#001B3A]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#001B3A] py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "กำลังตรวจสอบ..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center text-sm font-medium text-[#001B3A] hover:underline gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}