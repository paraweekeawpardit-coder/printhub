import express from "express";
import { adminLogin } from "../controller/Admin/auth.js";
import {
  getPlatformStats,
  getPendingShops,
  verifyShop,
  getAllReports,
  verifyReport,
  getAllTransactions,
  // เพิ่ม Controller สำหรับ Profile, Settings, Notifications, Logout
  getAdminProfile,
  updateAdminProfile,
  updateSettings,
  getNotifications,
  adminLogout,
} from "../controller/Admin/dashboard.js";

const router = express.Router();

// ==========================================
// Authentication (แยกเฉพาะ Admin)
// ==========================================
// POST: /api/admin/login
router.post("/login", adminLogin);

// POST: /api/admin/logout
router.post("/logout", adminLogout);

// ==========================================
// Admin Profile & Settings
// ==========================================
// GET / PUT: /api/admin/profile
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

// PUT: /api/admin/settings
router.put("/settings", updateSettings);

// GET: /api/admin/notifications
router.get("/notifications", getNotifications);

// ==========================================
// Admin Dashboard & Management
// ==========================================
// 1. ดึงข้อมูลสถิติภาพรวมสำหรับ Admin Dashboard
router.get("/dashboard-stats", getPlatformStats);

// 2. ดึงรายการร้านค้าที่รอการอนุมัติ (status = 'pending')
router.get("/shops/pending", getPendingShops);

// 3. อนุมัติหรือปฏิเสธการลงทะเบียนร้านค้า
router.patch("/shops/verify", verifyShop);

// 4. ดึงรายการคำร้องเรียน/ปัญหาทั้งหมด
router.get("/reports", getAllReports);

// 5. อัปเดตสถานะการตรวจสอบคำร้องเรียน/ปัญหา
router.patch("/reports/verify", verifyReport);

// 6. ดึงรายการธุรกรรมการเงินทั้งหมด
router.get("/transactions", getAllTransactions);

export default router;