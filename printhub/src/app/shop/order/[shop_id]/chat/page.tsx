"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare } from "lucide-react";
import ChatBox from "@/component/ChatBox";
import { supabase } from "@/config/supabase";

interface OrderChat {
  id: string;
  order_no?: number;
  customer_name?: string;
  latest_message?: string;
  updated_at?: string;
  status_name?: string;
}

// 🟢 ฟังก์ชันสำหรับกำหนดสี Badge ตามสถานะ
const getStatusBadgeStyle = (statusName: string = "") => {
  const clean = statusName.trim().toLowerCase();

  // กลุ่มเสร็จสิ้น -> สีเขียว (Emerald)
  if (
    ["พิมพ์เสร็จสิ้น", "รายการเสร็จสิ้น", "เสร็จสิ้น", "completed"].includes(clean)
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  // กลุ่มยกเลิก -> สีแดง (Rose)
  if (["ยกเลิกการพิมพ์", "ยกเลิก", "cancelled"].includes(clean)) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  // กลุ่มกำลังพิมพ์ -> สีฟ้า/น้ำเงิน (Blue)
  if (["กำลังพิมพ์", "กำลังดำเนินการ", "in progress"].includes(clean)) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  // สถานะอื่นๆ / รอดำเนินการ -> สีส้มอ่อน (Amber)
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export default function ShopChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const isFromNavbar = searchParams.get("from") === "navbar";
  const rawOrderId =
    searchParams.get("order_id") ||
    (params?.shop_id as string) ||
    (params?.order_id as string) ||
    "";

  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [orderChats, setOrderChats] = useState<OrderChat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusName, setStatusName] = useState<string>("กำลังโหลดสถานะ...");
  const [isChatDisabled, setIsChatDisabled] = useState<boolean>(false);

  // 1. ดึงรายการออเดอร์ทั้งหมดจาก Supabase
  useEffect(() => {
    const fetchShopChats = async () => {
      try {
        setLoading(true);

        const { data: orders, error } = await supabase
          .from("print_order")
          .select(`
            id,
            order_no,
            customer_id,
            description,
            order_date,
            current_status_id,
            status:current_status_id ( state ),
            customer:customer_id ( first_name, last_name )
          `)
          .order("order_date", { ascending: false });

        if (!error && orders) {
          const list: OrderChat[] = orders.map((item: any) => {
            const firstName = item.customer?.first_name || "";
            const lastName = item.customer?.last_name || "";
            const fullName = `${firstName} ${lastName}`.trim();

            return {
              id: item.id,
              order_no: item.order_no,
              customer_name:
                fullName || `ลูกค้า (#${item.order_no || item.id.slice(0, 6)})`,
              latest_message: item.description || "แตะเพื่อดูแชต",
              updated_at: item.order_date,
              status_name: item.status?.state || "กำลังดำเนินการ",
            };
          });

          setOrderChats(list);

          const isExistInOrders = list.some((o) => o.id === rawOrderId);

          if (!isFromNavbar && isExistInOrders) {
            setSelectedOrderId(rawOrderId);
          } else {
            setSelectedOrderId("");
          }
        } else {
          console.error("Supabase fetch error:", error);
        }
      } catch (err) {
        console.error("Fetch shop chats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopChats();
  }, [rawOrderId, isFromNavbar]);

  // 2. ดึงสถานะออเดอร์เมื่อมีการคลิกเลือก selectedOrderId
  useEffect(() => {
    if (!selectedOrderId) {
      setStatusName("");
      setIsChatDisabled(false);
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
          .eq("id", selectedOrderId)
          .single();

        if (error || !data) {
          setStatusName("ไม่พบข้อมูลออเดอร์");
          setIsChatDisabled(true);
          return;
        }

        const stateName = (data.status as any)?.state || "กำลังดำเนินการ";
        setStatusName(stateName);

        const stateClean = String(stateName).trim().toLowerCase();
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
          disabledStates.some((s) => s.toLowerCase() === stateClean)
        );
      } catch (err) {
        console.error("Fetch status error:", err);
        setStatusName("เชื่อมต่อผิดพลาด");
        setIsChatDisabled(false);
      }
    };

    fetchOrderStatus();
  }, [selectedOrderId]);

  const currentSelectedOrder = orderChats.find((o) => o.id === selectedOrderId);

  return (
    <div className="h-screen w-full bg-[#F4F6F9] flex flex-col font-sans overflow-hidden">
      {/* Header หลักด้านบน */}
      <header className="bg-[#001B3A] text-white h-14 px-6 flex items-center justify-between shadow-md shrink-0">
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

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex gap-4 min-h-0 overflow-hidden">
        
        {/* ================= ฝั่งซ้าย: รายการกล่องข้อความทั้งหมด ================= */}
        <div className="w-1/3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
          <h2 className="text-base font-bold text-slate-800 mb-3 px-1 shrink-0">
            กล่องข้อความทั้งหมด ({orderChats.length})
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
            <div className="overflow-y-auto flex-1 min-h-0 space-y-2 pr-1">
              {orderChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedOrderId(chat.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedOrderId === chat.id
                      ? "bg-slate-100 border-[#001B3A] shadow-xs"
                      : "bg-white border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-800 truncate">
                      {chat.customer_name}
                    </span>
                    {/*  ปรับปรุงสี Badge ในกล่องข้อความฝั่งซ้าย */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-medium shrink-0 ${getStatusBadgeStyle(
                        chat.status_name
                      )}`}
                    >
                      {chat.status_name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-1">
                    {chat.latest_message}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    ออเดอร์: #{chat.order_no || chat.id.slice(0, 8)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= ฝั่งขวา: ห้องแชต (ChatBox) ================= */}
        <div className="w-2/3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col min-h-0 overflow-hidden">
          {selectedOrderId ? (
            <>
              {/* Header ฝั่งขวา */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    ออเดอร์ #{currentSelectedOrder?.order_no || selectedOrderId.slice(0, 8)}
                  </h3>
                </div>
                {statusName && (
                  /*  ปรับปรุงสี Badge ฝั่งขวา ใช้ฟังก์ชัน getStatusBadgeStyle */
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-lg border ${getStatusBadgeStyle(
                      statusName
                    )}`}
                  >
                    {statusName}
                  </span>
                )}
              </div>

              {/* ChatBox Component */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <ChatBox
                  orderId={selectedOrderId}
                  role="shop"
                  isChatDisabled={isChatDisabled}
                />
              </div>
            </>
          ) : (
            /* ข้อความแนะนำเมื่อกดมาจาก Navbar */
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
              <div className="p-4 rounded-full bg-slate-50 text-slate-300 mb-1">
                <MessageSquare size={36} />
              </div>
              <p className="font-medium text-slate-600 text-base">
                เลือกรายการแชตเพื่อเริ่มสนทนา
              </p>
              <p className="text-xs text-slate-400">
                กรุณาคลิกเลือกรายการออเดอร์จากแถบด้านซ้ายมือเพื่อดูข้อความ
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}