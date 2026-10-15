import { Router } from "express";
import multer from "multer";
import { Regis, Login,} from "../controller/Auth/customer.js";
import {registerShop, LoginShop } from "../controller/Auth/shop.js";
import { forgotPassword, verifyResetToken, resetPassword } from "../controller/Auth/testMail.js";
import { GoogleLogin } from "../controller/Auth/google.js";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/login", Login);
router.post("/register", Regis);

router.post(
  "/registerShop",
  upload.fields([
    { name: "image_card", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  registerShop
);
router.post("/loginShop", LoginShop);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/verify", verifyResetToken);
router.post("/reset-password", resetPassword);

router.post("/google", GoogleLogin);

export default router;