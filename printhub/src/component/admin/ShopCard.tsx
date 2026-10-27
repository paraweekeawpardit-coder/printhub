"use client";

import React from "react";
import { Store, User, Phone, Mail, FileText, CheckCircle, XCircle } from "lucide-react";

// 🟢 Export interface Shop เพื่อให้ไฟล์อื่น Import ไปใช้งานได้
export interface Shop {
  id?: string | number;
  _id?: string | number;
  shop_name?: string;
  name?: string;
  owner_name?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  status?: string;
  profile_image?: string;
  logoUrl?: string;
  id_card_image?: string;
  tax_id?: string;
  created_at?: string;
  createdAt?: string;
  [key: string]: any;
}

interface ShopCardProps {
  shop: Shop;
  onVerify: (shop_id: string | number, action: "approve" | "reject") => void;
  onSelectShop: (shop: Shop) => void;
}

export default function ShopCard({ shop, onVerify, onSelectShop }: ShopCardProps) {
  const shopId = shop.id || shop._id || "";
  const shopName = shop.shop_name || shop.name || "ไม่ระบุชื่อร้านค้า";
  const ownerName = shop.owner_name || shop.ownerName || "-";
  const logo = shop.profile_image || shop.logoUrl;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between space-y-4 font-sans">
      <div className="space-y-3">
        {/* Header ส่วนรูปและชื่อร้าน */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          {logo ? (
            <img
              src={logo}
              alt={shopName}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
              <Store size={22} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate" title={shopName}>
              {shopName}
            </h3>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              ยื่นเรื่องเมื่อ: {formatDate(shop.created_at || shop.createdAt)}
            </span>
          </div>
        </div>

        {/* ข้อมูลการติดต่อ */}
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 truncate">
            <User size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">เจ้าของ: <strong className="text-slate-800">{ownerName}</strong></span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Phone size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{shop.phone || "-"}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Mail size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{shop.email || "-"}</span>
          </div>
        </div>
      </div>

      {/* ปุ่มจัดการ */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <button
          onClick={() => onSelectShop(shop)}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText size={14} />
          <span>ดูเอกสารและรายละเอียด</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onVerify(shopId, "reject")}
            className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all border border-rose-200 flex items-center justify-center gap-1 cursor-pointer"
          >
            <XCircle size={14} />
            <span>ปฏิเสธ</span>
          </button>
          <button
            onClick={() => onVerify(shopId, "approve")}
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <CheckCircle size={14} />
            <span>อนุมัติ</span>
          </button>
        </div>
      </div>
    </div>
  );
}