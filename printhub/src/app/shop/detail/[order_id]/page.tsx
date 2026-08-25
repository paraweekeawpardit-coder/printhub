"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import ShopNavbar from "@/src/component/shop/navbar";
import OrderDetailCard, {
  OrderDetail,
} from "@/src/component/shop/order-detail-card";

export default function OrderDetailPage() {
  const params = useParams();

  const order_id = Array.isArray(params?.order_id)
    ? params.order_id[0]
    : (params?.order_id as string);

  console.log(order_id); 

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!order_id) return;

    let isMounted = true;

    const getOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/shop/getOrder", {
          headers: {
            order_id: order_id,
          },
        });

        if (isMounted) {
          setOrder(res.data.order ?? null);
        }
      } catch (err) {
        console.error("Fetch order detail error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [order_id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <ShopNavbar />

      <div className="mx-auto max-w-5xl px-8 py-10">
        <h1 className="mb-8 text-2xl font-bold text-[#0F2942]">
          รายละเอียดคำสั่งพิมพ์
        </h1>

        {loading ? (
          <div className="py-10 text-center text-slate-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : order ? (
          <OrderDetailCard order={order} />
        ) : (
          <div className="py-10 text-center text-red-500">
            ไม่พบข้อมูลคำสั่งพิมพ์
          </div>
        )}
      </div>
    </div>
  );
}