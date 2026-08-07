"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Fascinate } from "next/font/google";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisFormCustomer({ setRegis }: RegisFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [Regisdata,setData] = useState({
    Fname:"",
    Lname:"",
    contact:"",
    password:""
  })
  const [message , setmessage] = useState("");
      async function handleSubmit() {
  
          try {
  
              const res = await axios.post(
              "http://localhost:5000/auth/register",
              Regisdata
              );
  
              if (res.data.message) {
                  setmessage(res.data.message);
                  console.log("regis success")
                  setRegis(false);
              } else {
                  console.log("worng password")
                  setmessage(res.data.error);
              }
          } catch (err) {
              console.log(err);
          }
  }
  return (
    <section className="w-full bg-white px-8 py-10">
      <div className="w-full max-w-sm">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-navy">
          สมัครสมาชิก
        </h2>

        <form className="space-y-4" onSubmit={() => {handleSubmit()}}>
          <input
            type="text"
            placeholder="ชื่อ"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                onChange={(e) => {
                        setData({
                            ...Regisdata,
                            Fname: e.target.value
                            })}
                }
          />
          
          <input
            type="text"
            placeholder="นามสกุล"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                onChange={(e) => {
                        setData({
                            ...Regisdata,
                            Lname: e.target.value
                            })}
                }
          />
          <input
            type="tel"
            placeholder="เบอร์โทรศัพท์"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            onChange={(e) => {
                        setData({
                            ...Regisdata,
                            contact: e.target.value
                            })}
            }
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                onChange={(e) => {
                        setData({
                            ...Regisdata,
                            password: e.target.value
                            })}
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
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm text-navy placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
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
          <div>
            {message}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:bg-[#005FA3]"
          >
            สมัครสมาชิก
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          มีบัญชีผู้ใช้อยู่แล้ว?{" "}
          <span onClick={()=>setRegis(false)} className="font-medium text-primary hover:underline">
            เข้าสู่ระบบที่นี่
          </span>
        </p>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="space-y-3">
          <button className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 py-3 text-sm font-medium text-navy transition hover:bg-gray-50">
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A10.99 10.99 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
