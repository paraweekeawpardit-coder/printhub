import { Router } from "express";
import { Regis, Login,} from "../controller/Auth/customer.js";
import {registerShop, LoginShop } from "../controller/Auth/shop.js";
const router = Router();

router.post("/login", Login);
router.post("/register", Regis);

router.post("/registerShop", registerShop);
router.post("/loginShop", LoginShop);

export default router;