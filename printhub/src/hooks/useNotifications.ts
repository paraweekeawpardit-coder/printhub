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
    // กรณี customer/shop แต่ไม่มี userId ให้เคลียร์ค่า
    if (role !== "admin" && (!userId || userId === "undefined" || userId === "null")) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const columnCheck = getColumnName();

      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      // ถ้าเป็น Admin และไม่มี userId เฉพาะเจาะจง ให้ดึงรายการทั้งหมดที่ admin_id ไม่เป็น null
      if (role === "admin" && (!userId || userId === "admin" || userId === "undefined")) {
        query = query.not("admin_id", "is", null);
      } else {
        query = query.eq(columnCheck, userId as string);
      }

      const { data, error } = await query;

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
  }, [userId, role, getColumnName]);

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
    if (unreadCount === 0) return;

    try {
      const columnCheck = getColumnName();

      let query = supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (role === "admin" && (!userId || userId === "admin")) {
        query = query.not("admin_id", "is", null);
      } else {
        query = query.eq(columnCheck, userId as string);
      }

      const { error } = await query;

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
    if (role !== "admin" && (!userId || userId === "undefined" || userId === "null")) return;

    fetchNotifications();

    const columnCheck = getColumnName();
    const channelId = `noti_channel_${role}_${userId || "all"}`;

    // 🟢 Realtime Supabase Postgres Changes
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: role === "admin" && (!userId || userId === "admin")
            ? undefined // แอดมินดึงข้อความใหม่ของแอดมินทั้งหมด
            : `${columnCheck}=eq.${userId}`,
        },
        (payload) => {
          const newNoti = payload.new as NotificationItem;
          // ตรวจสอบความถูกต้องฝั่ง Admin
          if (role === "admin" && !newNoti.admin_id) return;

          setNotifications((prev) => [newNoti, ...prev]);
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