"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Store, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  ShoppingBag, 
  Loader2 
} from "lucide-react";
import NavBar from "../../../component/customer/NavBar";

interface CartGroupedShop {
  shop_id: string;
  shop_name: string;
  is_open?: boolean;
  open_time?: string;
  close_time?: string;
  items: any[];
  total_price: number;
}

export default function CustomerCartOverviewPage() {
  const router = useRouter();
  const [groupedCarts, setGroupedCarts] = useState<CartGroupedShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string>("");

  // State เก็บ shop_id ที่เปิดดูรายการอยู่
  const [expandedShopIds, setExpandedShopIds] = useState<Set<string>>(new Set());

  const toggleExpand = (shopId: string) => {
    setExpandedShopIds((prev) => {
      const next = new Set(prev);
      if (next.has(shopId)) {
        next.delete(shopId);
      } else {
        next.add(shopId);
      }
      return next;
    });
  };

  const loadAllCarts = async (cid: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/customer/cart?customer_id=${cid}`);
      const json = await res.json();

      if (json.success && json.data) {
        const rawItems = Array.isArray(json.data)
          ? json.data
          : json.data.cart_items ||
            json.data.cart_item ||
            json.data.items ||
            [];

        const shopInfoFromCart = json.data.print_shop || json.data.shop || {};
        const fallbackShopId = json.data.shop_id || shopInfoFromCart.id || "";

        const groups: Record<string, CartGroupedShop> = {};

        rawItems.forEach((item: any) => {
          const shopData = item.print_shop || item.shop || shopInfoFromCart;
          const sId = item.shop_id || fallbackShopId || "unknown";
          const sName = shopData.shop_name || item.shop_name || "ร้านค้างานพิมพ์";
          
          const isOpen = Boolean(
            shopData.is_open === true ||
            shopData.is_open === 1 ||
            String(shopData.is_open).toLowerCase() === "true" ||
            String(shopData.status).toUpperCase() === "OPEN"
          );

          const itemPrice = Number(item.subtotal || item.unit_price * item.quantity || 0);

          if (!groups[sId]) {
            groups[sId] = {
              shop_id: sId,
              shop_name: sName,
              is_open: isOpen,
              open_time: shopData.open_time,
              close_time: shopData.close_time,
              items: [],
              total_price: 0,
            };
          }

          groups[sId].items.push(item);
          groups[sId].total_price += itemPrice;
        });

        const groupList = Object.values(groups);
        for (const grp of groupList) {
          if (grp.shop_id && grp.shop_id !== "unknown" && grp.shop_name === "ร้านค้างานพิมพ์") {
            try {
              const shopRes = await fetch(`http://localhost:5000/api/customer/shops/${grp.shop_id}/services`);
              const shopJson = await shopRes.json();
              if (shopJson.success && shopJson.data?.shop) {
                const s = shopJson.data.shop;
                grp.shop_name = s.shop_name || grp.shop_name;
                grp.is_open = Boolean(
                  s.is_open === true ||
                  s.is_open === 1 ||
                  String(s.is_open).toLowerCase() === "true" ||
                  String(s.status).toUpperCase() === "OPEN"
                );
                grp.open_time = s.open_time;
                grp.close_time = s.close_time;
              }
            } catch (e) {
              console.error("Fetch shop detail fallback error:", e);
            }
          }
        }

        setGroupedCarts([...groupList]);
      } else {
        setGroupedCarts([]);
      }
    } catch (err) {
      console.error("Load cart error:", err);
      setGroupedCarts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id");
    if (cid && !cid.startsWith("customer_")) {
      setCustomerId(cid);
      loadAllCarts(cid);
    } else {
      router.push("/auth");
    }
  }, [router]);

  const handleClearShopCart = async (shopId: string) => {
    if (!confirm("ต้องการล้างรายการสินค้าของร้านนี้ใช่หรือไม่?")) return;

    try {
      await fetch("http://localhost:5000/api/customer/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId, shop_id: shopId }),
      });
      loadAllCarts(customerId);
    } catch (err) {
      console.error("Clear shop cart error:", err);
    }
  };

  const totalItemsCount = groupedCarts.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased pb-12">
      <NavBar cartCount={totalItemsCount} />

      <main className="max-w-4xl w-full mx-auto px-4 py-6 space-y-4 flex-1">
        {/* Header แถบด้านบน: ปุ่มลูกศรย้อนกลับสไตล์กรอบโค้งมน พร้อมข้อความและจำนวนตะกร้า */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/customer")}
              className="w-12 h-12 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer text-slate-700 hover:text-slate-900 group"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">ตะกร้าสินค้าของคุณ</h1>
          </div>

          <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
            มีทั้งหมด {groupedCarts.length} ตะกร้าร้านค้า
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span>กำลังโหลดข้อมูลตะกร้า...</span>
          </div>
        ) : groupedCarts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-800">ไม่มีสินค้าในตะกร้า</p>
            <p className="text-xs text-slate-400">คุณยังไม่ได้เพิ่มบริการงานพิมพ์ใด ๆ ลงในตะกร้า</p>
            <button
              type="button"
              onClick={() => router.push("/customer")}
              className="mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
            >
              เลือกดูร้านค้า
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedCarts.map((group) => {
              const isExpanded = expandedShopIds.has(group.shop_id);

              return (
                <div
                  key={group.shop_id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4 transition"
                >
                  {/* หัวการ์ดร้านค้า + ปุ่มคลิกเพื่อพับ/คลี่ (Accordion Header) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div 
                      onClick={() => toggleExpand(group.shop_id)}
                      className="flex items-center gap-2 flex-wrap cursor-pointer group select-none flex-1"
                    >
                      <Store className="w-5 h-5 text-blue-600 shrink-0" />
                      <h2 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                        {group.shop_name}
                      </h2>

                      {/* ป้ายเปิด/ปิด */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          group.is_open
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            group.is_open ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {group.is_open ? "เปิดให้บริการ" : "ปิดทำการ"}
                      </span>

                      {/* เวลาเปิดทำการ */}
                      {group.open_time && group.close_time && (
                        <span className="text-[11px] text-slate-400">
                          ({group.open_time.slice(0, 5)} - {group.close_time.slice(0, 5)} น.)
                        </span>
                      )}

                      {/* ปุ่มกด Dropdown บอกจำนวนรายการ */}
                      <span className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition">
                        {group.items.length} รายการ
                        <ChevronDown 
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-blue-600" : "text-slate-400"
                          }`} 
                        />
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClearShopCart(group.shop_id)}
                      className="text-xs text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ลบร้านนี้
                    </button>
                  </div>

                  {/* รายการสินค้า: แสดงเมื่อคลี่ออก */}
                  {isExpanded && (
                    <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {group.items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{item.category}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">
                              ({[item.selected_size, item.color_type].filter(Boolean).join(" • ")})
                            </span>
                            <span className="text-slate-500 block text-[11px] mt-0.5">
                              จำนวน {item.quantity} ชุด
                            </span>
                          </div>
                          <span className="font-bold text-slate-900">
                            ฿{Number(item.subtotal || item.unit_price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ส่วนล่าง: ยอดรวม + ปุ่มไปที่ร้าน */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 block">ยอดรวมร้านนี้</span>
                      <span className="text-base font-extrabold text-blue-600">
                        ฿{group.total_price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        router.push(`/customer/shop/${group.shop_id}?openCart=true`);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md ${
                        group.is_open
                          ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                          : "bg-slate-700 hover:bg-slate-800 shadow-slate-500/20"
                      }`}
                    >
                      <span>{group.is_open ? "ไปที่ร้านนี้เพื่อสั่งซื้อ" : "ดูร้านค้า"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}