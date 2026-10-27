"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { 
  Search, 
  User, 
  Store, 
  Headset, 
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import axios from "axios";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import ChatBox from "@/component/ChatBox"; 
import { supabase } from "@/config/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface SupportRoom {
  roomId: string;
  senderId: string;
  senderName: string;
  senderType: "customer" | "shop";
  lastMessage?: string;
  updatedAt?: string;
  unreadCount?: number;
}

function AdminSupportContent() {
  const searchParams = useSearchParams();
  const targetType = searchParams.get("type"); // "customer" | "shop"
  const targetId = searchParams.get("id");     // ID ของลูกค้า หรือ ร้านค้า

  const [rooms, setRooms] = useState<SupportRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<SupportRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "customer" | "shop">("all");
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล User/Shop จาก Supabase ผสานประวัติแชต MongoDB
  const fetchRooms = async () => {
    try {
      setLoading(true);

      const { data: customers } = await supabase
        .from("customer")
        .select("id, first_name, last_name, contact");

      const { data: shops } = await supabase
        .from("print_shop")
        .select("id, shop_name, owner_name, email");

      let mongoMap: Record<string, any> = {};
      try {
        const mongoRes = await axios.get(`${API_BASE}/api/admin/chat-support/rooms`);
        const mongoList = mongoRes.data?.data || [];
        mongoList.forEach((m: any) => {
          if (m._id) {
            mongoMap[m._id] = m;
            const altKey = m._id.replace("support_customer_", "support_cust_");
            mongoMap[altKey] = m;
          }
        });
      } catch (err) {
        console.warn("Mongo support rooms warning:", err);
      }

      const formattedRooms: SupportRoom[] = [];

      // ลูกค้า
      if (customers) {
        customers.forEach((c: any) => {
          const fullName = `${c.first_name || ""} ${c.last_name || ""}`.trim();
          const mainRoomId = `support_customer_${c.id}`;
          const altRoomId = `support_cust_${c.id}`;
          const mongoInfo = mongoMap[mainRoomId] || mongoMap[altRoomId] || {};

          formattedRooms.push({
            roomId: mainRoomId,
            senderId: c.id,
            senderName: fullName || c.contact || "ลูกค้า",
            senderType: "customer",
            lastMessage: mongoInfo.lastMessage || "คลิกเพื่อดูข้อความสนทนา",
            updatedAt: mongoInfo.updatedAt || "",
            unreadCount: mongoInfo.unreadCount || 0,
          });
        });
      }

      // ร้านค้า
      if (shops) {
        shops.forEach((s: any) => {
          const roomId = `support_shop_${s.id}`;
          const mongoInfo = mongoMap[roomId] || {};

          formattedRooms.push({
            roomId,
            senderId: s.id,
            senderName: s.shop_name || s.owner_name || s.email || "ร้านค้า",
            senderType: "shop",
            lastMessage: mongoInfo.lastMessage || "คลิกเพื่อดูข้อความสนทนา",
            updatedAt: mongoInfo.updatedAt || "",
            unreadCount: mongoInfo.unreadCount || 0,
          });
        });
      }

      // เรียงลำดับแชตล่าสุดขึ้นบนสุดเสมอ
      formattedRooms.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

      setRooms(formattedRooms);
      return formattedRooms;
    } catch (err) {
      console.error("Error loading support rooms:", err);
      setRooms([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms().then((loadedRooms) => {
      // 🟢 ตรวจหาและเลือกห้องแชตตาม URL Query Params อัตโนมัติเมื่อโหลดหน้าเสร็จ
      if (targetId && targetType) {
        const expectedRoomId = targetType === "shop" 
          ? `support_shop_${targetId}` 
          : `support_customer_${targetId}`;

        const matchedRoom = loadedRooms.find(
          (r) => r.roomId === expectedRoomId || r.senderId === targetId
        );

        if (matchedRoom) {
          setSelectedRoom(matchedRoom);
          if (targetType === "customer") setFilterType("customer");
          if (targetType === "shop") setFilterType("shop");
        }
      }
    });
  }, [targetId, targetType]);

  // Realtime Socket.io — ดักฟังข้อความใหม่
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

    socket.on("receive_message", (newMsg: any) => {
      const rawRoomId = newMsg.roomId || newMsg.room_id || newMsg.orderId;
      if (!rawRoomId || !rawRoomId.startsWith("support_")) return;

      const targetRoomId = rawRoomId.replace("support_cust_", "support_customer_");

      setRooms((prevRooms) => {
        const roomIndex = prevRooms.findIndex(
          (r) => r.roomId === targetRoomId || r.roomId.replace("support_customer_", "support_cust_") === rawRoomId
        );

        if (roomIndex !== -1) {
          const targetRoom = prevRooms[roomIndex];
          const isCurrentActiveRoom = selectedRoom?.roomId === targetRoom.roomId;
          const isFromOther = newMsg.sender !== "admin";

          const updatedRoom: SupportRoom = {
            ...targetRoom,
            lastMessage: newMsg.text || newMsg.message || (newMsg.images?.length ? "ส่งรูปภาพ" : "ข้อความใหม่"),
            updatedAt: new Date().toISOString(),
            unreadCount: isCurrentActiveRoom
              ? 0
              : isFromOther
              ? (targetRoom.unreadCount || 0) + 1
              : targetRoom.unreadCount,
          };

          const remainingRooms = prevRooms.filter((_, idx) => idx !== roomIndex);
          return [updatedRoom, ...remainingRooms];
        } else {
          fetchRooms();
          return prevRooms;
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRoom]);

  // คลิกเลือกห้องแชต -> เคลียร์ Unread Badge
  const handleSelectRoom = (room: SupportRoom) => {
    setSelectedRoom(room);

    setRooms((prev) =>
      prev.map((r) => (r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r))
    );

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socket.emit("mark_as_read", {
      roomId: room.roomId,
      reader: "admin",
    });
  };

  // ค้นหาและกรองรายการห้องแชต
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "all" || room.senderType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [rooms, searchQuery, filterType]);

  return (
    <div className="w-full h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] p-2 sm:p-4 md:p-6 flex flex-col bg-[#F8FAFC] overflow-hidden box-border font-sans">
      
      {/* Header */}
      <div className="mb-2 sm:mb-4 flex items-center justify-between shrink-0 px-1">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Headset className="text-[#0F2942] shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
            <span className="truncate">ศูนย์รับเรื่องช่วยเหลือ (Admin Support)</span>
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">
            จัดการและตอบกลับข้อความสอบถามจากลูกค้าและร้านค้าในระบบ
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-0">
        
        {/* 👈 ฝั่งซ้าย: รายชื่อผู้ติดต่อ */}
        <div 
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex-col bg-slate-50/50 shrink-0 h-full min-h-0 ${
            selectedRoom ? "hidden md:flex" : "flex"
          }`}
        >
          {/* ค้นหา & ตัวกรอง */}
          <div className="p-3 sm:p-4 border-b border-slate-200 space-y-2.5 sm:space-y-3 bg-white shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้ติดต่อ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20 border border-transparent transition"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilterType("all")}
                className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                  filterType === "all"
                    ? "bg-white text-slate-800 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterType("customer")}
                className={`flex-1 py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1 cursor-pointer ${
                  filterType === "customer"
                    ? "bg-white text-slate-800 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User size={13} />
                ลูกค้า
              </button>
              <button
                onClick={() => setFilterType("shop")}
                className={`flex-1 py-1.5 rounded-lg text-center transition flex items-center justify-center gap-1 cursor-pointer ${
                  filterType === "shop"
                    ? "bg-white text-slate-800 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Store size={13} />
                ร้านค้า
              </button>
            </div>
          </div>

          {/* รายชื่อเลื่อนสโครล */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">กำลังโหลดรายการ...</div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">ไม่พบรายการติดต่อ</div>
            ) : (
              filteredRooms.map((room) => {
                const isSelected = selectedRoom?.roomId === room.roomId;
                const isShop = room.senderType === "shop";

                return (
                  <button
                    key={room.roomId}
                    onClick={() => handleSelectRoom(room)}
                    className={`w-full p-3 sm:p-3.5 text-left flex items-start justify-between gap-2.5 transition cursor-pointer hover:bg-slate-100/80 ${
                      isSelected ? "bg-white border-l-4 border-[#0F2942] shadow-xs" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white ${
                          isShop ? "bg-amber-500" : "bg-[#0F2942]"
                        }`}
                      >
                        {isShop ? <Store size={16} className="sm:w-[18px] sm:h-[18px]" /> : <User size={16} className="sm:w-[18px] sm:h-[18px]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                            {room.senderName}
                          </span>
                        </div>

                        <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
                          {room.lastMessage}
                        </p>

                        <span
                          className={`inline-block text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md mt-1 font-medium ${
                            isShop
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {isShop ? "ร้านค้า" : "ลูกค้า"}
                        </span>
                      </div>
                    </div>

                    {/* Unread Badge สีเขียว */}
                    {!!room.unreadCount && room.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] px-1 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 shadow-xs animate-pulse mt-0.5">
                        {room.unreadCount > 99 ? "99+" : room.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 👉 ฝั่งขวา: กล่องแชต */}
        <div 
          className={`flex-1 flex-col bg-white h-full min-w-0 overflow-hidden ${
            selectedRoom ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedRoom ? (
            <>
              {/* Header ฝั่งขวาพร้อมปุ่มย้อนกลับบนมือถือ */}
              <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="ย้อนกลับ"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
                      selectedRoom.senderType === "shop" ? "bg-amber-500" : "bg-[#0F2942]"
                    }`}
                  >
                    {selectedRoom.senderType === "shop" ? <Store size={18} /> : <User size={18} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-xs sm:text-base leading-tight truncate">
                      {selectedRoom.senderName}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      {selectedRoom.senderType === "shop" ? "บัญชีร้านค้า" : "บัญชีลูกค้าทั่วไป"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ChatBox Component */}
              <div className="flex-1 min-h-0 bg-white overflow-hidden flex flex-col">
                <ChatBox 
                  key={selectedRoom.roomId} 
                  roomId={selectedRoom.roomId} 
                  role="admin"
                  currentUserId="admin"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
              <div className="p-3.5 sm:p-4 rounded-full bg-slate-50 text-slate-300 mb-1">
                <MessageSquare size={32} className="sm:w-[36px] sm:h-[36px]" />
              </div>
              <p className="font-medium text-slate-600 text-sm sm:text-base">
                เลือกรายการผู้ติดต่อเพื่อเริ่มสนทนา
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                กรุณาคลิกเลือกรายการลูกค้าหรือร้านค้าจากแถบด้านซ้ายมือเพื่อดูข้อความ
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function AdminSupportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">กำลังโหลดระบบแชต...</div>}>
      <AdminSupportContent />
    </Suspense>
  );
}