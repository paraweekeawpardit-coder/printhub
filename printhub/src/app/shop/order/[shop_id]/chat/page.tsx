"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/src/config/supabase";
import ChatBox from "../../../../../component/ChatBox";

interface OrderChatItem {
  id: string;
  customer_name?: string;
  status?: string;
  updated_at?: string;
  latest_message?: string;
}

export default function ShopChatPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const shopId =
    (params?.shop_id as string) ||
    (typeof window !== "undefined" ? localStorage.getItem("shop_id") || "" : "");
  const urlOrderId = searchParams.get("order_id");

  const [orderChats, setOrderChats] = useState<OrderChatItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(urlOrderId);
  const [loading, setLoading] = useState<boolean>(true);
  const [shopOrderStatus, setShopOrderStatus] = useState<string>("กำลังโหลดสถานะ...");
  const [isShopChatDisabled, setIsShopChatDisabled] = useState<boolean>(false);

  // 1. ดึงรายการออเดอร์ทั้งหมด
  useEffect(() => {
    const fetchShopOrders = async () => {
      setLoading(true);
      try {
        let query = supabase.from("print_order").select("*");

        if (shopId && shopId !== "undefined" && shopId !== "null") {
          query = query.eq("shop_id", shopId);
        }

        let { data: orders, error } = await query;

        if (error || !orders || orders.length === 0) {
          const fallback = await supabase.from("print_order").select("*");
          orders = fallback.data || [];
        }

        if (orders && orders.length > 0) {
          const customerIds = orders
            .map((o: any) => o.customer_id)
            .filter((id: any) => Boolean(id));

          let customerMap: Record<string, string> = {};

          if (customerIds.length > 0) {
            const { data: customers } = await supabase
              .from("customer")
              .select("id, first_name, last_name")
              .in("id", customerIds);

            if (customers) {
              customers.forEach((c: any) => {
                const fname = c.first_name || "";
                const lname = c.last_name || "";
                customerMap[c.id] = `${fname} ${lname}`.trim();
              });
            }
          }

          const formattedOrders: OrderChatItem[] = orders.map((o: any) => {
            const fullName = customerMap[o.customer_id];

            return {
              id: o.id,
              customer_name:
                fullName && fullName !== ""
                  ? fullName
                  : `ลูกค้า (${o.customer_id ? o.customer_id.slice(0, 6) : "ทั่วไป"})`,
              status: o.status || "กำลังดำเนินการ",
              updated_at: o.created_at || new Date().toISOString(),
              latest_message: "กดเพื่อเปิดกล่องแชต",
            };
          });

          setOrderChats(formattedOrders);

          if (!selectedOrderId && formattedOrders.length > 0) {
            setSelectedOrderId(formattedOrders[0].id);
          }
        } else {
          setOrderChats([]);
        }
      } catch (err) {
        console.error("Fetch Exception:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopOrders();
  }, [shopId]);

  // 2. ดึงสถานะออเดอร์ปัจจุบันตรงจาก Supabase
  useEffect(() => {
    if (!selectedOrderId) return;

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("print_order")
          .select(`
            current_status_id,
            status:current_status_id ( state )
          `)
          .eq("id", selectedOrderId)
          .single();

        if (error || !data || !data.status) {
          const { data: fallbackData } = await supabase
            .from("print_order")
            .select("status")
            .eq("id", selectedOrderId)
            .single();

          const state = fallbackData?.status || "กำลังดำเนินการ";
          updateStatusUI(state);
          return;
        }

        const stateName = (data.status as any)?.state || "กำลังดำเนินการ";
        updateStatusUI(stateName);
      } catch (err) {
        console.error("Fetch status error:", err);
        setShopOrderStatus("กำลังดำเนินการ");
      }
    };

    const updateStatusUI = (state: string) => {
      setShopOrderStatus(state);

      const stateClean = state.trim().toLowerCase();
      const disabledStates = [
        "พิมพ์เสร็จสิ้น",
        "รายการเสร็จสิ้น",
        "เสร็จสิ้น",
        "ยกเลิกการพิมพ์",
        "ยกเลิก",
        "completed",
        "cancelled",
      ];

      setIsShopChatDisabled(
        disabledStates.some((st) => st.toLowerCase() === stateClean)
      );
    };

    fetchStatus();

    const channel = supabase
      .channel(`shop_order_status_${selectedOrderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "print_order",
          filter: `id=eq.${selectedOrderId}`,
        },
        () => fetchStatus()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedOrderId]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
      <header className="bg-[#001B3A] text-white h-14 px-6 flex items-center justify-between shadow-md sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          ย้อนกลับ
        </button>
        <div className="font-bold text-lg tracking-tight">PrintHub Management</div>
        <div className="w-16"></div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex gap-4 h-[calc(100vh-80px)]">
        {/* ฝั่งซ้าย: กล่องข้อความทั้งหมด */}
        <div className="w-1/3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col">
          <h2 className="text-base font-bold text-slate-800 mb-3 px-1">
            กล่องข้อความทั้งหมด
          </h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              กำลังโหลดรายการ...
            </div>
          ) : orderChats.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              ไม่มีรายการแชต
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 space-y-2">
              {orderChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedOrderId(chat.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    selectedOrderId === chat.id
                      ? "bg-slate-100 border-slate-300 shadow-sm"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-800">
                      {chat.customer_name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-1">
                    {chat.latest_message}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    ออเดอร์: #{chat.id ? chat.id.slice(0, 8) : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ฝั่งขวา: แสดง ChatBox */}
        <div className="w-2/3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {selectedOrderId ? (
            <>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    ออเดอร์ #{selectedOrderId}
                  </h3>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-lg ${
                    isShopChatDisabled
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {shopOrderStatus}
                </span>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <ChatBox
                  orderId={selectedOrderId}
                  role="shop"
                  isChatDisabled={isShopChatDisabled}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              เลือกรายการแชตด้านซ้ายเพื่อเริ่มสนทนา
            </div>
          )}
        </div>
      </div>
    </div>
  );
}