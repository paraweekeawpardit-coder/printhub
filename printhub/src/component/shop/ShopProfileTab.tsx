"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Clock,
  Pencil,
  Lock,
  ChevronDown,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

type AddressData = {
  detail: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
};

type Props = {
  isVerified: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  togglingOpen: boolean;
  shopName: string;
  setShopName: (v: string) => void;
  ownerName: string;
  setOwnerName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  profileImage: string | null;
  onUploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
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

// ==========================================
// รูปโปรไฟล์ร้าน: แสดงรูป + กดเพื่อเปลี่ยนรูปได้ (ไม่มีปุ่มลบ เพราะร้านต้องมีรูปเสมอ)
// ==========================================
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_MB = 5;

function ShopAvatar({
  src,
  name,
  uploading,
  onSelectFile,
}: {
  src: string | null;
  name: string;
  uploading: boolean;
  onSelectFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [failed, setFailed] = useState(false);

  // เปลี่ยนรูปใหม่แล้วให้ลองโหลดใหม่
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = !!src && !failed;
  const openPicker = () => inputRef.current?.click();

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        aria-label="เปลี่ยนรูปโปรไฟล์ร้านค้า"
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#EAF1FF] text-xl font-bold text-[#2F6FED] ring-1 ring-slate-200 transition-shadow hover:ring-2 hover:ring-[#2F6FED]/40 disabled:cursor-wait"
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src as string}
            alt={`รูปโปรไฟล์ ${name}`}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          name ? name.charAt(0) : "S"
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 size={18} className="animate-spin text-[#2F6FED]" />
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        aria-label="เลือกรูปใหม่"
        className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0F2942] text-white transition-colors hover:bg-[#16385c] disabled:opacity-50"
      >
        <Camera size={13} />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // เลือกไฟล์เดิมซ้ำได้
          if (file) onSelectFile(file);
        }}
      />
    </div>
  );
}

// ==========================================
// TimePicker: เลือกเวลาแบบ 24 ชั่วโมง (00-23) ให้เข้ากับธีม
// value / onChange ใช้รูปแบบ "HH:mm" เหมือนที่เก็บในฐานข้อมูล
// ==========================================
const pad2 = (n: number) => String(n).padStart(2, "0");

const parseTime = (value: string) => {
  const [h, m] = (value || "").split(":");
  const hour = Math.min(23, Math.max(0, parseInt(h, 10) || 0));
  const minute = Math.min(59, Math.max(0, parseInt(m, 10) || 0));
  return { hour, minute };
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const timeItemClass = (selected: boolean) =>
  `flex h-9 w-full items-center justify-center rounded-lg text-sm tabular-nums transition-colors ${
    selected
      ? "bg-[#2F6FED] font-semibold text-white"
      : "text-slate-700 hover:bg-slate-100"
  }`;

function TimePicker({
  value,
  onChange,
  ariaLabel,
  align = "left",
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const { hour, minute } = parseTime(value);

  // นาทีทุก 5 นาที (ถ้าค่าเดิมในระบบไม่ลงตัว เช่น 09:07 ให้แสดงค่านั้นด้วย จะได้ไม่หาย)
  const minutes = useMemo(() => {
    const base = Array.from({ length: 12 }, (_, i) => i * 5);
    return base.includes(minute)
      ? base
      : [...base, minute].sort((a, b) => a - b);
  }, [minute]);

  // ปิดเมื่อคลิกข้างนอก หรือกด Esc
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // เปิดมาแล้วเลื่อนให้ค่าที่เลือกอยู่กลางรายการ
  useEffect(() => {
    if (!open) return;
    [hourListRef.current, minuteListRef.current].forEach((list) => {
      const el = list?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (list && el) {
        list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
      }
    });
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center gap-2 rounded-xl border bg-white px-3.5 py-2 text-left text-sm text-[#0F2942] outline-none transition-colors ${
          open
            ? "border-[#2F6FED] ring-2 ring-[#2F6FED]/15"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <Clock size={16} className="text-slate-400" />
        <span className="flex-1 tabular-nums">
          {pad2(hour)}:{pad2(minute)} น.
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full z-20 mt-1.5 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/10 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-center text-xs font-semibold text-slate-400">
                ชั่วโมง
              </p>
              <div
                ref={hourListRef}
                role="listbox"
                aria-label="ชั่วโมง"
                className="relative max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-100 p-1"
              >
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    role="option"
                    aria-selected={h === hour}
                    onClick={() => onChange(`${pad2(h)}:${pad2(minute)}`)}
                    className={timeItemClass(h === hour)}
                  >
                    {pad2(h)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-center text-xs font-semibold text-slate-400">
                นาที
              </p>
              <div
                ref={minuteListRef}
                role="listbox"
                aria-label="นาที"
                className="relative max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-100 p-1"
              >
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="option"
                    aria-selected={m === minute}
                    onClick={() => onChange(`${pad2(hour)}:${pad2(m)}`)}
                    className={timeItemClass(m === minute)}
                  >
                    {pad2(m)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-semibold tabular-nums text-[#0F2942]">
              {pad2(hour)}:{pad2(minute)} น.
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[#0F2942] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#16385c]"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopProfileTab({
  isVerified,
  isOpen,
  onToggleOpen,
  togglingOpen,
  shopName,
  setShopName,
  ownerName,
  setOwnerName,
  phone,
  setPhone,
  email,
  profileImage,
  onUploadImage,
  uploadingImage,
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
  const addressText = [
    address.detail,
    address.subdistrict,
    address.district,
    address.province,
    address.postcode,
  ]
    .filter(Boolean)
    .join(" ");

  const [imageMessage, setImageMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // ข้อความ "เปลี่ยนรูปแล้ว" หายเองหลัง 3 วินาที
  useEffect(() => {
    if (imageMessage?.type !== "success") return;
    const timer = setTimeout(() => setImageMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [imageMessage]);

  const handleSelectImage = async (file: File) => {
    setImageMessage(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageMessage({ type: "error", text: "รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP" });
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageMessage({ type: "error", text: `ไฟล์ต้องมีขนาดไม่เกิน ${MAX_IMAGE_MB} MB` });
      return;
    }

    const error = await onUploadImage(file);
    setImageMessage(
      error
        ? { type: "error", text: error }
        : { type: "success", text: "เปลี่ยนรูปร้านเรียบร้อยแล้ว" }
    );
  };

  const imageFeedback = (
    <>
      {imageMessage && (
        <p
          role={imageMessage.type === "error" ? "alert" : "status"}
          className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
            imageMessage.type === "error" ? "text-rose-500" : "text-emerald-600"
          }`}
        >
          {imageMessage.type === "error" ? (
            <AlertCircle size={12} className="shrink-0" />
          ) : (
            <Check size={12} className="shrink-0" />
          )}
          {imageMessage.text}
        </p>
      )}
      {!profileImage && !imageMessage && (
        <p className="mt-1.5 text-xs font-medium text-amber-600">
          ร้านของคุณยังไม่มีรูปโปรไฟล์ กรุณากดที่รูปเพื่ออัปโหลด
        </p>
      )}
    </>
  );

  return (
    <div className="relative">
      <div
        className={`space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
          !isVerified ? "pointer-events-none blur-[2px] select-none" : ""
        }`}
      >
        {/* สถานะร้าน: เปิด / ปิดชั่วคราว */}
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <div>
              <p className="text-sm font-bold text-[#0F2942]">
                {isOpen ? "ร้านเปิดให้บริการ" : "ปิดร้านชั่วคราว"}
              </p>
              <p className="text-xs text-slate-400">
                {isOpen
                  ? "ลูกค้าสามารถสั่งพิมพ์กับร้านคุณได้ตามปกติ"
                  : "ลูกค้าจะไม่สามารถสั่งพิมพ์กับร้านคุณได้ชั่วคราว"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleOpen}
            disabled={togglingOpen}
            aria-pressed={isOpen}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
              isOpen ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isOpen ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Default Mode: View Mode */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <ShopAvatar
                  src={profileImage}
                  name={shopName}
                  uploading={uploadingImage}
                  onSelectFile={handleSelectImage}
                />
                <div>
                  <p className="text-sm font-bold text-[#0F2942]">{shopName || "-"}</p>
                  <p className="text-xs text-slate-400">เจ้าของร้าน: {ownerName || "-"}</p>
                  {imageFeedback}
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
                  {openTime} — {closeTime} น.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">ที่อยู่ร้านค้า</p>
              <p className="mt-1 text-sm text-[#0F2942]">{addressText || "-"}</p>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <ShopAvatar
                src={profileImage}
                name={shopName}
                uploading={uploadingImage}
                onSelectFile={handleSelectImage}
              />
              <div>
                <p className="text-sm font-bold text-[#0F2942]">รูปโปรไฟล์ร้านค้า</p>
                <p className="text-xs text-slate-400">
                    JPG, PNG, WebP ไม่เกิน {MAX_IMAGE_MB} MB
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  กดที่รูปเพื่อเปลี่ยน (รูปจะถูกบันทึกทันที ไม่ต้องกดบันทึกข้อมูลร้าน)
                </p>
                {imageFeedback}
              </div>
            </div>

            {/* Inputs Form */}
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
                <TimePicker
                  value={openTime}
                  onChange={setOpenTime}
                  ariaLabel="เวลาเปิดร้าน"
                />
                <span className="text-slate-400">—</span>
                <TimePicker
                  value={closeTime}
                  onChange={setCloseTime}
                  ariaLabel="เวลาปิดร้าน"
                  align="right"
                />
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
              <button
                type="button"
                onClick={onToggleEdit}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-500 hover:border-slate-300 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="rounded-xl bg-[#0F2942] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#16385c] transition-colors disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลร้าน"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification Overlay */}
      {!isVerified && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 backdrop-blur-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Lock size={20} />
          </div>
          <p className="text-center px-6 text-sm font-semibold text-gray-900">
            คุณจะสามารถแก้ไขข้อมูลร้านได้ เมื่อผ่านการยืนยันตัวตนจากผู้ดูแลระบบแล้ว
          </p>
        </div>
      )}
    </div>
  );
}