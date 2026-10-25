"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  X,
  XCircle,
} from "lucide-react";
import { PASSWORD_RULES, isPasswordValid } from "../../component/auth/Validators";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

type TokenState = "checking" | "valid" | "invalid";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [tokenState, setTokenState] = useState<TokenState>("checking");
  const [tokenError, setTokenError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const touch = (key: string) =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  // เช็คลิงก์ตั้งแต่เปิดหน้า จะได้รู้ทันทีถ้าหมดอายุ/ถูกใช้ไปแล้ว
  useEffect(() => {
    if (!token) {
      setTokenError("ลิงก์ไม่ถูกต้อง กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่");
      setTokenState("invalid");
      return;
    }

    let cancelled = false;
    axios
      .post(`${API_URL}/auth/reset-password/verify`, { token })
      .then(() => {
        if (!cancelled) setTokenState("valid");
      })
      .catch((err) => {
        if (cancelled) return;
        setTokenError(
          err.response?.data?.error ||
            "ไม่สามารถตรวจสอบลิงก์ได้ กรุณาลองใหม่อีกครั้ง"
        );
        setTokenState("invalid");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const passwordOk = isPasswordValid(password);
  const confirmError = !confirmPassword
    ? "กรุณายืนยันรหัสผ่าน"
    : password !== confirmPassword
    ? "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน"
    : "";
  const showConfirmError = touched.confirm || submitted ? confirmError : "";
  const showChecklist = !!touched.passwordFocus || !!touched.password || submitted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage("");
    if (!passwordOk || confirmError) return;

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      setIsDone(true);
    } catch (err: any) {
      console.error("Reset password failed:", err);
      setErrorMessage(
        err.response?.data?.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // กำลังตรวจสอบลิงก์
  if (tokenState === "checking") {
    return (
      <div className="w-full max-w-md mx-auto text-center py-10 text-sm text-gray-500">
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-[#001B3A]" />
        กำลังตรวจสอบลิงก์...
      </div>
    );
  }

  // ลิงก์ไม่ถูกต้อง / หมดอายุ / ถูกใช้แล้ว
  if (tokenState === "invalid") {
    return (
      <div className="w-full max-w-md mx-auto text-center py-6 px-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-5 shadow-inner">
          <XCircle className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          ลิงก์ใช้งานไม่ได้
        </h2>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">{tokenError}</p>
        <Link
          href="/forgot-password"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#001B3A] py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
        >
          ขอลิงก์รีเซ็ตรหัสผ่านใหม่
        </Link>
        <Link
          href="/auth"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#001B3A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  // เปลี่ยนรหัสผ่านสำเร็จ
  if (isDone) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-6 px-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5 shadow-inner">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          ตั้งรหัสผ่านใหม่สำเร็จ
        </h2>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
        </p>
        <Link
          href="/auth"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#001B3A] py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
        >
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  // ฟอร์มตั้งรหัสผ่านใหม่
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1.5">
          ตั้งรหัสผ่านใหม่
        </h2>
        <p className="text-sm text-gray-500 leading-normal">
          กรอกรหัสผ่านใหม่ที่คุณต้องการใช้เข้าสู่ระบบ
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-100">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
            รหัสผ่านใหม่
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => touch("passwordFocus")}
              onBlur={() => touch("password")}
              placeholder="รหัสผ่านใหม่"
              autoComplete="new-password"
              className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#001B3A] focus:outline-none focus:ring-2 focus:ring-[#001B3A]/20 transition-all ${
                (touched.password || submitted) && !passwordOk
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {showChecklist &&
            (passwordOk ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <Check size={13} /> รหัสผ่านตรงตามรูปแบบที่กำหนด
              </p>
            ) : (
              <div className="mt-1.5 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-xs">
                <p className="mb-1 font-semibold text-red-600">
                  รหัสผ่านต้องเป็นไปตามรูปแบบนี้:
                </p>
                <ul className="space-y-0.5">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li
                        key={rule.key}
                        className={`flex items-center gap-1.5 ${
                          ok ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {ok ? <Check size={13} /> : <X size={13} />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
            ยืนยันรหัสผ่านใหม่
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => touch("confirm")}
              placeholder="ยืนยันรหัสผ่านใหม่"
              autoComplete="new-password"
              className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#001B3A] focus:outline-none focus:ring-2 focus:ring-[#001B3A]/20 transition-all ${
                showConfirmError ? "border-red-400" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {showConfirmError && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-500">
              {showConfirmError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#001B3A] py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#001B3A] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
        </button>
      </form>

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

// useSearchParams ต้องอยู่ใน Suspense ไม่งั้น next build จะ error
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}