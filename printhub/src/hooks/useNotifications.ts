"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/config/supabase";

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

  const fetchNotifications = useCallback(async () => {
    if (!userId || userId === "undefined" || userId === "null") {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const columnCheck = role === "customer" ? "customer_id" : "shop_id";

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
  }, [userId, role]);

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

  useEffect(() => {
    if (!userId || userId === "undefined" || userId === "null") return;

    fetchNotifications();

    const columnCheck = role === "customer" ? "customer_id" : "shop_id";

    // Realtime listener
    const channel = supabase
      .channel(`noti_channel_${role}_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `${columnCheck}=eq.${userId}`,
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
  }, [userId, role, fetchNotifications]);

  return { notifications, unreadCount, loading, markAsRead, fetchNotifications };
}