import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shopRoutes from "./route/Shop.js";
import adminRoutes from "./route/Admin.js";
import authRoutes from "./route/Auth.js";

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

// 1. เส้น Route สำหรับฝั่งร้านค้า (Shop)
app.use("/api/shop", shopRoutes);
app.use("/shop", shopRoutes); // เพิ่มไว้เพื่อรองรับ backward compatibility

// 2. เส้น Route สำหรับฝั่งผู้ดูแลระบบ (Admin)
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes); // เพิ่มไว้เพื่อรองรับ backward compatibility

// 3. เส้น Route สำหรับระบบยืนยันตัวตน (Auth)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});