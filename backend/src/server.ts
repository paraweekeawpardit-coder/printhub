import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
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
import notificationRoute from "./route/notificationRoute.js";
import ownerRoute from "./route/owner.js";
import chatRoute from "./route/chatRoute.js";

const app = express();
const server = http.createServer(app);

// ==========================================
// 1. CORS & Middlewares Setup
// ==========================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.59:3000",
      "http://localhost:5173",
    ],
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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// Static File Serving
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==========================================
// 2. Database Connection
// ==========================================
connectDB();

// ==========================================
// 3. API Routes Mapping
// ==========================================
app.get("/", (req: Request, res: Response) => {
  res.send("PrintHub Backend is running!");
});

app.use("/auth", Authroute);
app.use("/api/shop", ShopRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/owner", ownerRoute);
app.use("/api/chat", chatRoute);

// ==========================================
// 4. Socket.io & MongoDB Real-time Chat
// ==========================================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
});

export interface IMessage {
  chatType?: "order" | "support_customer" | "support_shop";
  room_id?: string;
  roomId?: string;
  print_order_id?: string;
  orderId?: string;
  order_no?: string | number;
  customerId?: string;
  shopId?: string;
  sender_id?: string;
  senderId?: string;
  sender_role?: "customer" | "shop" | "admin";
  sender?: "customer" | "shop" | "admin";
  text?: string;
  message?: string;
  images?: string[];
  time?: string;
  is_read?: boolean;
  isRead?: boolean;
  is_unsent?: boolean;
  isUnsent?: boolean;
  createdAt?: Date;
}

const MessageSchema = new Schema(
  {
    chatType: {
      type: String,
      enum: ["order", "support_customer", "support_shop"],
      default: "order",
    },
    room_id: { type: String, index: true },
    roomId: { type: String, index: true },
    orderId: { type: String, required: true, index: true },
    orderNo: { type: String, default: null, index: true },
    customerId: { type: String, default: null },
    shopId: { type: String, default: null },
    senderId: { type: String, default: null },
    sender_role: { type: String, default: "customer" },
    sender: {
      type: String,
      required: true,
      enum: ["customer", "shop", "admin"],
    },
    message: { type: String, default: "" },
    text: { type: String, default: "" },
    images: { type: [String], default: [] },
    time: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    isUnsent: { type: Boolean, default: false },
    is_unsent: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "messages" }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export async function sendAdminNotification(data: {
  title: string;
  message: string;
  type?: string;
  orderId?: string;
}) {
  try {
    const { data: adminUser } = await supabase
      .from("admin")
      .select("id")
      .limit(1)
      .maybeSingle();

    const adminId = adminUser?.id || null;

    const { data: newNoti, error } = await supabase
      .from("notifications")
      .insert({
        admin_id: adminId,
        customer_id: null,
        shop_id: null,
        order_id: data.orderId || null,
        title: data.title,
        message: data.message,
        type: data.type || "report_issue",
        is_read: false,
      })
      .select()
      .maybeSingle();

    if (error) console.error("❌ Error inserting admin notification:", error);

    io.emit("new_admin_notification", newNoti || {
      title: data.title,
      message: data.message,
      created_at: new Date().toISOString(),
      is_read: false,
    });
  } catch (err) {
    console.error("❌ Send Admin Notification Exception:", err);
  }
}

async function checkCanSendMessage(roomId: string, chatType: string): Promise<boolean> {
  if (chatType === "support_customer" || chatType === "support_shop" || roomId.startsWith("support_")) {
    return true;
  }

  try {
    const { data: orderData, error } = await supabase
      .from("print_order")
      .select("current_status_id, status:current_status_id(state)")
      .or(`id.eq.${roomId},order_no.eq.${roomId}`)
      .maybeSingle();

    if (error || !orderData) return true;

    const stateName = (orderData.status as any)?.state?.trim() || "";
    const allowedStates = ["กำลังพิมพ์", "พิมพ์เสร็จสิ้น"];

    return allowedStates.includes(stateName);
  } catch (err) {
    console.error("❌ Error checking message permission:", err);
    return true;
  }
}

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("report_issue", async (issueData: { ticketId: string; title?: string; message?: string; orderId?: string }) => {
    const ticketShort = (issueData.ticketId || "").slice(0, 8);
    await sendAdminNotification({
      title: "มีคำร้องเรียนใหม่",
      message: issueData.message || `รหัสคำร้องเรียน #${ticketShort} รอการตรวจสอบ`,
      type: "report_issue",
      orderId: issueData.orderId || issueData.ticketId,
    });
  });

  // 1. Join Chat Room
  socket.on("join_chat_room", async (data: { roomId?: string; room_id?: string; orderNo?: string | number } | string) => {
    const targetRoomId = typeof data === "string" ? data : data?.roomId || data?.room_id;
    if (!targetRoomId || targetRoomId === "undefined" || targetRoomId === "null") return;

    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    socket.join(targetRoomId);

    let targetOrderNo = typeof data === "object" ? data?.orderNo : null;
    if (targetOrderNo) {
      socket.join(String(targetOrderNo));
    }

    try {
      let orderUuid = targetRoomId;
      let orderNoStr = targetOrderNo ? String(targetOrderNo) : null;

      if (!orderNoStr && !targetRoomId.startsWith("support_")) {
        const { data: orderData } = await supabase
          .from("print_order")
          .select("id, order_no")
          .or(`id.eq.${targetRoomId},order_no.eq.${targetRoomId}`)
          .maybeSingle();

        if (orderData) {
          orderUuid = orderData.id;
          orderNoStr = orderData.order_no ? String(orderData.order_no) : null;
          socket.join(orderUuid);
          if (orderNoStr) socket.join(orderNoStr);
        }
      }

      const queryConditions: any[] = [{ orderId: targetRoomId }, { roomId: targetRoomId }, { room_id: targetRoomId }];
      if (orderUuid) queryConditions.push({ orderId: orderUuid }, { roomId: orderUuid }, { room_id: orderUuid });
      if (orderNoStr) queryConditions.push({ orderNo: orderNoStr }, { orderId: orderNoStr });

      const history = await Message.find({ $or: queryConditions }).sort({ createdAt: 1 });
      socket.emit("load_chat_history", history);
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
    }
  });

  socket.on("join_order_chat", async (orderId: string) => {
    if (!orderId || orderId === "undefined" || orderId === "null") return;
    socket.emit("join_chat_room", { roomId: orderId });
  });

  // 2. Send Message Event
  socket.on("send_message", async (data: IMessage) => {
    const targetRoomId = data.roomId || data.room_id || data.orderId || data.print_order_id;
    if (!targetRoomId || targetRoomId === "undefined" || targetRoomId === "null") return;

    const messageText = data.text || data.message || "";
    const imageList = data.images || [];

    if (!messageText.trim() && imageList.length === 0) return;

    const senderRole = data.sender_role || data.sender || "customer";
    const senderId = data.sender_id || data.senderId || null;

    let chatType = data.chatType;
    if (!chatType) {
      if (targetRoomId.startsWith("support_cust_") || targetRoomId.startsWith("support_customer_")) chatType = "support_customer";
      else if (targetRoomId.startsWith("support_shop_")) chatType = "support_shop";
      else chatType = "order";
    }

    const isAllowed = await checkCanSendMessage(targetRoomId, chatType);
    if (!isAllowed) {
      socket.emit("error_message", {
        message: "ไม่สามารถส่งข้อความได้ เนื่องจากสถานะออเดอร์ไม่ได้อยู่ในช่วงเปิดแชต",
      });
      return;
    }

    try {
      let finalOrderId = targetRoomId;
      let finalOrderNo = data.order_no ? String(data.order_no) : null;

      if (chatType === "order") {
        const { data: orderData } = await supabase
          .from("print_order")
          .select("id, order_no")
          .or(`id.eq.${targetRoomId},order_no.eq.${targetRoomId}`)
          .maybeSingle();

        if (orderData) {
          finalOrderId = orderData.id;
          finalOrderNo = orderData.order_no ? String(orderData.order_no) : finalOrderNo;
        }
      }

      const newMessage = new Message({
        chatType,
        roomId: targetRoomId,
        room_id: targetRoomId,
        orderId: chatType === "order" ? finalOrderId : targetRoomId,
        orderNo: finalOrderNo,
        customerId: data.customerId || null,
        shopId: data.shopId || null,
        senderId: senderId,
        sender: senderRole,
        sender_role: senderRole,
        text: messageText,
        message: messageText,
        images: imageList,
        time: data.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isRead: false,
        is_read: false,
        isUnsent: false,
        is_unsent: false,
      });

      const savedMessage = await newMessage.save();

      // ส่งเข้าห้องแชตที่เปิดอยู่
      io.to(targetRoomId).emit("receive_message", savedMessage);
      
      if (targetRoomId.includes("support_customer_")) {
        io.to(targetRoomId.replace("support_customer_", "support_cust_")).emit("receive_message", savedMessage);
      } else if (targetRoomId.includes("support_cust_")) {
        io.to(targetRoomId.replace("support_cust_", "support_customer_")).emit("receive_message", savedMessage);
      }

      if (finalOrderId !== targetRoomId) io.to(finalOrderId).emit("receive_message", savedMessage);
      if (finalOrderNo) io.to(finalOrderNo).emit("receive_message", savedMessage);

      // 🟢 ส่งแจ้งเตือนกลางให้หน้ารวมแชตร้านค้า/แอดมิน อัปเดต Badge สีเขียวและดันขึ้นบนสุดทันที
      io.emit("new_chat_notification", savedMessage);

    } catch (error) {
      console.error("❌ Error saving message to DB:", error);
    }
  });

  // Unsend Message Event
  socket.on("unsend_message", async (data: { messageId: string; roomId: string }) => {
    const { messageId, roomId } = data;
    if (!messageId || !roomId) return;

    try {
      const queryConditions: any[] = [{ id: messageId }];
      if (mongoose.Types.ObjectId.isValid(messageId)) {
        queryConditions.push({ _id: messageId });
      }

      await Message.updateMany(
        { $or: queryConditions },
        {
          $set: {
            isUnsent: true,
            is_unsent: true,
            text: "",
            message: "",
            images: [],
          },
        }
      );

      io.to(roomId).emit("message_unsent", { messageId });

      if (roomId.includes("support_customer_")) {
        io.to(roomId.replace("support_customer_", "support_cust_")).emit("message_unsent", { messageId });
      } else if (roomId.includes("support_cust_")) {
        io.to(roomId.replace("support_cust_", "support_customer_")).emit("message_unsent", { messageId });
      }
    } catch (error) {
      console.error("❌ Error unsending message in DB:", error);
      socket.emit("error_message", { message: "เกิดข้อผิดพลาดในการยกเลิกข้อความ" });
    }
  });

  // 3. Mark As Read (Socket)
  socket.on(
    "mark_as_read",
    async (data: { roomId?: string; room_id?: string; orderId?: string; reader: string }) => {
      const targetRoomId = data.roomId || data.room_id || data.orderId;
      if (!targetRoomId || targetRoomId === "undefined" || targetRoomId === "null") return;

      const altRoomId = targetRoomId.includes("support_customer_")
        ? targetRoomId.replace("support_customer_", "support_cust_")
        : targetRoomId.replace("support_cust_", "support_customer_");

      try {
        await Message.updateMany(
          {
            $and: [
              { $or: [{ roomId: targetRoomId }, { room_id: targetRoomId }, { orderId: targetRoomId }, { roomId: altRoomId }, { orderId: altRoomId }] },
              { sender: { $ne: data.reader } },
              { $or: [{ isRead: false }, { is_read: false }] }
            ]
          },
          { $set: { isRead: true, is_read: true } }
        );

        io.to(targetRoomId).emit("messages_read", { reader: data.reader });
      } catch (error) {
        console.error("❌ Error updating read status in DB:", error);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ==========================================
// 5. REST APIs (Messages & Support Admin)
// ==========================================

app.get("/api/messages/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    if (!roomId || roomId === "undefined" || roomId === "null") {
      return res.status(400).json({ success: false, message: "Invalid Room ID" });
    }

    const roomStr = String(roomId);
    const altRoomId = roomStr.includes("support_customer_")
      ? roomStr.replace("support_customer_", "support_cust_")
      : roomStr.replace("support_cust_", "support_customer_");

    const messages = await Message.find({
      $or: [{ roomId: roomStr }, { room_id: roomStr }, { orderId: roomStr }, { orderNo: roomStr }, { roomId: altRoomId }, { orderId: altRoomId }],
    }).sort({ createdAt: 1 });

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

app.delete("/api/messages/:roomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    if (!roomId || roomId === "undefined" || roomId === "null") {
      return res.status(400).json({ success: false, message: "Invalid Room ID" });
    }

    await Message.deleteMany({ $or: [{ roomId }, { room_id: roomId }, { orderId: roomId }, { orderNo: roomId }] });
    io.to(roomId).emit("chat_cleared");

    res.json({ success: true, message: `ลบประวัติแชตของห้อง ${roomId} เรียบร้อยแล้ว` });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// API ดึงห้องแชต Support ฝั่ง Admin
app.get("/api/admin/chat-support/rooms", async (req: Request, res: Response) => {
  try {
    const rooms = await Message.aggregate([
      {
        $match: {
          $or: [
            { chatType: { $in: ["support_customer", "support_shop"] } },
            { roomId: { $regex: /^support_/ } },
            { orderId: { $regex: /^support_/ } },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: { $ifNull: ["$roomId", "$orderId"] }, regex: /^support_cust_/ } },
              { $replaceOne: { input: { $ifNull: ["$roomId", "$orderId"] }, find: "support_cust_", replacement: "support_customer_" } },
              { $ifNull: ["$roomId", "$orderId"] }
            ]
          },
          chatType: { $first: "$chatType" },
          customerId: { $first: "$customerId" },
          shopId: { $first: "$shopId" },
          lastMessage: { $first: "$text" },
          lastSender: { $first: "$sender" },
          updatedAt: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$isRead", false] },
                    { $ne: ["$sender", "admin"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    res.json({ success: true, data: rooms });
  } catch (error) {
    console.error("❌ Error fetching admin support rooms:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

app.get("/api/orders/:orderId/status", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId || orderId === "undefined" || orderId === "null") {
      return res.status(400).json({ success: false, message: "ไม่พบรหัสออเดอร์ (Invalid ID)" });
    }

    const { data: workData, error } = await supabase
      .from("work_status")
      .select(`order_id, updated_at, status:status_id ( state )`)
      .eq("order_id", orderId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) console.error("❌ Supabase Query Error:", error);

    if (workData && workData.length > 0 && workData[0].status) {
      const statusObj = workData[0].status as unknown as { state: string };
      return res.json({ success: true, state: statusObj.state || "กำลังพิมพ์" });
    }

    return res.json({ success: true, state: "กำลังพิมพ์" });
  } catch (error) {
    console.error("❌ Error fetching status from Supabase:", error);
    return res.json({ success: true, state: "กำลังพิมพ์" });
  }
});

// 🟢 API ดึงสรุปข้อมูลแชตฝั่งร้านค้า (ตรวจทั้ง isRead และ is_read)
app.get("/api/chat/shop-summary/:shopId", async (req: Request, res: Response) => {
  try {
    const chatSummaries = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$orderId",
          roomId: { $first: "$roomId" },
          orderNo: { $first: "$orderNo" },
          latest_message: { $first: { $ifNull: ["$text", "$message"] } },
          updated_at: { $first: "$createdAt" },
          unread_count: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$sender", "customer"] },
                    { $or: [{ $eq: ["$isRead", false] }, { $eq: ["$is_read", false] }] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json({ success: true, data: chatSummaries });
  } catch (err: any) {
    console.error("❌ Fetch shop chat summary error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🟢 API เคลียร์ข้อความยังไม่อ่านฝั่งร้านค้า (อัปเดตทั้ง isRead และ is_read)
app.put("/api/chat/read/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    await Message.updateMany(
      {
        $and: [
          { $or: [{ orderId }, { roomId: orderId }, { room_id: orderId }] },
          { sender: "customer" },
          { $or: [{ isRead: false }, { is_read: false }] }
        ]
      },
      { $set: { isRead: true, is_read: true } }
    );

    res.json({ success: true, message: "Marked as read successfully" });
  } catch (err: any) {
    console.error("❌ Mark as read error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/chat/shop-orders", async (req: Request, res: Response) => {
  try {
    const shopId = req.query.shop_id as string;
    let query = supabase
      .from("print_order")
      .select("*")
      .order("created_at", { ascending: false });

    if (shopId && shopId !== "undefined" && shopId !== "null") {
      query = query.eq("shop_id", shopId);
    }

    const { data: orders, error } = await query;

    if (error || !orders) {
      return res.status(200).json([]);
    }

    const chatSummaries = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$orderId",
          roomId: { $first: "$roomId" },
          latestMessage: { $first: "$text" },
          updatedAt: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$sender", "customer"] },
                    { $eq: ["$isRead", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const mongoMap: Record<string, any> = {};
    chatSummaries.forEach((sum: any) => {
      if (sum._id) mongoMap[sum._id] = sum;
      if (sum.roomId) mongoMap[sum.roomId] = sum;
    });

    const customerIds = Array.from(
      new Set(orders.map((o: any) => o.customer_id || o.user_id).filter(Boolean))
    );
    let customerMap: Record<string, string> = {};

    if (customerIds.length > 0) {
      const { data: customers } = await supabase
        .from("customer")
        .select("*")
        .in("id", customerIds);
      if (customers) {
        customers.forEach((c: any) => {
          const fullName = `${c.first_name || c.name || ""} ${c.last_name || ""}`.trim();
          if (fullName) customerMap[String(c.id)] = fullName;
        });
      }
    }

    const result = orders.map((order: any) => {
      const custId = String(order.customer_id || order.user_id || "");
      const orderUuid = String(order.id || order.order_id);
      const displayOrderNo = order.order_no ? String(order.order_no) : orderUuid.substring(0, 6);

      const mongoInfo = mongoMap[orderUuid] || mongoMap[displayOrderNo] || {};

      return {
        id: orderUuid,
        order_no: displayOrderNo,
        customerName: customerMap[custId] || `ลูกค้า (#${displayOrderNo})`,
        latestMessage: mongoInfo.latestMessage || "คลิกเพื่อดูแชต",
        updatedAt: mongoInfo.updatedAt || order.created_at,
        unreadCount: mongoInfo.unreadCount || 0,
      };
    });

    result.sort((a: any, b: any) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

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