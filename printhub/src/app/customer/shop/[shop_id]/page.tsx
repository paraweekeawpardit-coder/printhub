"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

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

  // 2. ดึงข้อมูลบริการและตะกร้าจากเซิร์ฟเวอร์
  const loadData = async (cid: string) => {
    if (!shopId || !cid) return;
    try {
      setLoading(true);

      // 1. โหลดข้อมูลร้านค้าและบริการ
      const resServices = await fetch(
        `http://localhost:5000/api/customer/shops/${shopId}/services`
      );
      const jsonServices = await resServices.json();
      if (jsonServices.success) {
        setShop(jsonServices.data.shop);
        setServices(jsonServices.data.service_types || []);
      }

      // 2. ดึงข้อมูลตะกร้า
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
    const payload = {
      customer_id: customerId,
      shop_id: shopId,
      file_url: itemPayload.file_url || "https://example.com/demo.pdf",
      category: itemPayload.category,
      selected_size: itemPayload.selected_size,
      color_type: itemPayload.color_type,
      paper_type: itemPayload.paper_type,
      finishing_option: itemPayload.finishing_option,
      quantity: Number(itemPayload.quantity) || 1,
      unit_price: Number(itemPayload.unit_price) || 0,
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
      subtotal: payload.unit_price * payload.quantity,
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

  // 4. บันทึกคำสั่งซื้อ และนำทางไปยังหน้าชำระเงิน (/customer/order/payment/[orderId])
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleProceedToPayment = async (appointmentData: any) => {
    if (!shopId) {
      alert("ไม่พบรหัสร้านค้า");
      return;
    }

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
      if (!res.ok || !result.success) {
        throw new Error(result.message || "สร้างคำสั่งซื้อไม่สำเร็จ");
      }

      const createdOrderId = result.data?.id || result.data?.order_id;
      if (!createdOrderId) {
        throw new Error("เซิร์ฟเวอร์ไม่ได้ส่ง orderId กลับมา");
      }

      // วิ่งไปที่หน้า payment/[orderId] พร้อมแนบ totalPrice ให้หน้าจ่ายเงินคำนวณต่อ
      router.push(
        `/customer/order/payment/${createdOrderId}?totalPrice=${appointmentData.total_price}`
      );
    } catch (err: any) {
      console.error("Order error:", err);
      alert(err.message || "เกิดข้อผิดพลาดในการไปหน้าชำระเงิน");
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28">
      <NavBar />

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
              shop?.is_open
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                shop?.is_open ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {shop?.is_open ? "เปิดให้บริการ" : "ปิดทำการ"}
          </span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <ShopHeaderCard shop={shop} />
        <ServiceMenuGrid
          services={services}
          onSelectService={(srv) => setSelectedService(srv)}
        />
      </main>

      {selectedService && (
        <ServiceOptionModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* ส่ง isSubmitting เพื่อปิดการกดย้ำขณะส่ง API */}
      <ShopCartDrawer
        shop={shop}
        cartItems={cartItems}
        onClearCart={handleClearCart}
        onProceedToPayment={handleProceedToPayment}
        isSubmitting={isSubmittingOrder}
      />
    </div>
  );
}