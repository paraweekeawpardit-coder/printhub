import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// ==========================================
// 1. ดึงรายชื่อร้านค้า (สำหรับหน้า Customer Home)
// ==========================================
export const getShops = async (req: Request, res: Response) => {
  try {
    const {
      search,
      is_open,
      is_top_rated,
      sort_by = 'distance',
      user_lat,
      user_lng
    } = req.query;

    const userLat = user_lat ? parseFloat(user_lat as string) : 13.7298;
    const userLng = user_lng ? parseFloat(user_lng as string) : 100.7782;

    // 🌟 ดึงข้อมูลร้านค้า โดยดึง is_open และ is_verify เพิ่มเข้ามา
    let query = supabase
      .from('print_shop')
      .select(`
        id,
        shop_name,
        profile_image,
        open_time,
        close_time,
        is_open,
        is_verify,
        rating,
        address:address_id (
          latitude,
          longitude
        )
      `)
      .eq('is_verify', true); // 👈 Fix 1: กรองเอาเฉพาะร้านที่ Admin อนุมัติแล้วเท่านั้น (แก้ปัญหาร้าน PENDING แสดง)

    if (search) {
      query = query.ilike('shop_name', `%${search}%`);
    }

    if (is_top_rated === 'true') {
      query = query.gte('rating', 4.0);
    }

    const { data: shops, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8);

    let formattedShops = (shops || []).map((shop: any) => {
      // 🌟 Fix 2: ถ้าร้านกดปิด Manual (is_open === false) ให้ถือว่าปิดทันที
      let isOpenNow = shop.is_open !== false;

      // ถ้าเปิด Manual ไว้ ให้เช็คเวลาทำการเพิ่มเติม
      if (isOpenNow && shop.open_time && shop.close_time) {
        if (shop.open_time <= shop.close_time) {
          isOpenNow = currentTime >= shop.open_time && currentTime <= shop.close_time;
        } else {
          isOpenNow = currentTime >= shop.open_time || currentTime <= shop.close_time;
        }
      }

      let distance: number | null = null;
      if (shop.address?.latitude && shop.address?.longitude) {
        const R = 6371;
        const dLat = ((Number(shop.address.latitude) - userLat) * Math.PI) / 180;
        const dLon = ((Number(shop.address.longitude) - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((Number(shop.address.latitude) * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = Number((R * c).toFixed(1));
      }

      return {
        id: shop.id,
        name: shop.shop_name,
        shop_name: shop.shop_name,
        image_url: shop.profile_image,
        profile_image: shop.profile_image,
        rating: Number(shop.rating || 0),
        review_count: 0,
        open_time: shop.open_time,
        close_time: shop.close_time,
        is_open: isOpenNow, // คืนค่าสถานะจริง
        distance: distance
      };
    });

    if (is_open === 'true') {
      formattedShops = formattedShops.filter((s) => s.is_open === true);
    }

    if (sort_by === 'rating') {
      formattedShops.sort((a, b) => b.rating - a.rating);
    } else {
      formattedShops.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return res.json({
      success: true,
      data: formattedShops
    });
  } catch (err: any) {
    console.error('Server error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ==========================================
// 2. ดึงประเภทงานพิมพ์ทั้งหมด
// ==========================================
export const getAllServiceTypes = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("service_type")
      .select("type");

    if (error) throw error;

    const uniqueCategories = Array.from(new Set((data || []).map((item) => item.type)));

    return res.status(200).json({ success: true, data: uniqueCategories });
  } catch (error: any) {
    console.error("Get service types error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. ดึงตัวเลือกบริการของร้านนั้นๆ
// ==========================================
export const getShopServices = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    const { data: shop, error: shopError } = await supabase
      .from("print_shop")
      .select("id, shop_name, profile_image, open_time, close_time, rating")
      .eq("id", shopId)
      .maybeSingle();

    if (shopError) throw shopError;
    if (!shop) {
      return res.status(404).json({ success: false, message: "ไม่พบร้านค้านี้ในระบบ" });
    }

    const { data: serviceTypes, error: stError } = await supabase
      .from("service_type")
      .select("id, type")
      .eq("shop_id", shopId);

    if (stError) throw stError;

    const formattedServices = (serviceTypes || []).map((st: any) => {
      return {
        id: st.id,
        type_name: st.type,
        options: [],
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        shop,
        service_types: formattedServices,
      },
    });
  } catch (error: any) {
    console.error("Get shop services error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};