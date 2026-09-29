"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function ShopChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const paramOrderId = (params?.order_id as string) || (params?.shop_id as string) || "";
  const queryOrderId = searchParams.get("order_id") || "";
  
  const validOrderId = (queryOrderId && queryOrderId !== "undefined") 
    ? queryOrderId 
    : (paramOrderId && paramOrderId !== "undefined") 
    ? paramOrderId 
    : "";

  const [selectedOrderId, setSelectedOrderId] = useState(validOrderId);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [statusName, setStatusName] = useState<string>("กำลังโหลดสถานะ...");
  const [isChatDisabled, setIsChatDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (validOrderId) setSelectedOrderId(validOrderId);
  }, [validOrderId]);

  // 1. ดึงสถานะออเดอร์ผ่าน Backend API
  useEffect(() => {
    if (!selectedOrderId || selectedOrderId === "undefined") {
      setStatusName("ไม่พบรหัสออเดอร์");
      setIsChatDisabled(true);
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${selectedOrderId}/status`);
        
        if (!res.ok) {
          console.warn(`API Status Error: ${res.status}`);
          setStatusName("ไม่สามารถดึงสถานะได้");
          setIsChatDisabled(false);
          return;
        }

        const data = await res.json();
        console.log("📌 Shop Page - Order Status Received:", data);

        if (data.success && data.state) {
          setStatusName(data.state);
          
          // 🟢 ล็อกแชตเฉพาะคำที่ระบุว่าเสร็จสิ้นหรือยกเลิกจริงๆ เท่านั้น
          const stateClean = String(data.state).trim().toLowerCase();
          const disabledStates = ["พิมพ์เสร็จสิ้น", "เสร็จสิ้น", "ยกเลิกการพิมพ์", "ยกเลิก", "completed", "cancelled"];
          
          if (disabledStates.some(s => s.toLowerCase() === stateClean)) {
            setIsChatDisabled(true);
          } else {
            setIsChatDisabled(false);
          }
        } else {
          setStatusName("กำลังดำเนินการ");
          setIsChatDisabled(false);
        }
      } catch (err) {
        console.error("Fetch status error:", err);
        setStatusName("เชื่อมต่อผิดพลาด");
        setIsChatDisabled(false);
      }
    };

    fetchOrderStatus();
  }, [selectedOrderId]);

  // 2. จัดการ Socket
  useEffect(() => {
    if (!selectedOrderId || selectedOrderId === "undefined") return;

    setMessages([]);
    socket = io("http://localhost:5000");

    socket.emit("join_order_chat", selectedOrderId);
    socket.emit("mark_as_read", { orderId: selectedOrderId, reader: "shop" });

    socket.on("load_chat_history", (history) => {
      setMessages(history || []);
    });

    socket.on("receive_message", (data) => {
      if (data.orderId === selectedOrderId) {
        setMessages((prev) => [...prev, data]);
        if (data.sender === "customer") {
          socket.emit("mark_as_read", { orderId: selectedOrderId, reader: "shop" });
        }
      }
    });

    socket.on("messages_read", (data) => {
      if (data.reader === "customer") {
        setMessages((prev) =>
          prev.map((msg) => (msg.sender === "shop" ? { ...msg, isRead: true } : msg))
        );
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [selectedOrderId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatDisabled || !selectedOrderId) return;

    const messageData = {
      orderId: selectedOrderId,
      sender: "shop",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("send_message", messageData);
    setInput("");
  };

  return (
    // 1. ล็อกความสูงพอดีจอภาพ (h-screen) และปิด scrollbar ของเบราว์เซอร์
    <div className="h-screen w-full bg-[#F4F6F9] flex flex-col font-sans overflow-hidden">
      {/* Header หลักด้านบน ล็อกขนาดคงที่ (shrink-0) */}
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

      {/* Main Container ครอบพื้นที่ทั้งหมดที่เหลือ */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex gap-4 min-h-0 overflow-hidden">
        
        {/* ================= ฝั่งซ้าย: กล่องข้อความทั้งหมด ================= */}
        <div className="w-1/3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col min-h-0 overflow-hidden">
          <h2 className="text-base font-bold text-slate-800 mb-3 px-1 shrink-0">
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
            /* overflow-y-auto + min-h-0 สั่งให้ scroll เฉพาะฝั่งซ้ายเมื่อรายชื่อเยอะ */
            <div className="overflow-y-auto flex-1 min-h-0 space-y-2 pr-1">
              {orderChats.map((chat) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === "shop" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.sender === "shop"
                        ? "bg-[#001B3A] text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                    <span>{msg.time}</span>
                    {msg.sender === "shop" && msg.isRead && (
                      <span className="text-blue-600 font-semibold">• อ่านแล้ว</span>
                    )}
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

        {/* ================= ฝั่งขวา: แสดง ChatBox ================= */}
        <div className="w-2/3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col min-h-0 overflow-hidden">
          {selectedOrderId ? (
            <>
              {/* Header ฝั่งขวา ล็อกขนาดคงที่ (shrink-0) */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
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

              {/* คอนเทนเนอร์สำหรับกล่องแชต สั่งล็อกความสูงและปล่อยให้ ChatBox ภายในทำการ scroll ข้อความเอง */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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