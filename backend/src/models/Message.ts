import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  print_order_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  image_url?: string | null;
  is_read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema: Schema = new Schema({
  print_order_id: { type: String, required: true },
  sender_id: { type: String, required: true },
  sender_role: { type: String, required: true },
  message: { type: String, default: '' },
  image_url: { type: String, default: null },
  is_read: { type: Boolean, default: false },
}, { 
  timestamps: true 
});

messageSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id.toString();
    ret.image_url = ret.image_url || null;
    ret.timestamp = new Date(ret.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;