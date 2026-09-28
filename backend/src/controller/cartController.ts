import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// ==========================================
// 1. ดึงข้อมูลตะกร้าสินค้า
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
          is_open,
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
// 2. เพิ่มสินค้าลงตะกร้า
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
      price,
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
// 3. ล้างตะกร้าสินค้า
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