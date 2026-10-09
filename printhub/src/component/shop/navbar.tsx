"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Printer,
  Home,
  ClipboardList,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import NotificationBell from "@/component/NotificationBell";

const API_BASE = "http://localhost:5000/shop";
// หน้าตั้งค่าร้านส่ง event นี้หลังเปลี่ยนรูปสำเร็จ เพื่อให้ navbar อัปเดตรูปทันที
const PROFILE_IMAGE_EVENT = "shop-profile-image-updated";

export default function ShopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  useEffect(() => {
    const storedShopId = localStorage.getItem("shop_id");
    const storedShopName = localStorage.getItem("shop_name");

    if (storedShopId) {
      setShopId(storedShopId);
    }
    if (storedShopName) {
      setShopName(storedShopName);
    }
  }, []);

  // ดึงรูปโปรไฟล์ร้านมาแสดง (ถ้าไม่มีรูปหรือโหลดไม่ได้ จะแสดงตัวอักษรแรกของร้านเหมือนเดิม)
  useEffect(() => {
    if (!shopId) return;
    let cancelled = false;

    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile/${shopId}`);
        if (!cancelled) {
          setProfileImage(res.data?.data?.profile_image ?? null);
          setImageFailed(false);
        }
      } catch (err) {
        console.error("Fetch shop profile image error:", err);
      }
    };
    fetchProfileImage();

    // เปลี่ยนรูปจากหน้าตั้งค่า -> อัปเดตทันทีโดยไม่ต้องรีเฟรช
    const handleImageUpdated = (e: Event) => {
      const url = (e as CustomEvent<{ profile_image?: string | null }>).detail
        ?.profile_image;
      setProfileImage(url ?? null);
      setImageFailed(false);
    };
    window.addEventListener(PROFILE_IMAGE_EVENT, handleImageUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener(PROFILE_IMAGE_EVENT, handleImageUpdated);
    };
  }, [shopId]);

  const showProfileImage = !!profileImage && !imageFailed;

  const isHomeActive = pathname === "/shop";
  const isOrderActive = pathname.startsWith("/shop/order") && !pathname.endsWith("/chat");
  const isChatActive = pathname.includes("/chat");
  const isSettingActive = pathname.startsWith("/shop/setting");

  const goTo = (path: string) => {
    if (!shopId) {
      console.warn("shopId not found in localStorage");
      alert("ไม่พบข้อมูลร้านค้า กรุณาล็อกอินใหม่อีกครั้ง");
      return;
    }

    if (path === "chat") {
      router.push(`/shop/order/${shopId}/chat?from=navbar`);
      return;
    }

    if (path === "order") {
      router.push(`/shop/order/${shopId}`);
      return;
    }

    router.push(`/shop/${path}/${shopId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("shop_id");
    localStorage.removeItem("shop_name");
    localStorage.removeItem("token");
    localStorage.clear();

    router.push("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur shadow-xs">
      <div className="mx-auto max-w-6xl h-16 flex items-center justify-between gap-2 px-4">
        {/* Logo / Home */}
        <button
          onClick={() => router.push("/shop")}
          className="logout-btn flex items-center gap-2 pl-1 cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#0F2942] flex items-center justify-center">
            <Printer size={18} className="text-white" />
          </div>
          <span className="hidden sm:block text-[#0F2942] font-bold text-xl tracking-tight">
            PrintHub
          </span>
        </button>

        {/* Navigation Menu */}
        <div className="flex items-center gap-1 text-sm font-medium">
          {/* หน้าหลัก */}
          <button
            onClick={() => router.push("/shop")}
            title="หน้าหลัก"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isHomeActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <Home size={15} />
            <span className={isHomeActive ? "inline" : "hidden md:inline"}>
              หน้าหลัก
            </span>
          </button>

          {/* รายการคำสั่งพิมพ์ */}
          <button
            onClick={() => goTo("order")}
            title="รายการคำสั่งพิมพ์"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isOrderActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={15} />
            <span className={isOrderActive ? "inline" : "hidden md:inline"}>
              รายการคำสั่งพิมพ์
            </span>
          </button>

          {/* แชท */}
          <button
            onClick={() => goTo("chat")}
            title="แชท"
            className={`flex items-center gap-2 h-10 px-3 md:px-4 rounded-full transition-colors cursor-pointer focus:outline-none ${
              isChatActive
                ? "bg-[#0F2942] text-white"
                : "text-slate-500 hover:text-[#0F2942] hover:bg-slate-100"
            }`}
          >
            <MessageCircle size={15} />
            <span className={isChatActive ? "inline" : "hidden md:inline"}>
              แชท
            </span>
          </button>
        </div>

        {/* Setting, Notification & Logout Section */}
        <div className="flex items-center gap-2">
          {/* NotificationBell */}
          {shopId && <NotificationBell userId={shopId} role="shop" />}

          {/* Setting / Profile Button */}
          <button
            onClick={() => goTo("setting")}
            title="ตั้งค่าร้านค้า"
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
          >
            <span className="hidden lg:block text-sm font-semibold text-slate-700 pl-2">
              {shopName || "ร้านค้า"}
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold relative shrink-0">
              {showProfileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage as string}
                  alt={shopName ? `รูปโปรไฟล์ ${shopName}` : "รูปโปรไฟล์ร้านค้า"}
                  onError={() => setImageFailed(true)}
                  className="absolute inset-0 h-full w-full rounded-full object-cover"
                />
              ) : (
                shopName?.charAt(0) || "S"
              )}
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs">
                <Settings
                  size={12}
                  className={
                    isSettingActive ? "text-[#0F2942]" : "text-slate-500"
                  }
                />
              </div>
            </div>
          </button>

          {/* เส้นคั่นแบ่งสัดส่วน */}
          <div className="h-5 w-[1px] bg-slate-200 my-auto" />

          {/* ปุ่มออกจากระบบ (Logout Button - ใส่ logout-btn เพิ่มที่นี่) */}
          <button
            onClick={handleLogout}
            title="ออกจากระบบ"
            className="logout-btn flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer focus:outline-none"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </nav>
  );
}