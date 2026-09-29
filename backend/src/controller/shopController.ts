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
      user_lng,
      service_type,
      category,
      finishing_service,
      finishing,
      // 🌟 1. รับ Query Parameters เรื่องราคา
      min_price,
      max_price,
      minPrice,
      maxPrice
    } = req.query;

    const userLat = user_lat ? parseFloat(user_lat as string) : 13.7298;
    const userLng = user_lng ? parseFloat(user_lng as string) : 100.7782;

    const categoryParam = ((service_type || category) as string || '').trim();
    const finishingParam = finishing_service || finishing;

    // แปลงช่วงราคาและป้องกันการติดลบ (ต้อง > 0 เสมอ)
    const rawMin = min_price || minPrice;
    const rawMax = max_price || maxPrice;
    const parsedMin = rawMin ? parseFloat(rawMin as string) : null;
    const parsedMax = rawMax ? parseFloat(rawMax as string) : null;

    const filterMinPrice = parsedMin !== null && !isNaN(parsedMin) && parsedMin > 0 ? parsedMin : null;
    const filterMaxPrice = parsedMax !== null && !isNaN(parsedMax) && parsedMax > 0 ? parsedMax : null;

    // 🌟 2. ปรับ Query ให้ดึง group_type และ price จาก service_detail มาด้วย
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
        ),
        service_type (
          type,
          service_detail (
            group_type,
            detail,
            price
          )
        )
      `)
      .eq('is_verify', true);

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
      let isOpenNow = shop.is_open !== false;

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

      const serviceTypes: string[] = Array.isArray(shop.service_type)
        ? shop.service_type.map((st: any) => st?.type?.trim()).filter(Boolean)
        : [];

      const allServiceDetails: string[] = Array.isArray(shop.service_type)
        ? shop.service_type.flatMap((st: any) =>
            Array.isArray(st?.service_detail)
              ? st.service_detail.map((sd: any) => sd?.detail?.trim()).filter(Boolean)
              : []
          )
        : [];

      const detailsByCategory: Record<string, string[]> = {};
      // 🌟 โครงสร้างไว้เก็บข้อมูลการบริการแบบแยกหมวดหมู่และกลุ่ม
      const itemsByCategory: Record<string, Array<{ group: string; detail: string; price: number }>> = {};

      if (Array.isArray(shop.service_type)) {
        shop.service_type.forEach((st: any) => {
          const typeName = st?.type?.trim();
          if (typeName && Array.isArray(st?.service_detail)) {
            detailsByCategory[typeName] = st.service_detail
              .map((sd: any) => sd?.detail?.trim())
              .filter(Boolean);

            itemsByCategory[typeName] = st.service_detail.map((sd: any) => ({
              group: sd?.group_type?.trim() || '',
              detail: sd?.detail?.trim() || '',
              price: Number(sd?.price || 0)
            }));
          }
        });
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
        is_open: isOpenNow,
        distance: distance,
        service_types: serviceTypes,
        service_details: allServiceDetails,
        details_by_category: detailsByCategory,
        items_by_category: itemsByCategory
      };
    });

    // 🌟 1. กรองตามประเภทหลัก (categoryParam)
    if (categoryParam && categoryParam !== 'ทั้งหมด') {
      formattedShops = formattedShops.filter((s: any) =>
        s.service_types?.some((t: string) => t.toLowerCase() === categoryParam.toLowerCase())
      );
    }

    // แปลงสเปกย่อยที่เลือกเป็น Array
    let selectedFinishingList: string[] = [];
    if (finishingParam) {
      if (Array.isArray(finishingParam)) {
        selectedFinishingList = finishingParam as string[];
      } else if (typeof finishingParam === 'string' && finishingParam.length > 0) {
        selectedFinishingList = decodeURIComponent(finishingParam).split(',');
      }
      selectedFinishingList = selectedFinishingList.map((f) => f.trim().toLowerCase()).filter(Boolean);
    }

    // 🌟 2. กรองตามสเปกย่อย (finishingParam)
    if (selectedFinishingList.length > 0) {
      formattedShops = formattedShops.filter((s: any) => {
        let targetDetails: string[] = [];
        if (categoryParam && categoryParam !== 'ทั้งหมด' && s.details_by_category[categoryParam]) {
          targetDetails = s.details_by_category[categoryParam].map((d: string) => d.toLowerCase());
        } else {
          targetDetails = s.service_details?.map((d: string) => d.toLowerCase()) || [];
        }

        // ต้องมีสเปกย่อยตรงอย่างน้อย 1 ข้อที่เลือก
        return selectedFinishingList.some((item) => targetDetails.includes(item));
      });
    }

    // 🌟 3. Combination Price Filter (คำนวณราคารวมสเปกที่ต้องจับคู่ + เทียบงบประมาณ)
    if (filterMinPrice !== null || filterMaxPrice !== null) {
      formattedShops = formattedShops.filter((s: any) => {
        // ดึงรายการไอเทมในหมวดหมู่ที่เลือก (หากไม่ได้เลือกหมวดหมู่ให้รวมทุกหมวด)
        let relevantItems: Array<{ group: string; detail: string; price: number }> = [];

        if (categoryParam && categoryParam !== 'ทั้งหมด' && s.items_by_category[categoryParam]) {
          relevantItems = s.items_by_category[categoryParam];
        } else {
          relevantItems = Object.values(s.items_by_category).flat() as Array<{
            group: string;
            detail: string;
            price: number;
          }>;
        }

        // กรองเอาเฉพาะสเปกที่เลือก (ถ้าผู้ใช้ระบุสเปกย่อยเข้ามา)
        let filteredItems = relevantItems;
        if (selectedFinishingList.length > 0) {
          filteredItems = relevantItems.filter((item) =>
            selectedFinishingList.includes(item.detail.toLowerCase())
          );
        }

        if (filteredItems.length === 0) return false;

        // จัดกลุ่มสเปกย่อยตาม group_type
        const groupedByGroup: Record<string, number[]> = {};
        filteredItems.forEach((item) => {
          const groupName = item.group || 'default';
          if (!groupedByGroup[groupName]) {
            groupedByGroup[groupName] = [];
          }
          groupedByGroup[groupName].push(item.price);
        });

        // ฟังก์ชันสร้าง Combination ของราคารวมจากแต่ละกลุ่ม
        const groupPricesArray = Object.values(groupedByGroup);
        const getCombinations = (arrays: number[][]): number[] => {
          if (arrays.length === 0) return [];
          return arrays.reduce((acc, curr) => {
            const res: number[] = [];
            acc.forEach((a) => {
              curr.forEach((b) => {
                res.push(a + b);
              });
            });
            return res;
          }, [0]);
        };

        const priceCombinations = getCombinations(groupPricesArray);

        // เช็คว่ามี Combination ราคารวมใดที่อยู่ในช่วงงบประมาณหรือไม่
        return priceCombinations.some((totalPrice) => {
          const matchMin = filterMinPrice !== null ? totalPrice >= filterMinPrice : true;
          const matchMax = filterMaxPrice !== null ? totalPrice <= filterMaxPrice : true;
          return matchMin && matchMax;
        });
      });
    }

    // 🌟 4. ค้นหาด้วย Keyword
    if (search && typeof search === 'string') {
      const keyword = search.trim().toLowerCase();
      formattedShops = formattedShops.filter((s: any) => {
        const matchName = s.shop_name?.toLowerCase().includes(keyword);
        const matchService = s.service_types?.some((t: string) =>
          t.toLowerCase().includes(keyword)
        );
        const matchDetail = s.service_details?.some((d: string) =>
          d.toLowerCase().includes(keyword)
        );
        return matchName || matchService || matchDetail;
      });
    }

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

    // ดึง service_type พร้อม service_detail ที่ผูกกัน
    const { data: serviceTypes, error: stError } = await supabase
      .from("service_type")
      .select(`
        id, 
        type,
        service_detail (
          id,
          category,
          group_type,
          detail,
          price
        )
      `)
      .eq("shop_id", shopId);

    if (stError) throw stError;

    return res.status(200).json({
      success: true,
      data: {
        shop,
        service_types: serviceTypes || [],
      },
    });
  } catch (error: any) {
    console.error("Get shop services error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. ดึงข้อมูลร้านค้าทั้งหมด (ฟังก์ชันสำรอง)
// ==========================================
export const getCustomerShops = async (req: Request, res: Response) => {
  try {
    const { data: shops, error } = await supabase
      .from("print_shop")
      .select(`
        *,
        service_type (
          type
        )
      `);

    if (error) throw error;

    const formattedShops = (shops || []).map((shop: any) => {
      const types = Array.isArray(shop.service_type)
        ? shop.service_type.map((st: any) => st?.type).filter(Boolean)
        : [];

      return {
        ...shop,
        service_types: types,
      };
    });

    return res.status(200).json({ success: true, data: formattedShops });
  } catch (err: any) {
    console.error("Get shops error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};