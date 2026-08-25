import express from "express";

import * as Home from "../controller/Shop/home.js";
import * as Detail from "../controller/Shop/detail.js";
import * as Order from "../controller/Shop/order.js";

const router = express.Router();
router.get("/getScore", Home.getTotalScore);
router.get("/getIncome", Home.getTodayInCome);
router.get("/numWork", Home.getNumOrderUnAccept);
router.get("/getTopOrder", Home.getTopOrder);
router.get("/getOrder", Detail.getOrder);
router.get("/getOrderByStatus", Order.getOrdersByStatus);
router.post("/updateStatus",Home.updateOrderStatus)


export default router;