"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import StatCard from "../admin/StatCard";

interface FinanceStats {
  totalPlatformIncome: number;
  totalGrossVolume: number;
  pendingPayout: number;
}

interface ShopRevenue {
  id: string;
  shop_name: string;
  owner_name: string;
  status: string;
  orderCount: number;
  totalSales: number;
  platformFee: number;
  netPayout: number;
}

interface OrderItem {
  payment_id: string;
  order_no: string;
  shop_id: string;
  shop_name: string;
  payment_date: string;
  total_amount: number;
  platform_fee: number;
  shop_income: number;
  is_small_order?: boolean;
  small_order_fee?: number;
  status: string;
}

interface OwnerDashboardProps {
  onLogout?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OwnerDashboard({ onLogout }: OwnerDashboardProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<"today" | "month" | "all">("all");
  const [viewMode, setViewMode] = useState<"byShop" | "byOrder">("byShop");

  // ค่าปัจจุบันสำหรับจำกัดไม่ให้เลือกอนาคต (Max Limits)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const currentMonthStr = useMemo(() => new Date().toISOString().slice(0, 7), []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  
  const [selectedShopId, setSelectedShopId] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [finance, setFinance] = useState<FinanceStats>({
    totalPlatformIncome: 0,
    totalGrossVolume: 0,
    pendingPayout: 0,
  });

  const [shopRevenues, setShopRevenues] = useState<ShopRevenue[]>([]);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);

  const fetchOwnerFinanceData = useCallback(
    async (
      overrideRange = timeRange,
      overrideDate = selectedDate,
      overrideMonth = selectedMonth
    ) => {
      setLoading(true);
      try {
        let queryUrl = `${API_BASE_URL}/api/owner/stats?timeRange=${overrideRange}&t=${Date.now()}`;
        if (overrideRange === "today" && overrideDate) {
          queryUrl += `&date=${overrideDate}`;
        } else if (overrideRange === "month" && overrideMonth) {
          queryUrl += `&month=${overrideMonth}`;
        }

        const res = await fetch(queryUrl);
        const result = await res.json();

        if (res.ok && result.success) {
          setFinance(result.data.finance);
          setShopRevenues(result.data.shopRevenues || []);
          setAllOrders(result.data.allOrders || []);
        }
      } catch (err) {
        console.error("Fetch Owner Finance Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [timeRange, selectedDate, selectedMonth]
  );

  useEffect(() => {
    fetchOwnerFinanceData(timeRange, selectedDate, selectedMonth);
  }, [timeRange, selectedDate, selectedMonth, fetchOwnerFinanceData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode, selectedShopId, timeRange]);

  const handleResetFilters = () => {
    setTimeRange("all");
    setSelectedDate(todayStr);
    setSelectedMonth(currentMonthStr);
    setSelectedShopId("all");
    setViewMode("byShop");
    setCurrentPage(1);
    fetchOwnerFinanceData("all", todayStr, currentMonthStr);
  };

  const filteredShopRevenues = useMemo(() => {
    if (selectedShopId === "all") return shopRevenues;
    return shopRevenues.filter((shop) => shop.id === selectedShopId);
  }, [shopRevenues, selectedShopId]);

  const filteredOrders = useMemo(() => {
    if (selectedShopId === "all") return allOrders;
    return allOrders.filter((order) => order.shop_id === selectedShopId);
  }, [allOrders, selectedShopId]);

  const totalItems = viewMode === "byShop" ? filteredShopRevenues.length : filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedShopRevenues = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShopRevenues.slice(start, start + itemsPerPage);
  }, [filteredShopRevenues, currentPage, itemsPerPage]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h2 className="text-xl font-bold">ภาพรวมการเงินระบบ PrintHub (Owner)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">สรุปข้อมูลส่วนแบ่งแพลตฟอร์ม เงินหมุนเวียน และยอดโอนร้านค้าจากระบบจริง</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ล็อกไม่ให้เลือกวันในอนาคตด้วย max={todayStr} */}
          {timeRange === "today" && (
            <input
              type="date"
              max={todayStr}
              value={selectedDate}
              onChange={(e) => {
                const newDate = e.target.value > todayStr ? todayStr : e.target.value;
                setSelectedDate(newDate);
                fetchOwnerFinanceData("today", newDate, selectedMonth);
              }}
              className="bg-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none cursor-pointer"
            />
          )}

          {/* ล็อกไม่ให้เลือกเดือนในอนาคตด้วย max={currentMonthStr} */}
          {timeRange === "month" && (
            <input
              type="month"
              max={currentMonthStr}
              value={selectedMonth}
              onChange={(e) => {
                const newMonth = e.target.value > currentMonthStr ? currentMonthStr : e.target.value;
                setSelectedMonth(newMonth);
                fetchOwnerFinanceData("month", selectedDate, newMonth);
              }}
              className="bg-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none cursor-pointer"
            />
          )}

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setTimeRange("today");
                fetchOwnerFinanceData("today", selectedDate, selectedMonth);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === "today" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              รายวัน
            </button>
            <button
              onClick={() => {
                setTimeRange("month");
                fetchOwnerFinanceData("month", selectedDate, selectedMonth);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === "month" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              รายเดือน
            </button>
            <button
              onClick={() => {
                setTimeRange("all");
                fetchOwnerFinanceData("all", selectedDate, selectedMonth);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeRange === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ทั้งหมด
            </button>
          </div>

          <button
            onClick={() => fetchOwnerFinanceData(timeRange, selectedDate, selectedMonth)}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            <span>{loading ? "กำลังโหลด..." : "รีเฟรช"}</span>
          </button>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer"
          >
            ล้างตัวกรอง
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer"
            >
              ออกจากสิทธิ์
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="รายได้ส่วนแบ่งเว็บทั้งหมด"
          value={loading ? "..." : finance.totalPlatformIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          unit="บาท"
          subtitle="รวมจากค่าธรรมเนียม 8% และ Small Order Fee"
        />
        <StatCard
          title="เงินหมุนเวียนในระบบ"
          value={loading ? "..." : finance.totalGrossVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          unit="บาท"
          subtitle="รวมยอดชำระจริงทั้งหมดจากลูกค้า"
        />
        <StatCard
          title="เงินรอโอนให้ร้านค้า"
          value={loading ? "..." : finance.pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          unit="บาท"
          subtitle="รวมยอดสุทธิหลังหักค่าธรรมเนียม รอเคลียริ่งรอบโอน"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-3xs z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              <span>กำลังดึงข้อมูลล่าสุด...</span>
            </div>
          </div>
        )}

        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">สรุปรายได้ระบบ (Revenue Breakdown)</h3>
            <p className="text-xs text-slate-500 mt-0.5">สลับการแสดงผลแบบรวมร้านค้าหรือแยกตามรายออเดอร์ได้</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode("byShop")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "byShop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                รวมตามร้านค้า ({shopRevenues.length})
              </button>
              <button
                onClick={() => setViewMode("byOrder")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "byOrder" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                แยกรายออเดอร์ ({allOrders.length})
              </button>
            </div>

            <select
              value={selectedShopId}
              onChange={(e) => setSelectedShopId(e.target.value)}
              className="bg-slate-100 text-xs px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-200 transition-all"
            >
              <option value="all">ร้านค้าทั้งหมด</option>
              {shopRevenues.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {viewMode === "byShop" ? (
            /* ตาราง 1: รวมตามร้านค้า */
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-5">ร้านค้า</th>
                  <th className="p-3.5">เจ้าของร้าน</th>
                  <th className="p-3.5 text-center">จำนวนออเดอร์</th>
                  <th className="p-3.5 text-right">ยอดรวมชำระ</th>
                  <th className="p-3.5 text-right">รายได้เข้าเว็บ</th>
                  <th className="p-3.5 text-right pr-5">ยอดโอนร้านค้าสุทธิ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedShopRevenues.length > 0 ? (
                  paginatedShopRevenues.map((shop) => (
                    <tr key={shop.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-slate-900">{shop.shop_name}</td>
                      <td className="p-3.5 text-slate-500">{shop.owner_name}</td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold">
                          {shop.orderCount} ออเดอร์
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-semibold text-slate-900">
                        ฿{shop.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right font-mono text-emerald-600 font-bold bg-emerald-50/30">
                        +฿{shop.platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right pr-5 font-mono font-semibold text-slate-700">
                        ฿{shop.netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      ไม่พบข้อมูลรายการขาย
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* ตาราง 2: แยกรายออเดอร์ */
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-5">เลขที่ออเดอร์</th>
                  <th className="p-3.5">ร้านค้า</th>
                  <th className="p-3.5">วันที่ / เวลา</th>
                  <th className="p-3.5 text-right">ยอดรวมชำระ</th>
                  <th className="p-3.5 text-right">รายได้เข้าเว็บ</th>
                  <th className="p-3.5 text-right pr-5">ยอดโอนร้านค้าสุทธิ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr key={order.payment_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600">#{order.order_no}</span>
                          {order.is_small_order ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                              Small Order
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                              Standard (8%)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{order.shop_name}</td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                        {order.payment_date ? new Date(order.payment_date).toLocaleString("th-TH") : "-"}
                      </td>
                      <td className="p-3.5 text-right font-mono font-semibold text-slate-900">
                        ฿{order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600 bg-emerald-50/30">
                        +฿{order.platform_fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right pr-5 font-mono font-semibold text-slate-700">
                        ฿{order.shop_income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      ไม่พบรายการออเดอร์
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-1.5 bg-slate-50/50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
            >
              ‹ ย้อนกลับ
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
            >
              ถัดไป ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}