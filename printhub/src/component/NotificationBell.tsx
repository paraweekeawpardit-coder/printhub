"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationBellProps {
  userId: string;
  role: "customer" | "shop";
}

export default function NotificationBell({ userId, role }: NotificationBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // 🟢 1. สร้าง Ref สำหรับจับพื้นที่ Component
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ดึง notifications, unreadCount, loading, markAsRead และ markAllAsRead จาก Hook
  const notificationHook = useNotifications(userId, role);
  const { notifications, unreadCount, loading, markAsRead } = notificationHook;
  const markAllAsRead = (notificationHook as any).markAllAsRead;

  // 🟢 2. เพิ่ม useEffect สำหรับดักจับการคลิกภายนอก (Click Outside) และปุ่ม Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // ถ้าคลิกนอกพื้นที่ dropdownRef ให้ปิด Dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // ฟังก์ชันเมื่อคลิกที่การแจ้งเตือนแต่ละรายการ
  const handleNotificationClick = async (noti: any) => {
    if (!noti.is_read) {
      await markAsRead(noti.id);
    }

    setIsOpen(false);

    const orderId = noti.order_id;

    if (orderId) {
      if (role === "shop") {
        router.push(`/shop/detail/${orderId}`);
      } else {
        router.push("/customer/orders");

        setTimeout(() => {
          const element = document.getElementById(`order-${orderId}`);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            element.classList.add("ring-2", "ring-blue-500", "shadow-lg");
            setTimeout(() => {
              element.classList.remove("ring-2", "ring-blue-500", "shadow-lg");
            }, 2500);
          }
        }, 300);
      }
    }
  };

  // ฟังก์ชันสำหรับกด "อ่านทั้งหมด"
  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unreadCount === 0) return;

    if (typeof markAllAsRead === "function") {
      await markAllAsRead();
    } else {
      const unreadItems = notifications.filter((n: any) => !n.is_read);
      await Promise.all(unreadItems.map((n: any) => markAsRead(n.id)));
    }
  };

  return (
    // 🟢 3. ผูก dropdownRef ไว้ที่ Container นอกสุด
    <div className="relative" ref={dropdownRef}>
      {/* ปุ่มกระดิ่ง */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer focus:outline-none"
        title="การแจ้งเตือน"
      >
        <Bell size={22} strokeWidth={2.2} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown แสดงรายการแจ้งเตือน */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 text-slate-800 overflow-hidden">
          {/* Header ด้านบนพร้อมปุ่มอ่านทั้งหมด */}
          <div className="p-3.5 border-b border-slate-100 font-bold text-sm flex justify-between items-center bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span className="text-slate-800">การแจ้งเตือน</span>
              <span className="text-[11px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {notifications.length}
              </span>
            </div>

            {/* ปุ่มอ่านทั้งหมด */}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline transition-all cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>อ่านทั้งหมด</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">
                กำลังโหลด...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                ไม่มีการแจ้งเตือน
              </div>
            ) : (
              notifications.map((noti) => (
                <div
                  key={noti.id}
                  onClick={() => handleNotificationClick(noti)}
                  className={`p-3.5 cursor-pointer text-xs hover:bg-slate-50 transition-colors ${
                    !noti.is_read ? "bg-blue-50/60 font-semibold" : "bg-white opacity-75"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-slate-800">{noti.title}</p>
                    {!noti.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-1.5 font-normal">
                    {noti.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    {new Date(noti.created_at).toLocaleString("th-TH")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}