"use client";

import React, { useState } from "react";
import { 
  Star, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Store, 
  Phone 
} from "lucide-react";

interface ShopHeaderCardProps {
  shop: any;
}

export default function ShopHeaderCard({ shop }: ShopHeaderCardProps) {
  const [imgError, setImgError] = useState(false);

  if (!shop) return null;

  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. ดึงและประกอบข้อความที่อยู่
  const addr = shop.address || shop.addresses || {};
  const detail = addr.detail || shop.detail || (typeof shop.address === "string" ? shop.address : "");
  const subdistrict = addr.subdistrict ? `ต.${addr.subdistrict}` : "";
  const district = addr.district ? `อ.${addr.district}` : "";
  const province = addr.province ? `จ.${addr.province}` : "";
  const postcode = addr.postcode || "";

  const fullAddress = [detail, subdistrict, district, province, postcode]
    .filter(Boolean)
    .join(" ") || shop.location || "";

  // 2. สร้างลิงก์ Google Maps
  const latitude = addr.latitude || shop.latitude;
  const longitude = addr.longitude || shop.longitude;

  let googleMapsUrl: string | null = null;
  if (shop.map_link || shop.google_maps_url) {
    googleMapsUrl = shop.map_link || shop.google_maps_url;
  } else if (latitude && longitude) {
    googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  } else if (fullAddress) {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent( `\({shop.shop_name \vert{}\vert{} ""} \){fullAddress}` )}`;

  }

  // 3. ข้อมูลพื้นฐานร้าน
  const ratingValue = Number(shop.rating ?? shop.score ?? shop.avg_rating ?? 0).toFixed(1);
  const totalReviews = shop.total_reviews ?? shop.review_count ?? shop.reviews_count ?? 0;
  const isOpen = Boolean(shop.is_open);
  const phone = shop.phone || shop.contact || shop.shop_phone || shop.tel;

  // 4. รูปภาพโปรไฟล์ร้าน
  const rawImg = shop.profile_image || shop.image_url || shop.logo;
  let profileImg = null;

  if (rawImg) {
    if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
      profileImg = rawImg;
    } else {
      const cleanPath = rawImg.replace(/\\/g, "/");
      const formattedPath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;
      profileImg = `${NEXT_PUBLIC_API_URL}/${formattedPath}`;
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      {/* เส้นตกแต่งไล่เฉดสีฟ้า-น้ำเงินด้านบน */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-1">
        
        {/* ฝั่งซ้าย: รูปโปรไฟล์ขนาดใหญ่ + ข้อมูลร้านค้า */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 min-w-0 flex-1 w-full">
          
          {/* รูปโปรไฟล์ร้านค้าขนาดใหญ่ */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shrink-0 flex items-center justify-center shadow-inner group">
            {profileImg && !imgError ? (
              <img
                src={profileImg}
                alt={shop.shop_name || "ร้านค้า"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <Store className="w-14 h-14 text-slate-300" />
            )}
          </div>

          {/* รายละเอียดร้านค้า */}
          <div className="space-y-3 min-w-0 flex-1 w-full">
            
            {/* บรรทัดที่ 1: ชื่อร้านค้า */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {shop.shop_name || "ร้านค้างานพิมพ์"}
              </h1>
            </div>

            {/* บรรทัดที่ 2: เวลาเปิด-ปิด วางคู่กับ เบอร์โทรศัพท์ */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-0.5">
              
              {/* ป้ายเวลาทำการ (ธีมฟ้าซอฟต์) */}
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-xl shadow-2xs">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {shop?.open_time && shop?.close_time
                    ? `${String(shop.open_time).slice(0, 5)} - ${String(shop.close_time).slice(0, 5)} น.`
                    : "เปิดตลอด 24 ชม."}
                </span>
              </div>

              {/* เบอร์โทรศัพท์ */}
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 text-xs text-blue-700 hover:text-blue-900 font-bold bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 px-3.5 py-1.5 rounded-xl transition shadow-2xs"
                  title="คลิกเพื่อโทรออก"
                >
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{phone}</span>
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 text-slate-400 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
                  <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>ยังไม่มีเบอร์ติดต่อ</span>
                </div>
              )}
            </div>

            {/* เส้นแบ่งแนวนอนก่อนถึงที่อยู่ */}
            <hr className="border-t border-slate-100 my-1.5" />

            {/* บรรทัดที่ 3 & 4: ที่อยู่ร้าน + ปุ่ม Google Maps อยู่บรรทัดใหม่ */}
            <div className="space-y-2 text-xs text-slate-600 pt-0.5">
              <div className="flex items-start gap-1.5 text-slate-700 max-w-xl">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="font-normal text-slate-600 leading-relaxed">
                  {fullAddress || "ยังไม่ได้ระบุรายละเอียดที่อยู่"}
                </span>
              </div>

              {/* ลิงก์ Google Maps แยกอยู่อีกบรรทัดหนึ่ง */}
              {googleMapsUrl && (
                <div className="pl-5">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 px-3 py-1 rounded-lg transition shrink-0 shadow-2xs"
                    title="เปิดดูตำแหน่งบน Google Maps"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ฝั่งขวา: สถานะเปิด/ปิด (ย้ายกลับมาข้างบน) + คะแนนรีวิว */}
        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
          
          {/* สถานะเปิด/ปิด */}
          <span
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold border flex items-center gap-1.5 shadow-2xs ${
              isOpen
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            {isOpen ? "เปิดให้บริการ" : "ปิดทำการ"}
          </span>

          {/* กล่องคะแนนรีวิว */}
          <div className="flex items-center gap-2.5 bg-amber-50/90 border border-amber-200/80 px-4 py-2 rounded-2xl shadow-2xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 shrink-0" />
            <div className="text-right">
              <span className="text-base font-extrabold text-amber-950 block leading-none">
                {ratingValue}
              </span>
              <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">
                {totalReviews} รีวิว
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}