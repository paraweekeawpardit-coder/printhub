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

  // Control View สำหรับสลับรายละเอียดของทั้ง 3 Cards
  const [activeView, setActiveView] = useState<"orders" | "financial" | "reviews" | null>(null);

  // Financial Data State
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

  // Order Breakdown State
  const [breakdownData, setBreakdownData] = useState<{
    total: number;
    counts: Record<string, number>;
    orders: any[];
  }>({
    total: 0,
    counts: {},
    orders: [],
  });

  // Review & Complaint State
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

  // 2. ฟังก์ชันดึงข้อมูล Dashboard
  const fetchDashboardData = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!shopId) return;

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        if (!opts?.silent) setLoading(true);

        const headers = { shop_id: shopId };

        const [
          numRes,
          scoreRes,
          incomeRes,
          ordersRes,
          financeRes,
          breakdownRes,
          reviewRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/shop/numWork", { headers }),
          axios.get("http://localhost:5000/shop/getScore", { headers }),
          axios.get("http://localhost:5000/shop/getIncome", { headers }),
          axios.get("http://localhost:5000/shop/getTopOrder", { headers }),
          axios.get("http://localhost:5000/shop/getFinancialOverview", { headers }),
          axios.get("http://localhost:5000/shop/getOrderStatusBreakdown", { headers }),
          axios.get("http://localhost:5000/shop/getComplaintsAndReviews", { headers }),
        ]);

        setNum(`${numRes.data.numWork ?? 0} รายการ`);
        setScore(`${scoreRes.data.score ?? 0.0} / 5.0`);
        setIncome(`${incomeRes.data.income ?? 0} บาท`);

        setTodayOrdersCount(incomeRes.data.orderCount ?? 0);
        setTotalReviewsCount(scoreRes.data.totalReviews ?? 0);

        setOrders(ordersRes.data ?? []);
        setFinancialData(
          financeRes.data ?? { totalGross: 0, totalFee: 0, totalNet: 0, transactions: [] }
        );
        setBreakdownData(
          breakdownRes.data ?? { total: 0, counts: {}, orders: [] }
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
            title="ออเดอร์รอการดำเนินการ"
            value={num}
            subtitle="กำลังเตรียม / รอพิมพ์"
            icon={Clock}
            active={activeView === "orders"}
            onClick={() => setActiveView(activeView === "orders" ? null : "orders")}
          />

          <DashboardCard
            title="รายได้วันนี้"
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

        {/* Dynamic Detail Section เมื่อกดคลิกแต่ละ Card */}
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