import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

// GET: ดึงข้อมูลโปรไฟล์ตาม admin_id หรือ email เท่านั้น
export const getAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, email } = req.query;

    if (!id && !email) {
      return res.status(401).json({ error: "Unauthorized: ไม่ระบุตัวตนผู้ใช้งาน" });
    }

    let query = supabase.from("admin").select("id, name, contact, avatar");

    if (id) {
      query = query.eq("id", id as string);
    } else if (email) {
      query = query.eq("contact", email as string);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: "ไม่พบข้อมูลแอดมิน" });
    }

    return res.status(200).json({
      id: data.id,
      name: data.name,
      email: data.contact,
      role: "Super Admin",
      avatar: data.avatar || "",
    });
  } catch (err: any) {
    console.error("getAdminProfile Error:", err.message || err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// PUT: อัปเดตข้อมูลโปรไฟล์โดยระบุ ID ของแอดมิน
export const updateAdminProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, name, email, avatar } = req.body;

    let targetId = id;
    if (!targetId && email) {
      const { data: foundAdmin } = await supabase
        .from("admin")
        .select("id")
        .eq("contact", email)
        .maybeSingle();
      targetId = foundAdmin?.id;
    }

    if (!targetId) {
      return res.status(400).json({ error: "ระบุ ID หรือ Email ของแอดมินที่ต้องการอัปเดต" });
    }

    // 🟢 สร้าง Payload เฉพาะฟิลด์ที่อนุญาตให้อัปเดต (เพื่อความปลอดภัย ไม่เขียนทับ contact โดยไม่จำเป็น)
    const updatePayload: Record<string, any> = {};
    if (name !== undefined) updatePayload.name = name;
    if (avatar !== undefined) updatePayload.avatar = avatar;

    const { data, error } = await supabase
      .from("admin")
      .update(updatePayload)
      .eq("id", targetId)
      .select("id, name, contact, avatar")
      .single();

    if (error) {
      console.error("Supabase Update Error:", error.message);
      return res.status(400).json({ error: "บันทึกข้อมูลไม่สำเร็จ" });
    }

    return res.status(200).json({
      message: "อัปเดตโปรไฟล์เรียบร้อยแล้ว",
      data: {
        id: data.id,
        name: data.name,
        email: data.contact,
        role: "Super Admin",
        avatar: data.avatar,
      },
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
      .select("id, created_at, is_verified")
      .or("is_verified.eq.false,is_verified.is.null")
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