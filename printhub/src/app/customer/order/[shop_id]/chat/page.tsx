"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function CustomerOrderChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // 🟢 ดึง order_id ให้ครอบคลุม
  const rawOrderId =
    searchParams.get("order_id") ||
    (params?.order_id as string) ||
    (params?.shop_id as string) ||
    "";
  
  const orderId = rawOrderId !== "undefined" ? rawOrderId : "";

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [statusName, setStatusName] = useState<string>("กำลังโหลดสถานะ...");
  const [isChatDisabled, setIsChatDisabled] = useState<boolean>(false);

  // 1. ดึงสถานะออเดอร์ผ่าน Backend API
  useEffect(() => {
    if (!orderId) {
      setStatusName("ไม่พบรหัสออเดอร์");
      setIsChatDisabled(true);
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`);
        
        if (!res.ok) {
          console.warn(`API Status Error: ${res.status}`);
          // 🟢 หากดึงไม่ได้ ให้แสดงสถานะทั่วไปและไม่ต้องสั่งปิดแชต
          setStatusName("ไม่สามารถดึงสถานะได้");
          setIsChatDisabled(false); 
          return;
        }

        const data = await res.json();
        console.log("📌 Customer Page - Order Status Received:", data);

        if (data.success && data.state) {
          setStatusName(data.state);
          
          // 🟢 ล็อกแชตเฉพาะคำที่ระบุว่าเสร็จสิ้นหรือยกเลิกจริงๆ เท่านั้น (Trim ช่องว่างออกป้องกันข้อผิดพลาด)
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
  }, [orderId]);

  // 2. เชื่อมต่อ Socket
  useEffect(() => {
    if (!orderId) return;

    setMessages([]);
    socket = io("http://localhost:5000");

    socket.emit("join_order_chat", orderId);
    socket.emit("mark_as_read", { orderId, reader: "customer" });

    socket.on("load_chat_history", (history) => {
      setMessages(history || []);
    });

    socket.on("receive_message", (data) => {
      if (data.orderId === orderId) {
        setMessages((prev) => [...prev, data]);
        if (data.sender === "shop") {
          socket.emit("mark_as_read", { orderId, reader: "customer" });
        }
      }
    });

    socket.on("messages_read", (data) => {
      if (data.reader === "shop") {
        setMessages((prev) =>
          prev.map((msg) => (msg.sender === "customer" ? { ...msg, isRead: true } : msg))
        );
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [orderId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatDisabled || !orderId) return;

    const messageData = {
      orderId,
      sender: "customer",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("send_message", messageData);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
      {/* Navbar สีน้ำเงิน - แบบที่ 1: ปุ่มย้อนกลับอยู๋ซ้ายสุด + เส้นคั่น + โลโก้ */}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>ย้อนกลับ</span>
          </button>

          {/* เส้นคั่นกลาง */}
          <div className="h-5 w-[1px] bg-slate-600" />

          {/* โลโก้ */}
          <span className="font-bold text-xl tracking-tight">PrintHub</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col my-2 h-[calc(100vh-100px)]">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">PrintHub Official Store</h2>
              <p className="text-xs text-slate-400">ออเดอร์: {orderId || "ไม่พบรหัสออเดอร์"}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                isChatDisabled 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {statusName}
              </span>
            </div>
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
                  className={`flex flex-col ${msg.sender === "customer" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.sender === "customer"
                        ? "bg-[#001B3A] text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                    <span>{msg.time}</span>
                    {msg.sender === "customer" && msg.isRead && (
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