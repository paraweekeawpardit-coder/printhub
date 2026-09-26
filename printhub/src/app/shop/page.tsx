"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import DashboardCard from "@/src/component/shop/dashboard-card";
import OrderCard from "@/src/component/shop/order-card";
import ShopNavbar from "@/src/component/shop/navbar";

// 1. อัปเดต Type ให้ตรงกับข้อมูลที่ Backend (home.ts) ส่งกลับมา
type FileItem = {
  id: string;
  category: string;
  filename: string;
  url: string;
  page_count?: number;
};

type Order = {
  id: string;
  customer_id: string;
  shop_id: string;
  description: string | null;
  order_date: string;
  total_price: number;
  latest_status?: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  files?: FileItem[];
  work_status?: {
    updated_at: string;
    status: {
      state: string;
    };
  }[];
};

export default function ShopPage() {
  const [num, setNum] = useState<string>("0 รายการ");
  const [score, setScore] = useState<string>("0.0 / 5.0");
  const [income, setIncome] = useState<string>("0.00 บาท");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shopId, setShopId] = useState<string>("");

  const router = useRouter();
  const isFetchingRef = useRef(false);

  // 1. ดึง shop_id จาก localStorage (แก้ Fallback ให้เป็น ID จริงใน Supabase)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedShopId =
        localStorage.getItem("shop_id") ||
        localStorage.getItem("id") ||
        "cd04a0a0-9a52-49ff-a84c-df32288ca384"; // <--- แก้ ID ตรงนี้ให้ตรงกับ Database

      if (storedShopId && storedShopId !== "undefined" && storedShopId !== "null") {
        setShopId(storedShopId);
      } else {
        console.error("shop_id not found in localStorage");
        setLoading(false);
      }
    }
  }, []);

  // 2. ฟังก์ชันดึงข้อมูล Dashboard
  const fetchDashboardData = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!shopId) return;

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        if (!opts?.silent) setLoading(true);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers = {
          shop_id: String(shopId),
          "shop-id": String(shopId),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const baseURL = "http://localhost:5000/shop";

        const [numRes, scoreRes, incomeRes, ordersRes] = await Promise.allSettled([
          axios.get(`${baseURL}/numWork`, { headers, params: { shop_id: shopId } }),
          axios.get(`${baseURL}/getScore`, { headers, params: { shop_id: shopId } }),
          axios.get(`${baseURL}/getIncome`, { headers, params: { shop_id: shopId } }),
          axios.get(`${baseURL}/getTopOrder`, { headers, params: { shop_id: shopId } }),
        ]);

        if (numRes.status === "fulfilled") {
          const val = numRes.value.data;
          const count = typeof val === "number" ? val : (val?.numWork ?? val?.count ?? 0);
          setNum(`${count} รายการ`);
        }

        if (scoreRes.status === "fulfilled") {
          const val = scoreRes.value.data;
          const scoreVal = typeof val === "number" ? val : (val?.score ?? 0.0);
          setScore(`${Number(scoreVal).toFixed(1)} / 5.0`);
        }

        if (incomeRes.status === "fulfilled") {
          const val = incomeRes.value.data;
          const incomeVal = typeof val === "number" ? val : (val?.income ?? val?.total_income ?? 0);
          setIncome(`${Number(incomeVal).toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท`);
        }

        if (ordersRes.status === "fulfilled") {
          const val = ordersRes.value.data;
          const orderList = Array.isArray(val) ? val : val?.orders || val?.data || [];
          setOrders(orderList);
        }
      } catch (err) {
        console.error("Fetch dashboard data error:", err);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [shopId]
  );

  useEffect(() => {
    if (shopId) {
      fetchDashboardData();
    }
  }, [shopId, fetchDashboardData]);

  useEffect(() => {
    const handleFocus = () => fetchDashboardData({ silent: true });
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchDashboardData({ silent: true });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchDashboardData]);

  const handleOrderClick = (orderId: string) => {
    router.push(`/shop/detail/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopNavbar />

      <div className="mx-auto max-w-7xl px-12 py-10">
        <h2 className="mb-6 text-lg font-bold text-[#0F2942]">
          ผลการดำเนินงานด้านคำสั่งพิมพ์
        </h2>

        <div className="mb-16 flex gap-5">
          <DashboardCard
            title="ออเดอร์รอการดำเนินการ"
            value={num}
            subtitle="กำลังเตรียม / รอพิมพ์"
          />

          <DashboardCard
            title="รายได้วันนี้"
            value={income}
            subtitle="สรุปรายได้สะสม"
          />

          <DashboardCard
            title="คะแนนรีวิวเฉลี่ย"
            value={score}
            subtitle="คะแนนจากลูกค้า"
          />
        </div>

        <h2 className="mb-8 text-lg font-bold text-[#0F2942]">
          รายการคำสั่งพิมพ์ล่าสุด
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.length > 0 ? (
              orders.map((item) => (
                <OrderCard
                  key={item.id}
                  order={item}
                  onClick={() => handleOrderClick(item.id)}
                />
              ))
            ) : (
              <p className="col-span-full py-8 text-center text-slate-500">
                ไม่มีรายการคำสั่งพิมพ์ล่าสุด
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}