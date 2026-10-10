"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Clock, DollarSign, Star } from "lucide-react";

import DashboardCard from "@/src/component/shop/dashboard-card";
import OrderCard from "@/src/component/shop/order-card";
import ShopNavbar from "@/src/component/shop/navbar";
import FinancialTable, { Transaction } from "@/src/component/shop/financial-table";
import OrderBreakdownModal from "@/src/component/shop/order-breakdown-modal";
import ReviewComplaintModal from "@/src/component/shop/review-complaint-modal";

type Order = {
  id: string;
  order_no?: string;
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

type TrendItem = { label: string; count: number };
type FinancialTrendItem = { label: string; amount: number };

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
    financialTrend?: {
      daily: FinancialTrendItem[];
      weekly: FinancialTrendItem[];
      monthly: FinancialTrendItem[];
      yearly: FinancialTrendItem[];
    };
  }>({
    totalGross: 0,
    totalFee: 0,
    totalNet: 0,
    transactions: [],
    financialTrend: { daily: [], weekly: [], monthly: [], yearly: [] },
  });

  const [breakdownData, setBreakdownData] = useState<{
    total: number;
    counts: Record<string, number>;
    orders: any[];
    trendData?: {
      daily: TrendItem[];
      weekly: TrendItem[];
      monthly: TrendItem[];
      yearly: TrendItem[];
    };
  }>({
    total: 0,
    counts: {},
    orders: [],
    trendData: { daily: [], weekly: [], monthly: [], yearly: [] },
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
    const id = localStorage.getItem("shop_id");
    if (id) {
      setShopId(id);
    } else {
      console.error("shop_id not found in localStorage");
    }
  }, []);

  const fetchDashboardData = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!shopId) return;

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        if (!opts?.silent) setLoading(true);

        const headers = { shop_id: shopId };

        // ใช้ Promise.allSettled เพื่อป้องกัน API บางตัวพังหรือส่งค่า null กลับมาแล้วทำให้แอปพังทั้งหน้า
        const [
          numRes,
          scoreRes,
          incomeRes,
          ordersRes,
          financeRes,
          breakdownRes,
          reviewRes,
        ] = await Promise.allSettled([
          axios.get("http://localhost:5000/shop/numWork", { headers }),
          axios.get("http://localhost:5000/shop/getScore", { headers }),
          axios.get("http://localhost:5000/shop/getIncome", { headers }),
          axios.get("http://localhost:5000/shop/getTopOrder", { headers }),
          axios.get("http://localhost:5000/shop/getFinancialOverview", { headers }),
          axios.get("http://localhost:5000/shop/getOrderStatusBreakdown", { headers }),
          axios.get("http://localhost:5000/shop/getComplaintsAndReviews", { headers }),
        ]);

        const numData = numRes.status === "fulfilled" ? numRes.value.data : null;
        const scoreData = scoreRes.status === "fulfilled" ? scoreRes.value.data : null;
        const incomeData = incomeRes.status === "fulfilled" ? incomeRes.value.data : null;
        const ordersData = ordersRes.status === "fulfilled" ? ordersRes.value.data : null;
        const financeDataRes = financeRes.status === "fulfilled" ? financeRes.value.data : null;
        const breakdownDataRes = breakdownRes.status === "fulfilled" ? breakdownRes.value.data : null;
        const reviewDataRes = reviewRes.status === "fulfilled" ? reviewRes.value.data : null;

        setNum(`${numData?.numWork ?? 0} รายการ`);
        setScore(`${scoreData?.score ?? 0.0} / 5.0`);
        setIncome(`${incomeData?.income ?? 0} บาท`);

        setTodayOrdersCount(incomeData?.orderCount ?? 0);
        setTotalReviewsCount(scoreData?.totalReviews ?? 0);

        setOrders(ordersData ?? []);
        setFinancialData(
          financeDataRes ?? {
            totalGross: 0,
            totalFee: 0,
            totalNet: 0,
            transactions: [],
            financialTrend: { daily: [], weekly: [], monthly: [], yearly: [] },
          }
        );
        setBreakdownData(
          breakdownDataRes ?? {
            total: 0,
            counts: {},
            orders: [],
            trendData: { daily: [], weekly: [], monthly: [], yearly: [] },
          }
        );
        setReviewData(
          reviewDataRes ?? { reviews: [], complaints: [] }
        );
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
    fetchDashboardData();
  }, [fetchDashboardData]);

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
          <DashboardCard
            title="รายการที่รอการดำเนินการ"
            value={num}
            subtitle="รอการดำเนินการ / รอพิมพ์"
            icon={Clock}
            active={activeView === "orders"}
            onClick={() => setActiveView(activeView === "orders" ? null : "orders")}
          />

          <DashboardCard
            title="รายได้ทั้งหมด"
            value={income}
            subtitle={`${todayOrdersCount} คำสั่งพิมพ์วันนี้`}
            icon={DollarSign}
            active={activeView === "financial"}
            onClick={() => setActiveView(activeView === "financial" ? null : "financial")}
          />

          <DashboardCard
            title="คะแนนรีวิวเฉลี่ย"
            value={score}
            subtitle={`${totalReviewsCount} รีวิวทั้งหมด`}
            icon={Star}
            active={activeView === "reviews"}
            onClick={() => setActiveView(activeView === "reviews" ? null : "reviews")}
          />
        </div>

        {/* Dynamic Detail Section */}
        {activeView === "orders" && (
          <div className="mb-10">
            <OrderBreakdownModal
              counts={breakdownData.counts}
              total={breakdownData.total}
              orders={breakdownData.orders}
              trendData={breakdownData.trendData}
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
              financialTrend={financialData.financialTrend}
              onOrderClick={handleOrderClick}
            />
          </div>
        )}

        {activeView === "reviews" && (
          <div className="mb-10">
            <ReviewComplaintModal
              reviews={reviewData.reviews}
              complaints={reviewData.complaints}
              onOrderClick={handleOrderClick}
            />
          </div>
        )}

        {/* รายการคำสั่งพิมพ์ล่าสุด */}
        <h2 className="mb-6 text-lg font-bold text-[#0F2942]">
          รายการคำสั่งพิมพ์วันนี้
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
                ไม่มีรายการคำสั่งพิมพ์วันนี้
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}