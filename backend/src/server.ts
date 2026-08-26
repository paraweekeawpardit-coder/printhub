import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import Authroute from "./route/Auth.js";
import ShopRoute from "./route/Shop.js";
import customerRoute from "./route/customerRoute.js";
import mongoose, { Schema } from "mongoose";
import connectDB from "./config/mongo.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. ตั้งค่า CORS และ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.59:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "shop_id",
      "order_id",
      "customer_id",
      "Accept"
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(morgan("dev"));

// 2. เชื่อมต่อ MongoDB สำหรับระบบแชท
connectDB();

// 3. แมป Routes หลักของระบบ (จุดที่ตกหล่นไป)
app.get("/", (req: Request, res: Response) => {
  res.send("PrintHub Backend is running!");
});

app.use("/auth", Authroute);                // 👈 ระบบเข้าสู่ระบบ/สมัครสมาชิก (Login / Register)
app.use("/shop", ShopRoute);                // 👈 ระบบร้านค้า
app.use("/api/customer", customerRoute);    // 👈 ระบบลูกค้าและสั่งพิมพ์

// ==========================================
// 4. Socket.io & MongoDB Real-time Chat
// ==========================================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

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

// REST API สำหรับดึงข้อความแชท
app.get("/api/messages/:orderId", async (req: Request, res: Response) => {
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
