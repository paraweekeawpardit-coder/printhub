/**
 * Page: Customer Settings (/customer/setting)
 * รองรับ Schema: customer (first_name, last_name, contact)
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from "lucide-react";
import supabase from "@/config/supabase";
import NavBar from "@/component/customer/NavBar";

export default function CustomerSettingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ข้อมูลโปรไฟล์
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
  });

  // สถานะรหัสผ่าน
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

        // 1. ดึง ID ของผู้ใช้งาน
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

        let loadedName = "";
        let loadedEmail = user?.email || "";

        // 2. เรียกผ่าน Backend Controller
        try {
          const res = await fetch(`http://localhost:5000/api/customer/profile?customer_id=${effectiveId}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              loadedName = json.data.name || "";
              loadedEmail = json.data.email || loadedEmail;
            }
          }
        } catch (backendErr) {
          console.warn("Backend profile unreachable:", backendErr);
        }

        // 3. Fallback: ดึงตรงจากตาราง customer โดยใช้ชื่อคอลัมน์ตาม Schema จริง (first_name, last_name, contact)
        if (!loadedName) {
          const { data: customerRow } = await supabase
            .from("customer")
            .select("id, first_name, last_name, contact")
            .eq("id", effectiveId)
            .maybeSingle();

          if (customerRow) {
            loadedName = [customerRow.first_name, customerRow.last_name].filter(Boolean).join(" ").trim();
            loadedEmail = customerRow.contact || loadedEmail;
          }
        }

        // Fallback จาก localStorage
        if (!loadedName && typeof window !== "undefined") {
          loadedName = localStorage.getItem("user_name") || localStorage.getItem("name") || "";
        }
        if (!loadedEmail && typeof window !== "undefined") {
          loadedEmail = localStorage.getItem("user_email") || "";
        }

        setProfile({
          id: effectiveId,
          name: loadedName,
          email: loadedEmail,
        });

        // 4. ดึงจำนวนของในตะกร้า
        try {
          const cartRes = await fetch(`http://localhost:5000/api/customer/cart?customer_id=${effectiveId}`);
          const cartJson = await cartRes.json();
          if (cartJson?.success && cartJson?.data) {
            const rawItems = Array.isArray(cartJson.data) ? cartJson.data : (cartJson.data.items || []);
            setCartCount(rawItems.length);
          }
        } catch {
          setCartCount(0);
        }
      } catch (err: any) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  // ฟังก์ชันบันทึกข้อมูลส่วนตัว (ชื่อ-นามสกุล และ อีเมล)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      showToast("error", "กรุณาระบุชื่อ - นามสกุล");
      return;
    }
    if (!profile.email.trim()) {
      showToast("error", "กรุณาระบุอีเมล");
      return;
    }

    try {
      setSaving(true);

      // แยก first_name และ last_name
      const parts = profile.name.trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";

      // 1. ส่งผ่าน Backend Controller
      let backendSuccess = false;
      try {
        const res = await fetch(`http://localhost:5000/api/customer/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: profile.id,
            name: profile.name.trim(),
            first_name: firstName,
            last_name: lastName,
            email: profile.email.trim(),
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) backendSuccess = true;
      } catch (e) {
        console.warn("Backend update skipped:", e);
      }

      // 2. อัปเดตตรงเข้าตาราง customer ใน Supabase (first_name, last_name, contact)
      const { error: cusErr } = await supabase
        .from("customer")
        .update({
          first_name: firstName,
          last_name: lastName,
          contact: profile.email.trim(),
        })
        .eq("id", profile.id);

      if (cusErr && !backendSuccess) throw cusErr;

      // 3. ซิงค์กับ Supabase Auth
      try {
        await supabase.auth.updateUser({
          email: profile.email.trim(),
          data: { first_name: firstName, last_name: lastName, full_name: profile.name.trim() }
        });
      } catch (authErr) {
        console.warn("Auth sync notice:", authErr);
      }

      // 4. บันทึกลง localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_name", profile.name.trim());
        localStorage.setItem("user_email", profile.email.trim());
      }

      showToast("success", "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
    } catch (err: any) {
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-800 antialiased pb-12">
      <NavBar 
        cartCount={cartCount} 
        onOpenCart={() => router.push("/customer/cart")} 
      />

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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0F2942] to-[#1d5d9b] flex items-center justify-center text-white font-bold text-3xl shadow-md overflow-hidden">
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={40} />}
              </div>

              <div className="w-full px-2">
                <h2 className="text-base font-bold text-slate-900 truncate">
                  {profile.name || "ผู้ใช้งาน PrintHub"}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5 truncate">
                  {profile.email || "ไม่มีข้อมูลอีเมล"}
                </p>
              </div>
            </div>

            {/* ฟอร์มแก้ไขข้อมูลฝั่งขวา */}
            <div className="md:col-span-2 space-y-6">
              {/* การ์ดที่ 1: แก้ไขชื่อและอีเมล */}
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
                        placeholder="กรอกชื่อ - นามสกุล"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      อีเมล (Contact)
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