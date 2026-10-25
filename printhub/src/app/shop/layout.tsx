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
      if (res.data && res.data.isBanned) {
        setBan({ reason: res.data.reason ?? null });
        return true;
      }
      setBan(null);
      return false;
    } catch (err: any) {
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