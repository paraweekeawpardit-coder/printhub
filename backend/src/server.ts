import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

import Authroute from "./route/Auth.js";
import ShopRoute from "./route/Shop.js";
import supabase from "./config/supabase.js";

// 1. Import ระบบแชตและฐานข้อมูล MongoDB
import connectDB from "./config/mongo";
import chatRoutes from "./route/chatRoute";

dotenv.config();

const app = express();

// 2. เรียกใช้งานฟังก์ชันเชื่อมต่อ MongoDB Atlas
connectDB();

// 3. สร้าง HTTP Server และตั้งค่า Socket.io สำหรับ Real-time Chat
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.59:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.59:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "shop_id",
      "order_id",
      "customer_id",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.use("/auth", Authroute);
app.use("/shop", ShopRoute);
// app.use("/order", Orderroute);

// 4. ประกาศใช้งาน Route ของระบบแชต
app.use("/api/chat", chatRoutes);

// 5. เหตุการณ์การเชื่อมต่อของ Socket.io
io.on("connection", (socket: any) => {
  console.log("A user connected to chat:", socket.id);

  // สั่งเข้าห้องแชตตาม orderId
  socket.on("join_room", (orderId: string) => {
    socket.join(orderId);
    console.log(`User joined room: ${orderId}`);
  });

  // รับข้อความแล้วกระจายไปยังคนในห้องแชตเดียวกัน
  socket.on("chat message", (msgData: any) => {
    if (msgData.orderId) {
      io.to(msgData.orderId).emit("chat message", msgData);
    } else {
      socket.broadcast.emit("chat message", msgData);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// 6. รันเซิร์ฟเวอร์ผ่าน httpServer
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});