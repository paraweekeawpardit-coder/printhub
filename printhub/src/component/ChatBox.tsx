"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { supabase } from "@/config/supabase";
import { Paperclip, X, Lock, Loader2 } from "lucide-react";

interface Message {
  _id?: string;
  id?: string;
  room_id?: string;
  roomId?: string;
  print_order_id?: string;
  orderId?: string;
  order_no?: string | number;
  sender_role?: "customer" | "shop" | "admin" | string;
  sender?: "customer" | "shop" | "admin" | string;
  sender_id?: string;
  senderId?: string;
  message?: string;
  text?: string;
  images?: string[];
  time?: string;
  createdAt?: string;
  is_read?: boolean;
  isRead?: boolean;
}

interface ChatBoxProps {
  roomId?: string;
  orderId?: string;
  orderNo?: string | number;
  role: "customer" | "shop" | "admin";
  currentUserId?: string;
  isChatDisabled?: boolean;
}

export default function ChatBox({
  roomId: propRoomId,
  orderId,
  orderNo,
  role,
  currentUserId,
  isChatDisabled: propIsChatDisabled,
}: ChatBoxProps) {
  const targetRoomId = propRoomId || orderId || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [statusState, setStatusState] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // สกอร์ลลงล่างสุดอัตโนมัติ
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. ดึงสถานะออเดอร์จาก Supabase
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderStatus = async () => {
      try {
        const { data } = await supabase
          .from("print_order")
          .select("current_status_id, status:current_status_id ( state )")
          .eq("id", orderId)
          .single();

        if (data && data.status) {
          setStatusState((data.status as any)?.state || "");
        }
      } catch (err) {
        console.error("Fetch order status error:", err);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  // 2. เงื่อนไขการเปิด-ปิดแชต
  const isSupportChat = Boolean(propRoomId && propRoomId.startsWith("support_"));
  const cleanStatus = statusState.trim();
  const allowedStates = ["กำลังพิมพ์", "พิมพ์เสร็จสิ้น"];
  
  const isOrderStatusLocked = orderId ? !allowedStates.includes(cleanStatus) : false;
  const isLocked = Boolean(!isSupportChat && (propIsChatDisabled || isOrderStatusLocked));

  // 3. Connect Socket.io
  useEffect(() => {
    if (!targetRoomId) return;

    const socket = io("http://localhost:5000", {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket Connected:", socket.id);
      socket.emit("join_chat_room", { roomId: targetRoomId, orderNo: orderNo || "" });
      socket.emit("mark_as_read", { roomId: targetRoomId, reader: role, userId: currentUserId || "" });
    });

    // โหลดประวัติแชทย้อนหลัง
    socket.on("load_chat_history", (history: Message[]) => {
      console.log("🟢 Loaded Chat History Data:", history);
      setMessages(history || []);
    });

    // รับข้อความ Realtime
    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => {
        const isExist = prev.some((m) => (m.id && m.id === data.id) || (m._id && m._id === data._id));
        if (isExist) return prev;
        return [...prev, data];
      });

      const senderRole = String(data.sender || data.sender_role || "").toLowerCase();
      if (senderRole !== role) {
        socket.emit("mark_as_read", { roomId: targetRoomId, reader: role, userId: currentUserId || "" });
      }
    });

    socket.on("messages_read", (data: { reader: string }) => {
      if (data.reader !== role) {
        setMessages((prev) =>
          prev.map((msg) => {
            const senderRole = String(msg.sender || msg.sender_role || "").toLowerCase();
            return senderRole === role ? { ...msg, is_read: true, isRead: true } : msg;
          })
        );
      }
    });

    socket.on("error_message", (data: { message: string }) => {
      alert(data.message || "เกิดข้อผิดพลาดในการส่งข้อความ");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [targetRoomId, role, currentUserId, orderNo]);

  // จัดการแปลงไฟล์รูปเป็น Base64
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 10) {
      alert("สามารถแนบรูปภาพได้สูงสุดไม่เกิน 10 รูปต่อครั้ง");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
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

  // 4. ฟังก์ชันส่งข้อความ
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!input.trim() && selectedImages.length === 0) || isLocked || !targetRoomId) return;

    const socket = socketRef.current;

    if (!socket || !socket.connected) {
      alert("การเชื่อมต่อระบบแชตขาดหาย กำลังลองเชื่อมต่อใหม่... กรุณาลองส่งใหม่อีกครั้ง");
      return;
    }

    setIsUploading(true);

    try {
      let imageBase64List: string[] = [];
      if (selectedImages.length > 0) {
        imageBase64List = await convertFilesToBase64(selectedImages);
      }

      // 🟢 ตรวจสอบ Role ของผู้ส่งให้ชัวร์ที่สุด
      let activeSenderRole = role;
      if (!activeSenderRole && typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.includes("/admin/")) activeSenderRole = "admin";
        else if (path.includes("/shop/")) activeSenderRole = "shop";
        else activeSenderRole = "customer";
      }

      const messageData: Message = {
        id: Date.now().toString(),
        room_id: targetRoomId,
        roomId: targetRoomId,
        print_order_id: orderId || undefined,
        orderId: orderId || undefined,
        order_no: orderNo,
        sender_id: currentUserId || activeSenderRole,
        senderId: currentUserId || activeSenderRole,
        sender_role: activeSenderRole,
        sender: activeSenderRole,
        message: input.trim(),
        text: input.trim(),
        images: imageBase64List,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        is_read: false,
        isRead: false,
      };

      socket.emit("send_message", messageData);

      setInput("");
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Send message error:", error);
      alert("เกิดข้อผิดพลาดในการเตรียมข้อมูลข้อความ");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full max-h-full min-h-0 overflow-hidden bg-slate-50">
      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            ไม่มีประวัติการสนทนา
          </div>
        ) : (
          messages.map((msg, index) => {
            // 🟢 1. ดึง Role ผู้ส่งที่แท้จริง (ป้องกัน DB บันทึก sender_role ผิด)
            let rawRole = "";
            const sVal = String(msg.sender || "").toLowerCase();
            const sIdVal = String(msg.senderId || "").toLowerCase();
            const sRoleVal = String(msg.sender_role || "").toLowerCase();

            if (sVal === "admin" || sIdVal === "admin" || sRoleVal === "admin") {
              rawRole = "admin";
            } else if (sVal === "shop" || sIdVal === "shop" || sRoleVal === "shop") {
              rawRole = "shop";
            } else if (sVal === "customer" || sRoleVal === "customer") {
              rawRole = "customer";
            } else {
              rawRole = sRoleVal || sVal;
            }

            const msgSenderRole = rawRole;
            const msgSenderId = String(msg.sender_id || msg.senderId || "");
            const myUserId = String(currentUserId || "");

            // 🟢 2. กำหนด Role ปัจจุบันของผู้ใช้งาน
            let activeRole = role;
            if (!activeRole && typeof window !== "undefined") {
              const path = window.location.pathname;
              if (path.includes("/admin/")) activeRole = "admin";
              else if (path.includes("/shop/")) activeRole = "shop";
              else activeRole = "customer";
            }

            // 🟢 3. คำนวณความถูกต้องของฝั่งข้อความ (isMe)
            let isMe = false;

            // 3.1 เช็ค User ID ตรงกันเป็นหลักก่อน
            if (myUserId && msgSenderId && msgSenderId === myUserId) {
              isMe = true;
            } 
            // 3.2 ถ้าเปิดหน้าร้านค้า (Shop)
            else if (activeRole === "shop") {
              // ถ้าอยู่ในห้อง Support (ร้านคุยกับ Admin): ฝั่งเราต้องเป็น "shop" เท่านั้น (ข้อความ admin ต้องชิดซ้าย)
              if (isSupportChat) {
                isMe = msgSenderRole === "shop";
              } 
              // ถ้าอยู่ในห้อง Order (ร้านคุยกับ Customer): ฝั่งเราเป็น "shop" (หรือแอดมินช่วยตอบ)
              else {
                isMe = msgSenderRole === "shop" || msgSenderRole === "admin";
              }
            } 
            // 3.3 ถ้าเปิดหน้าลูกค้า (Customer)
            else if (activeRole === "customer") {
              isMe = msgSenderRole === "customer";
            } 
            // 3.4 ถ้าเปิดหน้าแอดมิน (Admin)
            else if (activeRole === "admin") {
              isMe = msgSenderRole === "admin";
            }

            const messageText = msg.message || msg.text || "";
            const msgImages = msg.images || [];
            const isReadStatus = msg.is_read || msg.isRead;

            return (
              <div
                key={msg._id || msg.id || index}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* แสดงชื่อผู้ส่ง */}
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {isMe
                    ? "คุณ"
                    : msgSenderRole === "admin"
                    ? "เจ้าหน้าที่ Support"
                    : msgSenderRole === "shop"
                    ? "ร้านค้า"
                    : "ลูกค้า"}
                </span>

                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                    isMe
                      ? "bg-[#001B3A] text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  {msgImages.length > 0 && (
                    <div className={`grid gap-1.5 mb-2 ${msgImages.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {msgImages.map((imgUrl, imgIdx) => (
                        <a key={imgIdx} href={imgUrl} target="_blank" rel="noreferrer">
                          <img
                            src={imgUrl}
                            alt="Chat attachment"
                            className="w-full h-28 object-cover rounded-lg border border-slate-200 cursor-pointer"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {messageText && <div className="whitespace-pre-wrap break-words">{messageText}</div>}
                </div>

                <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
                  <span>
                    {msg.time || (msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "")}
                  </span>
                  {isMe && (
                    <span className={isReadStatus ? "text-blue-600 font-semibold" : "text-slate-400"}>
                      • {isReadStatus ? "อ่านแล้ว" : "ยังไม่อ่าน"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Warning Box */}
      {isLocked && (
        <div className="bg-amber-50 border-t border-amber-200 p-2.5 text-center text-amber-800 text-xs flex items-center justify-center gap-1.5 shrink-0">
          <Lock size={14} />
          <span>
            {statusState
              ? `ห้องแชตอยู่ในโหมดอ่านอย่างเดียว (สถานะออเดอร์: "${statusState}")`
              : "ห้องแชตปิดการส่งข้อความแล้ว"}
          </span>
        </div>
      )}

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="p-2 bg-slate-100 border-t flex items-center gap-2 overflow-x-auto shrink-0">
          {imagePreviews.map((preview, idx) => (
            <div key={idx} className="relative w-14 h-14 shrink-0">
              <img src={preview} alt="preview" className="w-full h-full object-cover rounded-lg border border-slate-300" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <span className="text-[10px] text-slate-400 font-medium px-1">{imagePreviews.length}/10 รูป</span>
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t flex items-center gap-2 shrink-0">
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
          className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 disabled:opacity-50 transition cursor-pointer"
        >
          <Paperclip size={18} />
        </button>

        <input
          type="text"
          value={input}
          disabled={isLocked || isUploading}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLocked ? "🔒 อ่านได้อย่างเดียว..." : "พิมพ์ข้อความ..."}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001B3A]/20 transition"
        />

        <button
          type="submit"
          disabled={isLocked || isUploading || (!input.trim() && selectedImages.length === 0)}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#001B3A] text-white hover:bg-slate-800 disabled:bg-slate-300 transition flex items-center gap-1.5 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              <span>กำลังส่ง...</span>
            </>
          ) : (
            <span>ส่ง</span>
          )}
        </button>
      </form>
    </div>
  );
}