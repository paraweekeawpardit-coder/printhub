import { Router } from "express";
import multer from "multer";
import { Regis, Login } from "../controller/Auth/customer.js";
import { loginShop, registerShop } from "../controller/Auth/shop.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Auth ลูกค้า
router.post("/login", Login);
router.post("/register", Regis);

// Auth ร้านค้า (แก้เป็นตัวพิมพ์เล็กขีดกลางให้ตรงกับ Frontend)
router.post(
  "/register-shop",
  upload.fields([
    { name: "image_card", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  registerShop
);
router.post("/login-shop", loginShop);

export default router;