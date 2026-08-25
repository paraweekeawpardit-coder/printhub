import { Request, Response } from "express";
import supabase from "../../config/supabase.js"; 


export const getShopProfile = async (req: Request,res: Response): Promise<Response> => {
  try {
    const { shop_id } = req.params;
 
    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }
 
    const { data: shop, error } = await supabase
      .from("print_shop")
      .select(
        `
        id,
        shop_name,
        owner_name,
        email,
        phone,
        profile_image,
        open_time,
        close_time,
        is_verify,
        address:address_id (
          id,
          detail,
          subdistrict,
          district,
          province,
          postcode
        )
      `
      )
      .eq("id", shop_id)
      .single();
 
    if (error || !shop) {
      return res.status(404).json({ error: "Shop not found" });
    }
 
    return res.status(200).json({ data: shop });
  } catch (err) {
    console.error("Get Shop Profile Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getBankAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
 
    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }
 
    const { data: bankAccount, error } = await supabase
      .from("bank_account")
      .select("id, bank_name, account_name, account_number")
      .eq("shop_id", shop_id)
      .maybeSingle();
 
    if (error) {
      return res.status(400).json({ error: error.message });
    }
 
    return res.status(200).json({ data: bankAccount });
  } catch (err) {
    console.error("Get Bank Account Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getShopServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
 
    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }
 
    const { data: services, error } = await supabase
      .from("service_type")
      .select(
        `
        id,
        type,
        service_detail (
          id,
          detail,
          price,
          group_name
        )
      `
      )
      .eq("shop_id", shop_id);
 
    if (error) {
      return res.status(400).json({ error: error.message });
    }
 
    return res.status(200).json({ data: services ?? [] });
  } catch (err) {
    console.error("Get Shop Services Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const checkShopVerified = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    const { data: shop, error } = await supabase
      .from("print_shop")
      .select("id, is_verify, verified_by")
      .eq("id", shop_id)
      .single();

    if (error || !shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    return res.status(200).json({
      data: {
        is_verify: Boolean(shop.is_verify),
        verified_by: shop.verified_by ?? null,
      },
    });
  } catch (err) {
    console.error("Check Shop Verified Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
 
export const saveShopServices = async (req: Request, res: Response): Promise<Response> => {
  try {
    const shop_id = req.headers.shop_id as string;
    const { services } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (!Array.isArray(services)) {
      return res.status(400).json({ error: "Invalid services format" });
    }

    // 1. ลบ service_type เก่าของร้านค้านี้ทั้งหมด (หรือจะใช้วิธี Upsert ก็ได้)
    const { data: oldTypes } = await supabase
      .from("service_type")
      .select("id")
      .eq("shop_id", shop_id);

    if (oldTypes && oldTypes.length > 0) {
      const typeIds = oldTypes.map((t) => t.id);
      await supabase.from("service_detail").delete().in("service_type_id", typeIds);
      await supabase.from("service_type").delete().eq("shop_id", shop_id);
    }

    // 2. บันทึกข้อมูล service_type และ service_detail ใหม่
    for (const service of services) {
      if (!service.type) continue;

      // Insert service_type
      const { data: newType, error: typeErr } = await supabase
        .from("service_type")
        .insert({ shop_id, type: service.type })
        .select("id")
        .single();

      if (typeErr || !newType) {
        console.error("Insert service_type error:", typeErr);
        continue;
      }

      // Insert service_detail
      if (Array.isArray(service.service_detail) && service.service_detail.length > 0) {
        const detailsToInsert = service.service_detail
          .filter((d: any) => d.detail) // กรองตัวเลือกที่เว้นว่างไว้ออก
          .map((d: any) => ({
            service_type_id: newType.id,
            detail: d.detail,
            group_name: d.group_name || "ตัวเลือกทั่วไป",
            price: Number(d.price) || 0,
          }));

        if (detailsToInsert.length > 0) {
          const { error: detailErr } = await supabase
            .from("service_detail")
            .insert(detailsToInsert);

          if (detailErr) {
            console.error("Insert service_detail error:", detailErr);
          }
        }
      }
    }

    return res.status(200).json({ message: "Services saved successfully" });
  } catch (err) {
    console.error("Save Shop Services Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};













