import { Request, Response } from 'express';
import Message from '../models/Message.js';

// 1. ดึงประวัติแชตตาม roomId
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      res.status(400).json({ error: 'roomId is required' });
      return;
    }

    const messages = await Message.find({
      $or: [{ room_id: roomId }, { print_order_id: roomId }]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (err: any) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// 2. [FR-6.4] อ่านข้อความทั้งหมดในห้องแชต (Mark as Read)
export const markMessagesAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
      res.status(400).json({ error: 'roomId and userId are required' });
      return;
    }

    // อัปเดตข้อความที่ผู้ใช้อีกฝั่งส่งมา ให้กลายเป็นอ่านแล้ว (is_read = true)
    await Message.updateMany(
      { 
        $or: [{ room_id: roomId }, { print_order_id: roomId }],
        sender_id: { $ne: userId },
        is_read: false 
      },
      { $set: { is_read: true } }
    );

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (err: any) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// 3. ดึงรายการห้องแชต Support สำหรับ Admin Inbox
export const getSupportRoomsForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Message.aggregate([
      {
        $match: {
          chat_type: { $in: ['support_customer', 'support_shop'] }
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$room_id',
          chatType: { $first: '$chat_type' },
          customerId: { $first: '$customer_id' },
          shopId: { $first: '$shop_id' },
          lastMessage: { $first: '$message' },
          lastSenderRole: { $first: '$sender_role' },
          lastSenderId: { $first: '$sender_id' },
          updatedAt: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$is_read', false] },
                    { $ne: ['$sender_role', 'admin'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { updatedAt: -1 } }
    ]);

    res.status(200).json({ success: true, data: rooms });
  } catch (err: any) {
    console.error('Error fetching admin support rooms:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// 4. [FR-6.3] บันทึกข้อความลง DB (ตรวจจำนวนรูปภาพไม่เกิน 10 รูป) - ฟังก์ชันรองรับฝั่ง Socket/Server
export const saveMessage = async (data: {
  room_id?: string;
  roomId?: string;
  chat_type?: 'order' | 'support_customer' | 'support_shop';
  chatType?: 'order' | 'support_customer' | 'support_shop';
  print_order_id?: string;
  order_no?: string | number;
  orderNo?: string | number;
  customer_id?: string;
  customerId?: string;
  shop_id?: string;
  shopId?: string;
  sender_id?: string;
  senderId?: string;
  sender_role?: 'customer' | 'shop' | 'admin';
  senderRole?: 'customer' | 'shop' | 'admin';
  sender?: 'customer' | 'shop' | 'admin';
  message?: string;
  text?: string;
  images?: string[];
  [key: string]: any;
}) => {
  try {
    const targetRoomId = data.room_id || data.roomId || data.print_order_id;
    const targetChatType = data.chat_type || data.chatType || 'order';
    const targetSenderRole = data.sender_role || data.senderRole || data.sender || 'customer';
    const targetSenderId = data.sender_id || data.senderId || targetSenderRole;
    const targetMessage = data.message || data.text || '';
    const imagesList = Array.isArray(data.images) ? data.images : [];
    const targetOrderNo = data.order_no || data.orderNo || null;

    // FR-6.3 ตรวจสอบไม่ให้แนบรูปเกิน 10 รูปต่อการส่ง 1 ครั้ง
    if (imagesList.length > 10) {
      throw new Error('สามารถแนบรูปภาพได้สูงสุดไม่เกิน 10 รูปต่อครั้งเท่านั้น');
    }

    if (!targetRoomId) {
      throw new Error('Missing room_id or roomId');
    }

    const newMessage = await Message.create({
      chat_type: targetChatType,
      room_id: targetRoomId,
      print_order_id: data.print_order_id || (targetChatType === 'order' ? targetRoomId : null),
      order_no: targetOrderNo,
      customer_id: data.customer_id || data.customerId || null,
      shop_id: data.shop_id || data.shopId || null,
      sender_id: targetSenderId,
      sender_role: targetSenderRole,
      message: targetMessage,
      images: imagesList,
      is_read: false,
    });
    
    // แปลงให้เป็น JSON/Object เพื่อส่งกลับให้ Frontend นำไปใช้ได้ทันที
    return newMessage.toJSON();
  } catch (err) {
    console.error('Error saving message to DB:', err);
    throw err;
  }
};

// 5. [เพิ่มใหม่] Express HTTP Controller สำหรับ POST /api/chat (Fallback เวลา Socket หลุด)
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const savedMsg = await saveMessage(req.body);
    res.status(201).json({ success: true, data: savedMsg });
  } catch (err: any) {
    console.error('Error handling REST sendMessage:', err);
    res.status(400).json({ error: err.message || 'Failed to send message' });
  }
};

export default {
  getChatHistory,
  markMessagesAsRead,
  getSupportRoomsForAdmin,
  saveMessage,
  sendMessage,
};