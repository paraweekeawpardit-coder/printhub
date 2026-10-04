import { Request, Response } from "express";
import  supabase  from "../config/supabase.js"; // หรือ path Supabase Config ของคุณ

export const getNotifications = async (req: Request, res: Response) => {
  const { userId, role } = req.query;
  const columnCheck = role === "customer" ? "customer_id" : "shop_id";

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq(columnCheck, userId as string)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json(data);
};