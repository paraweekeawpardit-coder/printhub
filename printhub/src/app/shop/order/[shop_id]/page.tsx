"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Lock, Search, X, SlidersHorizontal, Check, Calendar as CalendarIcon, ArrowUpDown } from "lucide-react";
import ShopNavbar from "@/component/shop/navbar";
import { toThaiDateKey } from"../../../../lib/Datetime";
import PageHeading from "@/component/shop/Pageheading";
import OrderStatusTabs, {
  OrderStatusFilter,
} from "@/component/shop/orderStatus";
import OrderDetailCard, {
  OrderDetail,
} from "@/component/shop/order-detail-card";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${rawApiUrl.replace(/\/+$/, "")}/api`;

type DateSortMode = "latest" | "past";

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();

  const paramShopId = Array.isArray(params?.shop_id)
    ? params.shop_id[0]
    : (params?.shop_id as string);

  const [shopId, setShopId] = useState<string>(paramShopId || "");

  const [activeFilter, setActiveFilter] =
    useState<OrderStatusFilter>("ทั้งหมด");
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);

  // Search & Filters State
  const [searchText, setSearchText] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // New Filters: วันสั่งพิมพ์ & วันรับงาน (เลือก ล่าสุด / อดีต) + ปฏิทิน
  const [orderDateSort, setOrderDateSort] = useState<DateSortMode | "">("");
  const [receiveDateSort, setReceiveDateSort] = useState<DateSortMode | "">("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("");

  // ปิดพาเนลตัวกรองเมื่อคลิกนอกพื้นที่
  useEffect(() => {
    if (!filterOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  useEffect(() => {
    if (!shopId && typeof window !== "undefined") {
      const storedShopId =
        localStorage.getItem("shop_id") || localStorage.getItem("id");
      if (storedShopId) setShopId(storedShopId);
    } else if (paramShopId && paramShopId !== shopId) {
      setShopId(paramShopId);
    }
  }, [paramShopId, shopId]);

  const checkShopStatus = useCallback(async () => {
    if (!shopId) return;
    try {
      const response = await axios.get(`${API_BASE}/shop/profile/${shopId}`);
      const shopData = response.data?.data ?? response.data;
      if (shopData?.status === "suspended") {
        setIsSuspended(true);
      } else {
        setIsSuspended(false);
      }
    } catch (error) {
      console.error("Check shop status error:", error);
    }
  }, [shopId]);

  useEffect(() => {
    checkShopStatus();
  }, [checkShopStatus]);

  const getOrder = useCallback(async () => {
    if (!shopId) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/shop/getOrderByStatus`, {
        headers: { shop_id: shopId },
        params: { status: activeFilter },
      });
      setOrders(response.data.orders ?? []);
    } catch (error) {
      console.error("Get order error:", (error as any)?.response?.data || error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [shopId, activeFilter]);

  useEffect(() => {
    getOrder();
  }, [getOrder]);

  const handleUpdateStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      if (!shopId || isSuspended) return;

      try {
        await axios.patch(
          `${API_BASE}/shop/orders/${orderId}/status`,
          { status_name: newStatus },
          { params: { shop_id: shopId } }
        );
        await getOrder();
      } catch (error) {
        console.error("Update order status error:", error);
      }
    },
    [shopId, getOrder, isSuspended]
  );

  const handleVerifyPayment = useCallback(
    async (orderId: string, isVerified: boolean) => {
      const config = { params: { shop_id: shopId } };

      try {
        await axios.patch(
          `${API_BASE}/shop/orders/${orderId}/verify-payment`,
          { is_verified: isVerified },
          config
        );
        if (!isVerified) {
          await axios.patch(
            `${API_BASE}/shop/orders/${orderId}/status`,
            { status_name: "รอการชำระเงิน" },
            config
          );
        }
        await getOrder();
      } catch (error) {
        console.error("Verify payment and update status error:", error);
      }
    },
    [shopId, getOrder]
  );

  // กรอง ค้นหา และเรียงลำดับตามสถานะบังคับ + Filter ที่เลือก
  const visibleOrders = useMemo(() => {
    const keyword = searchText.trim().toLowerCase().replace(/^#/, "");

    let result = orders.filter((order) => {
      const o = order as any;

      // ค้นหาด้วยเลขออเดอร์หรือ Order ID
      if (keyword) {
        const orderNo = String(o.order_no ?? "").toLowerCase();
        const orderId = String(o.order_id ?? "").toLowerCase();
        if (!orderNo.includes(keyword) && !orderId.includes(keyword)) {
          return false;
        }
      }

      // กรองด้วยปฏิทินที่เลือกเจาะจงวันนัดรับ
      if (selectedCalendarDate) {
        const pickupVal = o.pickup_time ?? o.appointment_time ?? o.date;
        const dateKey = toThaiDateKey(pickupVal);
        if (dateKey !== selectedCalendarDate) return false;
      }

      return true;
    });

    // กำหนดลำดับสถานะบังคับเสมอตามโจทย์: 
    // 1. รอดำเนินงาน (รอการดำเนินการ / รอการดำเนินงาน) 
    // 2. กำลังพิมพ์ 
    // 3. พิมพ์เสร็จสิ้น 
    // 4. รายการเสร็จสิ้น 
    // 5. ยกเลิกการพิมพ์
    const STATUS_PRIORITY: Record<string, number> = {
      "รอการดำเนินการ": 1,
      "รอการดำเนินงาน": 1,
      "กำลังพิมพ์": 2,
      "พิมพ์เสร็จสิ้น": 3,
      "รายการเสร็จสิ้น": 4,
      "ยกเลิกการพิมพ์": 5,
    };

    result.sort((a, b) => {
      const pA = STATUS_PRIORITY[a.status] ?? 99;
      const pB = STATUS_PRIORITY[b.status] ?? 99;

      if (pA !== pB) {
        return pA - pB;
      }

      // หากสถานะเดียวกัน ให้กรองตามเงื่อนไข วันสั่งพิมพ์ หรือ วันรับงาน ที่ผู้ใช้เลือก
      if (orderDateSort) {
        const timeA = new Date((a as any).date).getTime() || 0;
        const timeB = new Date((b as any).date).getTime() || 0;
        return orderDateSort === "latest" ? timeB - timeA : timeA - timeB;
      }

      if (receiveDateSort) {
        const timeA = new Date((a as any).pickup_time || (a as any).date).getTime() || 0;
        const timeB = new Date((b as any).pickup_time || (b as any).date).getTime() || 0;
        return receiveDateSort === "latest" ? timeB - timeA : timeA - timeB;
      }

      return 0;
    });

    return result;
  }, [orders, searchText, selectedCalendarDate, orderDateSort, receiveDateSort]);

  const hasActiveFilters =
    searchText.trim() !== "" ||
    selectedCalendarDate !== "" ||
    orderDateSort !== "" ||
    receiveDateSort !== "";

  return (
    <div className="min-h-screen bg-slate-100">
      <ShopNavbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <PageHeading title="คำสั่งพิมพ์" />

        {isSuspended && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
            <Lock className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm font-medium">
              บัญชีถูกระงับการใช้งาน ระบบปิดการปรับเปลี่ยนสถานะคำสั่งพิมพ์ชั่วคราว
            </p>
          </div>
        )}

        <OrderStatusTabs active={activeFilter} onChange={setActiveFilter} />

        {/* แถวเครื่องมือ: ย้าย Search Bar ไปอยู่อีกฝั่ง (ชิดซ้าย) และปุ่ม Filter อยู่ขวา */}
        <div className="relative z-30 flex items-center justify-between gap-4">
          {/* Search Bar ชิดซ้าย / ขยายเต็มพื้นที่ฝั่งซ้าย */}
          <div className="group relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาเลขออเดอร์ เช่น 1024 หรือ Order ID"
              className="h-12 w-full rounded-full bg-white pl-11 pr-11 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                aria-label="ล้างคำค้นหา"
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* ปุ่มตัวกรอง & Modern Calendar Popup */}
          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              aria-label="ตัวกรอง"
              aria-expanded={filterOpen}
              className={`relative flex h-12 items-center gap-2 px-4 rounded-full shadow-sm transition ${
                filterOpen || hasActiveFilters
                  ? "bg-slate-900 text-white ring-1 ring-slate-900"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="text-xs font-bold hidden sm:inline">ตัวกรองขั้นสูง</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 z-50">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-blue-600" />
                    ตัวกรองและเรียงลำดับ
                  </h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchText("");
                        setOrderDateSort("");
                        setReceiveDateSort("");
                        setSelectedCalendarDate("");
                      }}
                      className="text-xs font-semibold text-rose-500 transition hover:text-rose-700"
                    >
                      ล้างทั้งหมด
                    </button>
                  )}
                </div>

                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                  {/* 1. วันสั่งพิมพ์ */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                      <ArrowUpDown size={13} /> วันสั่งพิมพ์
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOrderDateSort(orderDateSort === "latest" ? "" : "latest");
                          setReceiveDateSort("");
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                          orderDateSort === "latest"
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        ล่าสุด
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderDateSort(orderDateSort === "past" ? "" : "past");
                          setReceiveDateSort("");
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                          orderDateSort === "past"
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        อดีต (เก่าสุด)
                      </button>
                    </div>
                  </div>

                  {/* 2. วันรับงาน */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                      <ArrowUpDown size={13} /> วันรับงาน
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReceiveDateSort(receiveDateSort === "latest" ? "" : "latest");
                          setOrderDateSort("");
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                          receiveDateSort === "latest"
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        ล่าสุด
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiveDateSort(receiveDateSort === "past" ? "" : "past");
                          setOrderDateSort("");
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                          receiveDateSort === "past"
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        อดีต (เก่าสุด)
                      </button>
                    </div>
                  </div>

                  {/* 3. ปฏิทินเลือกวัน (Modern Calendar Input) */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
                      <CalendarIcon size={13} /> เลือกวันที่นัดรับต้องการ (ปฏิทิน)
                    </p>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedCalendarDate}
                        onChange={(e) => setSelectedCalendarDate(e.target.value)}
                        className="h-11 w-full rounded-2xl bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-slate-900"
                      />
                      {selectedCalendarDate && (
                        <button
                          type="button"
                          onClick={() => setSelectedCalendarDate("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-rose-500 hover:underline"
                        >
                          ล้างวัน
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleOrders.length > 0 ? (
              visibleOrders.map((order) => (
                <OrderDetailCard
                  key={order.order_id}
                  order={order}
                  disabled={isSuspended}
                  onClick={() => router.push(`/shop/detail/${order.order_id}`)}
                  onUpdateStatus={handleUpdateStatus}
                  onVerifyPayment={handleVerifyPayment}
                />
              ))
            ) : (
              <p className="col-span-full py-12 text-center text-slate-400 font-medium">
                {hasActiveFilters
                  ? "ไม่พบคำสั่งพิมพ์ที่ตรงกับเงื่อนไขการค้นหาและตัวกรอง"
                  : `ไม่มีคำสั่งพิมพ์ในสถานะ "${activeFilter}"`}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
