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
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
      {/* Navbar สีน้ำเงิน - ปุ่มย้อนกลับซ้ายสุด + เส้นคั่น + โลโก้ */}
      <header className="bg-[#001B3A] text-white px-6 py-4 flex items-center shadow-md">
        <div className="flex items-center gap-4">
          {/* ปุ่มย้อนกลับ */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>ย้อนกลับ</span>
          </button>

          {/* เส้นคั่นกลาง */}
          <div className="h-5 w-[1px] bg-slate-600" />

          {/* โลโก้ */}
          <span className="font-bold text-xl tracking-tight">PrintHub Management</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex gap-4 my-2 h-[calc(100vh-100px)]">
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-base">กล่องข้อความสำหรับออเดอร์</h3>
              <p className="text-xs text-slate-400">ออเดอร์ปัจจุบัน: {selectedOrderId || "ยังไม่ได้เลือกออเดอร์"}</p>
            </div>

            <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
              isChatDisabled 
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              {statusName}
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                ไม่มีประวัติการสนทนาสำหรับออเดอร์นี้
              </div>
            ) : (
              messages.map((msg, i) => (
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
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              disabled={isChatDisabled}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isChatDisabled 
                  ? "ออเดอร์นี้เสร็จสิ้นแล้ว ไม่สามารถส่งข้อความได้" 
                  : "พิมพ์ข้อความ..."
              }
              className={`flex-1 px-4 py-2.5 text-sm rounded-xl focus:outline-none transition ${
                isChatDisabled
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-slate-50 border border-slate-200 focus:border-[#001B3A]"
              }`}
            />
            <button 
              type="submit" 
              disabled={isChatDisabled}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${
                isChatDisabled
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-[#001B3A] text-white hover:bg-slate-800"
              }`}
            >
              ส่ง
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}