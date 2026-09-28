"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";

import NavBar from "../../../../component/customer/NavBar";
import ShopHeaderCard from "../../../../component/customer/shop/ShopHeaderCard";
import ServiceMenuGrid, { ServiceType } from "../../../../component/customer/shop/ServiceMenuGrid";
import ServiceOptionModal from "../../../../component/customer/shop/ServiceOptionModal";
import ShopCartDrawer, { CartItem } from "../../../../component/customer/shop/ShopCartDrawer";

export default function ShopMainPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = (params?.shop_id || params?.id) as string;

  const [shop, setShop] = useState<any>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // State สำหรับควบคุมเปิด-ปิด Cart Drawer

  // 1. ดึง Customer ID จริงจากการล็อกอิน
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

  // ตรวจสอบสถานะเปิดร้านอย่างละเอียด รองรับทั้ง boolean, string และ number
  const isShopOpen = Boolean(
    shop?.is_open === true ||
    shop?.is_open === 1 ||
    String(shop?.is_open).toLowerCase() === "true" ||
    String(shop?.status).toUpperCase() === "OPEN"
  );

  // 2. ดึงข้อมูลบริการและตะกร้าจากเซิร์ฟเวอร์
  const loadData = async (cid: string) => {
    if (!shopId || !cid) return;
    try {
      setLoading(true);

      // โหลดข้อมูลร้านค้าและบริการ
      const resServices = await fetch(
        `http://localhost:5000/api/customer/shops/${shopId}/services`
      );
      const jsonServices = await resServices.json();
      if (jsonServices.success) {
        setShop(jsonServices.data.shop);
        setServices(jsonServices.data.service_types || []);
      }

      // ดึงข้อมูลตะกร้า
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

  // 3. จัดการเพิ่มสินค้าลงตะกร้า
  const handleAddToCart = async (itemPayload: any) => {
    const qty = Number(itemPayload.quantity) || 1;
    const unitPrice = Number(itemPayload.unit_price) || 0;
    const computedSubtotal = itemPayload.subtotal ? Number(itemPayload.subtotal) : unitPrice * qty;

    const payload = {
      customer_id: customerId,
      shop_id: shopId,
      file_url: itemPayload.file_url || "https://example.com/demo.pdf",
      category: itemPayload.category,
      selected_size: itemPayload.selected_size,
      color_type: itemPayload.color_type,
      paper_type: itemPayload.paper_type,
      finishing_option: itemPayload.finishing_option,
      quantity: qty,
      unit_price: unitPrice,
      total_pages: Number(itemPayload.total_pages) || 1,
      page_count: Number(itemPayload.total_pages) || 1,
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
    };

    setCartItems((prev) => [...prev, tempItem]);
    setSelectedService(null);

    try {
      const res = await fetch("http://localhost:5000/api/customer/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        if (
          confirm(
            "คุณมีสินค้าของร้านอื่นอยู่ในตะกร้า ต้องการล้างตะกร้าเพื่อเริ่มสั่งร้านนี้หรือไม่?"
          )
        ) {
          await fetch("http://localhost:5000/api/customer/cart/clear", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_id: customerId }),
          });
          await fetch("http://localhost:5000/api/customer/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          setCartItems([tempItem]);
        } else {
          setCartItems((prev) => prev.filter((i) => i.id !== tempItem.id));
          return;
        }
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
    await fetch("http://localhost:5000/api/customer/cart/clear", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId }),
    });
    setCartItems([]);
  };

  // 4. บันทึกคำสั่งซื้อ และนำทางไปยังหน้าชำระเงิน
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

    const formattedItems = cartItems.map((item) => {
      const itemSubtotal = Number(item.subtotal) || Number(item.unit_price * item.quantity) || 0;
      return {
        fileName: item.category || "งานพิมพ์เอกสาร",
        paperSize: item.paper_type || item.selected_size || "A4",
        colorType: item.color_type || "สี/ขาวดำ",
        printSide: item.finishing_option || "ไม่มี",
        pagesPerSet: item.total_pages || 1,
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

      const res = await fetch("http://localhost:5000/api/customer/orders", {
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

  // สร้างวัตถุ shop ที่ปรับปรุงค่า is_open แล้ว
  const updatedShop = shop ? { ...shop, is_open: isShopOpen } : null;

  // คำนวณราคารวมในตะกร้าทั้งหมด
  const cartTotalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.subtotal) || Number(item.unit_price) * item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 relative">
      {/* ส่ง cartCount และฟังก์ชันสั่งเปิดตะกร้าไปยัง NavBar */}
      <NavBar 
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/customer")}
            className="flex items-center gap-1.5 p-1.5 hover:bg-slate-100 rounded-xl transition cursor-pointer text-slate-600 hover:text-slate-900 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่หน้ารวมร้านค้า</span>
          </button>

          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
              isShopOpen
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isShopOpen ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {isShopOpen ? "เปิดให้บริการ" : "ปิดทำการ"}
          </span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <ShopHeaderCard shop={updatedShop} />
        <ServiceMenuGrid
          services={services}
          onSelectService={(srv) => setSelectedService(srv)}
        />
      </main>

      {/* 🌟 แถบแจ้งเตือนตะกร้าลอยด้านล่าง (Floating Cart Bar) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
          <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-between">
            {/* คลิกส่วนซ้ายเพื่อเปิดตะกร้า */}
            <div
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            >
              <div className="relative bg-blue-50 p-2.5 rounded-xl text-blue-600 flex items-center justify-center">
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {cartItems.length}
                </span>
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  {cartItems.length} รายการที่เลือกไว้
                </p>
                <p className="text-base font-extrabold text-slate-900">
                  ฿{cartTotalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ปุ่มกดเปิด Pop-up ตะกร้าสินค้าตามรูปที่ 1 และ 2 */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              ดูตะกร้า / กำหนดวันรับงาน
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
        onProceedToPayment={handleProceedToPayment}
        isSubmitting={isSubmittingOrder}
      />
    </div>
  );
}