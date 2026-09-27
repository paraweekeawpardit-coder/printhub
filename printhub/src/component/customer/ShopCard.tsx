"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";

export interface Shop {
  id: string | number;
  name: string;
  image_url?: string;
  distance?: number | string;
  rating: number;
  review_count?: number;
  open_time?: string;
  close_time?: string;
  opening_time?: string;
  closing_time?: string;
  is_open?: boolean;
  starting_price?: number;
  profile_image?: string | null;
  shop_name?: string;
}

interface ShopCardProps {
  shop: Shop;
}

// 🌟 ฟังก์ชันช่วยดึงค่าเวลาแบบครอบคลุมทุกชื่อฟิลด์จาก API / Supabase
const getShopTimes = (shopData: any) => {
  const open =
    shopData.open_time ||
    shopData.openTime ||
    shopData.opening_time ||
    shopData.opening_hours ||
    "";
  const close =
    shopData.close_time ||
    shopData.closeTime ||
    shopData.closing_time ||
    shopData.closing_hours ||
    "";

  const openFormatted = open ? String(open).slice(0, 5) : "";
  const closeFormatted = close ? String(close).slice(0, 5) : "";

  return { openTime: openFormatted, closeTime: closeFormatted };
};

// 🌟 ฟังก์ชันคำนวณสถานะเปิด-ปิดร้าน (รองรับร้าน 24 ชั่วโมง)
export const checkIsShopOpen = (shop: Shop): boolean => {
  const shopData = shop as any;

  // 1. ถ้าร้านสั่งปิด Manual (is_open === false) ให้ถือว่าปิด
  if (shopData.is_open === false) return false;

  const { openTime, closeTime } = getShopTimes(shopData);

  // 2. เงื่อนไขร้านเปิด 24 ชั่วโมง
  if (
    (openTime === "00:00" && (closeTime === "23:59" || closeTime === "24:00")) ||
    shopData.is_24_hours === true
  ) {
    return true;
  }

  // 3. ถ้าไม่มีการระบุเวลา ให้ยึดตามค่า is_open จาก DB
  if (!openTime || !closeTime) {
    return shopData.is_open !== undefined ? Boolean(shopData.is_open) : true;
  }

  // 4. คำนวณตามเวลาปัจจุบัน
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, "0");
  const currentMinutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${currentHours}:${currentMinutes}`;

  if (openTime <= closeTime) {
    return currentTime >= openTime && currentTime <= closeTime;
  } else {
    // กรณีเปิดข้ามคืน
    return currentTime >= openTime || currentTime <= closeTime;
  }
};

export default function ShopCard({ shop }: ShopCardProps) {
  const shopData = shop as any;

  const isOpen = checkIsShopOpen(shop);
  const { openTime, closeTime } = getShopTimes(shopData);

  // 🌟 จัดการข้อความแสดงเวลาเปิด-ปิด
  let businessHours = "ไม่ระบุเวลาทำการ";
  if (
    (openTime === "00:00" && (closeTime === "23:59" || closeTime === "24:00")) ||
    shopData.is_24_hours === true
  ) {
    businessHours = "เปิด 24 ชั่วโมง";
  } else if (openTime && closeTime) {
    businessHours = `${openTime} - ${closeTime} น.`;
  }

  const formattedDistance =
    shop.distance !== undefined && shop.distance !== null
      ? `${Number(shop.distance).toFixed(1)} กม.`
      : "ไม่ระบุระยะทาง";

  const rawImage = shop?.profile_image || shop?.image_url;
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `http://localhost:5000${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
    : null;

  return (
    <Link
      href={`/customer/shop/${shopData.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col cursor-pointer"
    >
      <div className="relative w-full h-44 bg-blue-50/60 border-b border-blue-100 flex items-center justify-center overflow-hidden shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={shop.shop_name || shop.name || "รูปร้านค้า"}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-4xl">🖨️</span>
        )}

        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-md ${
              isOpen
                ? "bg-emerald-500/90 text-white"
                : "bg-slate-700/80 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? "bg-white animate-pulse" : "bg-slate-400"
              }`}
            />
            {isOpen ? "เปิดอยู่" : "ปิดทำการ"}
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">
            {shopData.shop_name || shopData.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span>{shopData.rating ? Number(shopData.rating).toFixed(1) : "0.0"}</span>
            </div>
            {shopData.review_count !== undefined && (
              <span className="text-[11px] text-slate-400">
                ({shopData.review_count})
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{formattedDistance}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] text-slate-500 truncate">{businessHours}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}