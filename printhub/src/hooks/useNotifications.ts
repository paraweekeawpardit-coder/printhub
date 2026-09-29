"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/config/supabase";

export interface NotificationItem {
  id: string;
  customer_id?: string;
  shop_id?: string;
  order_id?: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications(userId: string | undefined, role: "customer" | "shop") {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      let query = supabase.from("notifications").select("*");

      // กรองตามบทบาทผู้ใช้
      if (role === "customer") {
        query = query.eq("customer_id", userId);
      } else {
        query = query.eq("shop_id", userId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

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
  };

  const markAsRead = async (id: string) => {
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
  };

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    const columnCheck = role === "customer" ? "customer_id" : "shop_id";

    // Subscription ฟังเหตุการณ์สร้างการแจ้งเตือนใหม่แบบ Realtime
    const channel = supabase
      .channel(`noti_\({role}_\){userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `\({columnCheck}=eq.\){userId}`,
        },
        (payload) => {
          const newNoti = payload.new as NotificationItem;
          setNotifications((prev) => [newNoti, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role]);

  return { notifications, unreadCount, loading, markAsRead, fetchNotifications };
}