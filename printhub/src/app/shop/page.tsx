"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import DashboardCard from "@/src/component/shop/dashboard-card";
import OrderCard from "@/src/component/shop/order-card";
import ShopNavbar from "@/src/component/shop/navbar";

type Order = {
  id: string;
  customer_id: string;
  shop_id: string;
  description: string | null;
  order_date: string;
  total_price: number;
  customer?: {
    first_name: string;
    last_name: string;
  };
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

  // =========================
  // Get shop_id from localStorage
  // =========================
  useEffect(() => {
    const id = "2a1e1ec6-1abd-49df-bcfe-cc66e64521d9";

    if (id) {
      setShopId(id);
    } else {
      console.error("shop_id not found in localStorage");
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (!shopId) {
      return;
    }

    try {
      setLoading(true);

      const headers = {
        shop_id: shopId,
      };

      console.log("Sending shop_id =", shopId);

      const [numRes, scoreRes, incomeRes, ordersRes] =
        await Promise.all([
          axios.get("http://localhost:5000/shop/numWork", {
            headers,
          }),

          axios.get("http://localhost:5000/shop/getScore", {
            headers,
          }),

          axios.get("http://localhost:5000/shop/getIncome", {
            headers,
          }),

          axios.get("http://localhost:5000/shop/getTopOrder", {
            headers,
          }),
        ]);

      setNum(`${numRes.data.numWork ?? 0} รายการ`);

      setScore(`${scoreRes.data.score ?? 0.0} / 5.0`);

      setIncome(`${incomeRes.data.income ?? 0} บาท`);

      setOrders(ordersRes.data ?? []);
    } catch (err) {
      console.error("Fetch dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchDashboardData();
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
            subtitle="0 คำสั่งพิมพ์"
          />

          <DashboardCard
            title="คะแนนรีวิวเฉลี่ย"
            value={score}
            subtitle="0 รีวิว"
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
