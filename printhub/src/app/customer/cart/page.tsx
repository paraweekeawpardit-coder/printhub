"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import NavBar from "../../../component/customer/NavBar";
import ShopBackButton from "../../../component/customer/shop/ShopBackButton";
import CustomerCartCard from "../../../component/customer/CustomerCartCard";

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

  const loadAllCarts = useCallback(async (cid: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/customer/cart?customer_id=${cid}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (json.success && json.data) {
        if (Array.isArray(json.data.shops)) {
          setGroupedCarts(json.data.shops);
        } else {
          setGroupedCarts([]);
        }
      } else {
        setGroupedCarts([]);
      }
    } catch (err) {
      console.error("Load cart error:", err);
      setGroupedCarts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id");
    if (cid && !cid.startsWith("customer_")) {
      setCustomerId(cid);
      loadAllCarts(cid);

      const handleFocus = () => loadAllCarts(cid);
      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleFocus);

      return () => {
        window.removeEventListener("focus", handleFocus);
        document.removeEventListener("visibilitychange", handleFocus);
      };
    } else {
      router.push("/auth");
    }
  }, [router, loadAllCarts]);

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
      
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 flex-1">
        
        {/* Header บาร์บน */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShopBackButton />
            <h1 className="text-xl font-bold text-slate-900">ตะกร้าสินค้าของคุณ</h1>
          </div>

          <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
            มีทั้งหมด {groupedCarts.length} ตะกร้าร้านค้า
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span>กำลังโหลดข้อมูลตะกร้า...</span>
          </div>
        ) : groupedCarts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-2xs space-y-3">
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
            {groupedCarts.map((group) => (
              <CustomerCartCard
                key={group.shop_id}
                group={group}
                isExpanded={expandedShopIds.has(group.shop_id)}
                onToggleExpand={() => toggleExpand(group.shop_id)}
                onClearCart={handleClearShopCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}