import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// ==========================================
// 1. ดึงรายชื่อร้านค้า (ตัด review_count ออก)
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

    let query = supabase
      .from('print_shop')
      .select(`
        id,
        shop_name,
        profile_image,
        open_time,
        close_time,
        rating,
        address:address_id (
          latitude,
          longitude
        )
      `);

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
      let isOpenNow = true;
      if (shop.open_time && shop.close_time) {
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
        review_count: 0, // กำหนดค่าเริ่มต้นเป็น 0
        open_time: shop.open_time,
        close_time: shop.close_time,
        is_open: isOpenNow,
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
// 2. ดึงประเภทงานพิมพ์ทั้งหมด (ดึงจาก service_type แทน)
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

    // 1. ดึงข้อมูลร้านค้า
    const { data: shop, error: shopError } = await supabase
      .from("print_shop")
      .select("id, shop_name, profile_image, open_time, close_time, rating")
      .eq("id", shopId)
      .maybeSingle();

    if (shopError) throw shopError;
    if (!shop) {
      return res.status(404).json({ success: false, message: "ไม่พบร้านค้านี้ในระบบ" });
    }

    // 2. ดึงประเภทบริการ (ตัดคอลัมน์ is_custom_size_allowed ออก)
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

// ==========================================
// 4. ดึงข้อมูลตะกร้าสินค้า
// ==========================================
export const getCart = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || (req.query.customer_id as string);
    const userLat = req.query.user_lat ? parseFloat(req.query.user_lat as string) : 13.7298;
    const userLng = req.query.user_lng ? parseFloat(req.query.user_lng as string) : 100.7782;

    if (!customerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing customer_id" 
      });
    }

    const { data: cart, error } = await supabase
      .from("cart")
      .select(`
        id,
        customer_id,
        shop_id,
        print_shop (
          id,
          shop_name,
          profile_image,
          rating,
          open_time,
          close_time,
          address:address_id (
            latitude,
            longitude,
            detail,
            subdistrict,
            district,
            province
          )
        ),
        cart_item (*)
      `)
      .eq("customer_id", customerId)
      .maybeSingle();

    if (error) throw error;

    if (!cart || !cart.print_shop) {
      return res.status(200).json({
        success: true,
        data: cart || { shop_id: null, cart_item: [] }
      });
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8);
    const shop = cart.print_shop as any;

    let isOpenNow = true;
    if (shop.open_time && shop.close_time) {
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

    const responseData = {
      ...cart,
      print_shop: {
        ...shop,
        is_open: isOpenNow,
        distance: distance
      }
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    console.error("Get cart error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. เพิ่มสินค้าลงตะกร้า
// ==========================================
export const addToCart = async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      shop_id,
      category,
      selected_size,
      color_type,
      paper_type,
      finishing_option,
      quantity,
      unit_price,
      price, // รับรองรับกรณี frontend ส่งมาชื่อ price
      file_url,
      total_pages,
      page_count,
      side_type,
    } = req.body;

    const actualCustomerId = (req as any).user?.id || customer_id;

    if (!actualCustomerId || !shop_id) {
      return res.status(400).json({
        success: false,
        message: "Missing customer_id or shop_id",
      });
    }

    let { data: cart, error: cartErr } = await supabase
      .from("cart")
      .select("*")
      .eq("customer_id", actualCustomerId)
      .maybeSingle();

    if (cartErr) throw cartErr;

    if (cart && cart.shop_id && String(cart.shop_id) !== String(shop_id)) {
      return res.status(409).json({
        success: false,
        message: "DIFFERENT_SHOP",
      });
    }

    if (!cart) {
      const { data: newCart, error: createCartErr } = await supabase
        .from("cart")
        .insert([{ customer_id: actualCustomerId, shop_id }])
        .select()
        .single();

      if (createCartErr) throw createCartErr;
      cart = newCart;
    }

    const calculatedPages = Number(page_count || total_pages) || 1;
    const calculatedQuantity = Number(quantity) || 1;
    
    // ตรวจสอบทั้ง unit_price และ price
    const rawPrice = unit_price !== undefined ? unit_price : price;
    const parsedUnitPrice = Number(rawPrice) || 0;

    const { data: itemData, error: itemErr } = await supabase
      .from("cart_item")
      .insert([
        {
          cart_id: cart.id,
          file_url: file_url || null,
          category: category || null,
          selected_size: selected_size || null,
          color_type: color_type || null,
          paper_type: paper_type || null,
          finishing_option: finishing_option || null,
          quantity: calculatedQuantity,
          unit_price: parsedUnitPrice,
          page_count: calculatedPages,
          side_type: side_type || "SINGLE",
        },
      ])
      .select()
      .single();

    if (itemErr) throw itemErr;

    return res.status(200).json({
      success: true,
      data: itemData,
    });
  } catch (error: any) {
    console.error("Add to cart error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. ล้างตะกร้าสินค้า
// ==========================================
export const clearCart = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;

    const { data: cart } = await supabase
      .from("cart")
      .select("id")
      .eq("customer_id", customerId)
      .maybeSingle();

    if (cart) {
      await supabase.from("cart_item").delete().eq("cart_id", cart.id);
      await supabase.from("cart").delete().eq("id", cart.id);
    }

    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error: any) {
    console.error("Clear cart error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. สั่งพิมพ์งาน (Checkout)
// ==========================================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { description, receive_date, appointment_time } = req.body;

    const { data: cart, error: cartError } = await supabase
      .from("cart")
      .select(`
        id,
        shop_id,
        cart_item (*)
      `)
      .eq("customer_id", customerId)
      .maybeSingle();

    if (cartError) throw cartError;
    if (!cart || !cart.shop_id || !cart.cart_item || cart.cart_item.length === 0) {
      return res.status(400).json({ success: false, message: "ไม่มีสินค้าในตะกร้า" });
    }

    const targetShopId = cart?.shop_id || req.body.shop_id;

    const { data: shop, error: shopError } = await supabase
      .from("print_shop")
      .select("open_time, close_time")
      .eq("id", targetShopId)
      .single();

    if (shopError || !shop) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลร้านค้า" });
    }

    if (appointment_time && shop.open_time && shop.close_time) {
      const reqTime = new Date(appointment_time).toTimeString().slice(0, 8);
      
      if (reqTime < shop.open_time || reqTime > shop.close_time) {
        return res.status(400).json({
          success: false,
          message: `เวลานัดหมายต้องอยู่ระหว่างเวลาทำการของร้าน (${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.)`
        });
      }
    }

    const pricing = calculateOrderPricing(cart.cart_item);

    const { data: statusRow } = await supabase
      .from("status")
      .select("id")
      .eq("state", "Pending")
      .maybeSingle();

    const { data: newOrder, error: orderError } = await supabase
      .from("print_order")
      .insert([
        {
          customer_id: customerId,
          shop_id: cart.shop_id,
          description: description || null,
          receive_date: receive_date || null,
          appointment_time: appointment_time || null,
          current_status_id: "8c416cf8-140c-4563-a912-6a4a6c0a4d9f",
          subtotal_price: pricing.subtotal_price,
          small_order_fee: pricing.small_order_fee,
          platform_fee: pricing.platform_fee,
          total_amount: pricing.net_total,
          total_price: pricing.net_total,
        },
      ])
      .select("id")
      .single();

    if (orderError) throw orderError;

    const orderItems = cart.cart_item.map((item: any) => ({
      order_id: newOrder.id,
      file_url: item.file_url,
      category: item.category,
      selected_size: item.selected_size,
      custom_width_cm: item.custom_width_cm,
      custom_height_cm: item.custom_height_cm,
      color_type: item.color_type,
      paper_type: item.paper_type,
      finishing_option: item.finishing_option,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal || item.quantity * item.unit_price,
      page_count: item.page_count || 1,
      side_type: item.side_type || "SINGLE",
    }));

    const { error: itemsError } = await supabase.from("print_order_item").insert(orderItems);
    if (itemsError) throw itemsError;

    if (statusRow?.id) {
      await supabase.from("work_status").insert([
        {
          order_id: newOrder.id,
          status_id: statusRow.id,
        },
      ]);
    }

    await supabase.from("cart_item").delete().eq("cart_id", cart.id);
    await supabase.from("cart").delete().eq("id", cart.id);

    return res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      data: { order_id: newOrder.id, total_price: pricing.net_total },
    });
  } catch (error: any) {
    console.error("Create order error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. ดึงประวัติคำสั่งซื้อ
// ==========================================
export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.query.customer_id;

    const { data: orders, error } = await supabase
      .from("print_order")
      .select(`
        id,
        order_no,
        total_price,
        order_date,
        receive_date,
        description,
        print_shop (
          id,
          shop_name,
          profile_image
        ),
        print_order_item (*),
        status:current_status_id (
          id,
          state
        )
      `)
      .eq("customer_id", customerId)
      .order("order_date", { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data: orders || [] });
  } catch (error: any) {
    console.error("Get customer orders error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. อัปเดตสถานะงานพิมพ์
// ==========================================
export const updateWorkStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status_id } = req.body;

    const { error: logError } = await supabase.from("work_status").insert([
      {
        order_id: orderId,
        status_id,
      },
    ]);
    if (logError) throw logError;

    const { error: orderError } = await supabase
      .from("print_order")
      .update({ current_status_id: status_id })
      .eq("id", orderId);

    if (orderError) throw orderError;

    return res.status(200).json({ success: true, message: "อัปเดตสถานะเรียบร้อยแล้ว" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 10. ดึงรายละเอียดออเดอร์สำหรับหน้ารีวิว
// ==========================================
export const getReviewOrderDetail = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabase
      .from("print_order")
      .select(`
        id,
        order_date,
        total_price,
        description,
        print_shop (
          id,
          shop_name,
          profile_image
        ),
        print_order_item (*)
      `)
      .eq("id", orderId)
      .maybeSingle();

    if (error) throw error;
    if (!order) return res.status(404).json({ success: false, message: "ไม่พบข้อมูลออเดอร์" });

    return res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 11. ส่งรีวิว
// ==========================================
export const submitOrderReview = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { order_id, shop_id, score, comment, image_url } = req.body;

    const { error } = await supabase.from("review").insert([
      {
        customer_id: customerId,
        order_id,
        shop_id,
        score: Number(score),
        comment: comment || null,
        image_url: image_url || null,
      },
    ]);

    if (error) throw error;

    return res.status(201).json({ success: true, message: "ส่งรีวิวสำเร็จ ขอบคุณสำหรับข้อเสนอแนะ" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 12. ส่งรายงานปัญหา
// ==========================================
export const submitOrderReport = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { order_id, shop_id, admin_id, description, image_url } = req.body;

    const { error } = await supabase.from("report").insert([
      {
        customer_id: customerId,
        order_id: order_id || null,
        shop_id,
        admin_id,
        description,
        image_url: image_url || null,
      },
    ]);

    if (error) throw error;

    return res.status(201).json({ success: true, message: "ส่งรายงานปัญหาเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบ" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// คำนวณราคา
// ==========================================
export const calculateOrderPricing = (items: Array<any>) => {
  const subtotal = items.reduce((sum, item) => {
    const pages = Number(item.page_count || item.total_pages) || 1;
    const qty = Number(item.quantity) || 1;
    const price = Number(item.unit_price) || 0;
    return sum + (price * pages * qty);
  }, 0);

  let smallOrderFee = 0;
  let platformFee = 0;

  if (subtotal < 50) {
    smallOrderFee = 20;
    platformFee = 0;
  } else {
    smallOrderFee = 0;
    platformFee = Number((subtotal * 0.08).toFixed(2));
  }

  const netTotal = subtotal + smallOrderFee;

  return {
    subtotal_price: subtotal,
    small_order_fee: smallOrderFee,
    platform_fee: platformFee,
    net_total: netTotal
  };
};