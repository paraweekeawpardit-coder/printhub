"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogOut, Mail, RefreshCw } from "lucide-react";

const API_BASE = "http://localhost:5000";
const LOGIN_PATH = "/auth";
const SUPPORT_EMAIL = "printhub.service@printhub.co.th";

type BanInfo = { reason: string | null } | null;

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ban, setBan] = useState<BanInfo>(null);
  const [checked, setChecked] = useState(false);
  const [rechecking, setRechecking] = useState(false);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("shop_id");
    delete axios.defaults.headers.common.Authorization;
  };

  const checkStatus = useCallback(async (): Promise<boolean | null> => {
    try {
      const res = await axios.get("http://localhost:5000/api/shop/status")
      setBan(res.data.isBanned ? { reason: res.data.reason ?? null } : null);
      return !!res.data.isBanned;
    } catch (err: any) {
      // หากโดน 403 (SHOP_BANNED) ให้เซ็ตสถานะแบนทันทีโดยไม่ให้เกิด error หลุดไป
      if (err.response?.status === 403) {
        setBan({ reason: err.response?.data?.reason ?? null });
        return true;
      }
      return null;
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    const id = axios.interceptors.response.use(
      (r) => r,
      (err) => {
        const status = err.response?.status;
        if (status === 401) {
          clearSession();
          router.replace(LOGIN_PATH);
          return Promise.reject(err);
        }
        
        // ดักจับ 403 กรณีร้านถูกแบน เพื่อไม่ให้ Axios โยน Error ไปรบกวนหน้าจอ Next.js
        if (status === 403 && err.response?.data?.code === "SHOP_BANNED") {
          setBan({ reason: err.response.data.reason ?? null });
          return Promise.resolve({ data: null, isBannedHandled: true });
        }

        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace(LOGIN_PATH);
      return;
    }
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    checkStatus();

    const onVisible = () => {
      if (document.visibilityState === "visible") checkStatus();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [checkStatus, router]);

  const handleLogout = () => {
    clearSession();
    router.push(LOGIN_PATH);
  };

  const handleRecheck = async () => {
    setRechecking(true);
    await checkStatus();
    setRechecking(false);
  };

  if (!checked) return null;

  return (
    <div className="relative min-h-screen">
      {/* 🔴 แบนเนอร์แจ้งเตือนระงับการใช้งาน ลอยตรึงอยู่ด้านบนสุด */}
      {ban && (
        <div className="sticky top-0 z-[9999] w-full bg-rose-600 text-white shadow-md border-b border-rose-700">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xs">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 text-sm">
                <p className="font-bold leading-tight">
                  บัญชีร้านค้าของคุณถูกระงับการใช้งานชั่วคราว
                </p>
                <p className="truncate text-xs text-rose-100 opacity-90 mt-0.5">
                  สาเหตุ: {ban.reason?.trim() ? ban.reason : "ไม่ได้ระบุเหตุผล"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {SUPPORT_EMAIL && (
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("ขออุทธรณ์การระงับบัญชีร้านค้า")}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ติดต่อแอดมิน</span>
                </a>
              )}

              <button
                onClick={handleRecheck}
                disabled={rechecking}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-70 shadow-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${rechecking ? "animate-spin" : ""}`} />
                {rechecking ? "กำลังตรวจ..." : "ตรวจสอบสถานะ"}
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-700/60 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-800"
                title="ออกจากระบบ"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🌫️ เนื้อหาหน้าเว็บเดิม: เบลอและปิดการคลิกเมื่อถูกแบน */}
      <div
        className={`transition-all duration-300 ${
          ban
            ? "pointer-events-none select-none filter blur-[3px] opacity-60 grayscale-[20%]"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}