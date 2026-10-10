"use client";

import {
  X,
  Mail,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  CreditCard,
  Layers,
} from "lucide-react";

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
  openDays?: string;
  open_days?: string;
  address?: any;
  address_detail?: any;
  full_address?: string;
  description?: string;
  logoUrl?: string;
  logo_url?: string;
  profile_image?: string;
  taxId?: string;
  tax_id?: string;
  id_card_number?: string;
  bankName?: string;
  bank_name?: string;
  bank?: string;
  bankAccountNo?: string;
  bank_account_no?: string;
  account_number?: string;
  account_no?: string;
  bankAccountName?: string;
  bank_account_name?: string;
  account_name?: string;
  bank_account?: any;
  shop_bank_account?: any;
  services?: string[];
  service_types?: any[];
  status?: string;
}

interface ShopDetailModalProps {
  shop: ShopPending | null;
  onClose: () => void;
  onApprove?: (shopId: string) => void;
  onReject?: (shopId: string) => void;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
  const openDays = shop.open_days || shop.openDays;

  // ฟังก์ชันดึงข้อมูลบัญชีธนาคารครอบคลุมทุกโครงสร้าง Data
  const extractBankInfo = () => {
    let rawBank: any = shop.bank_account || shop.shop_bank_account;

    if (Array.isArray(rawBank) && rawBank.length > 0) {
      rawBank = rawBank[0];
    }

    const bName =
      rawBank?.bank_name ||
      rawBank?.bankName ||
      rawBank?.bank ||
      (shop as any).bank_name ||
      (shop as any).bankName ||
      (shop as any).bank ||
      "-";

    const bAccNo =
      rawBank?.account_number ||
      rawBank?.account_no ||
      rawBank?.bank_account_no ||
      rawBank?.bankAccountNo ||
      (shop as any).account_number ||
      (shop as any).account_no ||
      (shop as any).bank_account_no ||
      (shop as any).bankAccountNo ||
      "-";

    const bAccName =
      rawBank?.account_name ||
      rawBank?.bank_account_name ||
      rawBank?.bankAccountName ||
      (shop as any).account_name ||
      (shop as any).bank_account_name ||
      (shop as any).bankAccountName ||
      (shop as any).owner_name ||
      (shop as any).ownerName ||
      "-";

    return {
      bankName: bName,
      bankAccountNo: bAccNo,
      bankAccountName: bAccName,
    };
  };

  const { bankName, bankAccountNo, bankAccountName } = extractBankInfo();

  const rawServices = shop.services || shop.service_types || [];
  const serviceList = rawServices
    .map((s) =>
      typeof s === "string" ? s : s?.name || s?.type || s?.category || ""
    )
    .filter(Boolean);

  const formatAddress = () => {
    const rawAddr = shop.address || shop.address_detail || shop.full_address;

    if (!rawAddr) return "ไม่ได้ระบุที่อยู่";
    if (typeof rawAddr === "string") return rawAddr;

    if (typeof rawAddr === "object") {
      const houseNo =
        rawAddr.house_number ||
        rawAddr.houseNo ||
        rawAddr.detail ||
        rawAddr.address ||
        "";
      const street = rawAddr.street || rawAddr.road || "";
      const subdistrict =
        rawAddr.subdistrict || rawAddr.sub_district || rawAddr.tambon || "";
      const district = rawAddr.district || rawAddr.amphoe || "";
      const province = rawAddr.province || rawAddr.changwat || "";
      const zipcode =
        rawAddr.postcode ||
        rawAddr.postal_code ||
        rawAddr.zipcode ||
        rawAddr.zip_code ||
        "";

      const combined = [
        houseNo,
        street,
        subdistrict,
        district,
        province,
        zipcode,
      ]
        .filter(Boolean)
        .join(" ");

      return combined.trim() || "ไม่ได้ระบุที่อยู่";
    }

    return "ไม่ได้ระบุที่อยู่";
  };

  const logoSrc = getImageUrl(
    shop.logo_url || shop.logoUrl || shop.profile_image
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            รายละเอียดข้อมูลการลงทะเบียนร้านค้า
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* ข้อมูลโปรไฟล์ร้านค้า */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={shopName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl font-bold border border-slate-200 shadow-xs shrink-0">
                {shopName.charAt(0) || "S"}
              </div>
            )}
            <div className="space-y-0.5">
              <h3 className="text-lg font-bold text-slate-900">{shopName}</h3>
              <p className="text-xs text-slate-500">
                เจ้าของร้าน: <span className="font-semibold text-slate-700">{ownerName}</span>
              </p>
            </div>
          </div>

          {/* ข้อมูลการติดต่อ & เวลาทำการ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">อีเมล</p>
                <p className="font-medium text-slate-800 break-all">{shop.email || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">เบอร์โทรศัพท์</p>
                <p className="font-medium text-slate-800">{shop.phone || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">เวลาทำการ / วันทำการ</p>
                <p className="font-medium text-slate-800">
                  {openTime && closeTime ? `${openTime} น. - ${closeTime} น.` : "ไม่ระบุเวลาทำการ"}
                  {openDays && <span className="ml-2 text-slate-500">({openDays})</span>}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">ที่อยู่ร้านค้า</p>
                <p className="font-medium text-slate-800 leading-relaxed">{formatAddress()}</p>
              </div>
            </div>
          </div>

          {/* ข้อมูลบัญชีธนาคารสำหรับรับเงินโอน */}
          <div className="bg-sky-50/60 border border-sky-100 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
              <CreditCard className="w-4 h-4 text-sky-600 shrink-0" />
              <span>ข้อมูลบัญชีธนาคารสำหรับรับเงินโอน</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ธนาคาร</span>
                <span className="font-bold text-slate-800">{bankName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">เลขที่บัญชี</span>
                <span className="font-mono font-bold text-slate-800">{bankAccountNo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ชื่อบัญชี</span>
                <span className="font-bold text-slate-800">{bankAccountName}</span>
              </div>
            </div>
          </div>

          {/* รายการบริการ */}
          {serviceList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Layers className="w-4 h-4 text-sky-600 shrink-0" />
                <span>ประเภทบริการที่เปิดให้บริการ</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {serviceList.map((srv, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* คำอธิบายร้านเพิ่มเติม */}
          {shop.description && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">คำอธิบายร้านเพิ่มเติม</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {shop.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer (จุดอนุมัติ / ปฏิเสธ) */}
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
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
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