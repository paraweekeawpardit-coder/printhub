import { Router } from "express";
import { getPlatformStats } from "../controller/Admin/dashboardController.js";
import { 
  getPendingShops, 
  getAllShops,
  verifyShop,
  toggleSuspendShop,
  getPendingBankAccounts,
  approveOrRejectBankAccount 
} from "../controller/Admin/shopController.js";
import { getAllReports, verifyReport } from "../controller/Admin/reportController.js";
import { getAllTransactions } from "../controller/Admin/transactionController.js";
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

// Bank Accounts
router.get("/bank-accounts/pending", getPendingBankAccounts);
router.patch("/bank-accounts/verify", approveOrRejectBankAccount);

// Reports
router.get("/reports", getAllReports);
router.patch("/reports/verify", verifyReport);

// Transactions
router.get("/transactions", getAllTransactions);

// Profile & Settings
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.put("/settings", updateSettings);
router.get("/notifications", getNotifications);
router.post("/logout", adminLogout);

export default router;