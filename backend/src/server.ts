import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import Authroute from "./route/Auth.js";
import ShopRoute from "./route/Shop.js";
import supabase from "./config/supabase.js";

import customerRoute from "./route/customerRoute.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.59:3000"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "shop_id",
      "order_id",
      "customer_id"
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

// Routes
app.use("/auth", Authroute);
app.use("/shop", ShopRoute);

// Map Route Customer
app.use("/api/customer", customerRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});