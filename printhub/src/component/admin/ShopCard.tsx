"use client";

import { Eye } from "lucide-react";

export interface Shop {
  id?: string;
  _id?: string;
  shop_name?: string;
  name?: string;
  owner_name?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  logoUrl?: string;
  open_time?: string;
  close_time?: string;
  openTime?: string;
  closeTime?: string;
  address?: any;
  description?: string;
  documentUrl?: string;
  is_verify?: boolean;
  status?: string;
  created_at?: string;
  bank_account?: any;
  tax_id?: string;
  id_card_number?: string;
  services?: any[];
}

interface ShopCardProps {
  shop: Shop;
  onVerify?: (shop_id: string, action: "approve" | "reject") => void;
  onSelectShop?: (shop: Shop) => void;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  return `${BACKEND_URL}/${cleanPath}`;
};

export default function ShopCard({ shop, onSelectShop }: ShopCardProps) {
  const shopId = shop.id || shop._id || "";
  const shopName = shop.shop_name || shop.name || "ไม่ระบุชื่อร้าน";
  const ownerName = shop.owner_name || shop.ownerName || "ไม่ระบุ";

  const rawImageSrc = shop.profile_image || shop.logoUrl;
  const imageSrc = getImageUrl(rawImageSrc);

  const openTime = shop.open_time || shop.openTime;
  const closeTime = shop.close_time || shop.closeTime;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "ไม่ระบุ";
    return timeStr.slice(0, 5) + " น.";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      {/* Card Header */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-sky-50 shrink-0">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={shopName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 text-2xl font-bold">
                {shopName.charAt(0) || "S"}
              </div>
            )}
          </div>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
            รอดำเนินการ
          </span>
        </div>

        {/* Card Body */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
            {shopName}
          </h3>
          <p className="text-sm text-slate-500">
            เจ้าของร้าน: <span className="text-slate-700 font-semibold">{ownerName}</span>
          </p>

          <div className="h-px bg-slate-100 my-4" />

          <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">อีเมล</span>
              <span className="text-slate-700 font-medium break-all max-w-[65%] text-right">
                {shop.email || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">เบอร์โทรศัพท์</span>
              <span className="text-slate-700 font-medium">{shop.phone || "-"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">เวลาทำการ</span>
              <span className="text-sky-950 font-semibold">
                {formatTime(openTime)} - {formatTime(closeTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button: เปิด Modal ตรวจสอบข้อมูลก่อน */}
      <div className="mt-5 pt-2">
        {onSelectShop && (
          <button
            type="button"
            onClick={() => onSelectShop(shop)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>ดูรายละเอียดข้อมูลร้านเพื่อดำเนินการ</span>
          </button>
        )}
      </div>
    </div>
  );
}