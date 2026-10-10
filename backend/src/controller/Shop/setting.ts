import { Request, Response } from "express";
import supabase from "../../config/supabase.js";

// bank_account.status เป็น NOT NULL -> ปรับค่าให้ตรงกับที่ระบบ admin ใช้ตรวจบัญชี
const DEFAULT_BANK_STATUS = "pending";
// เมื่อร้านแก้ไขข้อมูลบัญชีเดิม -> รอแอดมินตรวจสอบใหม่
const CHANGED_BANK_STATUS = "pending";

export const getShopProfile = async (
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
        is_open,
        status,
        address:address_id (
          id,
          detail,
          subdistrict,
          district,
          province,
          postcode,
          latitude,
          longitude
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

// 🟢 แก้ไข: ใช้ type_id และดึงข้อมูลสัมพันธ์กับ service_detail ตาม Schema
export const getShopServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // ดึง service_type และ service_detail ผ่าน type_id
    const { data: services, error } = await supabase
      .from("service_type")
      .select(
        `
        id,
        type,
        service_detail!type_id (
          id,
          category,
          group_type,
          detail,
          price
        )
      `
      )
      .eq("shop_id", shop_id);

    if (error) {
      console.error("Get services error:", error);
      return res.status(400).json({ error: error.message });
    }

    // ฟอร์แมตข้อมูลส่งกลับไปที่ Frontend
    const formattedServices = (services ?? []).map((s: any) => ({
      id: s.id,
      type: s.type,
      items: (s.service_detail ?? []).map((d: any) => ({
        id: d.id,
        category: d.category ?? "",
        group_type: d.group_type ?? "",
        detail: d.detail ?? "",
        price: d.price != null ? String(d.price) : "",
      })),
    }));

    return res.status(200).json({ data: formattedServices });
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

export const setShopOpenStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
    const { is_open } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (typeof is_open !== "boolean") {
      return res.status(400).json({ error: "is_open must be true or false" });
    }

    const { data: shop, error } = await supabase
      .from("print_shop")
      .update({ is_open })
      .eq("id", shop_id)
      .select("id, is_open")
      .single();

    if (error || !shop) {
      console.error("Set shop open status error:", error);
      return res.status(404).json({ error: "Shop not found" });
    }

    return res.status(200).json({ data: shop });
  } catch (err) {
    console.error("Set Shop Open Status Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// บันทึกบริการ (sync แบบเทียบรายการ)
// - service_type: unique (shop_id, type) -> ใช้แถวเดิมซ้ำตามชื่อ type
// - service_detail: น่าจะ unique (type_id, group_type, detail) -> insert เฉพาะรายการใหม่,
//   update ราคา/หมวดของรายการเดิม, ลบเฉพาะรายการที่ถูกเอาออก (ไม่ insert ซ้ำ จึงไม่ชน constraint)
// - insert/update ทำก่อน ลบทำทีหลังสุด ถ้าพังกลางทางจะ rollback ข้อมูลเดิมไม่หาย
type DetailRow = {
  id: string;
  type_id?: string;
  group_type: string;
  detail: string;
  category: string;
  price: number | null;
};

const detailKey = (group_type: string, detail: string) =>
  `${group_type}\u0000${detail}`;

export const saveShopServices = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const shop_id = (req.headers["shop_id"] || req.body.shop_id) as string;
    const { services } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (!Array.isArray(services)) {
      return res.status(400).json({ error: "Invalid services format" });
    }

    // 1) เตรียมข้อมูล: รวม type ชื่อซ้ำ + กัน detail ซ้ำ (group_type + detail) ใน payload
    const merged = new Map<
      string,
      Map<string, { category: string; group_type: string; detail: string; price: number }>
    >();

    for (const s of services) {
      const type = String(s?.type ?? "").trim();
      if (!type) continue;

      let detailMap = merged.get(type);
      if (!detailMap) {
        detailMap = new Map();
        merged.set(type, detailMap);
      }

      const rawItems = s.items || s.service_detail || [];
      for (const d of Array.isArray(rawItems) ? rawItems : []) {
        const detail = String(d?.detail ?? "").trim();
        if (!detail) continue;
        const group_type = String(d?.group_type ?? "").trim();
        detailMap.set(detailKey(group_type, detail), {
          category: d?.category || type,
          group_type,
          detail,
          price: Number(d?.price) || 0,
        });
      }
    }

    const prepared = Array.from(merged.entries()).map(([type, m]) => ({
      type,
      details: Array.from(m.values()),
    }));

    // 2) ดึงข้อมูลเดิม (ยังไม่แก้อะไร)
    const { data: oldTypes, error: oldErr } = await supabase
      .from("service_type")
      .select("id, type")
      .eq("shop_id", shop_id);

    if (oldErr) {
      return res.status(400).json({ error: oldErr.message });
    }

    const oldTypeByName = new Map<string, string>();
    for (const t of oldTypes ?? []) oldTypeByName.set(t.type, t.id);
    const oldTypeIds = (oldTypes ?? []).map((t: any) => t.id);

    const existingDetailsByType = new Map<string, DetailRow[]>();
    if (oldTypeIds.length > 0) {
      const { data: rows, error: rowsErr } = await supabase
        .from("service_detail")
        .select("id, type_id, group_type, detail, category, price")
        .in("type_id", oldTypeIds);

      if (rowsErr) {
        return res.status(400).json({ error: rowsErr.message });
      }
      for (const r of (rows ?? []) as DetailRow[]) {
        const list = existingDetailsByType.get(r.type_id as string) ?? [];
        list.push(r);
        existingDetailsByType.set(r.type_id as string, list);
      }
    }

    console.log("[saveShopServices v5-sync-details]", {
      shop_id,
      oldTypes: (oldTypes ?? []).map((t: any) => t.type),
      incomingTypes: prepared.map((p) => p.type),
    });

    // 3) insert / update (ยังไม่ลบอะไร) ถ้าพังให้ rollback
    const createdTypeIds: string[] = [];
    const createdDetailIds: string[] = [];
    const updatedBackups: DetailRow[] = [];
    const pendingDeleteDetailIds: string[] = [];

    try {
      for (const s of prepared) {
        let typeId = oldTypeByName.get(s.type);

        if (!typeId) {
          const { data: newType, error: typeErr } = await supabase
            .from("service_type")
            .insert({ shop_id, type: s.type })
            .select("id")
            .single();

          if (typeErr?.code === "23505") {
            // มีแถวนี้อยู่แล้วแต่ไม่อยู่ในลิสต์ตอนแรก -> ใช้แถวเดิม (ไม่นับเป็นของที่เพิ่งสร้าง)
            const { data: existing, error: findErr } = await supabase
              .from("service_type")
              .select("id")
              .eq("shop_id", shop_id)
              .eq("type", s.type)
              .single();

            if (findErr || !existing) throw findErr ?? typeErr;
            typeId = existing.id as string;

            const { data: rows, error: rowsErr } = await supabase
              .from("service_detail")
              .select("id, type_id, group_type, detail, category, price")
              .eq("type_id", typeId);
            if (rowsErr) throw rowsErr;
            existingDetailsByType.set(typeId, (rows ?? []) as DetailRow[]);
          } else if (typeErr || !newType) {
            throw typeErr ?? new Error("insert service_type failed");
          } else {
            typeId = newType.id as string;
            createdTypeIds.push(typeId);
          }
        }

        const existingRows = existingDetailsByType.get(typeId) ?? [];
        const existingByKey = new Map<string, DetailRow>();
        for (const r of existingRows) {
          existingByKey.set(detailKey(r.group_type, r.detail), r);
        }

        const incomingKeys = new Set<string>();
        const toInsert: any[] = [];
        const toUpdate: { row: DetailRow; category: string; price: number }[] = [];

        for (const d of s.details) {
          const key = detailKey(d.group_type, d.detail);
          incomingKeys.add(key);

          const ex = existingByKey.get(key);
          if (!ex) {
            toInsert.push({ ...d, type_id: typeId });
          } else if (Number(ex.price) !== d.price || ex.category !== d.category) {
            toUpdate.push({ row: ex, category: d.category, price: d.price });
          }
        }

        for (const r of existingRows) {
          if (!incomingKeys.has(detailKey(r.group_type, r.detail))) {
            pendingDeleteDetailIds.push(r.id);
          }
        }

        if (toInsert.length > 0) {
          const { data: inserted, error: insErr } = await supabase
            .from("service_detail")
            .insert(toInsert)
            .select("id");

          if (insErr) throw insErr;
          createdDetailIds.push(...(inserted ?? []).map((d: any) => d.id));
        }

        for (const u of toUpdate) {
          const { error: updErr } = await supabase
            .from("service_detail")
            .update({ category: u.category, price: u.price })
            .eq("id", u.row.id);

          if (updErr) throw updErr;
          updatedBackups.push(u.row);
        }
      }
    } catch (syncErr: any) {
      console.error("Save services sync error:", syncErr);

      // rollback: คืนค่าที่ update ไปแล้ว + ลบของที่เพิ่งสร้าง
      for (const b of updatedBackups) {
        await supabase
          .from("service_detail")
          .update({ category: b.category, price: b.price })
          .eq("id", b.id);
      }
      if (createdDetailIds.length > 0) {
        await supabase.from("service_detail").delete().in("id", createdDetailIds);
      }
      if (createdTypeIds.length > 0) {
        await supabase.from("service_type").delete().in("id", createdTypeIds);
      }

      return res.status(400).json({
        error: "Failed to save services",
        detail: syncErr?.message ?? String(syncErr),
        code: syncErr?.code ?? null,
        debug: {
          version: "v5-sync-details",
          oldTypes: (oldTypes ?? []).map((t: any) => t.type),
          incomingTypes: prepared.map((p) => p.type),
        },
      });
    }

    // 4) ทุกอย่างเข้าครบแล้ว -> ลบรายการที่ผู้ใช้เอาออก และ type ที่ถูกลบทั้งกลุ่ม
    if (pendingDeleteDetailIds.length > 0) {
      const { error: delErr } = await supabase
        .from("service_detail")
        .delete()
        .in("id", pendingDeleteDetailIds);
      if (delErr) {
        console.error("Delete old service_detail error:", delErr);
        return res.status(400).json({ error: delErr.message });
      }
    }

    const keptTypeNames = new Set(prepared.map((p) => p.type));
    const removedTypeIds = (oldTypes ?? [])
      .filter((t: any) => !keptTypeNames.has(t.type))
      .map((t: any) => t.id);

    if (removedTypeIds.length > 0) {
      await supabase.from("service_detail").delete().in("type_id", removedTypeIds);
      const { error: delTypeErr } = await supabase
        .from("service_type")
        .delete()
        .in("id", removedTypeIds);
      if (delTypeErr) {
        console.error("Delete old service_type error:", delTypeErr);
        return res.status(400).json({ error: delTypeErr.message });
      }
    }

    return res.status(200).json({ message: "Services saved successfully" });
  } catch (err) {
    console.error("Save Shop Services Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const updateShopProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
    const { shop_name, owner_name, phone, open_time, close_time, address } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    let address_id = address?.id;

    if (address) {
      const addressPayload = {
        detail: address.detail ?? "",
        subdistrict: address.subdistrict,
        district: address.district,
        province: address.province,
        postcode: address.postcode,
        // พิกัดจากแผนที่ (ส่งมาเฉพาะตอนที่ผู้ใช้ยืนยัน/ปักหมุดใหม่)
        ...(Number.isFinite(Number(address.latitude)) &&
          Number.isFinite(Number(address.longitude)) &&
          address.latitude !== null &&
          address.longitude !== null && {
            latitude: Number(address.latitude),
            longitude: Number(address.longitude),
          }),
      };

      if (address_id) {
        const { error: addrErr } = await supabase
          .from("address")
          .update(addressPayload)
          .eq("id", address_id);

        if (addrErr) {
          return res.status(400).json({ error: addrErr.message });
        }
      } else {
        const { data: newAddr, error: addrErr } = await supabase
          .from("address")
          .insert(addressPayload)
          .select("id")
          .single();

        if (addrErr || !newAddr) {
          return res
            .status(400)
            .json({ error: addrErr?.message ?? "Failed to create address" });
        }
        address_id = newAddr.id;
      }
    }

    const { error: shopErr } = await supabase
      .from("print_shop")
      .update({
        shop_name,
        owner_name,
        phone,
        open_time,
        close_time,
        ...(address_id && { address_id }),
      })
      .eq("id", shop_id);

    if (shopErr) {
      return res.status(400).json({ error: shopErr.message });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Shop Profile Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const updateBankAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
    const { id, bank_name, account_name, account_number } = req.body;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    // ---------- แก้ไขบัญชีเดิม ----------
    if (id) {
      const { data: old, error: oldErr } = await supabase
        .from("bank_account")
        .select("bank_name, account_name, account_number, status")
        .eq("id", id)
        .eq("shop_id", shop_id)
        .single();

      if (oldErr || !old) {
        return res.status(404).json({ error: "Bank account not found" });
      }

      // เช็คว่ามีการเปลี่ยนแปลงข้อมูลจริงหรือไม่
      const changed =
        old.bank_name !== bank_name ||
        old.account_name !== account_name ||
        old.account_number !== account_number;

      const { error } = await supabase
        .from("bank_account")
        .update({
          bank_name,
          account_name,
          account_number,
          ...(changed && { status: CHANGED_BANK_STATUS }), // เปลี่ยน status เป็น "change" เมื่อมีการแก้ไข
        })
        .eq("id", id)
        .eq("shop_id", shop_id);

      if (error) return res.status(400).json({ error: error.message });

      // หากมีการเปลี่ยนแปลงข้อมูล ให้ปรับ print_shop.is_verify เป็น false เพื่อรอแอดมินตรวจสอบใหม่
      if (changed) {
        const { error: shopErr } = await supabase
          .from("print_shop")
          .update({ is_verify: false })
          .eq("id", shop_id);

        if (shopErr) {
          // rollback ข้อมูลบัญชีธนาคารกลับค่าเดิมหากอัปเดต print_shop ไม่สำเร็จ
          await supabase
            .from("bank_account")
            .update({
              bank_name: old.bank_name,
              account_name: old.account_name,
              account_number: old.account_number,
              status: old.status,
            })
            .eq("id", id)
            .eq("shop_id", shop_id);

          return res.status(400).json({ error: shopErr.message });
        }
      }

      return res.status(200).json({ message: "Bank account updated successfully" });
    }

    // ---------- เพิ่มบัญชีครั้งแรก ----------
    const { error } = await supabase.from("bank_account").insert({
      shop_id,
      bank_name,
      account_name,
      account_number,
      status: DEFAULT_BANK_STATUS,
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Bank account updated successfully" });
  } catch (err) {
    console.error("Update Bank Account Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
// ==========================================
// รูปโปรไฟล์ร้าน: เปลี่ยนได้อย่างเดียว ลบไม่ได้ (ร้านต้องมีรูปเสมอ)
// ต้องสร้าง bucket (แบบ Public) ใน Supabase Storage ชื่อ "shop-profile"
// หรือกำหนดชื่ออื่นผ่าน env: SUPABASE_PROFILE_BUCKET
// ==========================================
const PROFILE_BUCKET = process.env.SUPABASE_PROFILE_BUCKET || "shop-profile";

// ตรวจชนิดไฟล์จากเนื้อไฟล์จริง (magic bytes) ไม่เชื่อ mimetype ที่ client ส่งมา
const detectImageType = (buf: Buffer): { mime: string; ext: string } | null => {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { mime: "image/png", ext: "png" };
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
};

export const updateShopProfileImage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { shop_id } = req.params;
    const file = (req as any).file as { buffer: Buffer; size: number } | undefined;

    if (!shop_id) {
      return res.status(400).json({ error: "shop_id is required" });
    }

    if (!file || !file.buffer || file.buffer.length === 0) {
      return res.status(400).json({ error: "กรุณาเลือกไฟล์รูปภาพ" });
    }

    const imageType = detectImageType(file.buffer);
    if (!imageType) {
      return res.status(400).json({ error: "รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP" });
    }

    // เช็กว่ามีร้านนี้จริงก่อนอัปโหลด + จำ URL รูปเดิมไว้ลบทีหลัง
    const { data: shop, error: shopErr } = await supabase
      .from("print_shop")
      .select("id, profile_image")
      .eq("id", shop_id)
      .single();

    if (shopErr || !shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // ชื่อไฟล์ใหม่ทุกครั้ง -> ไม่ติด cache ของรูปเก่า
    const filePath = `${shop_id}/profile-${Date.now()}.${imageType.ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(PROFILE_BUCKET)
      .upload(filePath, file.buffer, { contentType: imageType.mime, upsert: false });

    if (uploadErr) {
      console.error("Upload profile image error:", uploadErr);
      return res.status(400).json({
        error: "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        detail: uploadErr.message,
      });
    }

    const { data: publicData } = supabase.storage
      .from(PROFILE_BUCKET)
      .getPublicUrl(filePath);
    const publicUrl = publicData.publicUrl;

    const { error: updateErr } = await supabase
      .from("print_shop")
      .update({ profile_image: publicUrl })
      .eq("id", shop_id);

    if (updateErr) {
      // บันทึกลงฐานข้อมูลไม่สำเร็จ -> ลบไฟล์ที่เพิ่งอัปโหลดทิ้ง ไม่ให้ค้างเป็นขยะ
      await supabase.storage.from(PROFILE_BUCKET).remove([filePath]);
      return res.status(400).json({ error: updateErr.message });
    }

    // ลบไฟล์รูปเก่าออกจาก Storage (best effort: พลาดก็ไม่กระทบผลลัพธ์)
    try {
      const oldUrl: string | null = shop.profile_image ?? null;
      const marker = `/storage/v1/object/public/${PROFILE_BUCKET}/`;
      const idx = oldUrl ? oldUrl.indexOf(marker) : -1;
      if (oldUrl && idx !== -1) {
        const oldPath = decodeURIComponent(
          oldUrl.slice(idx + marker.length).split("?")[0]
        );
        if (oldPath && oldPath !== filePath) {
          await supabase.storage.from(PROFILE_BUCKET).remove([oldPath]);
        }
      }
    } catch (cleanupErr) {
      console.warn("Remove old profile image failed:", cleanupErr);
    }

    return res.status(200).json({ data: { profile_image: publicUrl } });
  } catch (err) {
    console.error("Update Shop Profile Image Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
