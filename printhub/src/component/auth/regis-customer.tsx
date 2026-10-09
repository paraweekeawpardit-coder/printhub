"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisFormCustomer({ setRegis }: RegisFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [Regisdata, setData] = useState({
    Fname: "",
    Lname: "",
    contact: "", // เก็บเป็น email
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (Regisdata.password !== Regisdata.confirmPassword) {
      setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!agreed) {
      setMessage("กรุณายอมรับเงื่อนไขการใช้งาน");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/register",
        Regisdata
      );

      if (res.data.message) {
        setRegis(false);
      } else {
        setMessage(res.data.error || "ไม่สามารถสมัครสมาชิกได้");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
    }
  }

  return (
    <section className="w-full bg-white px-8 py-10">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-navy">
          สมัครสมาชิกผู้ใช้งาน
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ชื่อ"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            onChange={(e) =>
              setData({ ...Regisdata, Fname: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="นามสกุล"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            onChange={(e) =>
              setData({ ...Regisdata, Lname: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="อีเมล"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            onChange={(e) =>
              setData({ ...Regisdata, contact: e.target.value })
            }
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              onChange={(e) =>
                setData({ ...Regisdata, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              onChange={(e) =>
                setData({ ...Regisdata, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
            />
            ฉันยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:bg-[#005FA3]"
          >
            สมัครสมาชิก
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          มีบัญชีผู้ใช้อยู่แล้ว?{" "}
          <span
            onClick={() => setRegis(false)}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            เข้าสู่ระบบที่นี่
          </span>
        </p>
      </div>
    </section>
  );
}