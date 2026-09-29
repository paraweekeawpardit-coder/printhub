"use client";

import { X, Mail, Phone, Clock, MapPin, FileText, CheckCircle2, XCircle } from "lucide-react";

export interface ShopPending {
  _id?: string;
  id?: string;
  name?: string;
  shop_name?: string;
  ownerName?: string;
  owner_name?: string;
  email?: string;
  phone?: string;
  openTime?: string;
  open_time?: string;
  closeTime?: string;
  close_time?: string;
  address?: any;
  address_detail?: any;
  full_address?: string;
  description?: string;
  logoUrl?: string;
  logo_url?: string;
  profile_image?: string;
  documentUrl?: string;
  doc_url?: string;
  status?: string;
}

interface ShopDetailModalProps {
  shop: ShopPending | null;
  onClose: () => void;
  onApprove?: (shopId: string) => void;
  onReject?: (shopId: string) => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const cleanPath = url.startsWith("/") ? url.slice(1) : url;
  return `${BACKEND_URL}/${cleanPath}`;
};

export default function ShopDetailModal({
  shop,
  onClose,
  onApprove,
  onReject,
}: ShopDetailModalProps) {
  if (!shop) return null;

  const shopId = shop._id || shop.id || "";
  const shopName = shop.shop_name || shop.name || "ไม่มีชื่อร้าน";
  const ownerName = shop.owner_name || shop.ownerName || "-";
  const openTime = shop.open_time || shop.openTime;
  const closeTime = shop.close_time || shop.closeTime;

  // ฟังก์ชันจัดรูปแบบที่อยู่ (รองรับ String, Nested Object และชื่อ Key ย่อยหลากหลายรูปแบบ)
  const formatAddress = () => {
    const rawAddr = shop.address || shop.address_detail || shop.full_address;

    if (!rawAddr) return "ไม่ได้ระบุที่อยู่";

    // กรณีที่ส่งมาเป็น String (ข้อความเต็ม)
    if (typeof rawAddr === "string") return rawAddr;

    // กรณีที่ส่งมาเป็น Object (เช็กเผื่อหลายชื่อ key)
    if (typeof rawAddr === "object") {
      const houseNo = rawAddr.house_number || rawAddr.houseNo || rawAddr.detail || rawAddr.address || "";
      const street = rawAddr.street || rawAddr.road || "";
      const subdistrict = rawAddr.subdistrict || rawAddr.sub_district || rawAddr.tambon || "";
      const district = rawAddr.district || rawAddr.amphoe || "";
      const province = rawAddr.province || rawAddr.changwat || "";
      const zipcode = rawAddr.postcode || rawAddr.postal_code || rawAddr.zipcode || rawAddr.zip_code || "";

      const combined = [houseNo, street, subdistrict, district, province, zipcode]
        .filter(Boolean)
        .join(" ");

      return combined.trim() || "ไม่ได้ระบุที่อยู่";
    }

    return "ไม่ได้ระบุที่อยู่";
  };

  const logoSrc = getImageUrl(shop.logo_url || shop.logoUrl || shop.profile_image);
  const docSrc = getImageUrl(shop.documentUrl || shop.doc_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">รายละเอียดร้านค้า</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={shopName}
                className="w-16 h-16 rounded-xl object-cover border border-white shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl font-bold border border-white shadow-xs shrink-0">
                {shopName.charAt(0) || "S"}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-slate-900">{shopName}</h3>
              <p className="text-xs text-slate-500">เจ้าของร้าน: {ownerName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">อีเมล</p>
                <p className="font-medium text-slate-800">{shop.email || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">เบอร์โทรศัพท์</p>
                <p className="font-medium text-slate-800">{shop.phone || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">เวลาทำการ</p>
                <p className="font-medium text-slate-800">
                  {openTime && closeTime ? `${openTime} น. - ${closeTime} น.` : "ไม่ระบุเวลาทำการ"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-400">ที่อยู่ร้านค้า</p>
                <p className="font-medium text-slate-800 leading-relaxed">{formatAddress()}</p>
              </div>
            </div>
          </div>

          {shop.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">คำอธิบายร้านเพิ่มเติม</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {shop.description}
              </p>
            </div>
          )}

          {docSrc && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">เอกสารแนบประกอบการลงทะเบียน</h4>
              <a
                href={docSrc}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-xs text-sky-600 font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                เปิดดูเอกสารยืนยันตัวตน / ใบประกอบการ (PDF / Image)
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          {onReject && (
            <button
              type="button"
              onClick={() => onReject(shopId)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              ปฏิเสธคำขอ
            </button>
          )}

          {onApprove && (
            <button
              type="button"
              onClick={() => onApprove(shopId)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              อนุมัติร้านค้า
            </button>
          )}

          {!onApprove && !onReject && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          )}
        </div>
      </div>
    </div>
  );
}