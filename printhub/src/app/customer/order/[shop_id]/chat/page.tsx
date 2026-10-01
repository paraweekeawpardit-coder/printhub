"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
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

  // ฟังก์ชันสไตล์สีตามสถานะ
  const getStatusBadgeClass = (status: string) => {
    const s = status.trim().toLowerCase();
    
    // 1. พิมพ์เสร็จสิ้น -> สีเขียว
    if (s.includes("พิมพ์เสร็จสิ้น")) {
      return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    }

    // 2. กำลังพิมพ์ -> สีฟ้า
    if (s.includes("กำลังพิมพ์") || s.includes("printing")) {
      return "bg-blue-50 text-blue-600 border border-blue-200";
    }

    // 3. รอการดำเนินงาน -> สีส้ม
    if (s.includes("รอการดำเนินงาน") || s.includes("pending")) {
      return "bg-amber-50 text-amber-600 border border-amber-200";
    }

    // 4. รายการเสร็จสิ้น / completed -> สีเทา
    if (s.includes("รายการเสร็จสิ้น") || s.includes("เสร็จสิ้น") || s.includes("completed")) {
      return "bg-slate-100 text-slate-600 border border-slate-300";
    }

    // 5. ยกเลิก -> สีแดง
    if (s.includes("ยกเลิก") || s.includes("cancel")) {
      return "bg-rose-50 text-rose-600 border border-rose-200";
    }
    
    return "bg-emerald-50 text-emerald-600 border border-emerald-200";
  };

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
    // 1. ล็อกความสูงเท่าหน้าจอพอดี (h-screen) และซ่อน Scrollbar นอกสุด (overflow-hidden)
    <div className="h-screen w-full bg-[#F4F6F9] flex flex-col font-sans overflow-hidden">
      {/* 2. Header ล็อกขนาด ไม่ให้โดนบีบย่อ (shrink-0) */}
      <header className="bg-[#001B3A] text-white px-6 py-4 flex items-center shadow-md shrink-0">
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

      {/* 3. Main ใช้ flex-1 min-h-0 overflow-hidden บังคับให้ขยายกินพื้นที่ที่เหลือในหน้าจอโดยไม่ล้น */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col min-h-0 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header ด้านในกล่องแชต ล็อกขนาดคงที่ (shrink-0) */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
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
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${getStatusBadgeClass(
                  statusName
                )}`}
              >
                {statusName}
              </span>
            </div>
          </div>

          {/* 4. กล่องส่วน ChatBox ที่จะ Scroll เฉพาะภายใน */}
          {orderId ? (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <ChatBox
                orderId={orderId}
                role="customer"
                isChatDisabled={isChatDisabled}
              />
            </div>
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