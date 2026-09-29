"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // แนะนำให้ install lucide-react หรือใช้ icon ที่คุณมี

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("admin_token", res.data.token);
        router.push("/admin/shops");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "เข้าสู่ระบบไม่สำเร็จ");
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
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none transition"
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
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none transition pr-10"
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
          className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-lg font-semibold transition shadow-md"
        >
          เข้าสู่ระบบ Admin
        </button>
      </form>
    </div>
  );
}
