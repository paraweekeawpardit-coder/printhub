import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { Schema, Document } from "mongoose";
import connectDB from "./config/mongo.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// 1. เชื่อมต่อฐานข้อมูลผ่าน config/mongo.ts
connectDB();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ==========================================
// 2. MongoDB Schema & Model Configuration
// ==========================================
interface IMessage {
  orderId: string;
  sender: "customer" | "shop";
  text: string;
  time: string;
  isRead: boolean;
  createdAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    orderId: { type: String, required: true, index: true },
    sender: { type: String, required: true, enum: ["customer", "shop"] },
    text: { type: String, required: true },
    time: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);

// ==========================================
// 3. Socket.io Real-time Chat Logic
// ==========================================
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // เข้าร่วมห้อง และดึงประวัติข้อความจาก MongoDB
  socket.on("join_order_chat", async (orderId: string) => {
    socket.join(orderId);
    console.log(`📌 User ${socket.id} joined order room: ${orderId}`);

    try {
      const history = await Message.find({ orderId }).sort({ createdAt: 1 });
      socket.emit("load_chat_history", history);
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
    }
  });

  // รับข้อความ บันทึกลง MongoDB แล้วกระจายให้ทุกคนในห้อง
  socket.on("send_message", async (data: IMessage) => {
    console.log(`💬 [Order #${data.orderId}] ${data.sender}: ${data.text}`);

    try {
      const newMessage = new Message({
        orderId: data.orderId,
        sender: data.sender,
        text: data.text,
        time: data.time,
        isRead: false,
      });
      const savedMessage = await newMessage.save();

      io.to(data.orderId).emit("receive_message", savedMessage);
    } catch (error) {
      console.error("❌ Error saving message to DB:", error);
    }
  });

  // อัปเดตสถานะ "อ่านแล้ว" ใน MongoDB
  socket.on("mark_as_read", async (data: { orderId: string; reader: string }) => {
    try {
      const senderToUpdate = data.reader === "customer" ? "shop" : "customer";
      
      await Message.updateMany(
        { orderId: data.orderId, sender: senderToUpdate, isRead: false },
        { $set: { isRead: true } }
      );

      io.to(data.orderId).emit("messages_read", { reader: data.reader });
    } catch (error) {
      console.error("❌ Error updating read status in DB:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ==========================================
// 4. REST API Endpoints
// ==========================================
app.get("/api/messages/:orderId", async (req, res) => {
  try {
    const messages = await Message.find({ orderId: req.params.orderId }).sort({ createdAt: 1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// ==========================================
// 5. Server Startup
// ==========================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});