import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "multer" 

interface MulterRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}

export const registerShop = async (req: MulterRequest, res: Response): Promise<Response> => {
  try {
    const {
      shop_name,
      owner_name,
      id_card,
      email,
      contact,
      location,
      latitude,
      longitude,
      province,
      district,
      subdistrict,
      zipcode,
      bank,
      bank_number,
      password,
    } = req.body;

    if (!email || !password || !shop_name || !owner_name || !id_card) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const imageCardPath = files && files["image_card"] ? files["image_card"][0].path : null;
    const shopImagePath = files && files["image"] ? files["image"][0].path : null;

    if (!imageCardPath) {
      return res.status(400).json({ error: "กรุณาอัปโหลดรูปภาพบัตรประชาชน" });
    }

    const { data: existingShop, error: checkShopError } = await supabase
      .from("print_shop")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkShopError) {
      console.error("Check shop error:", checkShopError);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูลร้านค้า" });
    }

    if (existingShop) {
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const { data: existingIdCard, error: checkIdError } = await supabase
      .from("id_card")
      .select("id")
      .eq("id_number", id_card)
      .maybeSingle();

    if (checkIdError) {
      console.error("Check ID card error:", checkIdError);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบบัตรประชาชน" });
    }

    if (existingIdCard) {
      return res.status(400).json({ error: "เลขบัตรประชาชนนี้ถูกใช้งานแล้ว" });
    }

    const { data: newAddress, error: addressError } = await supabase
      .from("address")
      .insert([
        {
          detail: location || "",
          subdistrict: subdistrict || null,
          district: district || null,
          province: province || null,
          postcode: zipcode || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
        },
      ])
      .select("id")
      .single();

    if (addressError || !newAddress) {
      console.error("Address Insert Error:", addressError);
      return res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูลที่อยู่ได้" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newShop, error: shopError } = await supabase
      .from("print_shop")
      .insert([
        {
          shop_name,
          owner_name,
          email,
          phone: contact || null,
          password: hashedPassword, // <-- FIX: password ไม่เคยถูกบันทึกลง DB มาก่อน ทำให้ login ไม่มี password ให้ตรวจสอบ
          profile_image: shopImagePath,
          address_id: newAddress.id,
          is_verify: false,
        },
      ])
      .select("id")
      .single();

    if (shopError || !newShop) {
      console.error("Shop Insert Error:", shopError);
      return res.status(500).json({ error: "ไม่สามารถสร้างบัญชีร้านค้าได้" });
    }

    const { error: idCardError } = await supabase.from("id_card").insert([
      {
        shop_id: newShop.id,
        id_number: id_card,
        image_url: imageCardPath,
      },
    ]);

    if (idCardError) {
      console.error("ID Card Insert Error:", idCardError);
    }

    if (bank && bank_number) {
      const { error: bankError } = await supabase.from("bank_account").insert([
        {
          shop_id: newShop.id,
          bank_name: bank,
          account_name: owner_name,
          account_number: bank_number,
        },
      ]);

      if (bankError) {
        console.error("Bank Account Insert Error:", bankError);
      }
    }

    return res.status(201).json({
      message: "ลงทะเบียนร้านค้าสำเร็จ!",
      shopId: newShop.id,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

export const LoginShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contact, password } = req.body;

    if (!contact || !password) {
      return res.status(400).json({
        error: "Please enter email/phone and password",
      });
    }

    const { data: shop, error: findError } = await supabase
      .from("print_shop")
      .select("*")
      .or(`email.eq.${contact},phone.eq.${contact}`)
      .maybeSingle();

    if (findError) {
      console.error("Find shop error:", findError);
      return res.status(500).json({
        error: "Server Error",
      });
    }

    if (!shop) {
      return res.status(400).json({
        error: "Shop not found",
      });
    }

    // <-- FIX: เดิมไม่มีการตรวจสอบรหัสผ่านเลย ทำให้ login ผ่านได้ทันทีแค่มี contact ที่ถูกต้อง
    if (!shop.password) {
      return res.status(400).json({
        error: "บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, shop.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Wrong password",
      });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined");
    }

    const payload = {
      id: shop.id,
      shop_name: shop.shop_name,
    };

    const token = jwt.sign(payload, secretKey, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      shop_id: shop.id,
      shop_name: shop.shop_name,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};