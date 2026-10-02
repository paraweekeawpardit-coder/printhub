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
  totalSales: number;
  platformFee: number;
  netPayout: number;
}

interface OwnerDashboardProps {
  onLogout?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OwnerDashboard({ onLogout }: OwnerDashboardProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<"today" | "month" | "all">("all");

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  
  const [selectedShopId, setSelectedShopId] = useState<string>("all");

  const [finance, setFinance] = useState<FinanceStats>({
    totalPlatformIncome: 0,
    totalGrossVolume: 0,
    pendingPayout: 0,
  });

  const [shopRevenues, setShopRevenues] = useState<ShopRevenue[]>([]);

  // ฟังก์ชันยิง API ดึงข้อมูล
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
          setShopRevenues(result.data.shopRevenues);
        } else {
          console.error("API Error Response:", result);
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

  const handleResetFilters = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const monthStr = new Date().toISOString().slice(0, 7);
    
    setTimeRange("all");
    setSelectedDate(todayStr);
    setSelectedMonth(monthStr);
    setSelectedShopId("all");
    fetchOwnerFinanceData("all", todayStr, monthStr);
  };

  const filteredShopRevenues = useMemo(() => {
    if (selectedShopId === "all") return shopRevenues;
    return shopRevenues.filter((shop) => shop.id === selectedShopId);
  }, [shopRevenues, selectedShopId]);

  const displayFinance = useMemo(() => {
    if (selectedShopId === "all") return finance;

    const filtered = shopRevenues.filter((shop) => shop.id === selectedShopId);
    const totalGross = filtered.reduce((acc, item) => acc + item.totalSales, 0);
    const totalIncome = filtered.reduce((acc, item) => acc + item.platformFee, 0);
    const pending = filtered.reduce((acc, item) => acc + item.netPayout, 0);

    return {
      totalPlatformIncome: totalIncome,
      totalGrossVolume: totalGross,
      pendingPayout: pending,
    };
  }, [finance, shopRevenues, selectedShopId]);

  return (
    <div className="space-y-6">
      {/* Header และ Action Control */}
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

        {/* ปุ่มควบคุมช่วงเวลา, Refresh, Reset, Logout */}
        <div className="flex flex-wrap items-center gap-2">
          {timeRange === "today" && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                fetchOwnerFinanceData("today", e.target.value, selectedMonth);
              }}
              className="bg-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none cursor-pointer"
            />
          )}

          {timeRange === "month" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                fetchOwnerFinanceData("month", selectedDate, e.target.value);
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
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            title="ดึงข้อมูลล่าสุดตามช่วงเวลาที่เลือก"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            รีเฟรช
          </button>

          <button
            onClick={handleResetFilters}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer active:scale-95"
            title="คืนค่าตัวกรองทั้งหมดกลับเป็นค่าเริ่มต้น"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            ล้างตัวกรอง
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              ออกจากสิทธิ์
            </button>
          )}
        </div>
      </div>

      {/* สถิติการเงิน 3 ช่องหลัก */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
          กำลังโหลดข้อมูลการเงินจริงจากระบบ...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="รายได้ค่าธรรมเนียมทั้งหมด"
              value={displayFinance.totalPlatformIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              unit="บาท"
              subtitle="รายได้ส่วนแบ่ง 8% ของแพลตฟอร์ม"
            />
            <StatCard
              title="เงินหมุนเวียนในระบบ"
              value={displayFinance.totalGrossVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              unit="บาท"
              subtitle="รวมยอดสั่งซื้อทั้งหมดจากร้านค้าที่เลือก"
            />
            <StatCard
              title="เงินรอโอนให้ร้านค้า"
              value={displayFinance.pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              unit="บาท"
              subtitle="ยอดคงเหลือรอเคลียริ่งรอบโอนเงิน"
            />
          </div>

          {/* ตารางสรุปรายได้แยกตามร้านค้า */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">สรุปรายได้แยกตามร้านค้า (Shop Revenue Breakdown)</h3>
                <p className="text-xs text-slate-500 mt-0.5">ยอดขายรวม ส่วนแบ่งระบบ และยอดสุทธิที่ต้องโอนให้แต่ละร้าน</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <svg className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                  </svg>
                  <select
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    className="bg-slate-100 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-200 transition-all"
                  >
                    <option value="all">ร้านค้าทั้งหมด ({shopRevenues.length})</option>
                    {shopRevenues.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.shop_name} ({shop.owner_name})
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                  แสดง {filteredShopRevenues.length} / {shopRevenues.length} ร้านค้า
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-5">ร้านค้า</th>
                    <th className="p-3.5">เจ้าของร้าน</th>
                    <th className="p-3.5 text-center">สถานะ</th>
                    <th className="p-3.5 text-right">ยอดขายรวม (100%)</th>
                    <th className="p-3.5 text-right">ส่วนแบ่งระบบ (8%)</th>
                    <th className="p-3.5 text-right pr-5">ยอดโอนร้านค้า (92%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredShopRevenues.length > 0 ? (
                    filteredShopRevenues.map((shop) => (
                      <tr key={shop.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 pl-5 font-semibold text-slate-900">{shop.shop_name}</td>
                        <td className="p-3.5 text-slate-500">{shop.owner_name}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            shop.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {shop.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono">฿{shop.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="p-3.5 text-right font-mono text-emerald-600 font-semibold">+฿{shop.platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="p-3.5 text-right pr-5 font-mono font-bold text-slate-900">฿{shop.netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">
                        ไม่พบข้อมูลรายการขายในช่วงเวลานี้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}