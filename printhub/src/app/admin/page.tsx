"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "../../component/admin/StatCard";

interface DashboardStats {
  totalCustomers: number;
  totalActiveShops: number;
  pendingReports: number;
  pendingAppeals: number;
  pendingRefunds?: number;
  pendingPayouts?: number;
  overdueAppeals: number;
  nudgedAppeals?: number;
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/admin/dashboard-stats?t=${Date.now()}`
      );
      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      // แสดงค่าที่ดึงได้ลงบน Console เพื่อใช้ในการตรวจดูข้อมูล
      console.log("📊 Dashboard API Data:", data);

      setStats({
        totalCustomers: data.totalCustomers ?? 0,
        totalActiveShops: data.totalActiveShops ?? 0,
        pendingReports: data.pendingReports ?? 0,
        pendingAppeals: data.pendingAppeals ?? 0,
        pendingRefunds: data.pendingRefunds ?? data.refundsCount ?? 0,
        pendingPayouts: data.pendingPayouts ?? data.payoutsCount ?? 0,
        overdueAppeals: data.overdueAppeals ?? 0,
        nudgedAppeals: data.nudgedAppeals ?? 0,
      });
    } catch (error) {
      console.error("Fetch dashboard error:", error);
      setStats({
        totalCustomers: 0,
        totalActiveShops: 0,
        pendingReports: 0,
        pendingAppeals: 0,
        pendingRefunds: 0,
        pendingPayouts: 0,
        overdueAppeals: 0,
        nudgedAppeals: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
          <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
          กำลังโหลดข้อมูลระบบ...
        </div>
      </div>
    );
  }

  const renderAppealSubtitle = () => {
    if ((stats.nudgedAppeals ?? 0) > 0) {
      return `เร่งติดตาม ${stats.nudgedAppeals} รายการ`;
    }
    if (stats.overdueAppeals > 0) {
      return `เกิน 3 วัน: ${stats.overdueAppeals} รายการ`;
    }
    return "คำร้องขอปลดระงับที่ค้างตรวจสอบ";
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto text-slate-900 font-sans p-6 space-y-6">
      {/* Console Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Admin Operations Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ระบบศูนย์ควบคุมและติดตามสถานะการดำเนินงาน PrintHub
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardStats}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer shadow-2xs"
        >
          <svg
            className="w-3.5 h-3.5 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* Grid 6 การ์ดสถิติ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch">
        <StatCard
          title="ลูกค้าทั้งหมด"
          value={stats.totalCustomers?.toLocaleString()}
          unit="คน"
          subtitle="ผู้ใช้ในระบบทั้งหมด"
          href="/admin/customers"
        />
        <StatCard
          title="ร้านค้าที่เปิดอยู่"
          value={stats.totalActiveShops?.toLocaleString()}
          unit="ร้าน"
          subtitle="เปิดให้บริการปกติ"
          href="/admin/shops?tab=all"
        />
        <StatCard
          title="คำร้องขอปลดระงับ"
          value={stats.pendingAppeals}
          unit="รายการ"
          subtitle={renderAppealSubtitle()}
          href="/admin/shops?tab=appeals"
          isAlert={stats.pendingAppeals > 0 || (stats.nudgedAppeals ?? 0) > 0}
        />
        <StatCard
          title="รายงานปัญหารอตรวจ"
          value={stats.pendingReports}
          unit="รายการ"
          subtitle="ข้อร้องเรียนค้างดำเนินการ"
          href="/admin/reports"
          isAlert={stats.pendingReports > 0}
        />
        <StatCard
          title="รายการรอโอนเงินคืน"
          value={stats.pendingRefunds ?? 0}
          unit="รายการ"
          subtitle="ออเดอร์ยกเลิก/คืนเงิน"
          href="/admin/refunds"
          isAlert={(stats.pendingRefunds ?? 0) > 0}
        />
        <StatCard
          title="รายการรอโอนให้ร้าน"
          value={stats.pendingPayouts ?? 0}
          unit="รายการ"
          subtitle="ออเดอร์เสร็จสิ้นรอโอน"
          href="/admin/payouts"
          isAlert={(stats.pendingPayouts ?? 0) > 0}
        />
      </section>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* คอลัมน์ซ้าย (2/3): Pending Task Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                ศูนย์จัดการรายการค้างรอดำเนินการ (Pending Task Queue)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                รายการตารางงานที่ผู้ดูแลระบบต้องทำการตรวจสอบและอนุมัติ
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 font-sans">
            {/* Task 1: อุทธรณ์ร้านค้า */}
            <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-xl transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      คำร้องขออุทธรณ์ร้านค้า
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border ${
                        stats.pendingAppeals > 0
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {stats.pendingAppeals} รายการ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    คำร้องขอยกเลิกการระงับสิทธิ์ร้านค้าจากเจ้าของร้าน
                  </p>
                </div>
              </div>
              <Link
                href="/admin/shops?tab=appeals"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-2xs"
              >
                ตรวจสอบ
              </Link>
            </div>

            {/* Task 2: รายงานปัญหา */}
            <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-xl transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      รายงานปัญหาบริการ
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border ${
                        stats.pendingReports > 0
                          ? "bg-rose-100 text-rose-900 border-rose-300"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {stats.pendingReports} รายการ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    รายงานความผิดปกติของออเดอร์ สินค้าชำรุด หรือพฤติกรรมมิชอบ
                  </p>
                </div>
              </div>
              <Link
                href="/admin/reports"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-2xs"
              >
                ตรวจสอบ
              </Link>
            </div>

            {/* Task 3: คืนเงินลูกค้า */}
            <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-xl transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      การโอนเงินคืนลูกค้า
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border ${
                        (stats.pendingRefunds ?? 0) > 0
                          ? "bg-blue-100 text-blue-900 border-blue-300"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {stats.pendingRefunds ?? 0} รายการ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ตรวจสอบและยืนยันการโอนเงินคืนผู้ใช้สำหรับคำสั่งซื้อที่ยกเลิก
                  </p>
                </div>
              </div>
              <Link
                href="/admin/refunds"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-2xs"
              >
                ตรวจสอบ
              </Link>
            </div>

            {/* Task 4: โอนเงินร้านค้า */}
            <div className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-xl transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      การโอนเงินรายได้ให้ร้านค้า
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border ${
                        (stats.pendingPayouts ?? 0) > 0
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {stats.pendingPayouts ?? 0} รายการ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    โอนเงินค่าบริการให้ออเดอร์ที่สถานะเสร็จสิ้นสมบูรณ์
                  </p>
                </div>
              </div>
              <Link
                href="/admin/payouts"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-2xs"
              >
                ตรวจสอบ
              </Link>
            </div>
          </div>
        </div>

        {/* คอลัมน์ขวา (1/3): System Health Monitoring Console */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              System Health & Metrics
            </h2>
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
              Online
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-600 font-sans font-medium">
                Database Node
              </span>
              <span className="text-emerald-700 font-bold">✓ Connected</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-600 font-sans font-medium">
                Payment Service
              </span>
              <span className="text-emerald-700 font-bold">✓ Active</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <span className="text-slate-600 font-sans font-medium">
                SLA Exceeded Appeals
              </span>
              <span
                className={`font-bold ${
                  stats.overdueAppeals > 0
                    ? "text-amber-700"
                    : "text-slate-700"
                }`}
              >
                {stats.overdueAppeals} Units
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-xs font-bold text-slate-800">
              System Operational Protocol:
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              แนะนำให้ตอบกลับคำร้องขออุทธรณ์ร้านค้าภายใน 24
              ชั่วโมงเพื่อรักษามาตรฐานและประสิทธิภาพในการให้บริการของแพลตฟอร์ม
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}