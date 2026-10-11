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
      min_price,
      max_price,
      minPrice,
      maxPrice
    } = req.query;

    const userLat = user_lat ? parseFloat(user_lat as string) : 13.7298;
    const userLng = user_lng ? parseFloat(user_lng as string) : 100.7782;

    const categoryParam = ((service_type || category) as string || '').trim();
    const finishingParam = (finishing_service || finishing) as string;

    const rawMin = min_price || minPrice;
    const rawMax = max_price || maxPrice;
    const parsedMin = rawMin ? parseFloat(rawMin as string) : null;
    const parsedMax = rawMax ? parseFloat(rawMax as string) : null;

    const filterMinPrice = parsedMin !== null && !isNaN(parsedMin) && parsedMin > 0 ? parsedMin : null;
    const filterMaxPrice = parsedMax !== null && !isNaN(parsedMax) && parsedMax > 0 ? parsedMax : null;

    // 🌟 Query ดึงข้อมูลร้านค้า (กรองเฉพาะสถานะ 'approved' เพื่อตัดร้าน suspended / pending ออก)
    let query = supabase
      .from('print_shop')
      .select(`
        id,
        shop_name,
        profile_image,
        open_time,
        close_time,
        is_open,
        status,
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
      .eq('status', 'approved'); // 🛑 ใช้ status = approved เพื่อกรองเฉพาะร้านที่ใช้งานได้ปกติ

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
      const itemsByCategory: Record<string, Array<{ group: string; detail: string; price: number }>> = {};

      if (Array.isArray(shop.service_type)) {
        shop.service_type.forEach((st: any) => {
          const typeName = st?.type?.trim();
          if (typeName && Array.isArray(st?.service_detail)) {
            detailsByCategory[typeName] = st.service_detail
              .map((sd: any) => sd?.detail?.trim())
              .filter(Boolean);

            itemsByCategory[typeName] = st.service_detail.map((sd: any) => ({
              group: sd?.group_type?.trim() || 'default',
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

    // -------------------------------------------------------------
    // กรองด้วย Search Box
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // กรองประเภทงานพิมพ์หลัก (Category / Service Type)
    // -------------------------------------------------------------
    if (categoryParam && categoryParam !== 'ทั้งหมด') {
      formattedShops = formattedShops.filter((shop: any) => {
        return (shop.service_types || []).some(
          (t: string) => t.toLowerCase() === categoryParam.toLowerCase()
        );
      });
    }

    // -------------------------------------------------------------
    // กรองสเปกย่อย + คำนวณราคาแบบ Combination Matching
    // -------------------------------------------------------------
    if (finishingParam && typeof finishingParam === 'string' && finishingParam.trim() !== '') {
      const selectedSpecs = finishingParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (selectedSpecs.length > 0) {
        formattedShops = formattedShops.filter((shop: any) => {
          let availableItems: Array<{ group: string; detail: string; price: number }> = [];

          if (categoryParam && categoryParam !== 'ทั้งหมด' && shop.items_by_category?.[categoryParam]) {
            availableItems = shop.items_by_category[categoryParam];
          } else {
            Object.values(shop.items_by_category || {}).forEach((items: any) => {
              availableItems.push(...items);
            });
          }

          const hasAllSpecs = selectedSpecs.every((spec) => {
            const cleanSpec = spec.toLowerCase();
            return availableItems.some((item) => {
              const d = item.detail.toLowerCase();
              return d.includes(cleanSpec) || cleanSpec.includes(d);
            });
          });

          if (!hasAllSpecs) return false;

          if (filterMinPrice === null && filterMaxPrice === null) return true;

          const selectedByGroup: Record<string, number[]> = {};

          selectedSpecs.forEach((spec) => {
            const cleanSpec = spec.toLowerCase();
            const matchedItem = availableItems.find((item) => {
              const d = item.detail.toLowerCase();
              return d.includes(cleanSpec) || cleanSpec.includes(d);
            });

            if (matchedItem) {
              const groupKey = matchedItem.group || 'default';
              if (!selectedByGroup[groupKey]) selectedByGroup[groupKey] = [];
              selectedByGroup[groupKey].push(matchedItem.price);
            }
          });

          const groupArrays = Object.values(selectedByGroup);
          const combinations = groupArrays.reduce<number[][]>(
            (acc, currentGroup) => {
              const nextAcc: number[][] = [];
              acc.forEach((prevCombination) => {
                currentGroup.forEach((price) => {
                  nextAcc.push([...prevCombination, price]);
                });
              });
              return nextAcc;
            },
            [[]]
          );

          return combinations.some((comboPrices) => {
            const totalPrice = comboPrices.reduce((sum, p) => sum + p, 0);
            if (filterMinPrice !== null && totalPrice < filterMinPrice) return false;
            if (filterMaxPrice !== null && totalPrice > filterMaxPrice) return false;
            return true;
          });
        });
      }
    } else if (filterMinPrice !== null || filterMaxPrice !== null) {
      formattedShops = formattedShops.filter((shop: any) => {
        let allPrices: number[] = [];
        Object.values(shop.items_by_category || {}).forEach((items: any) => {
          items.forEach((it: any) => allPrices.push(it.price));
        });

        if (allPrices.length === 0) return true;
        const minShopPrice = Math.min(...allPrices);

        if (filterMinPrice !== null && minShopPrice < filterMinPrice) return false;
        if (filterMaxPrice !== null && minShopPrice > filterMaxPrice) return false;
        return true;
      });
    }

    // -------------------------------------------------------------
    // กรองเปิดให้บริการ
    // -------------------------------------------------------------
    if (is_open === 'true') {
      formattedShops = formattedShops.filter((s) => s.is_open === true);
    }

    // -------------------------------------------------------------
    // เรียงลำดับ (Sorting)
    // -------------------------------------------------------------
    if (sort_by === 'rating') {
      formattedShops.sort((a, b) => b.rating - a.rating);
    } else if (sort_by === 'both') {
      formattedShops.sort((a, b) => {
        const ratingDiff = b.rating - a.rating;
        if (ratingDiff !== 0) return ratingDiff;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
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
      .select(`
        id, 
        shop_name, 
        profile_image, 
        open_time, 
        close_time, 
        rating,
        phone,
        email,
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
      `)
      .eq("id", shopId)
      .maybeSingle();

    if (shopError) throw shopError;
    
    // 🛑 ตรวจสอบ: ถ้าร้านค้าไม่ได้มีสถานะอนุมัติ (approved) ให้ระบุว่าไม่พบร้าน
    if (!shop || shop.status !== 'approved') {
      return res.status(404).json({ success: false, message: "ไม่พบร้านค้านี้ในระบบ หรือร้านค้าถูกระงับการใช้งาน" });
    }

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
          price,
          is_required, 
          price_type
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
      `)
      .eq("status", "approved"); // 🛑 กรองเฉพาะสถานะ approved

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

// ==========================================
// 5. ยื่นเรื่องขอเปลี่ยน/เพิ่มบัญชีธนาคาร (ฝั่งร้านค้า - Status: Pending)
// ==========================================
export const requestBankAccountUpdate = async (req: Request, res: Response) => {
  try {
    const { shop_id, bank_name, account_number, account_name } = req.body;

    if (!shop_id || !bank_name || !account_number || !account_name) {
      return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลบัญชีธนาคารให้ครบถ้วน" });
    }

    const { data, error } = await supabase
      .from("bank_account")
      .insert([
        {
          shop_id,
          bank_name,
          account_number,
          account_name,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "ส่งคำขอเปลี่ยนบัญชีธนาคารเรียบร้อยแล้ว กรอดำเนินการอนุมัติจาก Admin",
      data,
    });
  } catch (error: any) {
    console.error("Request bank account error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. ดึงข้อมูลบัญชีธนาคารที่อนุมัติแล้ว (สำหรับลูกค้าชำระเงิน)
// ==========================================
export const getApprovedBankAccount = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({ success: false, message: "กรุณาระบุ shopId" });
    }

    const { data: bankInfo, error } = await supabase
      .from("bank_account")
      .select("*")
      .eq("shop_id", shopId)
      .eq("status", "approved")
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: bankInfo || null,
    });
  } catch (error: any) {
    console.error("Get approved bank account error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};