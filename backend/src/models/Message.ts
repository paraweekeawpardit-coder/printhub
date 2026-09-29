import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  print_order_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  images?: string[]; // <-- ปรับเป็น Array ของ string
  is_read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema: Schema = new Schema({
  print_order_id: { type: String, required: true },
  sender_id: { type: String, required: true },
  sender_role: { type: String, required: true },
  message: { type: String, default: '' },
  images: { type: [String], default: [] }, // <-- ปรับตรงนี้รองรับ Array รูปภาพ
  is_read: { type: Boolean, default: false },
}, { 
  timestamps: true 
});

messageSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id.toString();
    ret.images = ret.images || []; // <-- คืนค่าเป็น Array รูปภาพ
    ret.timestamp = new Date(ret.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;