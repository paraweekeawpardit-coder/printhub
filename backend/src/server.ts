import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import mongoose, { Schema } from "mongoose";

// Config & Database Connections
import connectDB from "./config/mongo.js";
import supabase from "./config/supabase.js";

// Routes Imports
import Authroute from "./route/Auth.js";
import ShopRoute from "./route/Shop.js";
import adminRoutes from "./route/Admin.js";
import customerRoute from "./route/customerRoute.js";
// import notificationRoute from "./route/notificationRoute.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ==========================================
// 1. CORS & Middlewares Setup (รวมของเดิม + ของเพื่อน)
// ==========================================
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.59:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "shop_id",
      "shop-id",
      "order_id",
      "customer_id",
      "admin_token",
      "Accept",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// 🌟 Static File Serving (รองรับการอัปโหลดไฟล์/รูปภาพของเพื่อน)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==========================================
// 2. Database Connection
// ==========================================
connectDB(); // เชื่อมต่อ MongoDB สำหรับระบบแชต

// ==========================================
// 3. API Routes Mapping (รวมของเดิม + ของเพื่อน)
// ==========================================
app.get("/", (req: Request, res: Response) => {
  res.send("PrintHub Backend is running!");
});

// Authentication
app.use("/api/auth", Authroute);
app.use("/auth", Authroute);

// Shop
app.use("/api/shop", ShopRoute);
app.use("/shop", ShopRoute);

// Admin
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);

// Customer
app.use("/api/customer", customerRoute);
app.use("/customer", customerRoute);

// Notifications
// app.use("/api", notificationRoute);

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

const MessageSchema = new Schema(
  {
    orderId: { type: String, required: true, index: true },
    sender: { type: String, required: true, enum: ["customer", "shop"] },
    text: { type: String, required: true },
    time: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // เข้าร่วมห้องแชตออเดอร์
  socket.on("join_order_chat", async (orderId: string) => {
    if (!orderId || orderId === "undefined") return;

    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    socket.join(orderId);
    console.log(`📌 User \({socket.id} joined order room:\){orderId}`);

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

    console.log(`💬 [Order #\({data.orderId}]\){data.sender}: ${data.text}`);

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

// ==========================================
// 5. REST APIs (Messages & Order Status)
// ==========================================

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

// REST API: ดึงสถานะออเดอร์จาก Supabase
app.get("/api/orders/:orderId/status", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId || orderId === "undefined") {
      return res.status(400).json({ success: false, message: "ไม่พบรหัสออเดอร์ (Invalid ID)" });
    }

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
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("❌ Supabase Query Error:", error);
    }

    if (workData && workData.length > 0 && workData[0].status) {
      const statusObj = workData[0].status as unknown as { state: string };
      return res.json({
        success: true,
        state: statusObj.state || "กำลังพิมพ์",
      });
    }

    return res.json({
      success: true,
      state: "กำลังพิมพ์",
    });

  } catch (error) {
    console.error("❌ Error fetching status from Supabase:", error);
    return res.json({ success: true, state: "กำลังพิมพ์" });
  }
});

// REST API: ดึงรายการออเดอร์ทั้งหมดของร้านค้าเพื่อแสดงบนแถบแชตฝั่งซ้าย
app.get("/api/chat/shop-orders", async (req: Request, res: Response) => {
  try {
    const shopId = req.query.shop_id as string;
    let query = supabase.from("print_order").select("*").order("created_at", { ascending: false });

    if (shopId && shopId !== "undefined" && shopId !== "null") {
      query = query.eq("print_shop_id", shopId);
    }

    const { data: orders, error } = await query;

    if (error || !orders) {
      return res.status(200).json([]);
    }

    // ดึงข้อมูลลูกค้า
    const customerIds = Array.from(new Set(orders.map((o: any) => o.customer_id || o.user_id).filter(Boolean)));
    let customerMap: any = {};

    if (customerIds.length > 0) {
      const { data: customers } = await supabase.from("customer").select("*").in("id", customerIds);
      if (customers) {
        customers.forEach((c: any) => {
          const fullName = `\({c.first_name || c.name || ""}\){c.last_name || ""}`.trim();
          if (fullName) customerMap[String(c.id)] = fullName;
        });
      }
    }

    const result = orders.map((order: any) => {
      const custId = String(order.customer_id || order.user_id || "");
      const orderIdStr = String(order.id || order.order_id);
      return {
        id: orderIdStr,
        customerName: customerMap[custId] || `ลูกค้า #${orderIdStr.substring(0, 8)}`,
        latestMessage: "คลิกเพื่อดูแชต",
        updatedAt: order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      };
    });

    return res.json(result);
  } catch (error) {
    console.error("❌ Error fetching shop order chats:", error);
    return res.status(200).json([]);
  }
});

// ==========================================
// 6. Server Startup
// ==========================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});