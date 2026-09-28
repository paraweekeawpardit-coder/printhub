import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import shopRoutes from "./route/Shop.js";
import adminRoutes from "./route/Admin.js";
import authRoutes from "./route/Auth.js";
import customerRoute from "./route/customerRoute.js";
import notificationRoute from "./route/notificationRoute.js"; // 🟢 1. Import Notification Route
import mongoose, { Schema } from "mongoose";
import connectDB from "./config/mongo.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ตั้งค่า CORS ให้รองรับ Custom Headers (shop_id, shop-id)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "shop_id",
      "shop-id",
      "admin_token",
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
app.use("/api", notificationRoute); // 🟢 2. แมป Notification Route (/api/notifications/...)

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

// 🌟 เปิดให้ภายนอกเข้าถึงไฟล์ในโฟลเดอร์ uploads เพื่อแสดงรูปภาพ
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 1. เส้น Route สำหรับฝั่งร้านค้า (Shop)
app.use("/api/shop", shopRoutes);
app.use("/shop", shopRoutes); // เพิ่มไว้เพื่อรองรับ backward compatibility

// 2. เส้น Route สำหรับฝั่งผู้ดูแลระบบ (Admin)
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes); // เพิ่มไว้เพื่อรองรับ backward compatibility

// 3. เส้น Route สำหรับระบบยืนยันตัวตน (Auth)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

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

// REST API: ดึงสถานะออเดอร์จาก Supabase (ดึงสถานะล่าสุดจริงตาม updated_at)
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
      .order("updated_at", { ascending: false })
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

// 5. เส้น Route แอดมิน
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});