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
    <div className="min-h-screen flex flex-col">
      {isSuspended && <SuspendedBanner reason={suspendReason} />}
      <div className="flex-1">{children}</div>
    </div>
  );
}