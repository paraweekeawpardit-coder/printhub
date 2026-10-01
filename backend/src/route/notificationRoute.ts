import { Router } from "express";
import { getNotifications } from "../controller/notificationController.js";

const router = Router();
router.get("/", getNotifications);

export default router;