import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

export const getAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json({
      name: "Admin User",
      email: "admin@printhub.com",
      role: "Super Admin",
    });
  } catch (err: any) {
    console.error("getAdminProfile Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const updateAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email } = req.body;
    return res.status(200).json({
      message: "Profile updated successfully",
      data: { name, email },
    });
  } catch (err: any) {
    console.error("updateAdminProfile Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { siteName, maintenanceMode } = req.body;
    return res.status(200).json({
      message: "Settings saved successfully",
      data: { siteName, maintenanceMode },
    });
  } catch (err: any) {
    console.error("updateSettings Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data: reports } = await supabase
      .from("report")
      .select("id, created_at, is_verify")
      .or("is_verify.eq.false,is_verify.is.null")
      .limit(5);

    const notifications = (reports ?? []).map((r: any) => ({
      _id: r.id,
      title: "มีคำร้องเรียนใหม่",
      message: `รหัสคำร้องเรียน #${r.id} รอการตรวจสอบ`,
      createdAt: r.created_at,
      isRead: false,
    }));

    return res.status(200).json(notifications);
  } catch (err: any) {
    console.error("getNotifications Error:", err.message || err);
    return res.status(200).json([]);
  }
};

export const adminLogout = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err: any) {
    console.error("adminLogout Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};