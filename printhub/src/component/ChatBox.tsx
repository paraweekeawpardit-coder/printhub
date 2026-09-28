"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/src/config/supabase";

interface Message {
  _id?: string;
  id?: string;
  orderId?: string;
  sender: "customer" | "shop";
  text?: string;
  message?: string;
  time?: string;
  createdAt?: string;
  isRead?: boolean;
}

interface ChatBoxProps {
  orderId: string;
  role: "customer" | "shop";
  isChatDisabled?: boolean;
}

export default function ChatBox({
  orderId,
  role,
  isChatDisabled: propIsChatDisabled,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [statusState, setStatusState] = useState<string>("");

  const socketRef = useRef<Socket | null>(null);

  // --------------------------------------------------
  // 1. ดึงสถานะออเดอร์จาก Supabase (Join status.state)
  // --------------------------------------------------
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderStatus = async () => {
      try {
        const { data } = await supabase
          .from("print_order")
          .select(`
            current_status_id,
            status:current_status_id ( state )
          `)
          .eq("id", orderId)
          .single();

        if (data && data.status) {
          const stateName = (data.status as any)?.state || "";
          setStatusState(stateName);
        }
      } catch (err) {
        console.error("Fetch order status error:", err);
      }
    };

    fetchOrderStatus();

    const channel = supabase
      .channel(`chat_box_status_${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "print_order",
          filter: `id=eq.${orderId}`,
        },
        () => {
          fetchOrderStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // ตรวจสอบรายการสถานะที่ต้องสั่ง "ล็อกแชต"
  const lockedStates = [
    "พิมพ์เสร็จสิ้น",
    "รายการเสร็จสิ้น",
    "ยกเลิกการพิมพ์",
    "เสร็จสิ้น",
    "ยกเลิก",
    "completed",
    "cancelled",
  ];

  const isFinished = lockedStates.includes(statusState.trim().toLowerCase());
  const isLocked = Boolean(propIsChatDisabled || isFinished);

  // --------------------------------------------------
  // 2. Socket.io (รับ-ส่ง ข้อความ Real-time)
  // --------------------------------------------------
  useEffect(() => {
    if (!orderId) return;

    setMessages([]);
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join_order_chat", orderId);
    socket.emit("mark_as_read", { orderId, reader: role });

    socket.on("load_chat_history", (history: Message[]) => {
      setMessages(history || []);
    });

    socket.on("receive_message", (data: Message) => {
      if (data.orderId === orderId) {
        setMessages((prev) => [...prev, data]);
        if (data.sender !== role) {
          socket.emit("mark_as_read", { orderId, reader: role });
        }
      }
    });

    socket.on("messages_read", (data) => {
      if (data.reader !== role) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === role ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    return () => {
      socket.off("load_chat_history");
      socket.off("receive_message");
      socket.off("messages_read");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [orderId, role]);

  // --------------------------------------------------
  // 3. ฟังก์ชันส่งข้อความ
  // --------------------------------------------------
  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLocked || !orderId) return;

    const socket = socketRef.current;
    if (!socket) return;

    const messageData = {
      orderId: orderId,
      sender: role,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", messageData);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            ไม่มีประวัติการสนทนาสำหรับออเดอร์นี้
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === role;
            const messageText = msg.text || msg.message || "";
            const displayTime =
              msg.time ||
              (msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "");

            return (
              <div
                key={msg._id || msg.id || index}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {isMe ? "คุณ" : msg.sender === "shop" ? "ร้านค้า" : "ลูกค้า"}
                </span>

                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-[#001B3A] text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  {messageText}
                </div>

                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                  <span>{displayTime}</span>
                  {isMe && msg.isRead && (
                    <span className="text-blue-600 font-semibold">
                      • อ่านแล้ว
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-slate-100 flex gap-2"
      >
        <input
          type="text"
          value={input}
          disabled={isLocked}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isLocked
              ? "🔒 ออเดอร์นี้เสร็จสิ้นแล้ว ไม่สามารถส่งข้อความได้"
              : "พิมพ์ข้อความ..."
          }
          className={`flex-1 px-4 py-2.5 text-sm rounded-xl focus:outline-none transition ${
            isLocked
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              : "bg-slate-50 border border-slate-200 focus:border-[#001B3A]"
          }`}
        />

        <button
          type="submit"
          disabled={isLocked}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${
            isLocked
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-[#001B3A] text-white hover:bg-slate-800"
          }`}
        >
          ส่ง
        </button>
      </form>
    </div>
  );
}