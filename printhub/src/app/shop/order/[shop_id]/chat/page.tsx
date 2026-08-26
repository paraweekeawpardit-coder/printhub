"use client";

import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function ShopChatPage() {
  const [selectedOrderId, setSelectedOrderId] = useState("PO-8942");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.emit("join_order_chat", selectedOrderId);
    socket.emit("mark_as_read", { orderId: selectedOrderId, reader: "shop" });

    // ดึงประวัติข้อความที่เคยส่งไว้ทั้งหมดมาแสดง
    socket.on("load_chat_history", (history) => {
      setMessages(history);
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
      socket.disconnect();
    };
  }, [selectedOrderId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
      <header className="bg-[#001B3A] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <span className="font-bold text-xl tracking-tight">PrintHub Management</span>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex gap-4 my-2 h-[calc(100vh-100px)]">
        <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-800 text-sm">ออเดอร์ที่มีแชต</h2>
          </div>
          <div className="p-4 bg-blue-50/70 border-l-4 border-[#001B3A] cursor-pointer">
            <div className="font-bold text-sm text-slate-800">คุณ ปริ้นเตอร์ ดีใจ</div>
            <div className="text-xs text-slate-400 mt-1">กดเพื่อเปิดแชตออเดอร์นี้</div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-slate-800 text-base">สนทนาสำหรับออเดอร์</h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.map((msg, i) => (
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
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ตอบกลับ..."
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#001B3A]"
            />
            <button type="submit" className="bg-[#001B3A] text-white px-6 py-2.5 rounded-xl text-sm font-medium">
              ส่ง
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}