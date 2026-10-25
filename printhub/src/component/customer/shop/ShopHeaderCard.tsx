"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  ExternalLink,
  Store,
  Phone,
  ChevronDown,
} from "lucide-react";

import { hoursLabel, isAllDayHours, isOpenOnWeekday, nextOpenText, todayWeekdayBangkok, weekSchedule } from "../shopOpenDays";

interface ShopHeaderCardProps {
  shop: any;
}

interface Review {
  score: number | string;
}

export default function ShopHeaderCard({ shop }: ShopHeaderCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [ratingValue, setRatingValue] = useState("0.0");
  const [totalReviews, setTotalReviews] = useState(0);

  const NEXT_PUBLIC_API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ดึง shop_id สำหรับสร้างลิงก์รีวิว
  const shopId = shop?.id || shop?.shop_id || "";

  // ดึงคะแนนเฉลี่ยและจำนวนรีวิวจริงจาก API
  useEffect(() => {
    if (!shopId) {
      setRatingValue("0.0");
      setTotalReviews(0);
      return;
    }

    const controller = new AbortController();

    const fetchReviewStats = async () => {
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_API_URL}/api/customer/shops/${encodeURIComponent(
            String(shopId)
          )}/reviews`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`โหลดรีวิวไม่สำเร็จ: HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success !== true || !Array.isArray(result.data)) {
          throw new Error("รูปแบบข้อมูลรีวิวจาก API ไม่ถูกต้อง");
        }

        const reviews: Review[] = result.data;

        const scores = reviews
          .map((review) => Number(review.score))
          .filter(
            (score) =>
              Number.isFinite(score) && score >= 1 && score <= 5
          );

        const average =
          scores.length > 0
            ? (
              scores.reduce((sum, score) => sum + score, 0) /
              scores.length
            ).toFixed(1)
            : "0.0";

        setRatingValue(average);
        setTotalReviews(reviews.length);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("เกิดข้อผิดพลาดในการโหลดคะแนนรีวิว:", error);
        setRatingValue("0.0");
        setTotalReviews(0);
      }
    };

    fetchReviewStats();

    return () => controller.abort();
  }, [shopId, NEXT_PUBLIC_API_URL]);

  if (!shop) return null;

  // 1. ดึงและประกอบข้อความที่อยู่
  const addr = shop.address || shop.addresses || {};

  const detail =
    addr.detail ||
    shop.detail ||
    (typeof shop.address === "string" ? shop.address : "");

  // แสดงตามข้อมูลใน DB คั่นด้วยคอมมา: detail, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์
  const clean = (v: any) => String(v ?? "").trim();
  const detailText = clean(detail);
  // ถ้าในช่อง detail มีค่านี้อยู่แล้ว (เช่น ที่อยู่เต็มจากแผนที่) ไม่ต้องต่อท้ายซ้ำ
  const extraParts = [addr.subdistrict, addr.district, addr.province, addr.postcode]
    .map(clean)
    .filter((v) => v && !detailText.includes(v));

  const fullAddress =
    [detailText, ...extraParts]
      .filter(Boolean)
      .join(", ") ||
    shop.location ||
    "";

  // 2. สร้างลิงก์ Google Maps
  const latitude = addr.latitude || shop.latitude;
  const longitude = addr.longitude || shop.longitude;

  let googleMapsUrl: string | null = null;

  if (shop.map_link || shop.google_maps_url) {
    googleMapsUrl = shop.map_link || shop.google_maps_url;
  } else if (latitude && longitude) {
    googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  } else if (fullAddress) {
    googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${shop.shop_name || ""} ${fullAddress}`
    )}`;
  }

  // 3. ข้อมูลพื้นฐานร้าน
  const isOpen = Boolean(shop.is_open);
  const isTempClosed = shop.is_temporarily_closed === true;
  const isClosedToday = !isOpenOnWeekday(shop.open_days, todayWeekdayBangkok());
  const statusText = isTempClosed
    ? "ปิดทำการชั่วคราว"
    : isOpen
    ? "เปิดให้บริการ"
    : isClosedToday
    ? "วันนี้ปิดทำการ"
    : "ปิดทำการ";
  const reopenText = !isTempClosed && isClosedToday ? nextOpenText(shop.open_days, shop.open_time, shop.close_time) : "";
  const phone = shop.phone || shop.contact || shop.shop_phone || shop.tel;

  // 4. รูปภาพโปรไฟล์ร้าน
  const rawImg = shop.profile_image || shop.image_url || shop.logo;
  let profileImg: string | null = null;

  if (rawImg) {
    if (
      rawImg.startsWith("http://") ||
      rawImg.startsWith("https://")
    ) {
      profileImg = rawImg;
    } else {
      const cleanPath = rawImg.replace(/\\/g, "/");
      const formattedPath = cleanPath.startsWith("/")
        ? cleanPath.slice(1)
        : cleanPath;

      profileImg = `${NEXT_PUBLIC_API_URL}/${formattedPath}`;
    }
  }

  const hoursText = hoursLabel(shop?.open_time, shop?.close_time);
  const allDay = isAllDayHours(shop?.open_time, shop?.close_time);
  const openHHMM = shop?.open_time ? String(shop.open_time).slice(0, 5) : "";
  const closeHHMM = shop?.close_time ? String(shop.close_time).slice(0, 5) : "";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm relative overflow-hidden">
      {/* เส้นตกแต่งด้านบน */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

      <div className="flex flex-col sm:flex-row gap-5 pt-1">
        {/* รูปร้าน */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shrink-0 flex items-center justify-center">
          {profileImg && !imgError ? (
            <img
              src={profileImg}
              alt={shop.shop_name || "ร้านค้า"}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Store className="w-12 h-12 text-slate-300" />
          )}
        </div>

        {/* ข้อมูลร้าน */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* แถว 1: ชื่อร้าน + เบอร์โทร | สถานะ (ขวาสุด) */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">
                {shop.shop_name || "ร้านค้างานพิมพ์"}
              </h1>
              <span className="h-6 w-px bg-slate-300" aria-hidden="true" />
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-lg transition"
                  title="คลิกเพื่อโทรออก"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {phone}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                  <Phone className="w-3.5 h-3.5" />
                  ยังไม่มีเบอร์ติดต่อ
                </span>
              )}
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
              <span
                className={`text-xs px-3 py-1.5 rounded-full font-bold border inline-flex items-center gap-1.5 ${
                  isOpen ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                {statusText}
              </span>
              {reopenText && <span className="text-[11px] text-slate-500">{reopenText}</span>}
            </div>
          </div>

          {/* แถว 2: คะแนนรีวิว + เวลาทำการ (กดดูวันเปิด-ปิด) */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/customer/shop/${shopId}/reviews`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-1.5 rounded-xl transition"
              title="คลิกเพื่อดูรีวิวร้านค้า"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-amber-950">{ratingValue}</span>
              <span className="text-amber-700 font-medium">({totalReviews} รีวิว)</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowSchedule((v) => !v)}
              aria-expanded={showSchedule}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                showSchedule
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100"
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{hoursText}</span>
              <span className="opacity-40">|</span>
              <span className="font-medium">วันเปิด-ปิด</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSchedule ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* ตารางวันเปิด-ปิด (กางในการ์ด) */}
          {showSchedule && (
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {weekSchedule(shop?.open_days, shop?.open_time, shop?.close_time).map((d) => (
                <div
                  key={d.weekday}
                  className={`relative rounded-xl border px-1 py-2 text-center ${
                    d.isOpen ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100"
                  } ${d.isToday ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
                >
                  {d.isToday && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 rounded-full bg-blue-600 text-white text-[9px] font-bold leading-4">
                      วันนี้
                    </span>
                  )}
                  <p className={`text-xs font-bold ${d.isOpen ? "text-slate-800" : "text-slate-400"}`}>
                    {d.name.replace("วัน", "").replace("พฤหัสบดี", "พฤหัส")}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 whitespace-nowrap ${
                      d.isOpen ? (allDay ? "text-emerald-600 font-semibold" : "text-slate-500") : "text-rose-500 font-semibold"
                    }`}
                  >
                    {!d.isOpen ? "ปิด" : allDay ? "24 ชม." : openHHMM && closeHHMM ? `${openHHMM}–${closeHHMM}` : "เปิด"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* แถว 3: ที่อยู่ + Google Maps */}
          <div className="flex items-start gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-slate-600 leading-relaxed">
              {fullAddress || "ยังไม่ได้ระบุรายละเอียดที่อยู่"}
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline whitespace-nowrap"
                  title="เปิดดูตำแหน่งบน Google Maps"
                >
                  Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
