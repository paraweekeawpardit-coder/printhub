import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chat_type?: 'order' | 'support_customer' | 'support_shop';
  chatType?: 'order' | 'support_customer' | 'support_shop';
  room_id?: string;
  roomId?: string;
  print_order_id?: string;
  orderId?: string;
  orderNo?: string;
  customer_id?: string;
  customerId?: string;
  shop_id?: string;
  shopId?: string;
  sender_id?: string;
  senderId?: string;
  sender_role?: 'customer' | 'shop' | 'admin';
  sender?: 'customer' | 'shop' | 'admin';
  message?: string;
  text?: string;
  images?: string[];
  time?: string;
  is_read?: boolean;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema: Schema = new Schema({
  chat_type: { 
    type: String, 
    enum: ['order', 'support_customer', 'support_shop'], 
    default: 'order' 
  },
  chatType: { type: String, default: 'order' },

  // รองรับทั้ง room_id และ roomId
  room_id: { type: String, index: true },
  roomId: { type: String, index: true },

  // รองรับ orderId ตาม MongoDB Atlas เดิม
  print_order_id: { type: String, default: null },
  orderId: { type: String, default: null, index: true },
  orderNo: { type: String, default: null },

  customer_id: { type: String, default: null },
  customerId: { type: String, default: null },
  shop_id: { type: String, default: null },
  shopId: { type: String, default: null },

  // ปลด required ออกเพื่อแก้ปัญหา ValidationError ค้าง
  sender_id: { type: String, default: null },
  senderId: { type: String, default: null },
  sender_role: { type: String, default: 'customer' },
  sender: { type: String, default: 'customer' },

  message: { type: String, default: '' },
  text: { type: String, default: '' },

  images: { 
    type: [String], 
    default: [],
    validate: [(val: string[]) => val.length <= 10, 'แนบรูปภาพได้สูงสุดไม่เกิน 10 รูป'] // FR-6.3
  },
  time: { type: String },
  is_read: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
}, { 
  timestamps: true,
  collection: 'messages' // 👈 บังคับเซฟลง Collection 'messages' ใน DB test
});

messageSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id.toString();
    ret.images = ret.images || [];
    ret.text = ret.text || ret.message || '';
    ret.sender = ret.sender || ret.sender_role || 'customer';
    ret.timestamp = ret.createdAt ? new Date(ret.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ret.time;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;