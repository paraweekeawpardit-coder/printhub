"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, Store } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

// 🟢 ปรับ Fallback หรือลบ Slash ท้าย URL ป้องกัน URL ซ้ำซ้อน
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

export default function LoginForm({ setRegis }: RegisFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [logindata, setData] = useState({
    contact: "",
    password: "",
  });

  async function doLogin() {
    setMessage("");
    setLoading(true);

<<<<<<< HEAD
    console.log("login information ", logindata);

=======
>>>>>>> origin/main
    try {
      // 🟢 แก้จาก /auth/login เป็น /api/auth/login ให้ตรงกับ Express Backend
      const res = await axios.post(`${API_URL}/api/auth/login`, logindata);

      if (!res.data.token) return;

      localStorage.setItem("token", res.data.token);

      switch (res.data.role) {
        case "admin":
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("username", res.data.name);
          router.push("/admin");
          break;
        case "owner":
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("username", res.data.name);
          router.push("/owner");
          break;
        case "shop":
          localStorage.setItem("shop_id", res.data.shop_id);
          localStorage.setItem("shop_name", res.data.shop_name);
          router.push("/shop");
          break;
        default:
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("username", res.data.name);
          router.push("/customer");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(
        err.response?.data?.error || "เกิดข้อผิดพลาด ไม่สามารถเข้าสู่ระบบได้"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    doLogin();
  }

  return (
    <section className="relative flex min-h-screen w-full items-center bg-white px-8 py-10">
      {/* Admin / Owner — ปรับให้ชิดขอบมุมขวาบน และกดเปลี่ยนหน้าได้ทันที ไม่ผ่าน API */}
      <div className="absolute top-6 right-6 flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur z-10">
        <span className="pl-3 pr-1 text-[11px] text-gray-400">เข้าสู่ระบบด้วย</span>

        <button
          type="button"
          onClick={() => router.push("/admin")}
          title="ไปที่หน้า Admin"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-navy transition hover:bg-primary hover:text-white"
        >
          <ShieldCheck size={14} />
          Admin
        </button>

        <button
          type="button"
          onClick={() => router.push("/owner")}
          title="ไปที่หน้า Owner"
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-navy transition hover:bg-navy hover:text-white"
        >
          <Store size={14} />
          Owner
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto">
        <h2 className="mb-7 text-center text-2xl font-semibold tracking-tight text-navy">
          เข้าสู่ระบบ
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="อีเมล (Email)"
            value={logindata.contact}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            onChange={(e) =>
              setData({ ...logindata, contact: e.target.value })
            }
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              value={logindata.password}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              onChange={(e) =>
                setData({ ...logindata, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-gray-400 hover:text-primary"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:bg-[#005FA3] disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          ยังไม่มีบัญชี?{" "}
          <span
            onClick={() => setRegis(true)}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            สมัครสมาชิกที่นี่
          </span>
        </p>
      </div>
    </section>
  );
}