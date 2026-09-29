"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Clock, DollarSign, Star } from "lucide-react";

import DashboardCard from "@/component/shop/dashboard-card";
import OrderCard from "@/component/shop/order-card";
import ShopNavbar from "@/component/shop/navbar";
import FinancialTable, { Transaction } from "@/component/shop/financial-table";
import OrderBreakdownModal from "@/component/shop/order-breakdown-modal";
import ReviewComplaintModal from "@/component/shop/review-complaint-modal";

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
  current_status?: {
    id: string;
    state: string;
  };
};

export default function ShopPage() {
  const [num, setNum] = useState<string>("0 รายการ");
  const [score, setScore] = useState<string>("0.0 / 5.0");
  const [income, setIncome] = useState<string>("0.00 บาท");
  const [todayOrdersCount, setTodayOrdersCount] = useState<number>(0);
  const [totalReviewsCount, setTotalReviewsCount] = useState<number>(0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shopId, setShopId] = useState<string>("");

  const [activeView, setActiveView] = useState<"orders" | "financial" | "reviews" | null>(null);

  const [financialData, setFinancialData] = useState<{
    totalGross: number;
    totalFee: number;
    totalNet: number;
    transactions: Transaction[];
  }>({
    totalGross: 0,
    totalFee: 0,
    totalNet: 0,
    transactions: [],
  });

  const [breakdownData, setBreakdownData] = useState<{
    total: number;
    counts: Record<string, number>;
    orders: any[];
  }>({
    total: 0,
    counts: {},
    orders: [],
  });

  const [reviewData, setReviewData] = useState<{
    reviews: any[];
    complaints: any[];
  }>({
    reviews: [],
    complaints: [],
  });

  const router = useRouter();
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const id = localStorage.getItem("shop_id") || localStorage.getItem("id");
    if (id) {
      setShopId(id);
    }
  }, []);

  const fetchDashboardData = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!shopId) return;

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        if (!opts?.silent) setLoading(true);

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = {
          shop_id: shopId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // 💡 ตรวจสอบ Path ว่ามี /api หรือไม่ตาม Backend ที่ตั้งไว้
        const [
          numRes,
          scoreRes,
          incomeRes,
          ordersRes,
          financeRes,
          breakdownRes,
          reviewRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/shop/numWork", { headers }).catch(() => ({ data: { numWork: 0 } })),
          axios.get("http://localhost:5000/shop/getScore", { headers }).catch(() => ({ data: { score: 0, totalReviews: 0 } })),
          axios.get("http://localhost:5000/shop/getIncome", { headers }).catch(() => ({ data: { income: 0, orderCount: 0 } })),
          axios.get("http://localhost:5000/shop/getTopOrder", { headers }).catch(() => ({ data: [] })),
          axios.get("http://localhost:5000/shop/getFinancialOverview", { headers }).catch(() => ({ data: null })),
          axios.get("http://localhost:5000/shop/getOrderStatusBreakdown", { headers }).catch(() => ({ data: null })),
          axios.get("http://localhost:5000/shop/getComplaintsAndReviews", { headers }).catch(() => ({ data: null })),
        ]);

        setNum(`${numRes.data.numWork ?? 0} รายการ`);
        setScore(`${Number(scoreRes.data.score ?? 0).toFixed(1)} / 5.0`);
        setIncome(`${Number(incomeRes.data.income ?? 0).toLocaleString()} บาท`);

        setTodayOrdersCount(incomeRes.data.orderCount ?? 0);
        setTotalReviewsCount(scoreRes.data.totalReviews ?? 0);

        setOrders(ordersRes.data ?? []);
        if (financeRes.data) setFinancialData(financeRes.data);
        if (breakdownRes.data) setBreakdownData(breakdownRes.data);
        if (reviewRes.data) setReviewData(reviewRes.data);
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

  const handleOrderClick = (orderId: string) => {
    router.push(`/shop/detail/${orderId}`);
  };

  const handleStatusUpdated = () => {
    fetchDashboardData({ silent: true });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <ShopNavbar />

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <h2 className="mb-6 text-lg font-bold text-[#0F2942]">
          ผลการดำเนินงานด้านคำสั่งพิมพ์
        </h2>

        {/* 3 Dashboard Summary Cards */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div
            className={`cursor-pointer rounded-2xl transition-all ${
              activeView === "orders" ? "ring-2 ring-[#0F2942]" : ""
            }`}
            onClick={() => setActiveView(activeView === "orders" ? null : "orders")}
          >
            <DashboardCard
              title="ออเดอร์รอการดำเนินการ"
              value={num}
              subtitle="กำลังเตรียม / รอพิมพ์"
              icon={Clock}
            />
          </div>

          <div
            className={`cursor-pointer rounded-2xl transition-all ${
              activeView === "financial" ? "ring-2 ring-[#0F2942]" : ""
            }`}
            onClick={() => setActiveView(activeView === "financial" ? null : "financial")}
          >
            <DashboardCard
              title="รายได้วันนี้"
              value={income}
              subtitle={`${todayOrdersCount} คำสั่งพิมพ์วันนี้`}
              icon={DollarSign}
            />
          </div>

          <div
            className={`cursor-pointer rounded-2xl transition-all ${
              activeView === "reviews" ? "ring-2 ring-[#0F2942]" : ""
            }`}
            onClick={() => setActiveView(activeView === "reviews" ? null : "reviews")}
          >
            <DashboardCard
              title="คะแนนรีวิวเฉลี่ย"
              value={score}
              subtitle={`${totalReviewsCount} รีวิวทั้งหมด`}
              icon={Star}
            />
          </div>
        </div>

        {/* Dynamic Detail Section */}
        {activeView === "orders" && (
          <div className="mb-10">
            <OrderBreakdownModal
              counts={breakdownData.counts}
              total={breakdownData.total}
              orders={breakdownData.orders}
              onOrderClick={handleOrderClick}
            />
          </div>
        )}

        {activeView === "financial" && (
          <div className="mb-10">
            <FinancialTable
              totalGross={financialData.totalGross}
              totalFee={financialData.totalFee}
              totalNet={financialData.totalNet}
              transactions={financialData.transactions}
              onOrderClick={handleOrderClick}
            />
          </div>
        )}

        {activeView === "reviews" && (
          <div className="mb-10">
            <ReviewComplaintModal
              reviews={reviewData.reviews}
              complaints={reviewData.complaints}
            />
          </div>
        )}

        {/* รายการคำสั่งพิมพ์ล่าสุด */}
        <h2 className="mb-6 text-lg font-bold text-[#0F2942]">
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
                  onUpdateStatus={handleStatusUpdated}
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