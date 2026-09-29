"use client";
import { supabase } from "@/config/supabase";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";

import NavBar from "../../../../component/customer/NavBar";
import ShopHeaderCard from "../../../../component/customer/shop/ShopHeaderCard";
import ServiceMenuGrid, { ServiceType } from "../../../../component/customer/shop/ServiceMenuGrid";
import ServiceOptionModal from "../../../../component/customer/shop/ServiceOptionModal";
import ShopCartDrawer, { CartItem } from "../../../../component/customer/shop/ShopCartDrawer";
import { checkIsShopOpen } from "../../../../component/customer/ShopCard";

export default function ShopMainPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const shopId = (params?.shop_id || params?.id) as string;

  const [shop, setShop] = useState<any>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [customerId, setCustomerId] = useState<string>("");

  useEffect(() => {
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id");

    if (cid && !cid.startsWith("customer_")) {
      setCustomerId(cid);
    } else {
      alert("กรุณาเข้าสู่ระบบก่อนเลือกสั่งพิมพ์");
      router.push("/auth");
    }
  }, [router]);

  useEffect(() => {
    if (searchParams.get("openCart") === "true") {
      setIsCartOpen(true);
    }
  }, [searchParams]);

  const isShopOpen = useMemo(() => {
    if (!shop) return false;
    return checkIsShopOpen(shop);
  }, [shop]);

  const loadData = async (cid: string) => {
    if (!shopId || !cid) return;
    try {
      setLoading(true);

      const resServices = await fetch(
        `http://localhost:5000/api/customer/shops/${shopId}/services`
      );
      const jsonServices = await resServices.json();
      if (jsonServices.success && jsonServices.data) {
        setShop(jsonServices.data.shop);
        setServices(jsonServices.data.service_types || []);
      }

      const resCart = await fetch(
        `http://localhost:5000/api/customer/cart?customer_id=${cid}`
      );
      const jsonCart = await resCart.json();

      if (jsonCart.success && jsonCart.data) {
        const rawItems = Array.isArray(jsonCart.data)
          ? jsonCart.data
          : jsonCart.data.cart_items ||
            jsonCart.data.cart_item ||
            jsonCart.data.items ||
            jsonCart.data.cart?.items ||
            jsonCart.data.cart?.cart_items ||
            [];

        const matchedItems = rawItems.filter((item: any) => {
          if (!item.shop_id) return true;
          return String(item.shop_id).trim() === String(shopId).trim();
        });

        const cartShopId = jsonCart.data.shop_id || jsonCart.data.cart?.shop_id;
        if (cartShopId && String(cartShopId).trim() !== String(shopId).trim()) {
          setCartItems([]);
        } else {
          setCartItems(matchedItems.length > 0 ? matchedItems : rawItems);
        }
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Load data error:", err);
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
    let uploadedUrls: string[] = [];

    // 🌟 รองรับกรณีเลือกหลายไฟล์ (files: File[]) หรือไฟล์เดี่ยว (file: File)
    const finalFileUrl = uploadedUrls.length > 0 
      ? uploadedUrls.join(",") 
      : (itemPayload.file_url || null);

    const qty = Number(itemPayload.quantity) || 1;
    const unitPrice = Number(itemPayload.unit_price) || 0;
    const computedSubtotal = itemPayload.subtotal ? Number(itemPayload.subtotal) : unitPrice * qty;

    // 🟢 1. ดึงจำนวนหน้ารวมที่แท้จริง
    const extractedPages = Number(itemPayload.page_count || itemPayload.total_pages || itemPayload.pages_per_set) || 1;

    const payload = {
      customer_id: customerId,
      shop_id: shopId,
      file_url: finalFileUrl,
      category: itemPayload.category,
      selected_size: itemPayload.selected_size,
      color_type: itemPayload.color_type,
      paper_type: itemPayload.paper_type,
      finishing_option: itemPayload.finishing_option,
      quantity: qty,
      unit_price: unitPrice,
      total_pages: extractedPages,  // 👈 ใช้ extractedPages
      page_count: extractedPages,   // 👈 ใช้ extractedPages
      side_type: itemPayload.finishing_option?.includes("หน้า-หลัง") ? "DOUBLE" : "SINGLE",
    };

    const tempItem: CartItem = {
      id: Date.now().toString(),
      category: payload.category,
      selected_size: payload.selected_size,
      color_type: payload.color_type,
      paper_type: payload.paper_type,
      finishing_option: payload.finishing_option,
      quantity: payload.quantity,
      unit_price: payload.unit_price,
      subtotal: computedSubtotal,
      total_pages: extractedPages, // 🟢 2. เพิ่มบรรทัดนี้ลงใน tempItem
      page_count: extractedPages,  // 🟢 3. เพิ่มบรรทัดนี้ลงใน tempItem
    } as CartItem;

    setCartItems((prev) => [...prev, tempItem]);
    setSelectedService(null);

    try {
      const res = await fetch("http://localhost:5000/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        await fetch("http://localhost:5000/api/customer/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: customerId }),
        });

        await fetch("http://localhost:5000/api/customer/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setCartItems([tempItem]);
      }

      const resCart = await fetch(
        `http://localhost:5000/api/customer/cart?customer_id=${customerId}`
      );
      const jsonCart = await resCart.json();
      if (jsonCart.success && jsonCart.data) {
        const realItems =
          jsonCart.data.cart_item ||
          jsonCart.data.cart_items ||
          jsonCart.data.items ||
          [];
        if (realItems.length > 0) {
          setCartItems(realItems);
        }
      }
    } catch (err) {
      console.error("Add item to cart error:", err);
    }
  };

  const handleClearCart = async () => {
    await fetch("http://localhost:5000/api/customer/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId }),
    });
    setCartItems([]);
  };

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleProceedToPayment = async (appointmentData: any) => {
    if (!shopId) {
      alert("ไม่พบรหัสร้านค้า");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("ไม่มีสินค้าในตะกร้า กรุณาเลือกรายการพิมพ์ก่อนครับ");
      return;
    }

    const formattedItems = cartItems.map((item: any) => {
      const itemSubtotal = Number(item.subtotal) || Number(item.unit_price * item.quantity) || 0;
      
      // 🟢 ดึงจำนวนหน้าที่ถูกต้องจากไอเทมในตะกร้า
      const itemPages = Number(item.page_count || item.total_pages || item.pagesPerSet) || 1;

      return {
        fileName: item.category || "งานพิมพ์เอกสาร",
        paperSize: item.paper_type || item.selected_size || "A4",
        colorType: item.color_type || "สี/ขาวดำ",
        printSide: item.finishing_option || "ไม่มี",
        pagesPerSet: itemPages, // 👈 ส่งจำนวนหน้าที่ถูกต้องไปแทนเลข 1
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
      const realOrderId = (res.ok && result.success && (result.data?.id || result.data?.order_id)) 
        ? (result.data?.id || result.data?.order_id) 
        : fallbackOrderId;

      pendingOrderPayload.id = realOrderId;
      sessionStorage.setItem("pending_order_data", JSON.stringify(pendingOrderPayload));

      const finalPrice = appointmentData.total_price || formattedItems.reduce((a, b) => a + b.totalPrice, 0);

      router.push(
        `/customer/order/payment/${realOrderId}?totalPrice=${finalPrice}`
      );
    } catch (err: any) {
      console.error("Order API exception:", err);
      const finalPrice = appointmentData.total_price || formattedItems.reduce((a, b) => a + b.totalPrice, 0);
      router.push(
        `/customer/order/payment/${fallbackOrderId}?totalPrice=${finalPrice}`
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleRemoveCartItem = async (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    try {
      await fetch(`http://localhost:5000/api/customer/cart/item/${itemId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Delete cart item error:", err);
      if (customerId) loadData(customerId);
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
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 relative">
      <NavBar 
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* บล็อกหลัก: ปุ่มย้อนกลับขนาดใหญ่ลอยอยู่ด้านซ้ายนอกการ์ด ไม่ดันเนื้อหาข้างใน */}
      <div className="max-w-5xl mx-auto px-4 pt-6 relative">
        <button
          type="button"
          onClick={() => router.push("/customer")}
          title="กลับสู่หน้าหลัก"
          className="hidden xl:flex absolute -left-14 top-6 w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:bg-slate-50 items-center justify-center text-slate-700 hover:text-blue-600 transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* ปุ่มย้อนกลับสำหรับจอมือถือ/แท็บเล็ต */}
        <div className="xl:hidden pb-3">
          <button
            type="button"
            onClick={() => router.push("/customer")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </button>
        </div>

        <main className="space-y-6">
          <ShopHeaderCard shop={updatedShop} />
          <ServiceMenuGrid
            services={services}
            onSelectService={(srv) => setSelectedService(srv)}
          />
        </main>
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:px-6 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                {cartItems.length}
              </div>
              <div>
                <span className="text-xs text-slate-500 block">{cartItems.length} รายการที่เลือกไว้</span>
                <span className="text-base font-extrabold text-blue-600">
                  ฿{totalCartPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ดูตะกร้า / กำหนดวันรับงาน</span>
            </button>
          </div>
        </div>
      )}

      {selectedService && (
        <ServiceOptionModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <ShopCartDrawer
        shop={updatedShop}
        cartItems={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onClearCart={handleClearCart}
        onRemoveItem={handleRemoveCartItem}
        onProceedToPayment={handleProceedToPayment}
        isSubmitting={isSubmittingOrder}
      />
    </div>
  );
}