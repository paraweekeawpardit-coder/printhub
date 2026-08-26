"use client";

import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function CustomerOrderChatPage() {
  const orderId = "PO-8942";
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.emit("join_order_chat", orderId);
    socket.emit("mark_as_read", { orderId, reader: "customer" });

    // โหลดประวัติข้อความทั้งหมดทันทีเมื่อเข้าห้อง
    socket.on("load_chat_history", (history) => {
      setMessages(history);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      if (data.sender === "shop") {
        socket.emit("mark_as_read", { orderId, reader: "customer" });
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
      socket.disconnect();
    };
  }, [orderId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
      <header className="bg-[#001B3A] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <span className="font-bold text-xl tracking-tight">PrintHub</span>
        <button onClick={() => window.history.back()} className="text-sm text-slate-300 hover:text-white">
          กลับหน้าหลัก
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col my-2 h-[calc(100vh-100px)]">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="font-bold text-slate-800 text-sm">PrintHub Official Store</h2>
            <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-medium">
              ออเดอร์ของฉัน
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
            {messages.map((msg, i) => (
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
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
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