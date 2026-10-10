import { Router } from "express";
import { getPlatformStats } from "../controller/Admin/dashboardController.js";
import { 
  getPendingShops, 
  getAllShops,
  verifyShop,
  toggleSuspendShop,
  getPendingBankAccounts,
  approveOrRejectBankAccount,
  createContactAdmin,
  getShopAppeals,
  getShopAppealStatus,
  nudgeShopAppeal
} from "../controller/Admin/shopController.js";
import { 
  getAllReports, 
  verifyReport, 
  resolveReport // 👈 นำเข้าฟังก์ชันตัดสินเคสรายงาน
} from "../controller/Admin/reportController.js";
import { 
  getAllTransactions, 
  getPendingRefunds, // 👈 นำเข้าฟังก์ชันดึงรายการรอคืนเงิน
  processRefund      // 👈 นำเข้าฟังก์ชันอนุมัติโอนเงินคืน
} from "../controller/Admin/transactionController.js";
import { adminLogin } from "../controller/Auth/admin.js";
import {
  getAdminProfile,
  updateAdminProfile,
  updateSettings,
  getNotifications,
  adminLogout
} from "../controller/Admin/profileController.js";
import { getAllCustomers } from "../controller/customerController.js"; 

const router = Router();

// Auth
router.post("/login", adminLogin);

// Dashboard
router.get("/dashboard-stats", getPlatformStats);

// Customers
router.get("/customers", getAllCustomers);

// Shops
router.get("/shops/pending", getPendingShops);
router.get("/shops/all", getAllShops);
router.patch("/shops/verify", verifyShop);
router.patch("/shops/suspend", toggleSuspendShop);

// Contact Admin & Appeals
router.post("/contact-admin", createContactAdmin);
router.get("/appeals", getShopAppeals);

// Bank Accounts
router.get("/bank-accounts/pending", getPendingBankAccounts);
router.patch("/bank-accounts/verify", approveOrRejectBankAccount);

// Reports
router.get("/reports", getAllReports);
router.patch("/reports/verify", verifyReport);
router.patch("/reports/resolve", resolveReport); // 👈 เพิ่ม Route ตัดสินเคสรายงานปัญหา

// Transactions & Refunds
router.get("/transactions", getAllTransactions);
router.get("/refunds", getPendingRefunds);       // 👈 เพิ่ม Route ดึงออเดอร์ยกเลิกเพื่อรอคืนเงิน
router.patch("/refunds/process", processRefund);  // 👈 เพิ่ม Route อนุมัติการโอนเงินคืน

// Profile & Settings
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.put("/settings", updateSettings);
router.get("/notifications", getNotifications);
router.post("/logout", adminLogout);

// Shop Appeals & Nudge
router.get("/shop-appeal/:shop_id", getShopAppealStatus);
router.patch("/shop-appeal/nudge", nudgeShopAppeal);

export default router;