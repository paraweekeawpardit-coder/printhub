"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { supabase } from "@/src/config/supabase";
import ChatBox from "../../../../../component/ChatBox";

export default function CustomerOrderChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const rawOrderId =
    searchParams.get("order_id") ||
    (params?.order_id as string) ||
    (params?.shop_id as string) ||
    "";

  const orderId = rawOrderId !== "undefined" ? rawOrderId : "";

  const [statusName, setStatusName] = useState("กำลังโหลดสถานะ...");
  const [isChatDisabled, setIsChatDisabled] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setStatusName("ไม่พบรหัสออเดอร์");
      setIsChatDisabled(true);
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("print_order")
          .select(`
            current_status_id,
            status:current_status_id ( state )
          `)
          .eq("id", orderId)
          .single();

        if (error || !data || !data.status) {
          // หากไม่มีการดึงผ่าน relation ให้ดึงคอลัมน์ status โดยตรงเป็น fallback
          const { data: fallbackData } = await supabase
            .from("print_order")
            .select("status")
            .eq("id", orderId)
            .single();

          const state = fallbackData?.status || "กำลังดำเนินการ";
          updateStatusUI(state);
          return;
        }

        const stateName = (data.status as any)?.state || "กำลังดำเนินการ";
        updateStatusUI(stateName);
      } catch (error) {
        console.error("Fetch status error:", error);
        setStatusName("เชื่อมต่อผิดพลาด");
      }
    };

    const updateStatusUI = (state: string) => {
      setStatusName(state);
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

      setIsChatDisabled(
        disabledStates.some((st) => st.toLowerCase() === stateClean)
      );
    };

    fetchOrderStatus();

    // Subscribe สด เมื่อมีการเปลี่ยนสถานะ
    const channel = supabase
      .channel(`cust_order_status_${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "print_order",
          filter: `id=eq.${orderId}`,
        },
        () => fetchOrderStatus()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
      <header className="bg-[#001B3A] text-white px-6 py-4 flex items-center shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span>ย้อนกลับ</span>
          </button>
          <div className="h-5 w-[1px] bg-slate-600" />
          <span className="font-bold text-xl tracking-tight">PrintHub</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col my-2 h-[calc(100vh-100px)]">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">
                PrintHub Official Store
              </h2>
              <p className="text-xs text-slate-400">
                ออเดอร์: {orderId || "ไม่พบรหัสออเดอร์"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                  isChatDisabled
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {statusName}
              </span>
            </div>
          </div>

          {orderId ? (
            <ChatBox
              orderId={orderId}
              role="customer"
              isChatDisabled={isChatDisabled}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              ไม่พบรหัสออเดอร์
            </div>
          )}
        </div>
      </main>
    </div>
  );
}