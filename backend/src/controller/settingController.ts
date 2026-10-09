import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// 1. ดึงข้อมูลโปรไฟล์ลูกค้า
export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.query.customer_id;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Missing customer_id' });
    }

    // ดึงตามฟิลด์จริงใน Schema: first_name, last_name, contact
    const { data, error } = await supabase
      .from('customer')
      .select('id, first_name, last_name, contact')
      .eq('id', customerId)
      .maybeSingle();

    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });
    }

    const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ').trim();

    return res.status(200).json({
      success: true,
      data: {
        id: data.id,
        name: fullName,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.contact || '',
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. อัปเดตข้อมูลส่วนตัว (ชื่อ-นามสกุล และ อีเมล/contact)
export const updateCustomerProfile = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { name, email, first_name, last_name } = req.body;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Missing customer_id' });
    }

    // แยกชื่อและนามสกุลหากส่ง name แบบรวมมา
    let fName = first_name;
    let lName = last_name;

    if (!fName && name) {
      const parts = name.trim().split(/\s+/);
      fName = parts[0] || '';
      lName = parts.slice(1).join(' ') || '';
    }

    const updatePayload: Record<string, any> = {
      first_name: fName,
      last_name: lName,
    };

    if (email) {
      updatePayload.contact = email.trim();
    }

    const { error: updateError } = await supabase
      .from('customer')
      .update(updatePayload)
      .eq('id', customerId);

    if (updateError) {
      console.error('Update customer error:', updateError.message);
      return res.status(500).json({ success: false, message: updateError.message });
    }

    return res.status(200).json({
      success: true,
      message: 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};