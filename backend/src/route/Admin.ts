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
  resolveReport
} from "../controller/Admin/reportController.js";

// 1. Transaction Controller
import { 
  getAllTransactions 
} from "../controller/Admin/transactionController.js";

// 2. Refund Controller (ระบบคืนเงินลูกค้า)
import { 
  getPendingRefunds, 
  processRefund,
  rejectRefund 
} from "../controller/Admin/refundController.js";

// 3. Payout Controller (ระบบโอนเงินให้ร้านค้า)
import { 
  getPayouts, 
  processPayout,
  rejectPayout // 👈 นำเข้าฟังก์ชันปฏิเสธโอนเงินให้ร้านค้า
} from "../controller/Admin/payoutController.js";

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
router.patch("/reports/resolve", resolveReport);

// Transactions
router.get("/transactions", getAllTransactions);

// Refunds (การคืนเงินลูกค้า)
router.get("/refunds", getPendingRefunds);
router.patch("/refunds/process", processRefund);
router.patch("/refunds/reject", rejectRefund);

// Payouts (การโอนเงินให้ร้านค้า)
router.get("/payouts", getPayouts);
router.patch("/payouts/process", processPayout);
router.patch("/payouts/reject", rejectPayout); // 👈 เพิ่ม Route ปฏิเสธการโอนเงินให้ร้านค้า

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