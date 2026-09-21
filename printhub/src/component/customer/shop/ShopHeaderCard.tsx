"use client";

import React from "react";
import { Clock } from "lucide-react";

interface ShopHeaderCardProps {
  shop: any;
}

export default function ShopHeaderCard({ shop }: ShopHeaderCardProps) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 sm:items-center">
      {/* รูปภาพร้าน */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative mx-auto sm:mx-0">
        {shop?.profile_image ? (
          <img
            src={shop.profile_image}
            alt={shop.shop_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-blue-50">
            🖨️
          </div>
        )}
      </div>

      {/* ข้อมูลร้าน */}
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {shop?.shop_name || "ชื่อร้านค้า"}
          </h2>
          <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg self-center sm:self-auto">
            <span>★</span>
            <span>{shop?.rating ? Number(shop.rating).toFixed(1) : "5.0"}</span>
            <span className="text-slate-400 font-normal">
              ({shop?.review_count || 0} รีวิว)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2">
          📍 {shop?.address?.detail || "บริเวณใกล้เคียงพื้นที่ให้บริการ"}
          {shop?.address && (shop.address.subdistrict || shop.address.district) && (
            <span className="text-slate-400 block sm:inline sm:ml-1">
              ({shop.address.subdistrict} {shop.address.district} {shop.address.province})
            </span>
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {shop?.open_time && shop?.close_time
              ? `${shop.open_time.slice(0, 5)} - ${shop.close_time.slice(0, 5)} น.`
              : "เปิดให้บริการทุกวัน"}
          </span>

          {shop?.distance !== undefined && shop?.distance !== null && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-medium">ห่าง {shop.distance} กม.</span>
            </>
          )}

          {shop?.address?.latitude && shop?.address?.longitude && (
            <>
              <span className="text-slate-300">•</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${shop.address.latitude},${shop.address.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-0.5"
              >
                ดูแผนที่ (Google Maps) →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}