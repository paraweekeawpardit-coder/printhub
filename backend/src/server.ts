import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import Authroute from "./route/Auth.js";
import ShopRoute from "./route/Shop.js";
import supabase from "./config/supabase.js";

import customerRoute from "./route/customerRoute.js";
import mongoose, { Schema } from "mongoose";
import connectDB from "./config/mongo.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. ตั้งค่า CORS และ Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.59:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "shop_id",
      "order_id",
      "customer_id",
      "Accept",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// 2. เชื่อมต่อ MongoDB สำหรับระบบแชท
connectDB();

// 3. แมป Routes หลักของระบบ
app.get("/", (req: Request, res: Response) => {
  res.send("PrintHub Backend is running!");
});

app.use("/auth", Authroute);
app.use("/shop", ShopRoute);
app.use("/api/customer", customerRoute);

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

  // เข้าร่วมห้องแชตออเดอร์
  socket.on("join_order_chat", async (orderId: string) => {
    if (!orderId || orderId === "undefined") return;

    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    socket.join(orderId);
    console.log(`📌 User ${socket.id} joined order room: ${orderId}`);

    try {
      const history = await Message.find({ orderId }).sort({ createdAt: 1 });
      socket.emit("load_chat_history", history);
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
    }
  });

  // ส่งข้อความเฉพาะใน Room ของออเดอร์นั้น
  socket.on("send_message", async (data: IMessage) => {
    if (!data.orderId || data.orderId === "undefined" || !data.text) return;

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

  // อัปเดตสถานะอ่านแล้ว
  socket.on("mark_as_read", async (data: { orderId: string; reader: string }) => {
    if (!data.orderId || data.orderId === "undefined") return;
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

// REST API: ดึงข้อความแชตเฉพาะออเดอร์
app.get("/api/messages/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId || orderId === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid Order ID" });
    }

    const messages = await Message.find({ orderId }).sort({ createdAt: 1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// REST API: ลบข้อความทั้งหมดของออเดอร์นั้นใน MongoDB
app.delete("/api/messages/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId || orderId === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid Order ID" });
    }

    await Message.deleteMany({ orderId });
    io.to(orderId).emit("chat_cleared");

    res.json({ success: true, message: `ลบประวัติแชตของออเดอร์ ${orderId} เรียบร้อยแล้ว` });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// 🟢 REST API: ดึงสถานะออเดอร์จาก Supabase (ดึงสถานะล่าสุดจริงตาม updated_at)
app.get("/api/orders/:orderId/status", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId || orderId === "undefined") {
      return res.status(400).json({ success: false, message: "ไม่พบรหัสออเดอร์ (Invalid ID)" });
    }

    // 1. เรียงตาม updated_at จากใหม่ไปเก่าเพื่อดึง Record ล่าสุดจริงๆ
    const { data: workData, error } = await supabase
      .from("work_status")
      .select(`
        order_id,
        updated_at,
        status:status_id (
          state
        )
      `)
      .eq("order_id", orderId)
      .order("updated_at", { ascending: false }) // 👈 เรียงตามเวลาอัปเดตล่าสุด
      .limit(1);

    if (error) {
      console.error("❌ Supabase Query Error:", error);
    }

    // 2. หากเจอสถานะ ให้ดึงค่า state ส่งกลับไป
    if (workData && workData.length > 0 && workData[0].status) {
      const statusObj = workData[0].status as unknown as { state: string };
      return res.json({
        success: true,
        state: statusObj.state || "กำลังพิมพ์",
      });
    }

    // 3. Fallback: ถ้าไม่พบข้อมูลให้ส่งสถานะ "กำลังพิมพ์" ป้องกันกล่องแชตล็อก
    return res.json({
      success: true,
      state: "กำลังพิมพ์",
    });

  } catch (error) {
    console.error("❌ Error fetching status from Supabase:", error);
    return res.json({ success: true, state: "กำลังพิมพ์" });
  }
});

// ==========================================
// 5. Server Startup
// ==========================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});