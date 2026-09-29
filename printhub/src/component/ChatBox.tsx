"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/src/config/supabase";
import { Paperclip, X } from "lucide-react";

interface Message {
  _id?: string;
  id?: string;
  orderId?: string;
  sender: "customer" | "shop";
  text?: string;
  message?: string;
  images?: string[];
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref สำหรับอ้างอิงจุดล่างสุด

  // ฟังก์ชันเลื่อนลงล่างสุดอัตโนมัติ
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // เลื่อนลงล่างสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --------------------------------------------------
  // 1. ดึงสถานะออเดอร์จาก Supabase
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
  // 2. Socket.io
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 10) {
      alert("สามารถแนบรูปภาพได้สูงสุดไม่เกิน 10 รูปต่อการส่ง 1 ครั้ง");
      return;
    }

    const newFiles = [...selectedImages, ...files];
    setSelectedImages(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFilesToBase64 = (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          })
      )
    );
  };

  // --------------------------------------------------
  // 3. ฟังก์ชันส่งข้อความ
  // --------------------------------------------------
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      (!input.trim() && selectedImages.length === 0) ||
      isLocked ||
      !orderId
    )
      return;

    const socket = socketRef.current;
    if (!socket) return;

    setIsUploading(true);

    try {
      let imageBase64List: string[] = [];
      if (selectedImages.length > 0) {
        imageBase64List = await convertFilesToBase64(selectedImages);
      }

      const messageData = {
        orderId: orderId,
        sender: role,
        text: input.trim(),
        images: imageBase64List,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      socket.emit("send_message", messageData);

      setInput("");
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // กำหนด h-full และ max-h-full เพื่อให้อยู่ในขอบเขต Parent
    <div className="flex-1 flex flex-col h-full max-h-full min-h-0 overflow-hidden">
      {/* Message Area: flex-1 + overflow-y-auto จะช่วยให้ Scroll เฉพาะกล่องนี้ */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC] min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            ไม่มีประวัติการสนทนาสำหรับออเดอร์นี้
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === role;
            const messageText = msg.text || msg.message || "";
            const msgImages = msg.images || [];
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
                  {/* แสดงรูปภาพ */}
                  {msgImages.length > 0 && (
                    <div
                      className={`grid gap-1.5 mb-2 ${
                        msgImages.length === 1
                          ? "grid-cols-1"
                          : msgImages.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-3"
                      }`}
                    >
                      {msgImages.map((imgUrl, imgIdx) => (
                        <a
                          key={imgIdx}
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={imgUrl}
                            alt="Chat attachment"
                            className="w-full h-24 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition cursor-pointer"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {messageText && <div>{messageText}</div>}
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
        {/* Element อ้างอิงจุดล่างสุดของแชต */}
        <div ref={messagesEndRef} />
      </div>

      {/* Previews ก่อนกดส่ง */}
      {imagePreviews.length > 0 && (
        <div className="p-2 bg-slate-50 border-t border-t border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0">
          {imagePreviews.map((preview, idx) => (
            <div key={idx} className="relative w-14 h-14 flex-shrink-0">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <span className="text-xs text-slate-400 ml-2">
            ({imagePreviews.length}/10)
          </span>
        </div>
      )}

      {/* Input Area (shrink-0 ป้องกันไม่ให้โดนบีบขนาด) */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          multiple
          accept="image/*"
          className="hidden"
          disabled={isLocked || isUploading}
        />

        <button
          type="button"
          disabled={isLocked || isUploading || selectedImages.length >= 10}
          onClick={() => fileInputRef.current?.click()}
          className={`p-2.5 rounded-xl border transition ${
            isLocked
              ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
          title="แนบรูปภาพ (สูงสุด 10 รูป)"
        >
          <Paperclip size={18} />
        </button>

        <input
          type="text"
          value={input}
          disabled={isLocked || isUploading}
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
          disabled={
            isLocked ||
            isUploading ||
            (!input.trim() && selectedImages.length === 0)
          }
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${
            isLocked ||
            isUploading ||
            (!input.trim() && selectedImages.length === 0)
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-[#001B3A] text-white hover:bg-slate-800"
          }`}
        >
          {isUploading ? "กำลังส่ง..." : "ส่ง"}
        </button>
      </form>
    </div>
  );
}