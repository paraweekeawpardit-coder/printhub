"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 1. ล้าง Storage เก่าทันทีเมื่อผู้ใช้เข้ามาที่หน้า Login
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    
    // ส่ง event บอก Navbar ให้ล้างค่าผู้ใช้ออกจากหน้าจอทันที
    window.dispatchEvent(new Event("userProfileUpdated"));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      // รองรับโครงสร้าง Response ทั้ง res.data.token หรือ res.data.data
      const token = res.data.token || res.data.data?.token;
      const user = res.data.user || res.data.data?.user || {
        name: username.split("@")[0],
        email: username,
        role: "Super Admin",
      };

      if (token) {
        // 2. เซฟ Key ให้ตรงกันทั้งโปรเจกต์ ("token" และ "user")
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // ส่ง event อัปเดต Navbar ทันทีที่เข้าสู่ระบบสำเร็จ
        window.dispatchEvent(new Event("userProfileUpdated"));

        // 3. ใช้ window.location.href แทน router.push เพื่อให้ Next.js รีเฟรช State ทั้งหมด
        window.location.href = "/admin";
      } else {
        setError("ไม่พบ Token ตอบกลับจากเซิร์ฟเวอร์");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Admin System Access
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username / Email
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none transition text-slate-800"
            placeholder="admin@printhub.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none transition pr-10 text-slate-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-500 text-white py-3 rounded-lg font-semibold transition shadow-md cursor-pointer"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ Admin"}
        </button>
      </form>
    </div>
  );
}