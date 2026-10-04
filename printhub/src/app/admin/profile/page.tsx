"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Shield, Camera, CheckCircle, AlertCircle } from "lucide-react";

// กำหนด BASE_URL ให้เรียกง่ายขึ้น
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    role: "Super Admin",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ฟังก์ชันช่วยซิงก์ข้อมูลจาก LocalStorage
  const loadProfileFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setProfile((prev) => ({
          ...prev,
          id: parsed.id || prev.id,
          name: parsed.name || prev.name,
          email: parsed.email || parsed.contact || prev.email,
          role: parsed.role || "Super Admin",
          avatar: parsed.avatar || prev.avatar,
        }));
        if (parsed.avatar) {
          setAvatarPreview(parsed.avatar);
        }
        return parsed;
      } catch (e) {
        console.error("Parse user error", e);
      }
    }
    return null;
  };

  useEffect(() => {
    // 1. โหลดจาก localStorage มาแสดงก่อนทันที
    const storedUser = loadProfileFromStorage();

    // 2. ดึงข้อมูลสดจาก API โดยระบุ id หรือ email ของแอดมินที่ล็อกอินอยู่
    const queryParams = new URLSearchParams();
    if (storedUser?.id) {
      queryParams.append("id", storedUser.id);
    } else if (storedUser?.email || storedUser?.contact) {
      queryParams.append("email", storedUser.email || storedUser.contact);
    }

    const token = localStorage.getItem("token");
    const fetchUrl = `${API_BASE_URL}/profile${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    fetch(fetchUrl, {
      headers: { 
        Authorization: `Bearer ${token || ""}`,
        "Content-Type": "application/json"
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const updatedAvatar = data.avatar || "";
          const userData = {
            id: data.id || storedUser?.id || "",
            name: data.name || "",
            email: data.email || data.contact || "",
            role: data.role || "Super Admin",
            avatar: updatedAvatar,
          };
          setProfile(userData);
          setAvatarPreview(updatedAvatar);

          // อัปเดตลง localStorage ให้ตรงกัน
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...currentUser, ...userData })
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching profile from API:", err);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatusMsg({ type: "error", text: "ขนาดรูปภาพต้องไม่เกิน 2MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setProfile((prev) => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // บันทึกข้อมูลโปรไฟล์ และรูปภาพ
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setSavingProfile(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          id: profile.id, // ส่ง ID แนบไปด้วยเพื่ออัปเดตถูกคน
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "ไม่สามารถบันทึกข้อมูลโปรไฟล์ได้");
      }

      const responseData = await res.json();
      const updatedData = responseData.data || profile;

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserObj = {
        ...currentUser,
        id: updatedData.id || profile.id,
        name: updatedData.name,
        email: updatedData.email,
        avatar: updatedData.avatar,
      };
      
      localStorage.setItem("user", JSON.stringify(newUserObj));
      
      // ส่ง Event บอก Navbar/Layout ให้เปลี่ยนรูปและชื่อสดๆ
      window.dispatchEvent(new Event("userProfileUpdated"));

      setStatusMsg({ type: "success", text: "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว" });
    } catch (error: any) {
      console.error("Save profile error:", error);
      setStatusMsg({ type: "error", text: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูลโปรไฟล์" });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800">โปรไฟล์แอดมิน</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการข้อมูลส่วนตัวและรูปภาพประจำตัว
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification Alert */}
          {statusMsg && (
            <div
              className={`flex items-center gap-2 p-3 text-xs font-medium rounded-xl border ${
                statusMsg.type === "success"
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-rose-700 bg-rose-50 border-rose-200"
              }`}
            >
              {statusMsg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Form: ข้อมูลทั่วไป และ รูปโปรไฟล์ */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Avatar Display */}
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl uppercase overflow-hidden shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.name.charAt(0) || "A"
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  title="เปลี่ยนรูปโปรไฟล์"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {profile.name || "Admin User"}
                </h3>
                <p className="text-xs text-slate-500">{profile.role || "Super Admin"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
                <User size={15} className="text-sky-500" /> ข้อมูลทั่วไป
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 transition-colors text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  อีเมล
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3.5 py-2 pl-9 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 transition-colors text-slate-800"
                    required
                  />
                  <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ตำแหน่งในระบบ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-3.5 py-2 pl-9 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                  <Shield size={15} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {savingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูลส่วนตัว"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}