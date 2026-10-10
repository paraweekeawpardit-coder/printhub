import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Regis = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { Fname, Lname, contact, password } = req.body;
    if (!Fname || !Lname || !contact || !password) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // 1. ตรวจสอบว่าอีเมลนี้มีในตาราง customer แล้วหรือยัง
    const { data: haveUser, error: findCustomerError } = await supabase
      .from("customer")
      .select("id")
      .eq("contact", contact)
      .maybeSingle();

    if (findCustomerError) {
      console.error(findCustomerError);
      return res.status(500).json({ error: "Server Error" });
    }

    if (haveUser) {
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้วในบัญชีผู้ใช้ทั่วไป" });
    }

    // 2. ตรวจสอบว่าอีเมลนี้ถูกใช้งานในตาราง print_shop แล้วหรือยัง (1 Email : 1 Role)
    const { data: haveShop, error: findShopError } = await supabase
      .from("print_shop")
      .select("id")
      .eq("email", contact)
      .maybeSingle();

    if (findShopError) {
      console.error(findShopError);
      return res.status(500).json({ error: "Server Error" });
    }

    if (haveShop) {
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้วในบัญชีร้านค้า" });
    }

    const Passwd = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase
      .from("customer")
      .insert([
        {
          first_name: Fname,
          last_name: Lname,
          contact: contact,
          password: Passwd,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ error: "ไม่สามารถสร้างบัญชีผู้ใช้ได้" });
    }

    return res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const Login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contact, password } = req.body;

    if (!contact || !password) {
      return res.status(400).json({
        error: "กรุณากรอกอีเมลและรหัสผ่าน",
      });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const { data: user, error: findError } = await supabase
      .from("customer")
      .select("*")
      .eq("contact", contact)
      .maybeSingle();

    if (findError) {
      console.error(findError);
      return res.status(500).json({
        error: "Server Error",
      });
    }

    // ไม่พบในตาราง customer -> ลองหาในตาราง print_shop
    if (!user) {
      const { data: shop, error: findShopError } = await supabase
        .from("print_shop")
        .select("*")
        .eq("email", contact)
        .maybeSingle();

      if (findShopError) {
        console.error("Find shop error:", findShopError);
        return res.status(500).json({
          error: "Server Error",
        });
      }

      if (!shop) {
        return res.status(400).json({
          error: "ไม่พบผู้ใช้งาน",
        });
      }

      const isShopPasswordValid = await bcrypt.compare(password, shop.password);

      if (!isShopPasswordValid) {
        return res.status(400).json({
          error: "รหัสผ่านไม่ถูกต้อง",
        });
      }

      const shopPayload = {
        id: shop.id,
        shop_name: shop.shop_name,
        role: "shop",
      };

      const shopToken = jwt.sign(shopPayload, secretKey, {
        expiresIn: "24h",
      });

      // ร้านที่โดนแบนยัง login ได้ เพื่อให้เห็น banner และเหตุผล
      return res.status(200).json({
        message: "เข้าสู่ระบบสำเร็จ",
        token: shopToken,
        shop_id: shop.id,
        shop_name: shop.shop_name,
        role: "shop",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "รหัสผ่านไม่ถูกต้อง",
      });
    }

    const payload = {
      id: user.id,
      name: user.first_name,
      role: "customer",
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token: token,
      id: user.id,
      name: user.first_name,
      role: "customer",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};