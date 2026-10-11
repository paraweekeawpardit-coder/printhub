"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabase";

export interface NotificationItem {
  id: string;
  customer_id?: string;
  shop_id?: string;
  admin_id?: string;
  order_id?: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications(
  userId: string | undefined, 
  role: "customer" | "shop" | "admin"
) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🟢 Helper กำหนดคอลัมน์ตาม role
  const getColumnName = useCallback(() => {
    if (role === "admin") return "admin_id";
    if (role === "shop") return "shop_id";
    return "customer_id";
  }, [role]);

  const fetchNotifications = useCallback(async () => {
    // ต้องมี userId ที่ถูกต้องก่อนดึงข้อมูล
    if (!userId || userId === "undefined" || userId === "null" || userId === "admin") {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const columnCheck = getColumnName();

      // 🟢 ดึงเฉพาะ Notification ของ userId ตนเองเท่านั้น
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq(columnCheck, userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase notification fetch error:", error);
      } else if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, getColumnName]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (!error) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // 🟢 ฟังก์ชันอัปเดตสถานะเป็น "อ่านแล้วทั้งหมด"
  const markAllAsRead = async () => {
    if (unreadCount === 0 || !userId) return;

    try {
      const columnCheck = getColumnName();

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq(columnCheck, userId)
        .eq("is_read", false);

      if (!error) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  useEffect(() => {
    if (!userId || userId === "undefined" || userId === "null" || userId === "admin") return;

    fetchNotifications();

    const columnCheck = getColumnName();
    const channelId = `noti_channel_${role}_${userId}`;

    // 🟢 Realtime Supabase Postgres Changes
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `${columnCheck}=eq.${userId}`, // 🟢 กรอง Event ให้รับเฉพาะ ID ตัวเอง
        },
        (payload) => {
          const newNoti = payload.new as NotificationItem;

          // 🟢 ป้องกัน Notification ตัวเองเพิ่มซ้ำใน State
          setNotifications((prev) => {
            if (prev.some((item) => item.id === newNoti.id)) return prev;
            return [newNoti, ...prev];
          });
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role, fetchNotifications, getColumnName]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  };
}