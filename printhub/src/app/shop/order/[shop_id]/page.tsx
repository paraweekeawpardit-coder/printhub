"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ShopNavbar from "@/component/shop/navbar";
import PageHeading from "@/component/shop/Pageheading";
import OrderStatusTabs, {
  OrderStatusFilter,
} from "@/component/shop/orderStatus";
import OrderDetailCard, {
  OrderDetail,
} from "@/component/shop/order-detail-card";

const API_BASE = "http://localhost:5000";

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

  // 3. ฟังก์ชันดึงรายการออเดอร์ตามสถานะ
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
      console.error("Get order error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [shopId, activeFilter]);

  useEffect(() => {
    getOrder();
  }, [getOrder]);

  // 4. ฟังก์ชันอัปเดตสถานะออเดอร์
  const handleUpdateStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      if (!shopId) return;

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
    [shopId, getOrder]
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <ShopNavbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <PageHeading title="คำสั่งพิมพ์" />

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
                  onClick={() => router.push(`/shop/detail/${order.order_id}`)}
                  onUpdateStatus={handleUpdateStatus}
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