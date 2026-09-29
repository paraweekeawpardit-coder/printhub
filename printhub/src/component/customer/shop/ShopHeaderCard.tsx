"use client";

import React, { useState } from "react";
import { Star, MapPin, Clock, ExternalLink, Store } from "lucide-react";

interface ShopHeaderCardProps {
  shop: any;
}

export default function ShopHeaderCard({ shop }: ShopHeaderCardProps) {
  console.log("ข้อมูลร้านค้าที่ส่งเข้ามาจริง:", shop);
  const [imgError, setImgError] = useState(false);

  if (!shop) return null;

  // 1. ใส่ URL ของ Server หลังบ้านของคุณตรงนี้ (เปลี่ยนเป็น Domain จริงเมื่อ Deploy)
  const NEXT_PUBLIC_API_URL = "http://localhost:5000"; 

  // 2. ดึงข้อความที่อยู่ให้ครอบคลุมทุกโครงสร้าง (แก้ไขบั๊ก Array.isArray และ Object เช็กฟิลด์)
  const addressText =
    shop.address?.detail ||
    shop.addresses?.detail ||
    (Array.isArray(shop.address) && shop.address[0] ? (shop.address[0].detail || shop.address[0]) : null) ||
    shop.detail ||
    (typeof shop.address === "string" ? shop.address : null) ||
    shop.location ||
    "";

  // 3. สร้างลิงก์ Google Maps เฉพาะเมื่อมีที่อยู่จริง
  const googleMapsUrl =
    shop.map_link ||
    shop.google_maps_url ||
    (addressText
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `(\({shop.shop_name \vert{}\vert{} ""}) \){addressText}`
        )}`
      : null);

  const ratingValue = Number(shop.rating ?? shop.score ?? shop.avg_rating ?? 0).toFixed(1);
  const totalReviews = shop.total_reviews ?? shop.review_count ?? shop.reviews_count ?? 0;
  const isOpen = Boolean(shop.is_open);

  // 4. จัดการแปลง Path รูปภาพจากหลังบ้านให้เป็น URL ที่ถูกต้อง
  const rawImg = shop.profile_image || shop.image_url || shop.logo;
  let profileImg = null;

  if (rawImg) {
    if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
      profileImg = rawImg;
    } else {
      // แปลง \\ เป็น / และตัด / ตัวแรกออกเพื่อไม่ให้ URL ซ้ำซ้อน
      const cleanPath = rawImg.replace(/\\/g, "/");
      const formattedPath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;
      profileImg = `${NEXT_PUBLIC_API_URL}/${formattedPath}`;
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* ฝั่งซ้าย: รูป + รายละเอียดร้าน */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
            {profileImg && !imgError ? (
              <img
                src={profileImg}
                alt={shop.shop_name || "ร้านค้า"}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <Store className="w-10 h-10 text-slate-400" />
            )}
          </div>

          <div className="space-y-1.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {shop.shop_name || "ร้านค้างานพิมพ์"}
            </h1>

            {/* ที่อยู่ + แผนที่ */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              {googleMapsUrl ? (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline flex items-center gap-1 transition truncate"
                  title="คลิกเพื่อเปิดใน Google Maps"
                >
                  <span className="truncate">{addressText}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                </a>
              ) : (
                <span className="text-slate-400">ยังไม่ได้ระบุที่อยู่</span>
              )}
            </div>

            {/* เวลาเปิดปิด */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {shop.open_time && shop.close_time
                  ? `${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.`
                  : "00:00 - 23:59 น."}
              </span>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: สถานะเปิด/ปิด และ เรตติ้งรีวิว */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${
              isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {isOpen ? "เปิดให้บริการ" : "ปิดทำการ"}
          </span>

          <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1 rounded-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-800">
              {ratingValue}
            </span>
            <span className="text-[11px] text-amber-700/80">
              ({totalReviews} รีวิว)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
