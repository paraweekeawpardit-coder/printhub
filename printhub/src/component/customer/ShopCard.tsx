"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";

export interface Shop {
  id: string | number;
  name?: string;
  image_url?: string;
  distance?: number | string;
  rating?: number;
  review_count?: number;
  open_time?: string;
  close_time?: string;
  opening_time?: string;
  closing_time?: string;
  is_open?: boolean;
  starting_price?: number;
  profile_image?: string | null;
  shop_name?: string;
  service_types?: string[];
  services?: any[];
  service_type?: any[];
  print_services?: any[];
}

interface ShopCardProps {
  shop: Shop;
}

// 🌟 ฟังก์ชันตรวจสอบสถานะร้านแบบยืดหยุ่น ป้องกัน Error ค่า null
export const checkIsShopOpen = (shop: any): boolean => {
  if (!shop) return false;

  // 1. ถ้ามีการสั่งปิดโดยตรง
  if (shop.is_open === false || shop.is_open === 0 || shop.is_open === "false") {
    return false;
  }

  // 2. ดึงเวลาเปิด-ปิด
  const open = shop.open_time || shop.openTime || shop.opening_time || "";
  const close = shop.close_time || shop.closeTime || shop.closing_time || "";

  const openTime = open ? String(open).slice(0, 5) : "";
  const closeTime = close ? String(close).slice(0, 5) : "";

  // 3. ร้านเปิด 24 ชม.
  if (
    (openTime === "00:00" && (closeTime === "23:59" || closeTime === "24:00" || closeTime === "00:00")) ||
    shop.is_24_hours === true
  ) {
    return true;
  }

  // 4. ถ้าไม่มีข้อมูลเวลา ให้ถือว่าเปิดไว้ก่อน (เพื่อไม่ให้ร้านหายไปจากหน้าจอ)
  if (!openTime || !closeTime) {
    return true;
  }

  // 5. เทียบเวลาปัจจุบัน
  try {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, "0");
    const currentMinutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;

    if (openTime <= closeTime) {
      return currentTime >= openTime && currentTime <= closeTime;
    } else {
      return currentTime >= openTime || currentTime <= closeTime;
    }
  } catch {
    return true;
  }
};

export default function ShopCard({ shop }: ShopCardProps) {
  if (!shop) return null;

  const shopData = shop as any;
  const targetId = shopData.id || shopData.shop_id || "";

  const isOpen = checkIsShopOpen(shop);

  // คำนวณข้อความเวลาทำการ
  const open = shopData.open_time || shopData.opening_time || "";
  const close = shopData.close_time || shopData.closing_time || "";
  const openTime = open ? String(open).slice(0, 5) : "";
  const closeTime = close ? String(close).slice(0, 5) : "";

  let businessHours = "เปิดให้บริการ";
  if (
    (openTime === "00:00" && (closeTime === "23:59" || closeTime === "24:00" || closeTime === "00:00")) ||
    shopData.is_24_hours === true
  ) {
    businessHours = "เปิด 24 ชั่วโมง";
  } else if (openTime && closeTime) {
    businessHours = `${openTime} - ${closeTime} น.`;
  }

  const formattedDistance =
    shop.distance !== undefined && shop.distance !== null
      ? `${Number(shop.distance).toFixed(1)} กม.`
      : "บริเวณใกล้เคียง";

  const rawImage = shop?.profile_image || shop?.image_url;
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `http://localhost:5000${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
    : null;

  // 🌟 ดึงข้อมูลแท็กบริการแบบครอบคลุมและ Safe ทุกชนิดข้อมูล
  const rawServiceList =
    shopData.service_types ||
    shopData.services ||
    shopData.service_type ||
    shopData.print_services ||
    [];

  const serviceTags: string[] = Array.isArray(rawServiceList)
    ? rawServiceList
        .map((s: any) => {
          if (!s) return "";
          if (typeof s === "string") return s;
          return s.type_name || s.name || s.service_type || "";
        })
        .filter(Boolean)
    : [];

  const displayedTags = serviceTags.slice(0, 10);
  const remainingCount = serviceTags.length - displayedTags.length;

  return (
    <Link
      href={`/customer/shop/${targetId}`}
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
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">
            {shopData.shop_name || shopData.name || "ร้านพิมพ์เอกสาร"}
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

          {/* แท็กบริการหลัก */}
          {displayedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {displayedTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100"
                >
                  {tag}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                  +{remainingCount}
                </span>
              )}
            </div>
          )}
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