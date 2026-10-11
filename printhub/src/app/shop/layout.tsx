"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SuspendedBanner from "@/component/shop/SuspendedBanner";

const LOGIN_PATH = "/auth";

type BanInfo = { reason: string | null } | null;

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ban, setBan] = useState<BanInfo>(null);
  const [checked, setChecked] = useState(false);
  const [shopId, setShopId] = useState<string>("");

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("shop_id");
    localStorage.removeItem("shop_name");
    localStorage.clear();
    delete axios.defaults.headers.common.Authorization;
  };

  const checkStatus = useCallback(async (): Promise<boolean | null> => {
    try {
      const res = await axios.get("http://localhost:5000/api/shop/status");
<<<<<<< HEAD
      // 🟢 เช็กเฉพาะกรณีที่เซิร์ฟเวอร์ยืนยันว่า isBanned เป็น true
=======
>>>>>>> feature/admin
      if (res.data && res.data.isBanned) {
        setBan({ reason: res.data.reason ?? null });
        return true;
      }
      setBan(null);
      return false;
    } catch (err: any) {
<<<<<<< HEAD
      // 🟢 เช็กว่าสถานะ 403 นั้นเกิดจากการแบนจริง ไม่ใช่ error ทั่วไป
=======
>>>>>>> feature/admin
      if (err.response?.status === 403 && err.response?.data?.code === "SHOP_BANNED") {
        setBan({ reason: err.response?.data?.reason ?? null });
        return true;
      }
      setBan(null);
      return null;
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("shop_id") || localStorage.getItem("id");
    if (id) setShopId(id);

    const interceptorId = axios.interceptors.response.use(
      (r) => r,
      (err) => {
        const status = err.response?.status;
        if (status === 401) {
          clearSession();
          router.replace(LOGIN_PATH);
          return Promise.reject(err);
        }
        
<<<<<<< HEAD
        // ดักจับ 403 กรณีร้านถูกแบนจริงเท่านั้น
=======
>>>>>>> feature/admin
        if (status === 403 && err.response?.data?.code === "SHOP_BANNED") {
          setBan({ reason: err.response.data.reason ?? null });
          return Promise.resolve({ data: null, isBannedHandled: true });
        }

        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptorId);
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

  if (!checked) return null;

  return (
    <div className="relative min-h-screen">
<<<<<<< HEAD
      {/* 🔴 แบนเนอร์แจ้งเตือนระงับการใช้งาน */}
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

=======
      {/* 🔴 แบนเนอร์แจ้งเตือนระงับใช้งาน ลอยด้านบนสุด */}
      {ban && (
        <SuspendedBanner
          reason={ban.reason || undefined}
          shopId={shopId}
        />
      )}

      {/* 🟢 Tailwind Global Rules: ปรับแต่งให้ปุ่ม .logout-btn ทำงานได้เสมอเมื่อโดนแบน */}
      {ban && (
        <style jsx global>{`
          .logout-btn {
            pointer-events: auto !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 99999 !important;
          }
        `}</style>
      )}

      {/* 🚫 Read-Only Mode (Tailwind ล้วน):
          - ไม่เบลอแล้ว คมชัดปกติ
          - pointer-events-none: ห้ามกดปุ่ม/ลิงก์ย่อย
          - cursor-not-allowed: ชี้ตรงไหนขึ้นไอคอนห้าม (Blocked Cursor)
          - select-none: ป้องกันการคลุมดำก๊อปปี้ข้อความ */}
>>>>>>> feature/admin
      <div
        className={`transition-all duration-200 ${
          ban ? "pointer-events-none cursor-not-allowed select-none" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}