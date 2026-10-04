"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import ShopNavbar from "@/component/shop/navbar";
import PageHeading from "@/component/shop/Pageheading";
import OrderStatusTabs, {
  OrderStatusFilter,
} from "@/component/shop/orderStatus";
import OrderDetailCard, {
  OrderDetail,
} from "@/component/shop/order-detail-card";

// 🟢 ปรับ API_BASE ให้มี /api นำหน้าเสมอ และรองรับ Environment Variable
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_BASE = `${rawApiUrl.replace(/\/+$/, "")}/api`;

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();

  // 1. ดึง paramShopId จาก URL params
  const paramShopId = Array.isArray(params?.shop_id)
    ? params.shop_id[0]
    : (params?.shop_id as string);

  // ประกาศ State shopId สำหรับเก็บ ID ร้านค้า
  const [shopId, setShopId] = useState<string>(paramShopId || "");

  const [activeFilter, setActiveFilter] =
    useState<OrderStatusFilter>("ทั้งหมด");
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);

  // 2. ถ้า paramShopId ไม่มี ให้ดึงจาก localStorage
  useEffect(() => {
    if (!shopId && typeof window !== "undefined") {
      const storedShopId =
        localStorage.getItem("shop_id") || localStorage.getItem("id");
      if (storedShopId) setShopId(storedShopId);
    } else if (paramShopId && paramShopId !== shopId) {
      setShopId(paramShopId);
    }
  }, [paramShopId, shopId]);

  // 3. ตรวจสอบสถานะของร้านค้า (Suspended Check)
  const checkShopStatus = useCallback(async () => {
    if (!shopId) return;
    try {
      // 🟢 ชี้ไปที่ /api/shop/profile/
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

  // 4. ฟังก์ชันดึงรายการออเดอร์ตามสถานะ
  const getOrder = useCallback(async () => {
    if (!shopId) return;

    try {
      setLoading(true);
      // 🟢 ชี้ไปที่ /api/shop/getOrderByStatus
      const response = await axios.get(`${API_BASE}/shop/getOrderByStatus`, {
        headers: { shop_id: shopId },
        params: { status: activeFilter },
      });
      setOrders(response.data.orders ?? []);
    } catch (error) {
      console.error("Get order error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [shopId, activeFilter]);

  useEffect(() => {
    getOrder();
  }, [getOrder]);

  // 5. ฟังก์ชันอัปเดตสถานะออเดอร์ (ล็อกไม่ให้ทำงานถ้าร้านโดนระงับ)
  const handleUpdateStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      if (!shopId) return;
      if (isSuspended) {
        console.warn("[Action Blocked] Shop is suspended. Cannot update order status.");
        return;
      }

      try {
        // 🟢 ชี้ไปที่ /api/shop/orders/.../status
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

  // ตรวจสลิป:
  // - ถูกต้อง = เปลี่ยนสถานะเป็น "กำลังพิมพ์" (เท่ากับกดยืนยันรับออเดอร์ทันที)
  // - ไม่ถูกต้อง = เปลี่ยนสถานะเป็น "รอการชำระเงิน" (จะถูกกรองออก ไม่แสดงบนหน้าเว็บฝั่ง Shop)
  const handleVerifyPayment = useCallback(
    async (orderId: string, isVerified: boolean) => {
      const newStatus = isVerified ? "กำลังพิมพ์" : "รอการชำระเงิน";
      const config = { params: { shop_id } };

      try {
        await axios.patch(
          `${API_BASE}/shop/orders/${orderId}/verify-payment`,
          { is_verified: isVerified },
          config
        );
        await axios.patch(
          `${API_BASE}/shop/orders/${orderId}/status`,
          { status_name: newStatus },
          config
        );
        await getOrder();
      } catch (error) {
        console.error("Verify payment and update status error:", error);
      }
    },
    [shop_id, getOrder]
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <ShopNavbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <PageHeading title="คำสั่งพิมพ์" />

        {/* แถบแจ้งเตือนเมื่อร้านถูกระงับ */}
        {isSuspended && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
            <Lock className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm font-medium">
              บัญชีถูกระงับการใช้งาน ระบบปิดการปรับเปลี่ยนสถานะคำสั่งพิมพ์ชั่วคราว
            </p>
          </div>
        )}

        <OrderStatusTabs active={activeFilter} onChange={setActiveFilter} />

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.length > 0 ? (
              orders.map((order) => (
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
              <p className="col-span-full py-8 text-center text-slate-500">
                ไม่มีคำสั่งพิมพ์ในสถานะ "{activeFilter}"
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}