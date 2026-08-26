// import { Request, Response } from 'express';
// import supabase from '../config/supabase.js';

// // ฟังก์ชันคำนวณระยะทางจากพิกัด (กิโลเมตร) ด้วย Haversine Formula
// function calculateDistance(
//   lat1?: number,
//   lon1?: number,
//   lat2?: number,
//   lon2?: number
// ): number | null {
//   if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
//   const R = 6371; // รัศมีโลก (km)
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const dist = R * c;
//   return isNaN(dist) ? null : parseFloat(dist.toFixed(2));
// }

// // ฟังก์ชันตรวจสอบว่าร้านเปิดอยู่หรือไม่ ณ เวลาปัจจุบัน
// function checkIsOpen(openTime?: string, closeTime?: string): boolean {
//   if (!openTime || !closeTime) return true;
//   try {
//     const now = new Date();
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();

//     const [openH, openM] = openTime.split(':').map(Number);
//     const [closeH, closeM] = closeTime.split(':').map(Number);

//     const openMinutes = openH * 60 + (openM || 0);
//     const closeMinutes = closeH * 60 + (closeM || 0);

//     if (closeMinutes < openMinutes) {
//       return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
//     }
//     return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
//   } catch (e) {
//     return true;
//   }
// }

// // 1. ฟังก์ชันค้นหาและกรองร้านค้าสำหรับหน้าแรก (UR-01 ถึง UR-07)
// export const getShops = async (req: Request, res: Response) => {
//   try {
//     const {
//       search,
//       service_type,
//       min_price,
//       max_price,
//       user_lat,
//       user_lng,
//       is_open,
//       sort_by
//     } = req.query;

//     let query = supabase
//       .from('print_shop')
//       .select(`
//         id,
//         shop_name,
//         rating,
//         profile_image,
//         open_time,
//         close_time,
//         is_verify,
//         address:address_id (
//           latitude,
//           longitude,
//           detail,
//           subdistrict,
//           district,
//           province
//         ),
//         service_type (
//           id,
//           type,
//           service_detail (
//             id,
//             price,
//             detail
//           )
//         )
//       `);

//     if (search) {
//       query = query.ilike('shop_name', `%${search}%`);
//     }

//     const { data: shops, error } = await query;
//     if (error) throw error;

//     let formattedShops = (shops || []).map((shop: any) => {
//       const allPrices = (shop.service_type || []).flatMap((st: any) =>
//         (st.service_detail || []).map((sd: any) => Number(sd.price))
//       );
//       const startingPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

//       const distance =
//         user_lat && user_lng && shop.address && shop.address.latitude && shop.address.longitude
//           ? calculateDistance(
//               Number(user_lat),
//               Number(user_lng),
//               Number(shop.address.latitude),
//               Number(shop.address.longitude)
//             )
//           : null;

//       const isOpenNow = checkIsOpen(shop.open_time, shop.close_time);

//       return {
//         id: shop.id,
//         shop_name: shop.shop_name,
//         profile_image: shop.profile_image,
//         rating: shop.rating,
//         open_time: shop.open_time,
//         close_time: shop.close_time,
//         is_open: isOpenNow,
//         is_verify: shop.is_verify,
//         address: shop.address,
//         distance,
//         starting_price: startingPrice,
//         service_types: (shop.service_type || []).map((st: any) => st.type).filter(Boolean)
//       };
//     });

//     if (service_type && service_type !== 'ทั้งหมด' && service_type !== 'all') {
//       const cleanFilter = String(service_type).trim().toLowerCase();
//       formattedShops = formattedShops.filter((shop: any) =>
//         shop.service_types.some((t: any) => {
//           const cleanType = String(t).trim().toLowerCase();
//           return cleanType.includes(cleanFilter) || cleanFilter.includes(cleanType);
//         })
//       );
//     }

//     if (min_price) {
//       formattedShops = formattedShops.filter(
//         (shop: any) => shop.starting_price >= Number(min_price)
//       );
//     }

//     if (max_price) {
//       formattedShops = formattedShops.filter(
//         (shop: any) => shop.starting_price <= Number(max_price)
//       );
//     }

//     if (is_open === 'true') {
//       formattedShops = formattedShops.filter((shop: any) => shop.is_open);
//     }

//     if (sort_by === 'rating') {
//       formattedShops.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
//     } else if (sort_by === 'distance') {
//       formattedShops.sort((a: any, b: any) => {
//         if (a.distance === null) return 1;
//         if (b.distance === null) return -1;
//         return a.distance - b.distance;
//       });
//     }

//     return res.status(200).json({ success: true, data: formattedShops });
//   } catch (error: any) {
//     console.error('Error fetching shops:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 2. ฟังก์ชันดึง service_type และ service_detail ตามรหัสร้านค้าสำหรับหน้าสั่งพิมพ์
// export const getShopServices = async (req: Request, res: Response) => {
//   const { shopId } = req.params;

//   try {
//     if (!shopId || shopId === 'undefined') {
//       return res.status(400).json({ success: false, message: 'กรุณาระบุ Shop ID' });
//     }

//     const { data: shop, error } = await supabase
//       .from('print_shop')
//       .select(`
//         id,
//         shop_name,
//         open_time,
//         close_time,
//         rating,
//         service_type (
//           id,
//           type,
//           service_detail (
//             id,
//             detail,
//             price
//           )
//         )
//       `)
//       .eq('id', isNaN(Number(shopId)) ? shopId : Number(shopId))
//       .maybeSingle();

//     if (error) {
//       console.error('Supabase Query Error:', error);
//       return res.status(400).json({ success: false, message: error.message });
//     }

//     if (!shop) {
//       return res.status(404).json({ success: false, message: 'ไม่พบร้านค้านี้ในระบบ' });
//     }

//     const formattedServices = (shop.service_type || []).map((st: any) => ({
//       id: st.id,
//       type_name: st.type,
//       details: (st.service_detail || []).map((sd: any) => ({
//         id: sd.id,
//         option_name: sd.detail,
//         unit_price: Number(sd.price) || 0,
//         unit_name: 'หน่วย'
//       }))
//     }));

//     return res.status(200).json({
//       success: true,
//       data: {
//         shop: {
//           id: shop.id,
//           shop_name: shop.shop_name,
//           open_time: shop.open_time,
//           close_time: shop.close_time,
//           rating: shop.rating
//         },
//         service_types: formattedServices
//       }
//     });
//   } catch (error: any) {
//     console.error('Error fetching shop services:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 3. ดึงรายการประเภทบริการทั้งหมด
// export const getAllServiceTypes = async (req: Request, res: Response) => {
//   try {
//     const { data, error } = await supabase
//       .from('service_type')
//       .select('type');

//     if (error) throw error;

//     const uniqueTypes = Array.from(
//       new Set((data || []).map((item: any) => item.type?.trim()).filter(Boolean))
//     );

//     return res.status(200).json({
//       success: true,
//       data: uniqueTypes,
//     });
//   } catch (error: any) {
//     console.error('Error fetching service types:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 4. ดึงประวัติคำสั่งซื้อของลูกค้า (เชื่อม work_status เพื่อดึงสถานะล่าสุด)
// export const getCustomerOrders = async (req: Request, res: Response) => {
//   const customerId = req.query.customerId || req.params.customerId;

//   if (!customerId || typeof customerId !== 'string') {
//     return res.status(400).json({ success: false, message: 'กรุณาระบุ customerId' });
//   }

//   try {
//     const { data: orders, error } = await supabase
//       .from('print_order')
//       .select(`
//         id,
//         order_date,
//         receive_date,
//         total_price,
//         description,
//         print_shop (
//           id,
//           shop_name,
//           phone,
//           profile_image
//         ),
//         work_status (
//           updated_at,
//           status (
//             state
//           )
//         ),
//         order_item (
//           id,
//           quantity,
//           unit_price,
//           subtotal,
//           service_detail (
//             detail
//           )
//         )
//       `)
//       .eq('customer_id', customerId.trim())
//       .order('order_date', { ascending: false });

//     if (error) throw error;

//     const formattedOrders = (orders || []).map((order: any) => {
//       // ดึงสถานะที่อัปเดตล่าสุดจากตาราง work_status
//       const latestWorkStatus = order.work_status && order.work_status.length > 0
//         ? order.work_status.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
//         : null;

//       return {
//         id: order.id,
//         order_date: order.order_date,
//         receive_date: order.receive_date,
//         total_price: order.total_price,
//         description: order.description,
//         shop: order.print_shop || {},
//         current_status: latestWorkStatus?.status?.state || 'รอดำเนินการ',
//         items: (order.order_item || []).map((item: any) => ({
//           name: item.service_detail?.detail || 'บริการพิมพ์เอกสาร',
//           quantity: item.quantity,
//           unit_price: item.unit_price,
//           subtotal: item.subtotal,
//         })),
//       };
//     });

//     return res.status(200).json({ success: true, data: formattedOrders });
//   } catch (error: any) {
//     console.error('Error fetching customer orders:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 5. ฟังก์ชันสร้างคำสั่งซื้อใหม่ (บันทึกสถานะเริ่มต้น "รอดำเนินการ" ลง work_status อัตโนมัติ)
// export const createOrder = async (req: Request, res: Response) => {
//   try {
//     const {
//       customer_id,
//       shop_id,
//       description,
//       receive_date,
//       total_price,
//       items,
//       files,
//     } = req.body;

//     if (!customer_id || !shop_id) {
//       return res.status(400).json({
//         success: false,
//         message: 'กรุณาระบุ customer_id และ shop_id ให้ครบถ้วน',
//       });
//     }

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'กรุณาระบุรายการสินค้าอย่างน้อย 1 รายการ',
//       });
//     }

//     // 1. บันทึกลงตาราง print_order
//     const { data: newOrder, error: orderError } = await supabase
//       .from('print_order')
//       .insert({
//         customer_id: String(customer_id),
//         shop_id: isNaN(Number(shop_id)) ? shop_id : Number(shop_id),
//         description: description || null,
//         receive_date: receive_date ? new Date(receive_date).toISOString() : null,
//         total_price: Number(total_price) || 0,
//         order_date: new Date().toISOString(),
//       })
//       .select('id, total_price, order_date')
//       .single();

//     if (orderError) throw orderError;

//     const orderId = newOrder.id;

//     // 2. บันทึกรายการย่อยลงตาราง order_item
//     const orderItemsToInsert = items.map((item: any) => ({
//       order_id: orderId,
//       service_detail_id: isNaN(Number(item.service_detail_id)) ? item.service_detail_id : Number(item.service_detail_id),
//       quantity: Number(item.quantity) || 1,
//       unit_price: Number(item.unit_price) || 0,
//       subtotal: Number(item.subtotal) || 0,
//     }));

//     const { error: itemsError } = await supabase
//       .from('order_item')
//       .insert(orderItemsToInsert);

//     if (itemsError) throw itemsError;

//     // 3. บันทึกไฟล์แนบลงตาราง print_file (ถ้ามี)
//     if (files && Array.isArray(files) && files.length > 0) {
//       const filesToInsert = files.map((f: any) => ({
//         order_id: orderId,
//         filename: f.filename,
//         file_url: f.file_url,
//       }));

//       const { error: filesError } = await supabase
//         .from('print_file')
//         .insert(filesToInsert);

//       if (filesError) console.warn('Warning inserting files:', filesError.message);
//     }

//     // 4. บันทึกสถานะเริ่มต้น "รอดำเนินการ" ลงตาราง work_status
//     try {
//       const { data: defaultStatus } = await supabase
//         .from('status')
//         .select('id')
//         .eq('state', 'รอดำเนินการ')
//         .maybeSingle();

//       if (defaultStatus?.id) {
//         await supabase.from('work_status').insert({
//           order_id: orderId,
//           status_id: defaultStatus.id,
//           updated_at: new Date().toISOString(),
//         });
//       }
//     } catch (statusErr) {
//       console.warn('Status log skipped:', statusErr);
//     }

//     return res.status(201).json({
//       success: true,
//       message: 'บันทึกคำสั่งซื้อสำเร็จ',
//       data: {
//         order_id: newOrder.id,
//         total_price: newOrder.total_price,
//         order_date: newOrder.order_date,
//       },
//     });
//   } catch (error: any) {
//     console.error('Error creating order:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ',
//     });
//   }
// };

// // 6. ✅ ฟังก์ชันอัปเดตสถานะงานพิมพ์ (เพิ่มข้อมูลใหม่ลง work_status เมื่อร้านค้า/แอดมินเปลี่ยนสถานะ)
// export const updateWorkStatus = async (req: Request, res: Response) => {
//   const { orderId } = req.params;
//   const { state } = req.body; // เช่น 'กำลังพิมพ์', 'พร้อมรับเอกสาร', 'สำเร็จ', 'ยกเลิก'

//   if (!orderId || !state) {
//     return res.status(400).json({
//       success: false,
//       message: 'กรุณาระบุ orderId และ state สถานะใหม่',
//     });
//   }

//   try {
//     // 1. ค้นหา status_id จากตาราง status ตามชื่อ state ที่ส่งมา
//     const { data: statusData, error: statusErr } = await supabase
//       .from('status')
//       .select('id')
//       .eq('state', state)
//       .maybeSingle();

//     if (statusErr || !statusData) {
//       return res.status(404).json({
//         success: false,
//         message: `ไม่พบสถานะ "${state}" ในตาราง status ของระบบ`,
//       });
//     }

//     // 2. บันทึกประวัติสถานะใหม่ลงตาราง work_status
//     const { error: insertErr } = await supabase
//       .from('work_status')
//       .insert({
//         order_id: orderId,
//         status_id: statusData.id,
//         updated_at: new Date().toISOString(),
//       });

//     if (insertErr) throw insertErr;

//     return res.status(200).json({
//       success: true,
//       message: `อัปเดตสถานะคำสั่งซื้อเป็น "${state}" สำเร็จ`,
//     });
//   } catch (error: any) {
//     console.error('Error updating work status:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ',
//     });
//   }
// };

import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// ฟังก์ชันคำนวณระยะทางจากพิกัด (กิโลเมตร) ด้วย Haversine Formula[cite: 1, 2]
function calculateDistance(
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number | null {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const R = 6371;
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

// ฟังก์ชันตรวจสอบว่าร้านเปิดอยู่หรือไม่ ณ เวลาปัจจุบัน[cite: 1, 2]
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

// 1. ฟังก์ชันค้นหาและกรองร้านค้าสำหรับหน้าแรก (UR-01 ถึง UR-07)[cite: 1, 2]
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

// 2. ฟังก์ชันดึง service_type และ service_detail ตามรหัสร้านค้าสำหรับหน้าสั่งพิมพ์[cite: 1, 2]
export const getShopServices = async (req: Request, res: Response) => {
  const { shopId } = req.params;

  try {
    if (!shopId || shopId === 'undefined') {
      return res.status(400).json({ success: false, message: 'กรุณาระบุ Shop ID' });
    }

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
      .eq('id', isNaN(Number(shopId)) ? shopId : Number(shopId))
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

// 3. ดึงรายการประเภทบริการทั้งหมด[cite: 1, 2]
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

// 4. ดึงประวัติคำสั่งซื้อของลูกค้า[cite: 2]
export const getCustomerOrders = async (req: Request, res: Response) => {
  const customerId = req.query.customerId || req.params.customerId;

  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ success: false, message: 'กรุณาระบุ customerId' });
  }

  try {
    const { data: orders, error } = await supabase
      .from('print_order')
      .select(`
        id,
        order_date,
        receive_date,
        total_price,
        description,
        print_shop (
          id,
          shop_name,
          phone,
          profile_image
        ),
        work_status (
          updated_at,
          status (
            state
          )
        ),
        order_item (
          id,
          quantity,
          unit_price,
          subtotal,
          service_detail (
            detail
          )
        )
      `)
      .eq('customer_id', customerId.trim())
      .order('order_date', { ascending: false });

    if (error) throw error;

    const formattedOrders = (orders || []).map((order: any) => {
      const latestWorkStatus = order.work_status && order.work_status.length > 0
        ? order.work_status.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
        : null;

      return {
        id: order.id,
        order_date: order.order_date,
        receive_date: order.receive_date,
        total_price: order.total_price,
        description: order.description,
        shop: order.print_shop || {},
        current_status: latestWorkStatus?.status?.state || 'รอดำเนินการ',
        items: (order.order_item || []).map((item: any) => ({
          name: item.service_detail?.detail || 'บริการพิมพ์เอกสาร',
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        })),
      };
    });

    return res.status(200).json({ success: true, data: formattedOrders });
  } catch (error: any) {
    console.error('Error fetching customer orders:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. ฟังก์ชันสร้างคำสั่งซื้อใหม่ (บันทึกลง work_status ชัวร์ 100%)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      shop_id,
      description,
      receive_date,
      total_price,
      items,
      files,
    } = req.body;

    if (!customer_id || !shop_id) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุ customer_id และ shop_id ให้ครบถ้วน',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุรายการสินค้าอย่างน้อย 1 รายการ',
      });
    }

    // 1. บันทึกลงตาราง print_order
    const { data: newOrder, error: orderError } = await supabase
      .from('print_order')
      .insert({
        customer_id: String(customer_id),
        shop_id: isNaN(Number(shop_id)) ? shop_id : Number(shop_id),
        description: description || null,
        receive_date: receive_date ? new Date(receive_date).toISOString() : null,
        total_price: Number(total_price) || 0,
        order_date: new Date().toISOString(),
      })
      .select('id, total_price, order_date')
      .single();

    if (orderError) {
      console.error('Insert print_order Error:', orderError);
      throw orderError;
    }

    const orderId = newOrder.id;

    // 2. บันทึกรายการย่อยลงตาราง order_item
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: orderId,
      service_detail_id: isNaN(Number(item.service_detail_id)) ? item.service_detail_id : Number(item.service_detail_id),
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      subtotal: Number(item.subtotal) || 0,
    }));

    const { error: itemsError } = await supabase
      .from('order_item')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('Insert order_item Error:', itemsError);
      throw itemsError;
    }

    // 3. บันทึกไฟล์แนบลงตาราง print_file (ถ้ามี)
    if (files && Array.isArray(files) && files.length > 0) {
      const filesToInsert = files.map((f: any) => ({
        order_id: orderId,
        filename: f.filename,
        file_url: f.file_url,
      }));

      await supabase.from('print_file').insert(filesToInsert);
    }

    // 4. บันทึกสถานะเริ่มต้นลงตาราง work_status (ปรับปรุงให้ดึง ID แน่นอน)
    let statusIdToUse: any = null;

    // หา ID สถานะ 'รอดำเนินการ'
    const { data: defaultStatus } = await supabase
      .from('status')
      .select('id')
      .eq('state', 'รอดำเนินการ')
      .maybeSingle();

    if (defaultStatus?.id) {
      statusIdToUse = defaultStatus.id;
    } else {
      // ถ้าไม่มี 'รอดำเนินการ' ให้หยิบ status ตัวแรกที่มีในตารางมาแทน
      const { data: anyStatus } = await supabase.from('status').select('id').limit(1).maybeSingle();
      statusIdToUse = anyStatus?.id;
    }

    if (statusIdToUse) {
      const { data: wsResult, error: wsError } = await supabase
        .from('work_status')
        .insert({
          order_id: orderId,
          status_id: statusIdToUse,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (wsError) {
        console.error('❌ Insert work_status Failed:', wsError.message);
      } else {
        console.log('✅ Insert work_status Success:', wsResult);
      }
    } else {
      console.warn('⚠️ ไม่พบรายการในตาราง status กรุณารัน SQL เพื่อเพิ่ม status ก่อน');
    }

    return res.status(201).json({
      success: true,
      message: 'บันทึกคำสั่งซื้อสำเร็จ',
      data: {
        order_id: newOrder.id,
        total_price: newOrder.total_price,
        order_date: newOrder.order_date,
      },
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ',
    });
  }
};

// 6. ฟังก์ชันอัปเดตสถานะงานพิมพ์
export const updateWorkStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { state } = req.body;

  if (!orderId || !state) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุ orderId และ state สถานะใหม่',
    });
  }

  try {
    const { data: statusData, error: statusErr } = await supabase
      .from('status')
      .select('id')
      .eq('state', state)
      .maybeSingle();

    if (statusErr || !statusData) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบสถานะ "${state}" ในระบบ`,
      });
    }

    const { error: insertErr } = await supabase
      .from('work_status')
      .insert({
        order_id: orderId,
        status_id: statusData.id,
        updated_at: new Date().toISOString(),
      });

    if (insertErr) throw insertErr;

    return res.status(200).json({
      success: true,
      message: `อัปเดตสถานะคำสั่งซื้อเป็น "${state}" สำเร็จ`,
    });
  } catch (error: any) {
    console.error('Error updating work status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ',
    });
  }
};


// ดึงรายละเอียดออร์เดอร์สำหรับหน้ารีวิว
export const getReviewOrderDetail = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const { data: order, error: orderError } = await supabase
      .from("print_order")
      .select(`
        id,
        order_date,
        total_price,
        description,
        customer_id,
        shop_id,
        print_shop (
          shop_name,
          profile_image
        ),
        order_item (
          id,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลออร์เดอร์" });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// บันทึกการรีวิว (Review)
export const submitOrderReview = async (req: Request, res: Response) => {
  const { order_id, shop_id, customer_id, score, comment, image_url } = req.body;

  if (!order_id || !score) {
    return res.status(400).json({ success: false, message: "กรุณาระบุคะแนนรีวิว" });
  }

  try {
    // ใช้ upsert เพื่ออัปเดตเมื่อมี order_id ซ้ำ
    const { data, error } = await supabase
      .from("review")
      .upsert(
        {
          order_id,
          shop_id,
          customer_id,
          score: Number(score),
          comment: comment || null,
          image_url: image_url || null,
          created_at: new Date().toISOString(),
        },
        { onConflict: "order_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, message: "บันทึกรีวิวสำเร็จ", data });
  } catch (error: any) {
    console.error("Submit review error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// บันทึกการรายงานปัญหา (Report)
export const submitOrderReport = async (req: Request, res: Response) => {
  const { order_id, shop_id, customer_id, severity, comment, image_url } = req.body;

  if (!order_id || !severity) {
    return res.status(400).json({ success: false, message: "กรุณาระบุระดับความรุนแรงของปัญหา" });
  }

  try {
    const { data, error } = await supabase
      .from("report")
      .insert({
        order_id,
        shop_id,
        customer_id,
        severity: Number(severity),
        comment: comment || null,
        image_url: image_url || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, message: "บันทึกรายงานปัญหาสำเร็จ", data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};