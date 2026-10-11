"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Star } from "lucide-react";

import NavBar from "../../../../component/customer/NavBar";
import ShopHeaderCard from "../../../../component/customer/shop/ShopHeaderCard";
import ServiceMenuGrid, { ServiceType } from "../../../../component/customer/shop/ServiceMenuGrid";
import ServiceOptionModal from "../../../../component/customer/shop/ServiceOptionModal";
import ShopCartDrawer, { CartItem } from "../../../../component/customer/shop/ShopCartDrawer";
import ShopCartBottomBar from "../../../../component/customer/shop/ShopCartBottomBar";
import ShopBackButton from "../../../../component/customer/shop/ShopBackButton";
import { checkIsShopOpen } from "../../../../component/customer/ShopCard";

export default function ShopMainPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const shopId = (params?.shop_id || params?.id || "") as string;

  const [shop, setShop] = useState<any>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalCartCount, setTotalCartCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const [customerId, setCustomerId] = useState<string>("");

  useEffect(() => {
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id");
    if (cid && !cid.startsWith("customer_")) {
      setCustomerId(cid);
    } else {
      router.push("/auth");
    }
  }, [router]);

  useEffect(() => {
    if (searchParams.get("openCart") === "true") {
      setIsCartOpen(true);
    }
  }, [searchParams]);

  const isShopOpen = useMemo(() => {
    if (!shop) return true;
    try {
      return checkIsShopOpen(shop);
    } catch {
      return shop.is_open ?? true;
    }
  }, [shop]);

  const loadData = async (cid: string) => {
    if (!shopId) return;
    try {
      setLoading(true);

      const resServices = await fetch(
        `http://localhost:5000/api/customer/shops/${shopId}/services`
      );
      const jsonServices = await resServices.json();

      if (jsonServices.success && jsonServices.data) {
        setShop(jsonServices.data.shop || jsonServices.data);
        setServices(
          jsonServices.data.service_types ||
          jsonServices.data.services ||
          []
        );
      }

      if (cid) {
        const resCart = await fetch(
          `http://localhost:5000/api/customer/cart?customer_id=${cid}`
        );
        const jsonCart = await resCart.json();

        if (jsonCart.success && jsonCart.data) {
          let globalTotal = 0;
          if (typeof jsonCart.data.total_items === "number") {
            globalTotal = jsonCart.data.total_items;
          } else if (Array.isArray(jsonCart.data.shops)) {
            globalTotal = jsonCart.data.shops.reduce(
              (sum: number, s: any) => sum + (s.items?.length || 0),
              0
            );
          } else if (Array.isArray(jsonCart.data.cart_items)) {
            globalTotal = jsonCart.data.cart_items.length;
          }
          setTotalCartCount(globalTotal);

          let currentShopItems: any[] = [];
          if (Array.isArray(jsonCart.data.shops)) {
            const currentShop = jsonCart.data.shops.find(
              (s: any) => String(s.shop_id).trim() === String(shopId).trim()
            );
            currentShopItems = currentShop ? currentShop.items || [] : [];
          } else if (Array.isArray(jsonCart.data.cart_items)) {
            currentShopItems = jsonCart.data.cart_items.filter(
              (it: any) => String(it.shop_id).trim() === String(shopId).trim()
            );
          } else if (Array.isArray(jsonCart.data.cart_item)) {
            currentShopItems = jsonCart.data.cart_item.filter(
              (it: any) => String(it.shop_id).trim() === String(shopId).trim()
            );
          }

          setCartItems(currentShopItems);
        } else {
          setCartItems([]);
          setTotalCartCount(0);
        }
      }
    } catch (err) {
      console.error("Load shop data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId && customerId) {
      loadData(customerId);
    }
  }, [shopId, customerId]);

  const handleAddToCart = async (itemPayload: any) => {
    try {
      const qty = Number(itemPayload.quantity) || 1;
      const unitPrice = Number(itemPayload.unit_price) || 0;
      const extractedPages =
        Number(itemPayload.page_count || itemPayload.total_pages || itemPayload.pages_per_set) || 1;

      const payload = {
        customer_id: customerId,
        shop_id: shopId,
        file_url: itemPayload.file_url || null,
        category: itemPayload.category || "งานพิมพ์",
        selected_size: itemPayload.selected_size || null,
        color_type: itemPayload.color_type || null,
        paper_type: itemPayload.paper_type || null,
        finishing_option: itemPayload.finishing_option || null,
        quantity: qty,
        unit_price: unitPrice,
        price: unitPrice,
        subtotal: itemPayload.subtotal || unitPrice * qty,
        total_pages: extractedPages,
        page_count: extractedPages,
        side_type: itemPayload.finishing_option?.includes("หน้า-หลัง") ? "DOUBLE" : "SINGLE",
      };

      // หากเป็นการแก้ไข ให้ลบรายการเดิมออกก่อนแล้วเพิ่มตัวใหม่
      if (editingCartItem?.id) {
        await fetch(`http://localhost:5000/api/customer/cart/item/${editingCartItem.id}`, {
          method: "DELETE",
        });
      }

      const res = await fetch("http://localhost:5000/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.warn(json.message);
        return;
      }

      setSelectedService(null);
      setEditingCartItem(null);

      if (customerId) {
        await loadData(customerId);
      }
    } catch (err) {
      console.error("Add item to cart error:", err);
    }
  };

  // ดึงบริการที่สอดคล้องเพื่อเปิด Modal แก้ไข
  const handleEditCartItem = (item: CartItem) => {
    // 1. ปิดตะกร้าสินค้าทันที
    setIsCartOpen(false);

    // 2. ค้นหาบริการที่ตรงกัน
    const matchedService = services.find((s) => {
      const sName = (s.type_name || s.type || "").trim().toLowerCase();
      const catName = (item.category || "").trim().toLowerCase();
      return sName === catName || sName.includes(catName) || catName.includes(sName);
    });

    if (matchedService) {
      setEditingCartItem(item);
      setSelectedService(matchedService);
    } else if (services.length > 0) {
      setEditingCartItem(item);
      setSelectedService(services[0]);
    }
  };

  const handleClearCart = async () => {
    try {
      await fetch("http://localhost:5000/api/customer/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId, shop_id: shopId }),
      });
      setCartItems([]);
      if (customerId) loadData(customerId);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const handleRemoveCartItem = async (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await fetch(`http://localhost:5000/api/customer/cart/item/${itemId}`, {
        method: "DELETE",
      });
      if (customerId) loadData(customerId);
    } catch (err) {
      console.error("Delete cart item error:", err);
    }
  };

  const handleProceedToPayment = async (appointmentData: any) => {
    if (!shopId || !cartItems || cartItems.length === 0) return;

    const formattedItems = cartItems.map((item: any) => {
      const itemSubtotal =
        Number(item.subtotal) || Number(item.unit_price * item.quantity) || 0;
      const itemPages =
        Number(item.page_count || item.total_pages || item.pages_per_set) || 1;

      return {
        fileName: item.category || "งานพิมพ์เอกสาร",
        paperSize: item.paper_type || item.selected_size || "A4",
        colorType: item.color_type || "สี/ขาวดำ",
        printSide: item.finishing_option || "ไม่มี",
        pagesPerSet: itemPages,
        pricePerPage: item.unit_price || 0,
        quantity: item.quantity || 1,
        totalPrice: itemSubtotal,
      };
    });

    const fallbackOrderId = "ORDER-" + Date.now();
    const pendingOrderPayload = {
      id: fallbackOrderId,
      items: formattedItems,
      services: [],
      smallOrderFeeThreshold: 50,
    };

    sessionStorage.setItem("pending_order_data", JSON.stringify(pendingOrderPayload));

    try {
      setIsSubmittingOrder(true);

      const res = await fetch("http://localhost:5000/api/customer/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          shop_id: shopId,
          description: appointmentData.description || "",
          receive_date: appointmentData.receive_date,
          appointment_time: appointmentData.appointment_time,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        console.warn("Order creation notice:", result.message || "ไม่สามารถสร้างคำสั่งซื้อได้");
        return;
      }

      const realOrderId = result.data?.order_id || result.data?.id || fallbackOrderId;
      const finalPrice =
        result.data?.total_price ||
        appointmentData.total_price ||
        formattedItems.reduce((a, b) => a + b.totalPrice, 0);
      const expiresAt = result.data?.expires_at || "";

      setCartItems([]);
      setIsCartOpen(false);
      setTotalCartCount(0);

      pendingOrderPayload.id = realOrderId;
      sessionStorage.setItem("pending_order_data", JSON.stringify(pendingOrderPayload));

      const queryParams = new URLSearchParams({
        totalPrice: String(finalPrice),
        ...(expiresAt ? { expiresAt } : {}),
      });

      router.push(`/customer/order/payment/${realOrderId}?${queryParams.toString()}`);
    } catch (err: any) {
      console.error("Order API exception:", err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const updatedShop = shop ? { ...shop, is_open: isShopOpen } : null;
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + (Number(item.subtotal) || Number(item.unit_price * item.quantity) || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <NavBar cartCount={totalCartCount} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 relative">
      <NavBar
        cartCount={totalCartCount}
        onOpenCart={() => router.push("/customer/cart")}
      />

      <div className="max-w-5xl mx-auto px-4 pt-6 relative">
        {/* 💡 แถวปุ่มย้อนกลับและปุ่มลิงก์ไปหน้าดูรีวิวร้านค้า */}
        <div className="flex items-center justify-between mb-2">
          <ShopBackButton />

          {shopId && (
            <Link
              href={`/customer/shop/${shopId}/reviews`}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>ดูรีวิวร้านค้า</span>
            </Link>
          )}
        </div>

        <main className="space-y-6">
          {updatedShop && <ShopHeaderCard shop={updatedShop} />}

          <ServiceMenuGrid
            services={services}
            onSelectService={(srv) => {
              setEditingCartItem(null);
              setSelectedService(srv);
            }}
          />
        </main>
      </div>

      <ShopCartBottomBar
        totalItems={cartItems.length}
        totalPrice={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {selectedService && (
        <ServiceOptionModal
          service={selectedService}
          initialItem={editingCartItem}
          onClose={() => {
            setSelectedService(null);
            setEditingCartItem(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      <ShopCartDrawer
        shop={updatedShop}
        cartItems={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onClearCart={handleClearCart}
        onEditItem={handleEditCartItem}
        onRemoveItem={handleRemoveCartItem}
        onProceedToPayment={handleProceedToPayment}
        isSubmitting={isSubmittingOrder}
      />
    </div>
  );
}