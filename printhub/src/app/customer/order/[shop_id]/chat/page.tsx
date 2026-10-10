"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Store, ShieldAlert } from "lucide-react";
import { supabase } from "@/config/supabase";
import ChatBox from "../../../../../component/ChatBox";
import CustomerNavBar from "@/component/customer/NavBar";

export default function CustomerOrderChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // 🟢 1. ดึง order_id ให้แม่นยำขึ้น
  const rawOrderId =
    searchParams.get("order_id") ||
    (params?.order_id as string) ||
    "";

  const orderId = rawOrderId && rawOrderId !== "undefined" ? rawOrderId : "";

  const [statusName, setStatusName] = useState("กำลังโหลดสถานะ...");
  const [orderNo, setOrderNo] = useState<string>(""); 
  const [shopName, setShopName] = useState<string>("กำลังโหลดชื่อร้านค้า...");
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const strOrderNo = orderNo ? String(orderNo) : "";
  const strOrderId = orderId ? String(orderId) : "";

  // 🟢 2. ดึงข้อมูล User ปัจจุบัน
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getUser();
  }, []);

  // ฟังก์ชันสไตล์สีตามสถานะ
  const getStatusBadgeClass = (status: string) => {
    const s = status.trim().toLowerCase();
    
    if (s.includes("พิมพ์เสร็จสิ้น")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (s.includes("กำลังพิมพ์") || s.includes("printing")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (s.includes("รอการดำเนินงาน") || s.includes("pending")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (s.includes("รายการเสร็จสิ้น") || s.includes("เสร็จสิ้น") || s.includes("completed")) {
      return "bg-slate-100 text-slate-600 border-slate-300";
    }

    if (s.includes("ยกเลิก") || s.includes("cancel")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  useEffect(() => {
    if (!orderId) {
      setStatusName("ไม่พบรหัสออเดอร์");
      setShopName("ไม่พบร้านค้า");
      setIsChatDisabled(true);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("print_order")
          .select(`
            order_no,
            current_status_id,
            status:current_status_id ( state ),
            print_shop:shop_id ( shop_name )
          `)
          .eq("id", orderId)
          .single();

        if (error || !data) {
          const { data: fallbackData } = await supabase
            .from("print_order")
            .select("order_no, status, shop_id")
            .eq("id", orderId)
            .single();

          if (fallbackData?.order_no) {
            setOrderNo(fallbackData.order_no);
          }

          if (fallbackData?.shop_id) {
            const { data: shopData } = await supabase
              .from("print_shop")
              .select("shop_name")
              .eq("id", fallbackData.shop_id)
              .single();

            if (shopData?.shop_name) {
              setShopName(shopData.shop_name);
            }
          }

          const state = fallbackData?.status || "กำลังดำเนินการ";
          updateStatusUI(state);
          return;
        }

        if (data.order_no) {
          setOrderNo(data.order_no);
        }

        const fetchedShopName = (data.print_shop as any)?.shop_name || "ร้านค้า";
        setShopName(fetchedShopName);

        const stateName = (data.status as any)?.state || "กำลังดำเนินการ";
        updateStatusUI(stateName);
      } catch (error) {
        console.error("Fetch order detail error:", error);
        setStatusName("เชื่อมต่อผิดพลาด");
        setShopName("ร้านค้า");
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

      // ปิดแชตเฉพาะเมื่อสถานะเสร็จสิ้นหรือยกเลิกแล้วเท่านั้น
      setIsChatDisabled(
        disabledStates.some((st) => st.toLowerCase() === stateClean)
      );
    };

    fetchOrderDetails();

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
        () => fetchOrderDetails()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const displayOrderNo = strOrderNo
    ? (strOrderNo.startsWith("#") ? strOrderNo : `#${strOrderNo}`)
    : strOrderId
    ? `#ORD-${strOrderId.substring(0, 6).toUpperCase()}`
    : "ไม่พบรหัสออเดอร์";

  return (
    <div className="h-screen w-full bg-[#F4F6F9] flex flex-col font-sans overflow-hidden">
      <CustomerNavBar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col min-h-0 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                title="ย้อนกลับ"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Store size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                  {shopName}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ออเดอร์ <span className="font-semibold text-slate-600">{displayOrderNo}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1.5 rounded-full font-bold border ${getStatusBadgeClass(
                  statusName
                )}`}
              >
                {statusName}
              </span>
            </div>
          </div>

          {/* 🟢 3. ส่ง Props ครบถ้วนเข้า ChatBox */}
          {orderId ? (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-50/50">
              <ChatBox
                orderId={orderId}
                orderNo={orderNo}
                role="customer"
                currentUserId={currentUserId}
                isChatDisabled={isChatDisabled}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-6">
              <ShieldAlert size={40} className="text-slate-300" />
              <p className="text-sm font-medium text-slate-500">ไม่พบรหัสออเดอร์สำหรับห้องแชตนี้</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}