"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import {
  hoursLabel,
  isAllDayHours,
  isOpenOnWeekday,
  nextOpenWeekday,
  todayWeekdayBangkok,
  weekdayLongName,
} from "./shopOpenDays";

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

  if (shop.is_open === false || shop.is_open === 0 || shop.is_open === "false") {
    return false;
  }

  // วันนี้ไม่ใช่วันเปิดร้าน
  if (!isOpenOnWeekday(shop.open_days, todayWeekdayBangkok())) {
    return false;
  }

  const open = shop.open_time || shop.openTime || shop.opening_time || "";
  const close = shop.close_time || shop.closeTime || shop.closing_time || "";

  const openTime = open ? String(open).slice(0, 5) : "";
  const closeTime = close ? String(close).slice(0, 5) : "";

  if (
    (openTime === "00:00" && (closeTime === "23:59" || closeTime === "24:00" || closeTime === "00:00")) ||
    shop.is_24_hours === true
  ) {
    return true;
  }

  if (!openTime || !closeTime) {
    return true;
  }

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

  const open = shopData.open_time || shopData.opening_time || "";
  const close = shopData.close_time || shopData.closing_time || "";
  const openTime = open ? String(open).slice(0, 5) : "";
  const closeTime = close ? String(close).slice(0, 5) : "";

  // หน้าแรกบอกแค่สถานะของวันนี้ (ข้อความหลัก + ข้อความรอง)
  let hoursMain = hoursLabel(open, close);
  let hoursSub = "";
  let hoursClosed = false;
  // ร้านกดปิดร้านชั่วคราวเอง (is_open = false ใน DB)
  const isTempClosed = shopData.is_temporarily_closed === true;
  if (isTempClosed) {
    hoursMain = "ปิดชั่วคราว";
    hoursClosed = true;
  } else if (!isOpenOnWeekday(shopData.open_days, todayWeekdayBangkok())) {
    hoursMain = "วันนี้ปิด";
    hoursClosed = true;
    const next = nextOpenWeekday(shopData.open_days, todayWeekdayBangkok());
    if (next >= 0) {
      const time = openTime && !isAllDayHours(open, close) ? ` ${openTime} น.` : "";
      hoursSub = `เปิด${weekdayLongName(next)}${time}`;
    }
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

  // 🌟 ดึงข้อมูลคะแนนรีวิวจากทุกชื่อฟิลด์ที่เป็นไปได้
  const rawRating =
    shopData.rating !== undefined && shopData.rating !== null
      ? shopData.rating
      : shopData.average_rating !== undefined && shopData.average_rating !== null
        ? shopData.average_rating
        : shopData.score !== undefined && shopData.score !== null
          ? shopData.score
          : shopData.avg_rating !== undefined && shopData.avg_rating !== null
            ? shopData.avg_rating
            : 0;

  const displayRating = Number(rawRating);

  // 🌟 ดึงข้อมูลจำนวนรีวิวจากทุกชื่อฟิลด์ที่เป็นไปได้
  const rawReviewCount =
    shopData.review_count !== undefined && shopData.review_count !== null
      ? shopData.review_count
      : shopData.total_reviews !== undefined && shopData.total_reviews !== null
        ? shopData.total_reviews
        : shopData.reviews_count !== undefined && shopData.reviews_count !== null
          ? shopData.reviews_count
          : shopData.num_reviews !== undefined && shopData.num_reviews !== null
            ? shopData.num_reviews
            : 0;

  const displayReviewCount = Number(rawReviewCount);

  // ดึงข้อมูลแท็กบริการ
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
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col">
      <Link href={`/customer/shop/${targetId}`} className="relative w-full h-44 bg-blue-50/60 border-b border-blue-100 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
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
                : isTempClosed
                ? "bg-amber-500/95 text-white"
                : "bg-slate-700/80 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? "bg-white animate-pulse" : isTempClosed ? "bg-white" : "bg-slate-400"
              }`}
            />
            {isOpen ? "เปิดอยู่" : isTempClosed ? "ปิดชั่วคราว" : "ปิดทำการ"}
          </span>
        </div>

        {/* ระยะทาง (ซ้าย) + คะแนนรีวิว (ขวา) บรรทัดเดียวกัน */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full shadow-xs flex items-center gap-1 bg-white/90 backdrop-blur-md text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            {formattedDistance}
          </span>
          <span className="text-[11px] font-bold px-2 py-1 rounded-full shadow-xs flex items-center gap-1 bg-white/90 backdrop-blur-md text-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
            {displayReviewCount > 0 ? (
              <>
                {displayRating.toFixed(1)}
                <span className="font-medium text-slate-400">({displayReviewCount})</span>
              </>
            ) : (
              <span className="font-medium text-slate-500">ยังไม่มีรีวิว</span>
            )}
          </span>
        </div>
      </Link>

      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <Link href={`/customer/shop/${targetId}`} className="cursor-pointer block">
            <h3 className="font-extrabold text-base leading-snug text-slate-900 group-hover:text-blue-600 transition truncate">
              {shopData.shop_name || shopData.name || "ร้านพิมพ์เอกสาร"}
            </h3>
          </Link>


          {displayedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {displayedTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium leading-none bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-[11px] font-semibold leading-none bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-full">
                  +{remainingCount}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs min-w-0">
          <Clock className={`w-3.5 h-3.5 shrink-0 ${isOpen ? "text-emerald-500" : "text-rose-500"}`} />
          <span className={`font-semibold shrink-0 ${isOpen ? "text-emerald-600" : "text-rose-500"}`}>
            {hoursMain}
          </span>
          {hoursSub && <span className="text-slate-400 truncate">· {hoursSub}</span>}
        </div>
      </div>
    </div>
  );
}