"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Printer, Home, ClipboardList, MessageCircle, Settings } from "lucide-react";
import NotificationBell from "@/src/component/NotificationBell";

export default function ShopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    const storedShopId = localStorage.getItem("shop_id");
    if (storedShopId) {
      setShopId(storedShopId);
    }
  }, []);

  const isHomeActive = pathname === "/shop";
  const isOrderActive = pathname.startsWith("/shop/order") && !pathname.includes("/chat");
  const isChatActive = pathname.includes("/chat");
  const isSettingActive = pathname.startsWith("/shop/setting");

  const goTo = (path: string) => {
    const activeShopId = shopId || localStorage.getItem("shop_id");

    if (!activeShopId) {
      alert("ไม่พบข้อมูลร้านค้า กรุณาล็อกอินใหม่อีกครั้ง");
      return;
    }

    if (path === "chat") {
      router.push(`/shop/order/${activeShopId}/chat`);
      return;
    }

    if (path === "order") {
      router.push(`/shop/order/${activeShopId}`);
      return;
    }

    router.push(`/shop/${path}/${activeShopId}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-6xl h-16 flex items-center justify-between gap-2 px-4">

        <button
          onClick={() => router.push("/shop")}
          className="flex items-center gap-2 pl-1 cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#0F2942] flex items-center justify-center">
            <Printer size={18} className="text-white" />
          </div>
          <span className="hidden sm:block text-[#0F2942] font-bold text-xl tracking-tight">PrintHub</span>
        </button>

        <div className="flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => router.push("/shop")}
            title="หน้าหลัก"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isHomeActive ? "bg-[#0F2942] text-white" : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <Home size={15} />
            <span className={isHomeActive ? "inline" : "hidden md:inline"}>หน้าหลัก</span>
          </button>

          <button
            onClick={() => goTo("order")}
            title="รายการคำสั่งพิมพ์"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isOrderActive ? "bg-[#0F2942] text-white" : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={15} />
            <span className={isOrderActive ? "inline" : "hidden md:inline"}>รายการคำสั่งพิมพ์</span>
          </button>

          <button
            onClick={() => goTo("chat")}
            title="แชท"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isChatActive ? "bg-[#0F2942] text-white" : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <MessageCircle size={15} />
            <span className={isChatActive ? "inline" : "hidden md:inline"}>แชท</span>
          </button>
        </div>

        {/* โซนเมนูขวาบน: เพิ่มNotificationBell ข้างๆ โปรไฟล์ */}
        <div className="flex items-center gap-2">
          {shopId && <NotificationBell userId={shopId} role="shop" />}

          <button
            onClick={() => goTo("setting")}
            className="flex items-center gap-2.5 pr-1 cursor-pointer focus:outline-none"
          >
            <span className="hidden lg:block text-sm font-medium text-slate-600">Shop</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold relative">
              S
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                <Settings size={14} className={isSettingActive ? "text-[#0F2942]" : "text-slate-500"} />
              </div>
            </div>
          </button>
        </div>

      </div>
    </nav>
  );
}