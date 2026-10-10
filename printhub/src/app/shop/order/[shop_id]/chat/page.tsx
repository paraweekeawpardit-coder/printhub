"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { MessageSquare, Lock, Search, X } from "lucide-react";
import axios from "axios";
import io from "socket.io-client";
import ChatBox from "@/component/ChatBox";
import ShopNavbar from "@/component/shop/navbar";
import { supabase } from "@/config/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface OrderChat {
  id: string;
  order_no?: number;
  customer_name?: string;
  latest_message?: string;
  updated_at?: string;
  status_name?: string;
  unread_count?: number;
}

// 🟢 สี Badge แต่ละสถานะ (รายการเสร็จสิ้น = สีเทา)
const getStatusBadgeStyle = (statusName: string = "") => {
  const clean = statusName.trim();

  switch (clean) {
    case "กำลังพิมพ์":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "พิมพ์เสร็จสิ้น":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "รายการเสร็จสิ้น":
      return "bg-slate-100 text-slate-600 border-slate-300";

    case "ยกเลิกการพิมพ์":
      return "bg-rose-50 text-rose-700 border-rose-200";

    case "รอการดำเนินงาน":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

export default function ShopChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // ดึง shop_id จาก URL Parameters
  const rawShopId = (params?.shop_id as string) || searchParams.get("shopId") || "";

  // รองรับทั้ง orderId (camelCase) และ order_id (snake_case)
  const rawOrderId =
    searchParams.get("orderId") ||
    searchParams.get("order_id") ||
    (params?.order_id as string) ||
    "";

  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [orderChats, setOrderChats] = useState<OrderChat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusName, setStatusName] = useState<string>("กำลังโหลดสถานะ...");
  const [isChatDisabled, setIsChatDisabled] = useState<boolean>(false);
  
  // State สำหรับระบบค้นหาและกรองสถานะ
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  
  // State ตรวจสอบการถูกระงับใช้งานร้านค้า
  const [isSuspended, setIsSuspended] = useState<boolean>(false);

  // 0. ตรวจสอบสถานะการถูกระงับของร้านค้า
  useEffect(() => {
    const checkShopSuspended = async () => {
      if (!rawShopId) return;
      try {
        const response = await axios.get(`${API_BASE}/api/shop/profile/${rawShopId}`);
        const shopData = response.data?.data ?? response.data;
        setIsSuspended(shopData?.status === "suspended");
      } catch (err) {
        console.error("Check shop suspended status error:", err);
      }
    };

    checkShopSuspended();
  }, [rawShopId]);

  // 🟢 1. ดึงรายการออเดอร์ (Supabase) + สรุปแชต MongoDB (Express API)
  const fetchShopChats = async () => {
    try {
      setLoading(true);

      // ดึงข้อมูลออเดอร์ทั้งหมดจาก Supabase
      const { data: orders, error: orderErr } = await supabase
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
        `);

      if (orderErr) {
        console.error("Order fetch error:", orderErr);
        return;
      }

      // ดึงสรุปข้อความแชตจาก Express (MongoDB Collection messages)
      let mongoMap: Record<string, any> = {};
      try {
        const mongoRes = await axios.get(`${API_BASE}/api/chat/shop-summary/${rawShopId}`);
        const mongoList = mongoRes.data?.data || [];
        mongoList.forEach((m: any) => {
          if (m._id) mongoMap[m._id] = m;
          if (m.roomId) mongoMap[m.roomId] = m;
        });
      } catch (e) {
        console.warn("Mongo summary fetch warning:", e);
      }

      if (orders) {
        const list: OrderChat[] = orders.map((item: any) => {
          const firstName = item.customer?.first_name || "";
          const lastName = item.customer?.last_name || "";
          const fullName = `${firstName} ${lastName}`.trim();

          const mongoInfo = mongoMap[item.id] || mongoMap[String(item.order_no)] || {};

          return {
            id: item.id,
            order_no: item.order_no,
            customer_name: fullName || `ลูกค้า (#${item.order_no || item.id.slice(0, 6)})`,
            latest_message: mongoInfo.latest_message || mongoInfo.latestMessage || item.description || "แตะเพื่อดูแชต",
            updated_at: mongoInfo.updated_at || mongoInfo.updatedAt || item.order_date,
            status_name: item.status?.state || "รอการดำเนินงาน",
            unread_count: mongoInfo.unread_count || mongoInfo.unreadCount || 0,
          };
        });

        // 🟢 เรียงลำดับจากข้อความล่าสุดขึ้นบนสุด
        list.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

        setOrderChats(list);

        const isFromNavbar = searchParams.get("from") === "navbar";
        if (isFromNavbar || !rawOrderId) {
          setSelectedOrderId("");
        } else {
          const targetOrder = list.find(
            (o) => o.id === rawOrderId || String(o.order_no) === rawOrderId
          );
          if (targetOrder) {
            setSelectedOrderId(targetOrder.id);
          }
        }
      }
    } catch (err) {
      console.error("Fetch shop chats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopChats();
  }, [rawOrderId, searchParams]);

  // 🟢 2. Realtime Socket.io ดักฟัง receive_message แล้วดันขึ้นบนสุด + นับ Unread Count
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

    socket.on("receive_message", (newMsg: any) => {
      const targetOrderId = newMsg.orderId || newMsg.order_id || newMsg.roomId;

      setOrderChats((prevChats) => {
        const chatIndex = prevChats.findIndex(
          (c) => c.id === targetOrderId || String(c.order_no) === String(targetOrderId)
        );

        if (chatIndex !== -1) {
          const targetChat = prevChats[chatIndex];
          const isCurrentActiveRoom = selectedOrderId === targetChat.id;

          const updatedChat: OrderChat = {
            ...targetChat,
            latest_message: newMsg.text || newMsg.message || (newMsg.images?.length ? "ส่งรูปภาพ" : "ข้อความใหม่"),
            updated_at: new Date().toISOString(),
            unread_count: isCurrentActiveRoom ? 0 : (targetChat.unread_count || 0) + 1,
          };

          const remainingChats = prevChats.filter((_, idx) => idx !== chatIndex);
          // ดันขึ้นเป็นอันดับ 1 บนสุด
          return [updatedChat, ...remainingChats];
        } else {
          fetchShopChats();
          return prevChats;
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedOrderId]);

  // 3. ตรวจสอบสถานะเปิด/ปิดช่องแชต
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
          .select(`current_status_id, status:current_status_id ( state )`)
          .eq("id", selectedOrderId)
          .single();

        if (error || !data) {
          setStatusName("ไม่พบข้อมูลออเดอร์");
          setIsChatDisabled(true);
          return;
        }

        const stateName = (data.status as any)?.state || "";
        setStatusName(stateName);

        const cleanState = String(stateName).trim();
        const allowedToChatStates = ["กำลังพิมพ์", "พิมพ์เสร็จสิ้น"];
        setIsChatDisabled(!allowedToChatStates.includes(cleanState));

      } catch (err) {
        console.error("Fetch status error:", err);
        setStatusName("เชื่อมต่อผิดพลาด");
        setIsChatDisabled(true);
      }
    };

    fetchOrderStatus();
  }, [selectedOrderId]);

  // 🟢 4. เมื่อคลิกเลือกแชต เคลียร์ Unread Badge ทันที + ยิง API Mark Read ไปที่ MongoDB
  const handleSelectChat = async (orderId: string) => {
    setSelectedOrderId(orderId);

    // เคลียร์ Badge สีเขียวทันที
    setOrderChats((prev) =>
      prev.map((chat) =>
        chat.id === orderId ? { ...chat, unread_count: 0 } : chat
      )
    );

    // ยิง API สั่ง Mark Read ใน MongoDB
    try {
      await axios.put(`${API_BASE}/api/chat/read/${orderId}`);
    } catch (e) {
      console.warn("Update read status error:", e);
    }
  };

  // 5. คำนวณการกรองค้นหาและสถานะ
  const filteredOrderChats = useMemo(() => {
    return orderChats.filter((chat) => {
      const cleanSearch = searchQuery.trim().toLowerCase().replace("#", "");
      
      const matchesSearch =
        !cleanSearch ||
        (chat.customer_name && chat.customer_name.toLowerCase().includes(cleanSearch)) ||
        (chat.order_no && String(chat.order_no).includes(cleanSearch)) ||
        chat.id.toLowerCase().includes(cleanSearch);

      const matchesStatus =
        selectedStatus === "ทั้งหมด" ||
        (chat.status_name && chat.status_name.trim() === selectedStatus);

      return matchesSearch && matchesStatus;
    });
  }, [orderChats, searchQuery, selectedStatus]);

  const currentSelectedOrder = orderChats.find((o) => o.id === selectedOrderId);
  const statusFilterList = ["ทั้งหมด", "รอการดำเนินงาน", "กำลังพิมพ์", "พิมพ์เสร็จสิ้น", "รายการเสร็จสิ้น", "ยกเลิกการพิมพ์"];

  return (
    <div className="h-screen w-full bg-[#F4F6F9] flex flex-col font-sans overflow-hidden">
      {/* Navbar ของร้านค้า */}
      <ShopNavbar />

      {/* แถบแจ้งเตือนเมื่อร้านถูกระงับการใช้งาน */}
      {isSuspended && (
        <div className="bg-amber-500 text-white px-6 py-2.5 flex items-center justify-center gap-2 text-xs md:text-sm font-medium shadow-inner shrink-0">
          <Lock size={16} />
          <span>บัญชีถูกระงับการใช้งาน ระบบปิดการส่งข้อความแชตชั่วคราว</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex gap-4 min-h-0 overflow-hidden">
        
        {/* ================= ฝั่งซ้าย: รายการกล่องข้อความทั้งหมด ================= */}
        <div className="w-1/3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex justify-between items-center mb-3 px-1 shrink-0">
            <h2 className="text-base font-bold text-slate-800">
              กล่องข้อความทั้งหมด ({filteredOrderChats.length})
            </h2>
          </div>

          {/* ช่องค้นหา */}
          <div className="relative mb-2.5 shrink-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อลูกค้า หรือ เลขออเดอร์ #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#001B3A] border border-transparent transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ปุ่มแท็บกรองตามสถานะ */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 shrink-0 no-scrollbar text-[11px]">
            {statusFilterList.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer font-medium ${
                  selectedStatus === st
                    ? "bg-[#001B3A] text-white shadow-xs"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              กำลังโหลดรายการ...
            </div>
          ) : filteredOrderChats.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              {searchQuery || selectedStatus !== "ทั้งหมด" ? "ไม่พบรายการที่ค้นหา" : "ไม่มีรายการแชต"}
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 min-h-0 space-y-2 pr-1">
              {filteredOrderChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    selectedOrderId === chat.id
                      ? "bg-slate-100 border-[#001B3A] shadow-xs"
                      : "bg-white border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-800 truncate pr-2">
                      {chat.customer_name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border font-medium shrink-0 ${getStatusBadgeStyle(
                        chat.status_name
                      )}`}
                    >
                      {chat.status_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-slate-500 truncate pr-2">
                      {chat.latest_message}
                    </p>

                    {/* 🟢 Unread Badge สีเขียวแบบ LINE */}
                    {!!chat.unread_count && chat.unread_count > 0 && (
                      <span className="min-w-[20px] h-[20px] px-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                        {chat.unread_count > 99 ? "99+" : chat.unread_count}
                      </span>
                    )}
                  </div>

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
                  key={selectedOrderId}
                  orderId={selectedOrderId}
                  orderNo={currentSelectedOrder?.order_no}
                  role="shop"
                  currentUserId={rawShopId}
                  isChatDisabled={isChatDisabled || isSuspended}
                />
              </div>
            </>
          ) : (
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