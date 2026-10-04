/**
 * =========================================================================
 * Page: Customer Settings (/customer/setting)
 * -------------------------------------------------------------------------
 * หน้าที่การทำงาน:
 * 1. แถบนำทางด้านบน (NavBar) คุมธีมเดียวกับระบบหลัก
 * 2. แสดงและแก้ไขข้อมูลโปรไฟล์ผู้ใช้ (ชื่อ-นามสกุล, อีเมล, เบอร์โทรศัพท์, ที่อยู่)
 * 3. แสดงรูปโปรไฟล์/อักษรย่อผู้ใช้แบบสม่ำเสมอ
 * 4. จัดการเปลี่ยนรหัสผ่าน (Password Change) พร้อมการตรวจสอบความถูกต้อง
 * =========================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Save, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import supabase from "@/config/supabase";
import NavBar from "@/component/customer/NavBar";

export default function CustomerSettingPage() {
  const router = useRouter();

  // สถานะการโหลด ตะกร้า และแจ้งเตือน
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ข้อมูลโปรไฟล์
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar_url: "",
  });

  // สถานะรหัสผ่าน
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState<boolean>(false);

  // ดึงข้อมูลผู้ใช้จาก Supabase
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/auth/login"); // หรือ path หน้าล็อกอินที่คุณสร้างไว้ เช่น /customer/login
            return;
            }

        const { data: customerData, error } = await supabase
          .from("customer")
          .select("id, name, phone, address, profile_image")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        setProfile({
          id: user.id,
          email: user.email || "",
          name: customerData?.name || "",
          phone: customerData?.phone || "",
          address: customerData?.address || "",
          avatar_url: customerData?.profile_image || "",
        });

        // ดึงจำนวนสินค้าในตะกร้าจาก localStorage (ถ้ามี)
        if (typeof window !== "undefined") {
          const savedCart = localStorage.getItem("cart_items");
          if (savedCart) {
            try {
              const parsed = JSON.parse(savedCart);
              setCartCount(Array.isArray(parsed) ? parsed.length : 0);
            } catch {
              setCartCount(0);
            }
          }
        }
      } catch (err: any) {
        console.error("Fetch profile error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // จัดการอัปเดตโปรไฟล์
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      const { error } = await supabase
        .from("customer")
        .update({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        })
        .eq("id", profile.id);

      if (error) throw error;
      showToast("success", "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
    } catch (err: any) {
      showToast("error", err.message || "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  // จัดการเปลี่ยนรหัสผ่าน
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
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast("error", err.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-800 antialiased pb-12">
      {/* NavBar ด้านบน */}
      <NavBar 
        cartCount={cartCount} 
        onOpenCart={() => router.push("/customer/cart")} 
      />

      {/* Toast แจ้งเตือน */}
      {toastMsg && (
        <div 
          className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium animate-in slide-in-from-top-2 ${
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

      {loading ? (
        <div className="py-28 flex flex-col items-center justify-center text-sm text-slate-400 gap-3">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          <span className="font-medium">กำลังโหลดข้อมูลบัญชี...</span>
        </div>
      ) : (
        <main className="max-w-5xl w-full mx-auto px-4 py-6 space-y-6 flex-1">
          {/* Header ของหน้า */}
          <div className="border-b border-slate-200/80 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">ตั้งค่าบัญชี</h1>
            <p className="text-sm text-slate-500 mt-1">
              จัดการข้อมูลโปรไฟล์ ที่อยู่เริ่มต้น และความปลอดภัยของบัญชีคุณ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ฝั่งซ้าย: การ์ดโปรไฟล์ */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col items-center text-center space-y-4 h-fit">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold text-3xl shadow-md overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  profile.name ? profile.name.charAt(0).toUpperCase() : <User size={40} />
                )}
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">{profile.name || "ผู้ใช้งาน PrintHub"}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{profile.email}</p>
              </div>

              <div className="w-full pt-4 border-t border-slate-100 flex flex-col gap-2 text-left text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>สถานะบัญชี: ยืนยันแล้ว</span>
                </div>
              </div>
            </div>

            {/* ฝั่งขวา: ฟอร์มแก้ไขข้อมูล & รหัสผ่าน */}
            <div className="md:col-span-2 space-y-6">
              {/* การ์ดที่ 1: ข้อมูลส่วนตัว */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  ข้อมูลส่วนตัว
                </h3>

                <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      ชื่อ - นามสกุล
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="เช่น วัฒนวดี ชุ่มเย็น"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        อีเมล (ไม่สามารถเปลี่ยนได้)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        เบอร์โทรศัพท์
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="08X-XXX-XXXX"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      ที่อยู่สำหรับจัดส่งเอกสารหรือนัดรับ
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <textarea
                        rows={3}
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        placeholder="ระบุที่อยู่ หอพัก หรือคณะ/ตึก เพื่อความสะดวกในการติดต่อ"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition resize-none"
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

              {/* การ์ดที่ 2: ความปลอดภัย & เปลี่ยนรหัสผ่าน */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  ความปลอดภัยและรหัสผ่าน
                </h3>

                <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        รหัสผ่านใหม่
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                          placeholder="อย่างน้อย 6 ตัวอักษร"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        ยืนยันรหัสผ่านใหม่
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                          placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                        />
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