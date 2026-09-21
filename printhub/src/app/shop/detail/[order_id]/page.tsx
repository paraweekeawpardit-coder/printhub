"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ShopNavbar from "@/src/component/shop/navbar";
import PageHeading from "@/src/component/shop/Pageheading";
import OrderStatusTabs, {
  OrderStatusFilter,
} from "@/src/component/shop/orderStatus";
import OrderDetailCard, {
  OrderDetail,
} from "@/src/component/shop/order-detail-card";

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

  useEffect(() => {
    if (!shopId && typeof window !== "undefined") {
      const storedShopId =
        localStorage.getItem("shop_id") || localStorage.getItem("id");
      if (storedShopId) setShopId(storedShopId);
    }
  }, [shopId]);

  const getOrder = useCallback(async () => {
    if (!shopId) return;

    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // ✅ ปรับ headers ให้ส่งเฉพาะ shop_id รูปแบบเดียว
      const headers = {
        shop_id: String(shopId),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await axios.get(
        "http://localhost:5000/shop/getOrderByStatus",
        {
          headers,
          params: { status: activeFilter },
        }
      );

      const resultData = Array.isArray(response.data)
        ? response.data
        : response.data.orders || response.data.data || [];

      setOrders(resultData);
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

  return (
    <div className="min-h-screen bg-white">
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
                  key={order.order_id || (order as any).id}
                  order={order}
                  onClick={() =>
                    router.push(
                      `/shop/detail/${order.order_id || (order as any).id}`
                    )
                  }
                  onStatusChange={getOrder}
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