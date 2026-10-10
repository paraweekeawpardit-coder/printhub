"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  User, 
  Store, 
  Headset, 
  MessageSquare 
} from "lucide-react";
import axios from "axios";
import io from "socket.io-client";
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

export default function AdminSupportPage() {
  const [rooms, setRooms] = useState<SupportRoom[]>([]);
  // 🟢 1. ตั้งค่าเริ่มต้นฝั่งขวาว่างไว้เหมือนร้านค้า (ไม่ auto select ห้องแรก)
  const [selectedRoom, setSelectedRoom] = useState<SupportRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "customer" | "shop">("all");
  const [loading, setLoading] = useState(true);

  // 🟢 2. ดึงข้อมูล User/Shop จาก Supabase ผสานประวัติแชต MongoDB
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
            // แมตช์เผื่อ ID ที่บันทึกด้วย support_cust_
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

      // 🟢 เรียงลำดับแชตล่าสุดขึ้นบนสุดเสมอ
      formattedRooms.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

      setRooms(formattedRooms);
      // 💡 เอาโค้ด setSelectedRoom(formattedRooms[0]) ออกเพื่อให้ฝั่งขวาว่างในตอนแรก
    } catch (err) {
      console.error("Error loading support rooms:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🟢 3. Realtime Socket.io — ดักฟังข้อความใหม่ รองรับทั้ง support_cust_ และ support_customer_
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

    socket.on("receive_message", (newMsg: any) => {
      const rawRoomId = newMsg.roomId || newMsg.room_id || newMsg.orderId;
      if (!rawRoomId || !rawRoomId.startsWith("support_")) return;

      // แปลง ID ให้ตรงกับโครงสร้างใน State
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
          // ดันขึ้นอันดับ 1 บนสุด
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

  // 🟢 4. คลิกเลือกห้องแชต -> เคลียร์ Unread Badge สีเขียวทันที
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

  // 5. ค้นหาและกรองรายการห้องแชต
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
    <div className="w-full h-[calc(100vh-64px)] p-4 sm:p-6 flex flex-col bg-[#F8FAFC] overflow-hidden box-border font-sans">
      
      {/* Header */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <Headset className="text-[#0F2942]" size={26} />
            ศูนย์รับเรื่องช่วยเหลือ (Admin Support)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            จัดการและตอบกลับข้อความสอบถามจากลูกค้าและร้านค้าในระบบ
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-0">
        
        {/* 👈 ฝั่งซ้าย: รายชื่อผู้ติดต่อ */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 h-full min-h-0">
          
          {/* ค้นหา & ตัวกรอง */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white shrink-0">
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

          {/* รายชื่อเลื่อนสโครลแยกฝั่งซ้าย */}
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
                    className={`w-full p-3.5 text-left flex items-start justify-between gap-3 transition cursor-pointer hover:bg-slate-100/80 ${
                      isSelected ? "bg-white border-l-4 border-[#0F2942] shadow-xs" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white ${
                          isShop ? "bg-amber-500" : "bg-[#0F2942]"
                        }`}
                      >
                        {isShop ? <Store size={18} /> : <User size={18} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                            {room.senderName}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 truncate mt-1">
                          {room.lastMessage}
                        </p>

                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded-md mt-1.5 font-medium ${
                            isShop
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {isShop ? "ร้านค้า" : "ลูกค้า"}
                        </span>
                      </div>
                    </div>

                    {/* 🟢 Unread Badge สีเขียวแบบ LINE */}
                    {!!room.unreadCount && room.unreadCount > 0 && (
                      <span className="min-w-[20px] h-[20px] px-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 shadow-xs animate-pulse mt-1">
                        {room.unreadCount > 99 ? "99+" : room.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 👉 ฝั่งขวา: กล่องแชต (แสดงหน้าว่างไว้ในตอนแรก) */}
        <div className="flex-1 flex flex-col bg-white h-full min-w-0 overflow-hidden">
          {selectedRoom ? (
            <>
              {/* Header ฝั่งขวา */}
              <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      selectedRoom.senderType === "shop" ? "bg-amber-500" : "bg-[#0F2942]"
                    }`}
                  >
                    {selectedRoom.senderType === "shop" ? <Store size={20} /> : <User size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                      {selectedRoom.senderName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedRoom.senderType === "shop" ? "บัญชีร้านค้า" : "บัญชีลูกค้าทั่วไป"} • ID: {selectedRoom.senderId}
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
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-8 text-center">
              <div className="p-4 rounded-full bg-slate-50 text-slate-300 mb-1">
                <MessageSquare size={36} />
              </div>
              <p className="font-medium text-slate-600 text-base">
                เลือกรายการผู้ติดต่อเพื่อเริ่มสนทนา
              </p>
              <p className="text-xs text-slate-400">
                กรุณาคลิกเลือกรายการลูกค้าหรือร้านค้าจากแถบด้านซ้ายมือเพื่อดูข้อความ
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}