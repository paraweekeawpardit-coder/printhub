"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/src/hooks/useNotifications";

interface NotificationBellProps {
  userId: string;
  role: "customer" | "shop";
}

export default function NotificationBell({ userId, role }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead } = useNotifications(
    userId,
    role
  );

  return (
    <div className="relative">
      {/* ปุ่มกระดิ่ง: ปรับสีให้เข้มขึ้นชัดเจน (text-slate-700) + ใส่ Hover BG */}
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

      {/* กล่อง Dropdown แสดงรายการแจ้งเตือน */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 text-slate-800 overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 font-bold text-sm flex justify-between items-center bg-slate-50/80">
            <span className="text-slate-800">การแจ้งเตือน</span>
            <span className="text-xs text-slate-400 font-normal">
              {notifications.length} รายการ
            </span>
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
                  onClick={() => markAsRead(noti.id)}
                  className={`p-3.5 cursor-pointer text-xs hover:bg-slate-50 transition-colors ${
                    !noti.is_read ? "bg-blue-50/60" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-slate-800">{noti.title}</p>
                    {!noti.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-1.5">
                    {noti.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block">
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