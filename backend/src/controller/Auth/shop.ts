import { Request, Response } from "express";
import supabase from "../../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ==========================================
// 1. ระบบเข้าสู่ระบบร้านค้า (Login Shop)
// ==========================================
export const loginShop = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { contact, password } = req.body;

    if (!contact || !password) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const cleanContact = contact.trim();
    const cleanPassword = password.trim();

    // ค้นหาร้านค้าจาก email หรือ contact (เบอร์โทร)
    const { data: shop, error } = await supabase
      .from("print_shop")
      .select("*")
      .or(`email.eq.${cleanContact},phone.eq.${cleanContact}`)
      .maybeSingle();

    if (error) {
      console.error("Find shop error:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }

    if (!shop) {
      return res.status(404).json({ error: "ไม่พบบัญชีผู้ใช้นี้ในระบบ" });
    }

    // ตรวจสอบรหัสผ่านแบบ Hash
    const isPasswordValid = await bcrypt.compare(cleanPassword, shop.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    const secretKey = process.env.JWT_SECRET || "default_secret_key";

    const payload = {
      id: shop.id,
      shop_name: shop.shop_name,
    };

    const token = jwt.sign(payload, secretKey, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      shop_id: shop.id,
      shop_name: shop.shop_name,
    });
  } catch (error: any) {
    console.error("Login shop controller error:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
};

// ==========================================
// 2. ระบบลงทะเบียนร้านค้า (Register Shop)
// ==========================================
export const registerShop = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // ตรวจสอบไฟล์ image_card จาก multer
    if (!files || !files["image_card"] || files["image_card"].length === 0) {
      return res.status(400).json({ error: "กรุณาอัปโหลดรูปภาพบัตรประชาชน" });
    }

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

    const imageCardPath = files["image_card"][0].path;
    const shopImagePath = files["image"] ? files["image"][0].path : null;

    // 1. ตรวจสอบอีเมลซ้ำในระบบร้านค้า
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
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานในระบบร้านค้าแล้ว" });
    }

    // 2. ตรวจสอบอีเมลซ้ำในระบบลูกค้า
    const { data: existingCustomer, error: checkCustomerError } = await supabase
      .from("customer")
      .select("id")
      .eq("contact", email)
      .maybeSingle();

    if (checkCustomerError) {
      console.error("Check customer error:", checkCustomerError);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบข้อมูลลูกค้า" });
    }

    if (existingCustomer) {
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้วในบัญชีผู้ใช้ทั่วไป" });
    }

    // 3. ตรวจสอบเลขบัตรประชาชน
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

    // 4. บันทึกที่อยู่ร้านค้า
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

    // 5. บันทึกข้อมูลร้านค้า
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newShop, error: shopError } = await supabase
      .from("print_shop")
      .insert([
        {
          shop_name,
          owner_name,
          email,
          phone: contact || null,
          password: hashedPassword,
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

    // 6. บันทึกข้อมูลบัตรประชาชน
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

    // 7. บันทึกบัญชีธนาคาร (ถ้ามี)
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