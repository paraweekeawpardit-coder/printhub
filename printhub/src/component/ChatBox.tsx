"use client";

import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { supabase } from "@/config/supabase";
import { Paperclip, X, Lock, Loader2, Download, ExternalLink, Trash2, Ban } from "lucide-react";

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
  is_unsent?: boolean;
  isUnsent?: boolean;
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // State สำหรับคุม Custom Unsend Modal
  const [unsendingMsgId, setUnsendingMsgId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ฟังก์ชันดาวน์โหลดรูปภาพ
  const handleDownloadImage = (imageUrl: string) => {
    try {
      if (imageUrl.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = `chat-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = imageUrl.split("/").pop()?.split("?")[0] || "chat-image.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch(() => window.open(imageUrl, "_blank"));
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ฟังก์ชันเปิดรูปในแท็บใหม่
  const handleOpenInNewTab = (imageUrl: string) => {
    if (imageUrl.startsWith("data:")) {
      try {
        const byteString = atob(imageUrl.split(",")[1]);
        const mimeString = imageUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (e) {
        console.error("Error opening base64 in new tab:", e);
      }
    } else {
      window.open(imageUrl, "_blank");
    }
  };

  // เรียกเปิด Custom Confirm Modal
  const handleUnsendMessage = (messageId: string) => {
    setUnsendingMsgId(messageId);
  };

  // ฟังก์ชันยืนยันการยกเลิกข้อความ
  const confirmUnsend = () => {
    if (!unsendingMsgId) return;

    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("unsend_message", { messageId: unsendingMsgId, roomId: targetRoomId });
    }
    setUnsendingMsgId(null);
  };

  // 1. ดึงสถานะออเดอร์
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

  const isSupportChat = Boolean(propRoomId && propRoomId.startsWith("support_"));
  const cleanStatus = statusState.trim();
  const allowedStates = ["กำลังพิมพ์", "พิมพ์เสร็จสิ้น"];
  const isOrderStatusLocked = orderId ? !allowedStates.includes(cleanStatus) : false;
  const isLocked = Boolean(!isSupportChat && (propIsChatDisabled || isOrderStatusLocked));

  // Connect Socket.io
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
      socket.emit("join_chat_room", { roomId: targetRoomId, orderNo: orderNo || "" });
      socket.emit("mark_as_read", { roomId: targetRoomId, reader: role, userId: currentUserId || "" });
    });

    socket.on("load_chat_history", (history: Message[]) => {
      setMessages(history || []);
    });

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => {
        const isExist = prev.some((m) => (m._id && m._id === data._id) || (m.id && m.id === data.id));
        if (isExist) return prev;
        return [...prev, data];
      });

      const senderRole = String(data.sender || data.sender_role || "").toLowerCase();
      if (senderRole !== role) {
        socket.emit("mark_as_read", { roomId: targetRoomId, reader: role, userId: currentUserId || "" });
      }
    });

    // 🟢 ดักฟังการยกเลิกข้อความ (เช็กเปรียบเทียบทั้ง _id และ id)
    socket.on("message_unsent", (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const matchByObjId = msg._id && String(msg._id) === String(data.messageId);
          const matchById = msg.id && String(msg.id) === String(data.messageId);

          if (matchByObjId || matchById) {
            return {
              ...msg,
              is_unsent: true,
              isUnsent: true,
              message: "",
              text: "",
              images: [],
            };
          }
          return msg;
        })
      );
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

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [targetRoomId, role, currentUserId, orderNo]);

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

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!input.trim() && selectedImages.length === 0) || isLocked || !targetRoomId) return;

    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      alert("การเชื่อมต่อระบบแชตขาดหาย กรุณาลองส่งใหม่อีกครั้ง");
      return;
    }

    setIsUploading(true);

    try {
      let imageBase64List: string[] = [];
      if (selectedImages.length > 0) {
        imageBase64List = await convertFilesToBase64(selectedImages);
      }

      let activeSenderRole = role;
      if (!activeSenderRole && typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.includes("/admin/")) activeSenderRole = "admin";
        else if (path.includes("/shop/")) activeSenderRole = "shop";
        else activeSenderRole = "customer";
      }

      const nowFormattedTime = new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const messageData: Message = {
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
        time: nowFormattedTime,
        is_read: false,
        isRead: false,
        is_unsent: false,
        isUnsent: false,
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

  const formatMessageTime = (msg: Message) => {
    if (msg.time && !msg.time.includes("AM") && !msg.time.includes("PM")) {
      return msg.time;
    }
    
    if (msg.createdAt) {
      try {
        return new Date(msg.createdAt).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } catch {
        return msg.time || "";
      }
    }

    if (msg.time) {
      try {
        const dummyDate = new Date(`1970-01-01 ${msg.time}`);
        if (!isNaN(dummyDate.getTime())) {
          return dummyDate.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        }
      } catch {
        return msg.time;
      }
    }

    return "";
  };

  return (
    <div className="flex-1 flex flex-col h-full max-h-full min-h-0 overflow-hidden bg-slate-50 relative">
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            ไม่มีประวัติการสนทนา
          </div>
        ) : (
          messages.map((msg, index) => {
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

            let activeRole = role;
            if (!activeRole && typeof window !== "undefined") {
              const path = window.location.pathname;
              if (path.includes("/admin/")) activeRole = "admin";
              else if (path.includes("/shop/")) activeRole = "shop";
              else activeRole = "customer";
            }

            let isMe = false;
            if (myUserId && msgSenderId && msgSenderId === myUserId) {
              isMe = true;
            } else if (activeRole === "shop") {
              isMe = isSupportChat ? msgSenderRole === "shop" : msgSenderRole === "shop" || msgSenderRole === "admin";
            } else if (activeRole === "customer") {
              isMe = msgSenderRole === "customer";
            } else if (activeRole === "admin") {
              isMe = msgSenderRole === "admin";
            }

            const messageText = msg.message || msg.text || "";
            const msgImages = msg.images || [];
            const isReadStatus = msg.is_read || msg.isRead;
            const isUnsent = Boolean(msg.isUnsent || msg.is_unsent);
            
            // 🟢 ลำดับการดึง ID สำหรับกดยกเลิกข้อความ
            const msgId = msg._id || msg.id || "";

            return (
              <div
                key={msgId || index}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} group relative`}
              >
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {isMe
                    ? "คุณ"
                    : msgSenderRole === "admin"
                    ? "เจ้าหน้าที่ Support"
                    : msgSenderRole === "shop"
                    ? "ร้านค้า"
                    : "ลูกค้า"}
                </span>

                <div className="flex items-center gap-1.5 max-w-[80%]">
                  {/* ปุ่มถังขยะสำหรับยกเลิกข้อความ */}
                  {isMe && !isUnsent && (
                    <button
                      type="button"
                      onClick={() => handleUnsendMessage(msgId)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 text-slate-400 hover:text-red-500 rounded-full transition cursor-pointer"
                      title="ยกเลิกข้อความ"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}

                  {/* กล่องแสดงข้อความ */}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                      isUnsent
                        ? "bg-slate-200/60 text-slate-400 italic border border-slate-200"
                        : isMe
                        ? "bg-[#001B3A] text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {isUnsent ? (
                      <div className="flex items-center gap-1.5">
                        <Ban size={14} className="shrink-0" />
                        <span>ยกเลิกข้อความแล้ว</span>
                      </div>
                    ) : (
                      <>
                        {msgImages.length > 0 && (
                          <div className={`grid gap-1.5 mb-2 ${msgImages.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                            {msgImages.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative group">
                                <img
                                  src={imgUrl}
                                  alt="Chat attachment"
                                  onClick={() => setPreviewImage(imgUrl)}
                                  className="w-full h-28 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {messageText && <div className="whitespace-pre-wrap break-words">{messageText}</div>}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
                  <span>{formatMessageTime(msg)}</span>
                  {isMe && !isUnsent && (
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

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-12 right-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadImage(previewImage)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md transition cursor-pointer"
                title="ดาวน์โหลดรูปภาพ"
              >
                <Download size={15} />
                <span>ดาวน์โหลด</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenInNewTab(previewImage)}
                className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-md transition cursor-pointer"
                title="เปิดรูปภาพในแท็บใหม่"
              >
                <ExternalLink size={16} />
              </button>

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-md transition cursor-pointer"
                title="ปิด"
              >
                <X size={18} />
              </button>
            </div>

            <img
              src={previewImage}
              alt="Preview Full"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Custom Unsend Confirmation Modal */}
      {unsendingMsgId && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setUnsendingMsgId(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-1">
              <Trash2 size={24} />
            </div>

            <h3 className="text-base font-bold text-slate-800">
              ยกเลิกข้อความนี้?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed -mt-1">
              ข้อความนี้จะถูกยกเลิกและแสดงสถานะยกเลิกข้อความในห้องแชตสำหรับทุกคน
            </p>

            <div className="flex items-center gap-2.5 w-full mt-2">
              <button
                type="button"
                onClick={() => setUnsendingMsgId(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmUnsend}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer shadow-xs"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}