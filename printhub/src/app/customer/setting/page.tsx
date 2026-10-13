"use client";

import React, { useState, useEffect, useRef } from "react";
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
  EyeOff
} from "lucide-react";
import supabase from "@/config/supabase";
import NavBar from "@/component/customer/NavBar";

export default function CustomerSettingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State สำหรับเปิด/ปิดการแสดงรหัสผ่าน (true = เปิดตา/เห็นรหัส, false = ปิดตา/ซ่อนรหัส)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // ข้อมูลโปรไฟล์
  const [profile, setProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar_url: "",
  });

  // รหัสผ่าน
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);

        const localId =
          typeof window !== "undefined"
            ? localStorage.getItem("customer_id") ||
            localStorage.getItem("id") ||
            localStorage.getItem("user_id")
            : null;

        const { data: { user } } = await supabase.auth.getUser();
        const effectiveId = localId || user?.id;

        if (!effectiveId) {
          router.push("/auth");
          return;
        }

        // ดึงข้อมูลตรงจากตาราง customer
        const { data: customerData, error } = await supabase
          .from("customer")
          .select("id, first_name, last_name, contact, profile_image")
          .eq("id", effectiveId)
          .maybeSingle();

        if (error) {
          console.error("Fetch profile error:", error.message);
        }

        setProfile({
          id: effectiveId,
          firstName: customerData?.first_name || "",
          lastName: customerData?.last_name || "",
          email: customerData?.contact || user?.email || "",
          avatar_url: customerData?.profile_image || "",
        });

      } catch (err: any) {
        console.error("Load user error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  // 🌟 ฟังก์ชันอัปโหลดและเปลี่ยนรูปโปรไฟล์
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile.id) return;

    // เช็คขนาดไฟล์ (ไม่เกิน 3MB)
    if (file.size > 3 * 1024 * 1024) {
      showToast("error", "ขนาดไฟล์รูปภาพต้องไม่เกิน 3MB");
      return;
    }

    try {
      setUploadingAvatar(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `avatar_${profile.id}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // อัปโหลดเข้า Storage bucket 'print_files'
      const { error: uploadError } = await supabase.storage
        .from("print_files")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // ขอ Public URL
      const { data: urlData } = supabase.storage
        .from("print_files")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // บันทึก URL ลงตาราง customer
      const { error: updateError } = await supabase
        .from("customer")
        .update({ profile_image: publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      showToast("success", "เปลี่ยนรูปโปรไฟล์สำเร็จ");
    } catch (err: any) {
      console.error("Upload avatar error:", err);
      showToast("error", err.message || "อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 🌟 ฟังก์ชันบันทึกข้อมูลส่วนตัว (พร้อมตรวจสอบ Email ซ้ำ)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.firstName.trim()) {
      showToast("error", "กรุณาระบุชื่อ");
      return;
    }
    if (!profile.email.trim()) {
      showToast("error", "กรุณาระบุอีเมล");
      return;
    }

    try {
      setSaving(true);

      const inputEmail = profile.email.trim().toLowerCase();

      // 1. ตรวจสอบว่า Email ซ้ำกับลูกค้ารายอื่นในระบบหรือไม่
      const { data: existingUser, error: checkError } = await supabase
        .from("customer")
        .select("id")
        .eq("contact", inputEmail)
        .neq("id", profile.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        showToast("error", "อีเมลนี้มีผู้ใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น");
        setSaving(false);
        return;
      }

      // 2. อัปเดตข้อมูลลงฐานข้อมูล
      const { error: updateError } = await supabase
        .from("customer")
        .update({
          first_name: profile.firstName.trim(),
          last_name: profile.lastName.trim(),
          contact: inputEmail,
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // ซิงค์ชื่อและอีเมลไปยัง Supabase Auth (ถ้ามี session)
      try {
        await supabase.auth.updateUser({
          email: inputEmail,
          data: {
            first_name: profile.firstName.trim(),
            last_name: profile.lastName.trim()
          }
        });
      } catch (authErr) {
        console.warn("Auth sync warning:", authErr);
      }

      showToast("success", "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
    } catch (err: any) {
      console.error("Update profile error:", err);
      showToast("error", err.message || "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  // เปลี่ยนรหัสผ่าน
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPassword) {
      showToast("error", "กรุณาระบุรหัสผ่านใหม่");
      return;
    }
    if (passwords.newPassword.length < 6) {
      showToast("error", "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("error", "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setChangingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });

      if (error) throw error;
      showToast("success", "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast("error", err.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    } finally {
      setChangingPassword(false);
    }
  };

  const fullNameDisplay = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "ผู้ใช้งาน PrintHub";

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-800 antialiased pb-12">
      <NavBar cartCount={cartCount} />

      {toastMsg && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium animate-in slide-in-from-top-2 ${toastMsg.type === "success"
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

      {loading ? (
        <div className="py-28 flex flex-col items-center justify-center text-sm text-slate-400 gap-3">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          <span className="font-medium">กำลังโหลดข้อมูลบัญชี...</span>
        </div>
      ) : (
        <main className="max-w-4xl w-full mx-auto px-4 py-6 space-y-6 flex-1">
          <div className="border-b border-slate-200/80 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">ตั้งค่าบัญชี</h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการชื่อผู้ใช้งาน อีเมล และเปลี่ยนรหัสผ่านความปลอดภัยของคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* การ์ดโปรไฟล์ฝั่งซ้าย */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center space-y-4 h-fit">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold text-3xl shadow-md overflow-hidden">
                  {uploadingAvatar ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  ) : profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={fullNameDisplay}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.firstName ? profile.firstName.charAt(0).toUpperCase() : <User size={40} />
                  )}
                </div>

                {/* ปุ่มกดอัปโหลดรูป */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  title="เปลี่ยนรูปโปรไฟล์"
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-slate-600 shadow-md border border-slate-200 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                >
                  <Camera size={16} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
              </div>

              <div className="w-full px-2">
                <h2 className="text-base font-bold text-slate-900 truncate">
                  {fullNameDisplay}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5 truncate">
                  {profile.email || "ไม่มีข้อมูลอีเมล"}
                </p>
              </div>
            </div>

            {/* ฟอร์มแก้ไขข้อมูลฝั่งขวา */}
            <div className="md:col-span-2 space-y-6">
              {/* การ์ดที่ 1: ข้อมูลส่วนตัว */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  ข้อมูลส่วนตัว
                </h3>

                <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        ชื่อ
                      </label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        placeholder="กรอกชื่อ"
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        นามสกุล
                      </label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        placeholder="กรอกนามสกุล"
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      อีเมล (ตรวจสอบการซ้ำในระบบ)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="example@mail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2942] hover:bg-[#1a3d5e] active:scale-95 text-white text-sm font-semibold shadow-xs transition cursor-pointer disabled:opacity-60"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{saving ? "กำลังบันทึก..." : "บันทึกข้อมูลส่วนตัว"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* การ์ดที่ 2: เปลี่ยนรหัสผ่าน */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  เปลี่ยนรหัสผ่าน
                </h3>

                <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ช่องรหัสผ่านใหม่ */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        รหัสผ่านใหม่
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                          placeholder="อย่างน้อย 6 ตัวอักษร"
                          className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* ช่องยืนยันรหัสผ่านใหม่ */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        ยืนยันรหัสผ่านใหม่
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                          placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                          className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                        >
                          {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-sm font-semibold transition cursor-pointer disabled:opacity-60 shadow-2xs"
                    >
                      {changingPassword ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-slate-600" />
                      )}
                      <span>{changingPassword ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}