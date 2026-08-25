import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// ฟังก์ชันคำนวณระยะทางจากพิกัด (กิโลเมตร) ด้วย Haversine Formula
function calculateDistance(
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number | null {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const R = 6371; // รัศมีโลก (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return isNaN(dist) ? null : parseFloat(dist.toFixed(2));
}

// ฟังก์ชันตรวจสอบว่าร้านเปิดอยู่หรือไม่ ณ เวลาปัจจุบัน
function checkIsOpen(openTime?: string, closeTime?: string): boolean {
  if (!openTime || !closeTime) return true;
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);

    const openMinutes = openH * 60 + (openM || 0);
    const closeMinutes = closeH * 60 + (closeM || 0);

    if (closeMinutes < openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } catch (e) {
    return true;
  }
}

// 1. ฟังก์ชันค้นหาและกรองร้านค้าสำหรับหน้าแรก (UR-01 ถึง UR-07)
export const getShops = async (req: Request, res: Response) => {
  try {
    const {
      search,
      service_type,
      min_price,
      max_price,
      user_lat,
      user_lng,
      is_open,
      sort_by
    } = req.query;

    let query = supabase
      .from('print_shop')
      .select(`
        id,
        shop_name,
        rating,
        profile_image,
        open_time,
        close_time,
        is_verify,
        address:address_id (
          latitude,
          longitude,
          detail,
          subdistrict,
          district,
          province
        ),
        service_type (
          id,
          type,
          service_detail (
            id,
            price,
            detail
          )
        )
      `);

    if (search) {
      query = query.ilike('shop_name', `%${search}%`);
    }

    const { data: shops, error } = await query;
    if (error) throw error;

    let formattedShops = (shops || []).map((shop: any) => {
      const allPrices = (shop.service_type || []).flatMap((st: any) =>
        (st.service_detail || []).map((sd: any) => Number(sd.price))
      );
      const startingPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

      const distance =
        user_lat && user_lng && shop.address && shop.address.latitude && shop.address.longitude
          ? calculateDistance(
              Number(user_lat),
              Number(user_lng),
              Number(shop.address.latitude),
              Number(shop.address.longitude)
            )
          : null;

      const isOpenNow = checkIsOpen(shop.open_time, shop.close_time);

      return {
        id: shop.id,
        shop_name: shop.shop_name,
        profile_image: shop.profile_image,
        rating: shop.rating,
        open_time: shop.open_time,
        close_time: shop.close_time,
        is_open: isOpenNow,
        is_verify: shop.is_verify,
        address: shop.address,
        distance,
        starting_price: startingPrice,
        service_types: (shop.service_type || []).map((st: any) => st.type).filter(Boolean)
      };
    });

    // กรองประเภทบริการ
    if (service_type && service_type !== 'ทั้งหมด' && service_type !== 'all') {
      const cleanFilter = String(service_type).trim().toLowerCase();
      formattedShops = formattedShops.filter((shop: any) =>
        shop.service_types.some((t: any) => {
          const cleanType = String(t).trim().toLowerCase();
          return cleanType.includes(cleanFilter) || cleanFilter.includes(cleanType);
        })
      );
    }

    if (min_price) {
      formattedShops = formattedShops.filter(
        (shop: any) => shop.starting_price >= Number(min_price)
      );
    }

    if (max_price) {
      formattedShops = formattedShops.filter(
        (shop: any) => shop.starting_price <= Number(max_price)
      );
    }

    if (is_open === 'true') {
      formattedShops = formattedShops.filter((shop: any) => shop.is_open);
    }

    if (sort_by === 'rating') {
      formattedShops.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    } else if (sort_by === 'distance') {
      formattedShops.sort((a: any, b: any) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    return res.status(200).json({ success: true, data: formattedShops });
  } catch (error: any) {
    console.error('Error fetching shops:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. ฟังก์ชันดึง service_type และ service_detail ตามรหัสร้านค้าสำหรับหน้าสั่งพิมพ์
export const getShopServices = async (req: Request, res: Response) => {
  const { shopId } = req.params;

  try {
    const { data: shop, error } = await supabase
      .from('print_shop')
      .select(`
        id,
        shop_name,
        open_time,
        close_time,
        rating,
        service_type (
          id,
          type,
          service_detail (
            id,
            detail,
            price
          )
        )
      `)
      .eq('id', shopId)
      .maybeSingle();

    if (error) {
      console.error('Supabase Query Error:', error);
      return res.status(400).json({ success: false, message: error.message });
    }

    if (!shop) {
      return res.status(404).json({ success: false, message: 'ไม่พบร้านค้านี้ในระบบ' });
    }

    const formattedServices = (shop.service_type || []).map((st: any) => ({
      id: st.id,
      type_name: st.type,
      details: (st.service_detail || []).map((sd: any) => ({
        id: sd.id,
        option_name: sd.detail,
        unit_price: Number(sd.price) || 0,
        unit_name: 'หน่วย'
      }))
    }));

    return res.status(200).json({
      success: true,
      data: {
        shop: {
          id: shop.id,
          shop_name: shop.shop_name,
          open_time: shop.open_time,
          close_time: shop.close_time,
          rating: shop.rating
        },
        service_types: formattedServices
      }
    });
  } catch (error: any) {
    console.error('Error fetching shop services:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ดึงรายการประเภทบริการทั้งหมดที่มีอยู่ในระบบ Supabase
export const getAllServiceTypes = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('service_type')
      .select('type');

    if (error) throw error;

    const uniqueTypes = Array.from(
      new Set((data || []).map((item: any) => item.type?.trim()).filter(Boolean))
    );

    return res.status(200).json({
      success: true,
      data: uniqueTypes,
    });
  } catch (error: any) {
    console.error('Error fetching service types:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};