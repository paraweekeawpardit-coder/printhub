import express from "express";
import {
  getPlatformStats,
  getPendingShops,
  verifyShop,
  getAllReports,
  getAllTransactions,
} from "../controller/Admin/dashboard.js"; // ปรับ path ให้ตรงกับที่เก็บไฟล์ controller ของคุณ[cite: 1]

const router = express.Router();

// 1. ดึงข้อมูลสถิติภาพรวมสำหรับ Admin Dashboard[cite: 1]
router.get("/dashboard-stats", getPlatformStats);

// 2. ดึงรายการร้านค้าที่รอการอนุมัติ (status = 'pending')[cite: 1]
router.get("/shops/pending", getPendingShops);

// 3. อนุมัติหรือปฏิเสธการลงทะเบียนร้านค้า[cite: 1]
router.patch("/shops/verify", verifyShop);

// 4. ดึงรายการคำร้องเรียน/ปัญหาทั้งหมด[cite: 1]
router.get("/reports", getAllReports);

// 5. ดึงรายการธุรกรรมการเงินทั้งหมด[cite: 1]
router.get("/transactions", getAllTransactions);

export default router;