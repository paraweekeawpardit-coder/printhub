"use client";

import { Camera, Clock, Pencil } from "lucide-react";

type AddressData = {
  detail: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
};

type Props = {
  shopName: string;
  setShopName: (v: string) => void;
  ownerName: string;
  setOwnerName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  openTime: string;
  setOpenTime: (v: string) => void;
  closeTime: string;
  setCloseTime: (v: string) => void;
  address: AddressData;
  setAddress: React.Dispatch<React.SetStateAction<AddressData>>;
  onSave: () => void;
  saving: boolean;
  hasData: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
};

export default function ShopProfileTab({
  shopName,
  setShopName,
  ownerName,
  setOwnerName,
  phone,
  setPhone,
  email,
  openTime,
  setOpenTime,
  closeTime,
  setCloseTime,
  address,
  setAddress,
  onSave,
  saving,
  hasData,
  isEditing,
  onToggleEdit,
}: Props) {
  // มีข้อมูลอยู่แล้ว และยังไม่ได้กดแก้ไข -> แสดงเป็นข้อมูลอย่างเดียว พร้อมปุ่มแก้ไข
  if (hasData && !isEditing) {
    const addressText = [
      address.detail,
      address.subdistrict,
      address.district,
      address.province,
      address.postcode,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF1FF] text-xl font-bold text-[#2F6FED]">
              {shopName ? shopName.charAt(0) : "S"}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F2942]">{shopName || "-"}</p>
              <p className="text-xs text-slate-400">เจ้าของร้าน: {ownerName || "-"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleEdit}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#0F2942] hover:border-[#0F2942] transition-colors"
          >
            <Pencil size={14} /> แก้ไขข้อมูล
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400">เบอร์โทรศัพท์</p>
            <p className="mt-1 text-sm text-[#0F2942]">{phone || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">อีเมล</p>
            <p className="mt-1 text-sm text-[#0F2942]">{email || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">เวลาทำการ</p>
            <p className="mt-1 text-sm text-[#0F2942] flex items-center gap-1.5">
              <Clock size={14} className="text-slate-400" />
              {openTime} — {closeTime}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400">ที่อยู่ร้านค้า</p>
          <p className="mt-1 text-sm text-[#0F2942]">{addressText || "-"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Profile Image */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF1FF] text-xl font-bold text-[#2F6FED]">
            {shopName ? shopName.charAt(0) : "S"}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2942] text-white hover:bg-[#16385c] transition-colors"
          >
            <Camera size={12} />
          </button>
        </div>
        <div>
          <p className="text-sm font-bold text-[#0F2942]">รูปโปรไฟล์ร้านค้า</p>
          <p className="text-xs text-slate-400">แนะนำขนาด 400 x 400 px</p>
        </div>
      </div>

      {/* Info Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">ชื่อร้านค้า</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="เช่น ตั๋วปริ้น ลาดกระบัง"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">ชื่อเจ้าของร้าน</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="ชื่อ-นามสกุล"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">เบอร์โทรศัพท์</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08x-xxx-xxxx"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">อีเมล</label>
          <input
            type="text"
            value={email}
            disabled
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <label className="text-xs font-semibold text-slate-600 mb-2 block">เวลาทำการ</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 rounded-xl border border-slate-200 px-3.5 py-2">
            <Clock size={16} className="text-slate-400" />
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full text-sm text-[#0F2942] outline-none bg-transparent"
            />
          </div>
          <span className="text-slate-400">—</span>
          <div className="flex items-center gap-2 flex-1 rounded-xl border border-slate-200 px-3.5 py-2">
            <Clock size={16} className="text-slate-400" />
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full text-sm text-[#0F2942] outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="text-xs font-semibold text-slate-600 mb-2 block">ที่อยู่ร้านค้า</label>
        <div className="space-y-3">
          <textarea
            value={address.detail}
            onChange={(e) => setAddress((prev) => ({ ...prev, detail: e.target.value }))}
            placeholder="เลขที่ อาคาร ซอย ถนน"
            rows={2}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED] resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={address.subdistrict}
              onChange={(e) => setAddress((prev) => ({ ...prev, subdistrict: e.target.value }))}
              placeholder="ตำบล / แขวง"
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
            />
            <input
              type="text"
              value={address.district}
              onChange={(e) => setAddress((prev) => ({ ...prev, district: e.target.value }))}
              placeholder="อำเภอ / เขต"
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
            />
            <input
              type="text"
              value={address.province}
              onChange={(e) => setAddress((prev) => ({ ...prev, province: e.target.value }))}
              placeholder="จังหวัด"
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
            />
            <input
              type="text"
              value={address.postcode}
              onChange={(e) => setAddress((prev) => ({ ...prev, postcode: e.target.value }))}
              placeholder="รหัสไปรษณีย์"
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0F2942] outline-none focus:border-[#2F6FED]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {hasData && (
          <button
            type="button"
            onClick={onToggleEdit}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 hover:border-slate-300 transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#16385c] transition-colors disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลร้าน"}
        </button>
      </div>
    </div>
  );
}