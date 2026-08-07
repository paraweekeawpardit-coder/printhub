"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginFormShop({ setRegis }: RegisFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [logindata, setData] = useState({
    contact: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/loginShop",
        logindata
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("shop_id", res.data.shop_id);
        localStorage.setItem("shop_name", res.data.shop_name);

        console.log("Log in success");
        router.push("/shop");
      } else {
        setMessage(res.data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
    }
  }

  return (
    <section className="w-full bg-white px-8 py-10">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="mb-7 text-center text-2xl font-semibold tracking-tight text-navy">
          เข้าสู่ระบบร้านค้า
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="เบอร์โทรศัพท์ หรือ อีเมล"
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
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:bg-[#005FA3]"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          ยังไม่มีบัญชี?{" "}
          <span
            onClick={() => setRegis(true)}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            สมัครร้านค้าที่นี่
          </span>
        </p>
      </div>
    </section>
  );
}