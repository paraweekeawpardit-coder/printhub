import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import supabase from '../config/supabase.js';

const AVATAR_BUCKET = 'print_files';
const PASSWORD_MIN = 6;

const toProfile = (data: any) => ({
  id: data.id,
  name: [data.first_name, data.last_name].filter(Boolean).join(' ').trim(),
  first_name: data.first_name || '',
  last_name: data.last_name || '',
  email: data.contact || '',
  avatar: data.avatar || '',
  created_at: data.created_at || null,
});

// 1. ดึงข้อมูลโปรไฟล์ลูกค้า
export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.query.customer_id;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Missing customer_id' });
    }

    const { data, error } = await supabase
      .from('customer')
      .select('id, first_name, last_name, contact, avatar, created_at')
      .eq('id', customerId)
      .maybeSingle();

    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });
    }

    return res.status(200).json({ success: true, data: toProfile(data) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. อัปเดตข้อมูลส่วนตัว (ชื่อ-นามสกุล และ อีเมล/contact) + ตรวจอีเมลซ้ำ
export const updateCustomerProfile = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { name, email, first_name, last_name } = req.body;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Missing customer_id' });
    }

    // แยกชื่อและนามสกุลหากส่ง name แบบรวมมา
    let fName = typeof first_name === 'string' ? first_name.trim() : '';
    let lName = typeof last_name === 'string' ? last_name.trim() : '';
    if (!fName && name) {
      const parts = String(name).trim().split(/\s+/);
      fName = parts[0] || '';
      lName = parts.slice(1).join(' ') || '';
    }

    if (!fName) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุชื่อ' });
    }

    const updatePayload: Record<string, any> = { first_name: fName, last_name: lName };

    if (email !== undefined) {
      const cleanEmail = String(email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ success: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' });
      }

      // อีเมลใช้เป็นชื่อเข้าสู่ระบบ ต้องไม่ซ้ำกับลูกค้าคนอื่น
      const { data: dup, error: dupErr } = await supabase
        .from('customer')
        .select('id')
        .eq('contact', cleanEmail)
        .neq('id', customerId)
        .maybeSingle();
      if (dupErr) {
        return res.status(500).json({ success: false, message: dupErr.message });
      }
      if (dup) {
        return res.status(409).json({ success: false, message: 'อีเมลนี้มีผู้ใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น' });
      }
      updatePayload.contact = cleanEmail;
    }

    const { data, error: updateError } = await supabase
      .from('customer')
      .update(updatePayload)
      .eq('id', customerId)
      .select('id, first_name, last_name, contact, avatar, created_at')
      .maybeSingle();

    if (updateError) {
      console.error('Update customer error:', updateError.message);
      return res.status(500).json({ success: false, message: updateError.message });
    }

    return res.status(200).json({
      success: true,
      message: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว',
      data: data ? toProfile(data) : null,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. เปลี่ยนรหัสผ่าน (ต้องยืนยันรหัสผ่านปัจจุบันก่อน)
export const changeCustomerPassword = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { current_password, new_password } = req.body;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Missing customer_id' });
    }
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกรหัสผ่านให้ครบถ้วน' });
    }
    if (String(new_password).length < PASSWORD_MIN) {
      return res.status(400).json({ success: false, message: `รหัสผ่านใหม่ต้องมีอย่างน้อย ${PASSWORD_MIN} ตัวอักษร` });
    }

    const { data: user, error } = await supabase
      .from('customer')
      .select('id, password')
      .eq('id', customerId)
      .maybeSingle();

    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!user) return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });

    const isMatch = !!user.password && (await bcrypt.compare(String(current_password), user.password));
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
    }

    const isSame = await bcrypt.compare(String(new_password), user.password);
    if (isSame) {
      return res.status(400).json({ success: false, message: 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม' });
    }

    const hashed = await bcrypt.hash(String(new_password), 10);
    const { error: updErr } = await supabase.from('customer').update({ password: hashed }).eq('id', customerId);
    if (updErr) return res.status(500).json({ success: false, message: updErr.message });

    return res.status(200).json({ success: true, message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. อัปโหลด / เปลี่ยนรูปโปรไฟล์ (บันทึกลงคอลัมน์ customer.avatar)
export const uploadCustomerAvatar = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Missing customer_id' });
    }
    if (!file) {
      return res.status(400).json({ success: false, message: 'กรุณาเลือกรูปภาพ' });
    }
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ success: false, message: 'รองรับเฉพาะไฟล์รูปภาพ' });
    }

    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const filePath = `avatars/customer_${customerId}_${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: true });
    if (upErr) return res.status(500).json({ success: false, message: upErr.message });

    const { data: urlData } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
    const avatarUrl = urlData.publicUrl;

    const { error: updErr } = await supabase.from('customer').update({ avatar: avatarUrl }).eq('id', customerId);
    if (updErr) return res.status(500).json({ success: false, message: updErr.message });

    return res.status(200).json({ success: true, message: 'เปลี่ยนรูปโปรไฟล์เรียบร้อยแล้ว', avatar: avatarUrl });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
