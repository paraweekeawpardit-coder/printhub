"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { isValidEmail, EMAIL_FORMAT_ERROR } from "../../component/auth/Validators";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailTrim = email.trim();
  const emailError = !emailTrim
    ? "กรุณากรอกอีเมล"
    : !isValidEmail(emailTrim)
    ? EMAIL_FORMAT_ERROR
    : "";
  const showEmailError = touched || submitted ? emailError : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (emailError) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email: emailTrim });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Failed to send reset email:", error);
      setErrorMessage(error.response?.data?.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  // หน้าจอเมื่อส่งสำเร็จ
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-6 px-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5 shadow-inner">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">ตรวจสอบอีเมลของคุณ</h2>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          หากอีเมล <span className="font-semibold text-gray-900">{email}</span> มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว
        </p>
        <Link
          href="/auth"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#001B3A] py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#001B3A] focus:ring-offset-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  // หน้าจอฟอร์มกรอกอีเมล
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1.5">ลืมรหัสผ่าน?</h2>
        <p className="text-sm text-gray-500 leading-normal">
          กรอกอีเมลที่คุณใช้ลงทะเบียน เพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-100">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            อีเมล
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="name@example.com"
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#001B3A] focus:outline-none focus:ring-2 focus:ring-[#001B3A]/20 transition-all ${
                showEmailError ? "border-red-400" : "border-gray-300"
              }`}
            />
          </div>
          {showEmailError && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-500">
              {showEmailError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#001B3A] py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#001B3A] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "กำลังตรวจสอบ..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
        </button>
      </form>

      {/* Footer Back Link */}
      <div className="mt-6 text-center">
        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#001B3A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}