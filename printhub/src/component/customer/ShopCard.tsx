"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";

export interface Shop {
  id: string | number;
  name: string;              // ชื่อร้าน (FR-1.4)
  image_url?: string;
  distance?: number | string;// ระยะทางจากจุดค้นหา กิโลเมตร (FR-1.4)
  rating: number;            // คะแนนรีวิวเฉลี่ย (FR-1.4)
  review_count?: number;
  open_time?: string;        // เวลาเปิดทำการ (FR-1.4)
  close_time?: string;       // เวลาปิดทำการ (FR-1.4)
  is_open?: boolean;         // สถานะเปิด-ปิด
  starting_price?: number;
  profile_image?: string | null;
  shop_name?: string;
}

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  // ฟอร์แมตแสดงเวลาเปิด-ปิด
  const businessHours =
    shop.open_time && shop.close_time
      ? `${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.`
      : "ไม่ระบุเวลาทำการ";

  // ฟอร์แมตระยะทาง (ปัดทศนิยม 1 ตำแหน่ง)
  const formattedDistance =
    shop.distance !== undefined && shop.distance !== null
      ? `${Number(shop.distance).toFixed(1)} กม.`
      : "ไม่ระบุระยะทาง";

  const shopData = shop as any;

  return (
    <Link
      href={`/customer/shop/${shopData.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col cursor-pointer"
    >
      {/* รูปภาพหน้าร้าน พร้อม Badge สถานะเปิด-ปิด */}
      <div className="relative w-full h-44 bg-blue-50/60 border-b border-blue-100 flex items-center justify-center overflow-hidden shrink-0">
        {shop?.profile_image || shop?.image_url ? (
          <img
            src={shop.profile_image || shop.image_url} 
            alt={shop.shop_name || "รูปร้านค้า"}
            className="w-full h-full object-cover"
            onError={(e) => {
              // ถ้ารูปโหลดไม่ได้/ลิงก์เสีย ให้ซ่อนรูปแล้วกลับไปใช้ไอคอนเครื่องพิมพ์
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          /* Fallback: กรณีไม่มี URL รูปภาพ */
          <span className="text-4xl">🖨️</span>
        )}

        {/* ป้ายสถานะเปิด-ปิดทำการ */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-md ${
              shopData.is_open
                ? "bg-emerald-500/90 text-white"
                : "bg-slate-700/80 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                shopData.is_open ? "bg-white animate-pulse" : "bg-slate-400"
              }`}
            />
            {shopData.is_open ? "เปิดอยู่" : "ปิดทำการ"}
          </span>
        </div>
      </div>

      {/* เนื้อหาสรุปข้อมูลร้านค้า (FR-1.4) */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* 1. ชื่อร้าน */}
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">
            {shopData.shop_name || shopData.name}
          </h3>

          {/* 2. คะแนนรีวิวเฉลี่ย */}
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

        {/* ข้อมูลระยะทาง และ เวลาเปิด-ปิดทำการ */}
        <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
          {/* 3. ระยะทางจากจุดค้นหา (กิโลเมตร) */}
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{formattedDistance}</span>
          </div>

          {/* 4. เวลาเปิด-ปิดทำการ */}
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] text-slate-500 truncate">{businessHours}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}