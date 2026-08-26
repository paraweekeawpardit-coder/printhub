import { Request, Response } from 'express';
import Message from '../models/Message.js';

// ดึงประวัติแชทตาม print_order_id
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { print_order_id } = req.params;

    if (!print_order_id) {
      res.status(400).json({ error: 'print_order_id is required' });
      return;
    }

    // ดึงข้อความทั้งหมดของ order นี้ และเรียงตามเวลาจากเก่าไปใหม่
    const messages = await Message.find({ print_order_id }).sort({ created_at: 1 });
    
    res.status(200).json(messages);
  } catch (err: any) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// บันทึกข้อความลง Database (ใช้ร่วมกับ Socket.io)
export const saveMessage = async (data: {
  print_order_id: string;
  sender: string;
  message: string;
  [key: string]: any;
}) => {
  try {
    const newMessage = await Message.create(data);
    return newMessage;
  } catch (err) {
    console.error('Error saving message to DB:', err);
    throw err; // throw ออกไปเพื่อให้ Socket.io Catch และจัดการต่อได้
  }
};

export default {
  getChatHistory,
  saveMessage,
};