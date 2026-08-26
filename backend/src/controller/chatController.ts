import { Request, Response } from 'express';
import Message from '../models/Message.js';

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { print_order_id } = req.params;
    const messages = await Message.find({ print_order_id }).sort({ created_at: 1 });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const saveMessage = async (data: any) => {
  try {
    return await Message.create(data);
  } catch (err) {
    console.error('Error saving message:', err);
  }
};

export default {
  getChatHistory,
  saveMessage,
};