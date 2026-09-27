"use client";

import { X, Mail, Phone, Clock, MapPin, FileText, CheckCircle2, XCircle } from "lucide-react";

export interface ShopPending {
  _id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  openTime?: string;
  closeTime?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  documentUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ShopDetailModalProps {
  shop: ShopPending | null;
  onClose: () => void;
  onApprove: (shopId: string) => void;
  onReject: (shopId: string) => void;
}

export default function ShopDetailModal({
  shop,
  onClose,
  onApprove,
  onReject,
}: ShopDetailModalProps) {
  if (!shop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">รายละเอียดคำขอลงทะเบียนร้านค้า</h2>
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
          {/* Header Info */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <img
              src={shop.logoUrl || "/placeholder-shop.png"}
              alt={shop.name}
              className="w-16 h-16 rounded-xl object-cover border border-white shadow-xs"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900">{shop.name}</h3>
              <p className="text-xs text-slate-500">เจ้าของร้าน: {shop.ownerName}</p>
              <span className="inline-block mt-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                รอการตรวจสอบ
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">อีเมล</p>
                <p className="font-medium text-slate-800">{shop.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">เบอร์โทรศัพท์</p>
                <p className="font-medium text-slate-800">{shop.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400">เวลาทำการ</p>
                <p className="font-medium text-slate-800">
                  {shop.openTime && shop.closeTime
                    ? `${shop.openTime} น. - ${shop.closeTime} น.`
                    : "ไม่ระบุเวลาทำการ"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-400">ที่อยู่ร้านค้า</p>
                <p className="font-medium text-slate-800 leading-relaxed">
                  {shop.address || "ไม่ได้ระบุที่อยู่"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {shop.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">คำอธิบายร้านเพิ่มเติม</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {shop.description}
              </p>
            </div>
          )}

          {/* Documents */}
          {shop.documentUrl && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">เอกสารแนบประกอบการลงทะเบียน</h4>
              <a
                href={shop.documentUrl}
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
          <button
            type="button"
            onClick={() => onReject(shop._id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            ปฏิเสธคำขอ
          </button>
          <button
            type="button"
            onClick={() => onApprove(shop._id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            อนุมัติร้านค้า
          </button>
        </div>
      </div>
    </div>
  );
}