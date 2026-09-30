import { Request, Response } from 'express';
import supabase from '../config/supabase.js';

// ==========================================
// 1. ดึงข้อมูลตะกร้าสินค้า (GET)
// ==========================================
export const getCart = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || (req.query.customer_id as string);
    const userLat = req.query.user_lat ? parseFloat(req.query.user_lat as string) : 13.7298;
    const userLng = req.query.user_lng ? parseFloat(req.query.user_lng as string) : 100.7782;

    if (!customerId) {
      return res.status(400).json({ success: false, message: "Missing customer_id" });
    }

    // 1. ดึง Cart ทั้งหมดของลูกค้า
    const { data: carts, error: cartError } = await supabase
      .from("cart")
      .select(`
        id,
        customer_id,
        shop_id,
        cart_item (
          id,
          category,
          selected_size,
          color_type,
          paper_type,
          finishing_option,
          quantity,
          unit_price,
          subtotal,
          file_url,
          page_count,
          side_type
        )
      `)
      .eq("customer_id", customerId);

    if (cartError) {
      console.error("Supabase getCart error:", cartError);
      throw cartError;
    }

    const activeCarts = (carts || []).filter((c: any) => c.cart_item && c.cart_item.length > 0);

    if (activeCarts.length === 0) {
      return res.status(200).json({
        success: true,
        data: { shops: [], total_items: 0, cart_items: [], cart_item: [] }
      });
    }

    // 2. ดึงข้อมูลร้านค้าจากตาราง print_shop แยกต่างหาก
    const shopIds = Array.from(new Set(activeCarts.map((c: any) => c.shop_id).filter(Boolean)));
    const { data: shopsData } = await supabase
      .from("print_shop")
      .select(`
        id,
        shop_name,
        profile_image,
        is_open,
        open_time,
        close_time,
        address:address_id (
          latitude,
          longitude
        )
      `)
      .in("id", shopIds);

    const shopMap = new Map((shopsData || []).map((s: any) => [s.id, s]));

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8);
    let totalItemsAllCarts = 0;
    const allCartItems: any[] = [];

    const groupedShops = activeCarts.map((c: any) => {
      const shop = shopMap.get(c.shop_id) as any;
      const items = c.cart_item || [];
      totalItemsAllCarts += items.length;
      allCartItems.push(...items);

      let isOpenNow = shop?.is_open !== false;
      if (isOpenNow && shop?.open_time && shop?.close_time) {
        if (shop.open_time <= shop.close_time) {
          isOpenNow = currentTime >= shop.open_time && currentTime <= shop.close_time;
        } else {
          isOpenNow = currentTime >= shop.open_time || currentTime <= shop.close_time;
        }
      }

      let distance: number | null = null;
      if (shop?.address?.latitude && shop?.address?.longitude) {
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
        cart_id: c.id,
        shop_id: c.shop_id,
        shop_name: shop?.shop_name || "ร้านค้างานพิมพ์",
        profile_image: shop?.profile_image || null,
        is_open: isOpenNow,
        open_time: shop?.open_time || null,
        close_time: shop?.close_time || null,
        distance: distance,
        items: items,
        total_price: items.reduce((sum: number, it: any) => sum + Number(it.subtotal || it.unit_price * it.quantity || 0), 0)
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        total_items: totalItemsAllCarts,
        shops: groupedShops,
        cart_items: allCartItems,
        cart_item: allCartItems
      },
    });
  } catch (error: any) {
    console.error("Get cart error details:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to load cart" });
  }
};


// ==========================================
// 2. เพิ่มสินค้าลงตะกร้า (addToCart)
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

    // 1. ตรวจสอบตะกร้าของร้านนี้
    let { data: cart, error: cartErr } = await supabase
      .from("cart")
      .select("id, shop_id")
      .eq("customer_id", actualCustomerId)
      .eq("shop_id", shop_id)
      .maybeSingle();

    if (cartErr) {
      console.error("Cart query error:", cartErr);
    }

    // 2. ถ้ายังไม่มีตะกร้าของร้านนี้ ให้สร้างใหม่
    if (!cart) {
      const { data: newCart, error: createCartErr } = await supabase
        .from("cart")
        .insert([{ customer_id: actualCustomerId, shop_id: shop_id }])
        .select("id, shop_id")
        .single();

      if (createCartErr) {
        console.error("Create cart error:", createCartErr);
        // Fallback: ดึง cart ที่เพิ่งสร้างเผื่อ query จังหวะแรกหลุด
        const { data: fallbackCart } = await supabase
          .from("cart")
          .select("id, shop_id")
          .eq("customer_id", actualCustomerId)
          .eq("shop_id", shop_id)
          .maybeSingle();
        cart = fallbackCart;
      } else {
        cart = newCart;
      }
    }

    if (!cart?.id) {
      return res.status(500).json({
        success: false,
        message: "ไม่สามารถสร้างหรือดึง Cart ID สำหรับร้านค้านี้ได้",
      });
    }

    // คำนวณตัวเลขให้ปลอดภัย ป้องกัน NaN
    const calculatedPages = parseInt(String(page_count || total_pages || 1), 10) || 1;
    const calculatedQuantity = parseInt(String(quantity || 1), 10) || 1;
    const rawPrice = unit_price !== undefined ? unit_price : price;
    const parsedUnitPrice = parseFloat(String(rawPrice || 0)) || 0;
    const calculatedSubtotal = parseFloat((calculatedQuantity * parsedUnitPrice).toFixed(2));

    // 3. เตรียมข้อมูล Insert ลง cart_item ให้ตรงตาม Schema ของ Supabase
    const itemPayload: any = {
      cart_id: cart.id,
      shop_id: shop_id,
      file_url: file_url || null,
      category: category || "งานพิมพ์",
      selected_size: selected_size || null,
      color_type: color_type || null,
      paper_type: paper_type || null,
      finishing_option: finishing_option || null,
      quantity: calculatedQuantity,
      unit_price: parsedUnitPrice,
      // subtotal: calculatedSubtotal,
      page_count: calculatedPages,
      side_type: side_type || "SINGLE",
      total_pages: calculatedPages,
    };

    console.log("กำลัง Insert cart_item:", itemPayload);

    const { data: itemData, error: itemErr } = await supabase
      .from("cart_item")
      .insert([itemPayload])
      .select()
      .single();

    if (itemErr) {
      console.error("❌ Insert cart_item error จาก Supabase:", itemErr);
      return res.status(500).json({
        success: false,
        message: itemErr.message,
        details: itemErr,
      });
    }

    console.log("✅ เพิ่มสินค้าลง cart_item สำเร็จ:", itemData);

    return res.status(200).json({
      success: true,
      data: itemData,
    });
  } catch (error: any) {
    console.error("Add to cart fatal error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า",
    });
  }
};

// ==========================================
// 3. ลบตะกร้าสินค้า (DELETE)
// ==========================================
export const clearCart = async (req: Request, res: Response) => {
  try {
    const customerId = (req as any).user?.id || req.body.customer_id;
    const { shop_id } = req.body;

    if (!customerId) {
      return res.status(400).json({ success: false, message: "Missing customer_id" });
    }

    if (shop_id) {
      const { data: targetCart } = await supabase
        .from("cart")
        .select("id")
        .eq("customer_id", customerId)
        .eq("shop_id", shop_id)
        .maybeSingle();

      if (targetCart) {
        await supabase.from("cart_item").delete().eq("cart_id", targetCart.id);
        await supabase.from("cart").delete().eq("id", targetCart.id);
      }
    } else {
      const { data: allCarts } = await supabase
        .from("cart")
        .select("id")
        .eq("customer_id", customerId);

      if (allCarts && allCarts.length > 0) {
        const cartIds = allCarts.map((c) => c.id);
        await supabase.from("cart_item").delete().in("cart_id", cartIds);
        await supabase.from("cart").delete().eq("customer_id", customerId);
      }
    }

    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error: any) {
    console.error("Clear cart error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. ลบสินค้าชิ้นเดียวออกจากตะกร้า
// ==========================================
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const { data: deletedItem, error } = await supabase
      .from("cart_item")
      .delete()
      .eq("id", itemId)
      .select("cart_id")
      .maybeSingle();

    if (error) throw error;

    if (deletedItem?.cart_id) {
      const { count } = await supabase
        .from("cart_item")
        .select("*", { count: "exact", head: true })
        .eq("cart_id", deletedItem.cart_id);

      if (count === 0) {
        await supabase.from("cart").delete().eq("id", deletedItem.cart_id);
      }
    }

    return res.status(200).json({ success: true, message: "ลบรายการสำเร็จ" });
  } catch (error: any) {
    console.error("Remove cart item error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};