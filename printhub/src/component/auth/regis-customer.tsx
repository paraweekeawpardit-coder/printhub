"use client";

import { useState } from "react";
import { Eye, EyeOff, FileText, X, ShieldCheck } from "lucide-react";
import axios from "axios";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RegisFormCustomer({ setRegis }: RegisFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
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
      setMessage("กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว");
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

          <div className="flex items-start gap-2.5 text-xs text-gray-500 pt-1">
            <input
              type="checkbox"
              id="agree-customer"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="agree-customer" className="leading-relaxed cursor-pointer">
              ฉันยอมรับ{" "}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-primary hover:underline font-semibold"
              >
                เงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:bg-[#005FA3] shadow-sm shadow-primary/20"
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

      {/* Improved PDPA Modal Design */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[85vh] flex flex-col border border-slate-100">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck size={22} />
              </div>
              <div className="flex-1 pr-6">
                <h3 className="text-base font-bold text-slate-800">
                  ข้อกำหนดและนโยบายความเป็นส่วนตัว
                </h3>
                <p className="text-xs text-slate-400">
                  กรุณาอ่านและศึกษารายละเอียดก่อนกดยอมรับการใช้งาน
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-4 text-xs text-slate-600 py-4 pr-2 leading-relaxed flex-1">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  1. เงื่อนไขการใช้งาน (Terms of Service)
                </h4>
                <p className="pl-3">• ผู้ใช้บริการต้องให้ข้อมูลที่ถูกต้องและเป็นปัจจุบันในขั้นตอนการลงทะเบียน</p>
                <p className="pl-3">• การสั่งพิมพ์งานจะสมบูรณ์เมื่อมีการยืนยันคำสั่งซื้อและตรวจสอบหลักฐานการชำระเงินเรียบร้อยแล้ว</p>
                <p className="pl-3">• ผู้ใช้งานต้องรับผิดชอบต่อเนื้อหาและไฟล์ที่อัปโหลด โดยต้องไม่ละเมิดลิขสิทธิ์หรือผิดกฎหมาย</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  2. นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                </h4>
                <p className="pl-3">• <strong>การจัดเก็บข้อมูล:</strong> เราจัดเก็บข้อมูลส่วนบุคคล เช่น ชื่อ, อีเมล, เบอร์โทรศัพท์ และไฟล์งานเพื่อการให้บริการพิมพ์เอกสาร</p>
                <p>• <strong>ความปลอดภัย:</strong> ข้อมูลของท่านจะถูกเก็บรักษาไว้อย่างปลอดภัยและไม่ถูกเปิดเผยแก่บุคคลภายนอก เว้นแต่เป็นไปตามวัตถุประสงค์ในการให้บริการ</p>
                <p>• <strong>สิทธิของท่าน:</strong> ท่านสามารถติดต่อขอเข้าถึง แก้ไข หรือขอลบข้อมูลส่วนบุคคลของท่านได้ตลอดเวลาผ่านระบบ</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgreed(true);
                  setShowTermsModal(false);
                }}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-[#005FA3] shadow-md shadow-primary/20 transition"
              >
                ยอมรับเงื่อนไข
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}