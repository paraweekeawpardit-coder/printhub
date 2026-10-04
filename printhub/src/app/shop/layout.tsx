"use client";

import React, { useEffect, useState } from "react";
import SuspendedBanner from "@/component/shop/SuspendedBanner";
import axios from "axios";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [suspendReason, setSuspendReason] = useState<string>("");

  useEffect(() => {
    const checkShopStatus = async () => {
      let shopId =
        localStorage.getItem("shop_id") ||
        localStorage.getItem("id");

      if (!shopId) {
        try {
          const stored = localStorage.getItem("shop") || localStorage.getItem("user");
          if (stored) {
            const parsed = JSON.parse(stored);
            shopId = parsed.id || parsed.shop_id;
          }
        } catch (e) {
          console.error("Layout JSON parse error:", e);
        }
      }

      console.log("[Layout] Checking status for shopId:", shopId);

      if (!shopId) return;

      const token = localStorage.getItem("token");
      const headers = {
        shop_id: shopId,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        let resData = null;
        try {
          const res = await axios.get(`http://localhost:5000/api/shop/profile/${shopId}`, { headers });
          resData = res.data;
        } catch (err) {
          const res = await axios.get(`http://localhost:5000/shop/getProfile/${shopId}`, { headers });
          resData = res.data;
        }

        console.log("[Layout] Shop profile response:", resData);

        if (resData && (resData.status === "suspended" || resData.data?.status === "suspended")) {
          const data = resData.data || resData;
          setIsSuspended(true);
          setSuspendReason(data.suspend_reason || "");
        } else {
          setIsSuspended(false);
        }
      } catch (error) {
        console.error("[Layout] Fetch shop status failed:", error);
      }
    };

    checkShopStatus();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* CSS บล็อกทุกอย่างในหน้า เว้นแต่ปุ่ม 'ออกจากระบบ' และ Banner */}
      {isSuspended && (
        <style jsx global>{`
          /* บล็อกฟิลด์กรอกข้อมูล ปุ่มกดทั่วไป เลือกไฟล์ สวิตช์เปิดปิด */
          .suspended-mode input,
          .suspended-mode select,
          .suspended-mode textarea,
          .suspended-mode button:not(.logout-btn):not(.banner-btn) {
            pointer-events: none !important;
            opacity: 0.6 !important;
            cursor: not-allowed !important;
          }

          /* ยินยอมให้ปุ่มออกจากระบบ และปุ่มบนแบนเนอร์ทำงานได้ตามปกติ */
          .logout-btn,
          .banner-btn,
          .banner-btn * {
            pointer-events: auto !important;
            opacity: 1 !important;
            cursor: pointer !important;
          }
        `}</style>
      )}

      {/* 1. Sticky Banner ด้านบนสุด */}
      {isSuspended && (
        <div className="sticky top-0 z-50 w-full banner-btn">
          <SuspendedBanner reason={suspendReason} />
        </div>
      )}

      {/* 2. เนื้อหาทั้งหมด (ใส่ class suspended-mode ถ้าถูกระงับ) */}
      <div className={`flex-1 ${isSuspended ? "suspended-mode" : ""}`}>
        {children}
      </div>
    </div>
  );
}