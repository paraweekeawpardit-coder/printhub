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

// 🟢 กำหนด API_URL หลักให้รองรับทั้ง Environment Variable และ Fallback
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = `${rawApiUrl.replace(/\/+$/, "")}/api`;

type Order = {
  id: string;
  order_no?: string; // 👈 เพิ่ม order_no ใน Type
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
  const [isSuspended, setIsSuspended] = useState<boolean>(false);

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

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;
        const headers = {
          shop_id: shopId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // 🟢 เปลี่ยนทุก Request ให้ยิงผ่าน ${API_URL}/shop/...
        const [
          numRes,
          scoreRes,
          incomeRes,
          ordersRes,
          financeRes,
          breakdownRes,
          reviewRes,
          profileRes,
        ] = await Promise.all([
          axios
            .get(`${API_URL}/shop/numWork`, { headers })
            .catch(() => ({ data: { numWork: 0 } })),
          axios
            .get(`${API_URL}/shop/getScore`, { headers })
            .catch(() => ({ data: { score: 0, totalReviews: 0 } })),
          axios
            .get(`${API_URL}/shop/getIncome`, { headers })
            .catch(() => ({ data: { income: 0, orderCount: 0 } })),
          axios
            .get(`${API_URL}/shop/getTopOrder`, { headers })
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_URL}/shop/getFinancialOverview`, {
              headers,
            })
            .catch(() => ({ data: null })),
          axios
            .get(`${API_URL}/shop/getOrderStatusBreakdown`, {
              headers,
            })
            .catch(() => ({ data: null })),
          axios
            .get(`${API_URL}/shop/getComplaintsAndReviews`, {
              headers,
            })
            .catch(() => ({ data: null })),
          axios
            .get(`${API_URL}/shop/profile/${shopId}`, { headers })
            .catch(() =>
              axios
                .get(`${API_URL}/shop/getProfile/${shopId}`, { headers })
                .catch(() => ({ data: null }))
            ),
        ]);

        const profData = profileRes?.data?.data || profileRes?.data;
        if (profData && profData.status === "suspended") {
          setIsSuspended(true);
        } else {
          setIsSuspended(false);
        }

        setNum(`${numRes.data.numWork ?? 0} รายการ`);
        setScore(`${Number(scoreRes.data.score ?? 0).toFixed(1)} / 5.0`);
        setIncome(
          `${Number(incomeRes.data.income ?? 0).toLocaleString()} บาท`
        );

        setTodayOrdersCount(incomeRes.data.orderCount ?? 0);
        setTotalReviewsCount(scoreRes.data.totalReviews ?? 0);

        setOrders(ordersRes.data ?? []);
        setFinancialData(
          financeRes.data ?? {
            totalGross: 0,
            totalFee: 0,
            totalNet: 0,
            transactions: [],
            financialTrend: {
              daily: [],
              weekly: [],
              monthly: [],
              yearly: [],
            },
          }
        );
        setBreakdownData(
          breakdownRes.data ?? {
            total: 0,
            counts: {},
            orders: [],
            trendData: { daily: [], weekly: [], monthly: [], yearly: [] },
          }
        );
        setReviewData(
          reviewRes.data ?? { reviews: [], complaints: [] }
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
    if (shopId) {
      fetchDashboardData();
    }
  }, [shopId, fetchDashboardData]);

  // ส่ง orderId (UUID) ในการนำทาง
  const handleOrderClick = (orderId: string) => {
    if (isSuspended) {
      console.warn("[Action Blocked] Account is suspended. Cannot view order details.");
      return;
    }
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
            onClick={() =>
              setActiveView(activeView === "orders" ? null : "orders")
            }
          >
            <DashboardCard
              title="รายการที่รอการดำเนินการ"
              value={num}
              subtitle="รอการดำเนินการ / รอพิมพ์"
              icon={Clock}
            />
          </div>

          <div
            className={`cursor-pointer rounded-2xl transition-all ${
              activeView === "financial" ? "ring-2 ring-[#0F2942]" : ""
            }`}
            onClick={() =>
              setActiveView(activeView === "financial" ? null : "financial")
            }
          >
            <DashboardCard
              title="รายได้ทั้งหมด"
              value={income}
              subtitle={`${todayOrdersCount} คำสั่งพิมพ์`}
              icon={DollarSign}
            />
          </div>

          <div
            className={`cursor-pointer rounded-2xl transition-all ${
              activeView === "reviews" ? "ring-2 ring-[#0F2942]" : ""
            }`}
            onClick={() =>
              setActiveView(activeView === "reviews" ? null : "reviews")
            }
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
                  disabled={isSuspended}
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