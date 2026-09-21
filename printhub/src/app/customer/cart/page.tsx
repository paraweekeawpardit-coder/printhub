"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Store, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  ArrowLeft, 
  Loader2,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import Navbar from "../../../component/customer/NavBar";

export default function CartPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ควบคุมการเปิด-ปิด Dropdown รายการสินค้าในตะกร้า
  const [isItemsOpen, setIsItemsOpen] = useState(false);

  // ดึงข้อมูลตะกร้าสินค้าของลูกค้า
  const fetchCart = async () => {
    const customerId =
      typeof window !== "undefined"
        ? localStorage.getItem("customer_id") || localStorage.getItem("id")
        : null;

    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/customer/cart?customer_id=${customerId}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        setCartData(json.data);
      } else {
        setCartData(null);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ล้างตะกร้าสินค้าทั้งหมด
  const handleClearCart = async () => {
    const customerId =
      localStorage.getItem("customer_id") || localStorage.getItem("id");
    if (!confirm("คุณต้องการลบรายการทั้งหมดในตะกร้าหรือไม่?")) return;

    try {
      await fetch("http://localhost:5000/api/customer/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId }),
      });
      setCartData(null);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const items = cartData?.cart_item || cartData?.cart_items || [];
  const shop = cartData?.print_shop;
  const shopId = cartData?.shop_id || shop?.id;

  // คำนวณยอดเงินรวม
  const totalPrice = items.reduce(
    (acc: number, item: any) =>
      acc + Number(item.subtotal || item.unit_price * item.quantity || 0),
    0
  );

  // จัดรูปแบบเวลาเปิด-ปิด
  const businessHours =
    shop?.open_time && shop?.close_time
      ? `${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.`
      : "ไม่ระบุเวลาทำการ";

  // จัดรูปแบบระยะทาง
  const formattedDistance =
    shop?.distance !== undefined && shop?.distance !== null
      ? `${Number(shop.distance).toFixed(1)} กม.`
      : "ไม่ระบุระยะทาง";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* ส่วนหัวหน้าเว็บ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/customer")}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="text-blue-600 w-6 h-6" />
              <span>ตะกร้าสินค้าของฉัน</span>
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างตะกร้า</span>
            </button>
          )}
        </div>

        {/* สถานะการโหลด หรือ แสดงการ์ด */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs">กำลังตรวจสอบรายการในตะกร้า...</p>
          </div>
        ) : items.length > 0 && shopId ? (
          <div className="space-y-4">
            {/* 🌟 การ์ดร้านค้าแนวนอน */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:border-blue-400">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                
                {/* 1. รูปภาพร้านค้า + Badge สถานะเปิด/ปิด */}
                <div className="relative w-full sm:w-36 h-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  {shop?.profile_image || shop?.image_url ? (
                    <img
                      src={shop.profile_image || shop.image_url}
                      alt={shop?.shop_name || "รูปร้านค้า"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-blue-50/70">
                      🖨️
                    </div>
                  )}

                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-md ${
                      shop?.is_open
                        ? "bg-emerald-500/90 text-white"
                        : "bg-slate-700/80 text-white"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        shop?.is_open ? "bg-white animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    {shop?.is_open ? "เปิดอยู่" : "ปิดทำการ"}
                  </span>
                </div>

                {/* 2. รายละเอียดร้านค้า (ชื่อ, เรตติ้ง, ระยะทาง, เวลาเปิดปิด) */}
                <div className="flex-1 min-w-0 w-full space-y-1.5 text-left">
                  <h2 className="text-base font-bold text-slate-900 truncate">
                    {shop?.shop_name || "ร้านรับพิมพ์งาน"}
                  </h2>

                  {/* คะแนนรีวิว */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span>
                        {shop?.rating ? Number(shop.rating).toFixed(1) : "0.0"}
                      </span>
                    </div>
                    {shop?.review_count !== undefined && (
                      <span className="text-[11px] text-slate-400">
                        ({shop.review_count})
                      </span>
                    )}
                  </div>

                  {/* ระยะทาง และ เวลาเปิด-ปิด */}
                  <div className="pt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-blue-600 font-semibold truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{formattedDistance}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] truncate">{businessHours}</span>
                    </div>
                  </div>
                </div>

                {/* 3. ปุ่มกดลิงก์ไปหน้าร้าน */}
                <div className="shrink-0 w-full sm:w-auto">
                  <Link
                    href={`/customer/shop/${shopId}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <span>ไปที่หน้าร้าน</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 4. แถบ Dropdown ยุบ/ขยายเพื่อดูรายการสินค้า */}
              <div className="border-t border-slate-100 px-5 py-2.5 bg-slate-50/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsItemsOpen(!isItemsOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
                >
                  <span>{isItemsOpen ? "ซ่อนรายการสินค้า" : "ดูรายการสินค้าในร้านนี้"}</span>
                  {isItemsOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <span className="text-[11px] text-slate-500 font-medium">
                  {items.length} รายการ • รวม ฿{totalPrice.toFixed(2)}
                </span>
              </div>

              {/* รายการสินค้าที่คลี่ออกมา */}
              {isItemsOpen && (
                <div className="divide-y divide-slate-100 px-5 py-1 bg-white border-t border-slate-100">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="py-3 flex justify-between items-start gap-4">
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                          {item.category || "งานพิมพ์"} ({item.selected_size || "ขนาดทั่วไป"})
                        </h4>
                        <p className="text-xs text-slate-500">
                          {[item.color_type, item.paper_type, item.finishing_option]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                        <p className="text-xs font-semibold text-blue-600">
                          จำนวน {item.quantity} ชุด
                        </p>
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 shrink-0">
                        ฿{Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* กรณีไม่มีสินค้าในตะกร้า */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              🛒
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">ไม่มีรายการในตะกร้า</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                คุณยังไม่ได้เลือกร้านค้าหรืองานพิมพ์ใส่ตะกร้าไว้ เริ่มต้นค้นหาร้านและบริการที่ต้องการได้ทันที
              </p>
            </div>
            <Link
              href="/customer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              ไปเลือกร้านค้า
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}