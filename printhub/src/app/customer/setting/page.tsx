"use client";

/**
 * หน้า: ตั้งค่าบัญชี (ลูกค้า)
 * Path: src/app/customer/setting/page.tsx
 * - ดึง/บันทึกข้อมูลผ่าน backend: GET/PUT /api/customer/profile
 * - เปลี่ยนรหัสผ่าน (ต้องยืนยันรหัสเดิม): PUT /api/customer/profile/password
 * - เปลี่ยนรูปโปรไฟล์ (คอลัมน์ customer.avatar): PUT /api/customer/profile/avatar
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Save,
  Camera,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  CalendarDays,
  RotateCcw,
} from "lucide-react";
import NavBar from "@/component/customer/NavBar";

const API = "http://localhost:5000/api/customer";
const PASSWORD_MIN = 6;

type Profile = { id: string; firstName: string; lastName: string; email: string; avatar: string; createdAt: string | null };
const EMPTY_PROFILE: Profile = { id: "", firstName: "", lastName: "", email: "", avatar: "", createdAt: null };

const mapProfile = (d: any): Profile => ({
  id: d?.id || "",
  firstName: d?.first_name || "",
  lastName: d?.last_name || "",
  email: d?.email || "",
  avatar: d?.avatar || "",
  createdAt: d?.created_at || null,
});

const formatMemberSince = (value: string | null) => {
  if (!value) return null;
  let cleaned = String(value).trim().replace(" ", "T");
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(cleaned)) cleaned += "Z";
  const d = new Date(cleaned);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "long", year: "numeric" });
};

// ช่องรหัสผ่านพร้อมปุ่มเปิด/ปิดการมองเห็น
function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <div className="relative">
        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </label>
  );
}

export default function CustomerSettingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [original, setOriginal] = useState<Profile>(EMPTY_PROFILE);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const notifyNavbar = (p: Profile) => {
    try {
      if (p.avatar) localStorage.setItem("user_avatar", p.avatar);
      window.dispatchEvent(new Event("profileUpdated"));
    } catch {}
  };

  // โหลดข้อมูลโปรไฟล์
  useEffect(() => {
    const cid = localStorage.getItem("customer_id") || localStorage.getItem("id") || localStorage.getItem("user_id");
    if (!cid || cid.startsWith("customer_")) {
      router.push("/auth");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/profile?customer_id=${cid}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "โหลดข้อมูลบัญชีไม่สำเร็จ");
        const p = mapProfile(json.data);
        setOriginal(p);
        setProfile(p);
      } catch (err: any) {
        setLoadError(err.message || "โหลดข้อมูลบัญชีไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const isDirty =
    profile.firstName.trim() !== original.firstName ||
    profile.lastName.trim() !== original.lastName ||
    profile.email.trim().toLowerCase() !== original.email.toLowerCase();

  // เปลี่ยนรูปโปรไฟล์
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !profile.id) return;

    if (!file.type.startsWith("image/")) return showToast("error", "รองรับเฉพาะไฟล์รูปภาพ");

    try {
      setUploadingAvatar(true);
      const fd = new FormData();
      fd.append("customer_id", profile.id);
      fd.append("avatar", file);
      const res = await fetch(`${API}/profile/avatar`, { method: "PUT", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "อัปโหลดรูปภาพไม่สำเร็จ");

      const updated = { ...profile, avatar: json.avatar };
      setProfile(updated);
      setOriginal((o) => ({ ...o, avatar: json.avatar }));
      notifyNavbar(updated);
      showToast("success", "เปลี่ยนรูปโปรไฟล์เรียบร้อยแล้ว");
    } catch (err: any) {
      showToast("error", err.message || "อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // บันทึกข้อมูลส่วนตัว
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.firstName.trim()) return showToast("error", "กรุณาระบุชื่อ");
    if (!profile.email.trim()) return showToast("error", "กรุณาระบุอีเมล");

    try {
      setSaving(true);
      const res = await fetch(`${API}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: profile.id,
          first_name: profile.firstName.trim(),
          last_name: profile.lastName.trim(),
          email: profile.email.trim().toLowerCase(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "ไม่สามารถบันทึกข้อมูลได้");

      const p = json.data ? mapProfile(json.data) : { ...profile };
      setOriginal(p);
      setProfile(p);
      notifyNavbar(p);
      showToast("success", "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
    } catch (err: any) {
      showToast("error", err.message || "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  // เปลี่ยนรหัสผ่าน
  const pwLongEnough = passwords.next.length >= PASSWORD_MIN;
  const pwMatch = passwords.next.length > 0 && passwords.next === passwords.confirm;
  const canChangePassword = passwords.current.length > 0 && pwLongEnough && pwMatch && !changingPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canChangePassword) return;
    try {
      setChangingPassword(true);
      const res = await fetch(`${API}/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: profile.id,
          current_password: passwords.current,
          new_password: passwords.next,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      setPasswords({ current: "", next: "", confirm: "" });
      showToast("success", "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว ครั้งหน้าให้ใช้รหัสผ่านใหม่เข้าสู่ระบบ");
    } catch (err: any) {
      showToast("error", err.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    } finally {
      setChangingPassword(false);
    }
  };

  const fullNameDisplay = useMemo(
    () => [original.firstName, original.lastName].filter(Boolean).join(" ") || "ผู้ใช้งาน PrintHub",
    [original.firstName, original.lastName]
  );
  const memberSince = formatMemberSince(original.createdAt);
  const initials = (original.firstName || original.email || "?").trim().charAt(0).toUpperCase();

  const inputClass =
    "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white transition";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased pb-12">
      <NavBar />

      {toastMsg && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium ${
            toastMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ตั้งค่าบัญชี</h1>
          <p className="text-sm text-slate-500 mt-1">จัดการข้อมูลส่วนตัว รูปโปรไฟล์ และรหัสผ่านของคุณ</p>
        </div>

        {loading ? (
          <div className="py-28 flex flex-col items-center justify-center text-sm text-slate-400 gap-3">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
            <span className="font-medium">กำลังโหลดข้อมูลบัญชี...</span>
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-3xl border border-rose-200 p-10 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="font-bold text-slate-800">{loadError}</p>
            <p className="text-xs text-slate-500">ลองรีเฟรชหน้า หรือตรวจสอบว่า backend ทำงานอยู่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
            {/* ซ้าย: การ์ดโปรไฟล์ */}
            <aside className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden md:sticky md:top-24">
              <div className="h-20 bg-gradient-to-br from-[#0F2942] to-blue-600" />
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full ring-4 ring-white bg-slate-100 overflow-hidden flex items-center justify-center shadow-md">
                    {profile.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.avatar} alt="รูปโปรไฟล์" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-slate-400">{initials}</span>
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center ring-4 ring-white transition cursor-pointer disabled:opacity-60"
                    aria-label="เปลี่ยนรูปโปรไฟล์"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>

                <p className="mt-3 font-bold text-slate-900 text-base">{fullNameDisplay}</p>
                <p className="text-xs text-slate-500 truncate max-w-full">{original.email || "ยังไม่ได้ระบุอีเมล"}</p>

                {memberSince && (
                  <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    <CalendarDays className="w-3 h-3" />
                    สมาชิกตั้งแต่ {memberSince}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="mt-4 w-full py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-60"
                >
                  {uploadingAvatar ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
                </button>
              </div>
            </aside>

            {/* ขวา: ฟอร์ม */}
            <div className="space-y-6">
              {/* ข้อมูลส่วนตัว */}
              <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">ข้อมูลส่วนตัว</h2>
                    <p className="text-xs text-slate-500">ชื่อที่แสดงกับร้านค้า และอีเมลสำหรับเข้าสู่ระบบ</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600">
                        ชื่อ <span className="text-rose-500">*</span>
                      </span>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        placeholder="กรอกชื่อ"
                        className={inputClass}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600">นามสกุล</span>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        placeholder="กรอกนามสกุล"
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">
                      อีเมล <span className="text-rose-500">*</span>
                    </span>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="example@mail.com"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                    <span className="block text-[11px] text-slate-400">
                      ใช้อีเมลนี้เข้าสู่ระบบ หากเปลี่ยน ครั้งหน้าต้องเข้าสู่ระบบด้วยอีเมลใหม่
                    </span>
                  </label>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl flex items-center justify-end gap-2">
                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => setProfile(original)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      ยกเลิก
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!isDirty || saving}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition bg-[#0F2942] text-white hover:bg-[#16395c] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                  </button>
                </div>
              </form>

              {/* เปลี่ยนรหัสผ่าน */}
              <form onSubmit={handleChangePassword} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">เปลี่ยนรหัสผ่าน</h2>
                    <p className="text-xs text-slate-500">ยืนยันรหัสผ่านปัจจุบันก่อนตั้งรหัสผ่านใหม่</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <PasswordField
                    label="รหัสผ่านปัจจุบัน"
                    value={passwords.current}
                    onChange={(v) => setPasswords({ ...passwords, current: v })}
                    placeholder="กรอกรหัสผ่านที่ใช้อยู่"
                    autoComplete="current-password"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PasswordField
                      label="รหัสผ่านใหม่"
                      value={passwords.next}
                      onChange={(v) => setPasswords({ ...passwords, next: v })}
                      placeholder={`อย่างน้อย ${PASSWORD_MIN} ตัวอักษร`}
                      autoComplete="new-password"
                    />
                    <PasswordField
                      label="ยืนยันรหัสผ่านใหม่"
                      value={passwords.confirm}
                      onChange={(v) => setPasswords({ ...passwords, confirm: v })}
                      placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                      autoComplete="new-password"
                    />
                  </div>

                  {(passwords.next || passwords.confirm) && (
                    <ul className="text-xs space-y-1">
                      {[
                        { ok: pwLongEnough, text: `อย่างน้อย ${PASSWORD_MIN} ตัวอักษร` },
                        { ok: pwMatch, text: "รหัสผ่านใหม่ทั้งสองช่องตรงกัน" },
                      ].map((r) => (
                        <li key={r.text} className={`flex items-center gap-1.5 ${r.ok ? "text-emerald-600" : "text-slate-400"}`}>
                          <Check className={`w-3.5 h-3.5 ${r.ok ? "" : "opacity-40"}`} />
                          {r.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl flex justify-end">
                  <button
                    type="submit"
                    disabled={!canChangePassword}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition bg-[#0F2942] text-white hover:bg-[#16395c] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {changingPassword ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
