import { Request, Response } from "express";
import supabase from "../config/supabase.js";

/**
 * GET /api/customer/shops
 * ดึงรายการร้านค้าเฉพาะที่ผ่านการอนุมัติแล้ว (is_verify = true)
 */
export const getShops = async (req: Request, res: Response) => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select("*")
      .eq("is_verify", true) // 🌟 กรองเฉพาะร้านที่ผ่านการอนุมัติแล้ว
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GetShops Error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(shops ?? []);
  } catch (err: any) {
    console.error("GetShops Exception:", err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};