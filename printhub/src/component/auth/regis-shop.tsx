"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, FileText, X, ChevronDown, ShieldCheck } from "lucide-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { LocationData } from "./map";
import { isValidEmail, isPasswordValid, EMAIL_FORMAT_ERROR } from "../auth/Validators";
import { FieldError, PasswordChecklist, scrollToFirstError } from "../../component/auth/From-feedback";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

const MapPicker = dynamic(() => import("./map"), { ssr: false });

function isValidThaiIDCard(id: string): boolean {
  return /^\d{13}$/.test(id);
}

function isValidThaiPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone);
}

export default function RegisFormShop({ setRegis }: RegisFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  const [shopData, setShopData] = useState({
    shop_name: "",
    owner_name: "",
    id_card: "",
    id_name: "",
    image_card: null as File | null,
    email: "",
    contact: "",
    location: "",
    latitude: 0,
    longitude: 0,
    province: "",
    district: "",
    subdistrict: "",
    zipcode: "",
    image: null as File | null,
    bank: "",
    bank_account_name: "",
    bank_number: "",
    password: "",
    confirmPassword: "",
  });

  const banks = [
    { code: "BBL", name: "ธนาคารกรุงเทพ (BBL)" },
    { code: "KBANK", name: "ธนาคารกสิกรไทย (KBANK)" },
    { code: "KTB", name: "ธนาคารกรุงไทย (KTB)" },
    { code: "SCB", name: "ธนาคารไทยพาณิชย์ (SCB)" },
    { code: "BAY", name: "ธนาคารกรุงศรีอยุธยา (BAY)" },
    { code: "TTB", name: "ธนาคารทหารไทยธนชาต (ttb)" },
    { code: "CIMBT", name: "ธนาคารซีไอเอ็มบี ไทย (CIMBT)" },
    { code: "UOB", name: "ธนาคารยูโอบี (UOB)" },
    { code: "KKP", name: "ธนาคารเกียรตินาคินภัทร (KKP)" },
    { code: "TISCO", name: "ธนาคารทิสโก้ (TISCO)" },
    { code: "LHFG", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)" },
    { code: "ICBC", name: "ธนาคารไอซีบีซี (ไทย) (ICBC)" },
    { code: "BOC", name: "ธนาคารแห่งประเทศจีน (ไทย) (BOC)" },
    { code: "SMBC", name: "ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น (SMBC)" },
    { code: "GSB", name: "ธนาคารออมสิน (GSB)" },
    { code: "BAAC", name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)" },
    { code: "GHB", name: "ธนาคารอาคารสงเคราะห์ (ธอส.)" },
    { code: "EXIM", name: "ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย (EXIM)" },
    { code: "SME", name: "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม (SME Bank)" },
    { code: "IBANK", name: "ธนาคารอิสลามแห่งประเทศไทย (iBank)" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(e.target as Node)
      ) {
        setIsBankOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const touch = (key: string) =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));

  // ข้อความ error ของแต่ละช่อง ("" = ผ่าน)
  const errors: Record<string, string> = {
    shop_name: !shopData.shop_name.trim()
      ? "กรุณากรอกชื่อร้านค้า"
      : shopData.shop_name.length > 100
      ? "ชื่อร้านค้าต้องไม่เกิน 100 ตัวอักษร"
      : "",
    id_name: !shopData.id_name.trim()
      ? "กรุณากรอกชื่อในบัตรประชาชน"
      : shopData.id_name.length > 100
      ? "ชื่อในบัตรต้องไม่เกิน 100 ตัวอักษร"
      : "",
    id_card: !shopData.id_card
      ? "กรุณากรอกเลขบัตรประชาชน"
      : !isValidThaiIDCard(shopData.id_card)
      ? `เลขบัตรประชาชนต้องเป็นตัวเลขครบ 13 หลัก (กรอกแล้ว ${shopData.id_card.length} หลัก)`
      : "",
    image_card: !shopData.image_card
      ? "กรุณาอัปโหลดรูปภาพถ่ายคู่กับบัตรประชาชน"
      : shopData.image_card.size > 5 * 1024 * 1024
      ? "ขนาดรูปภาพบัตรประชาชนต้องไม่เกิน 5MB"
      : "",
    email: !shopData.email.trim()
      ? "กรุณากรอกอีเมล"
      : shopData.email.length > 100
      ? "อีเมลต้องไม่เกิน 100 ตัวอักษร"
      : !isValidEmail(shopData.email)
      ? EMAIL_FORMAT_ERROR
      : "",
    contact: !shopData.contact
      ? "กรุณากรอกเบอร์โทรศัพท์"
      : !isValidThaiPhone(shopData.contact)
      ? "เบอร์โทรศัพท์ต้องมี 10 หลัก และขึ้นต้นด้วย 0"
      : "",
    location:
      shopData.latitude === 0 || shopData.longitude === 0
        ? "กรุณาเลือกตำแหน่งร้านบนแผนที่"
        : shopData.location.length > 250
        ? "รายละเอียดที่อยู่ต้องไม่เกิน 250 ตัวอักษร"
        : "",
    bank: shopData.bank ? "" : "กรุณาเลือกธนาคาร",
    bank_account_name: !shopData.bank_account_name.trim()
      ? "กรุณากรอกชื่อบัญชีธนาคาร"
      : shopData.bank_account_name.length > 100
      ? "ชื่อบัญชีต้องไม่เกิน 100 ตัวอักษร"
      : "",
    bank_number: !shopData.bank_number
      ? "กรุณากรอกเลขบัญชีธนาคาร"
      : !/^\d{10,12}$/.test(shopData.bank_number)
      ? `เลขบัญชีธนาคารต้องเป็นตัวเลข 10-12 หลัก (กรอกแล้ว ${shopData.bank_number.length} หลัก)`
      : "",
    password: isPasswordValid(shopData.password) ? "" : "invalid",
    confirmPassword: !shopData.confirmPassword
      ? "กรุณายืนยันรหัสผ่าน"
      : shopData.password !== shopData.confirmPassword
      ? "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน"
      : "",
    agreed: agreed
      ? ""
      : "กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว",
  };

  // แสดง error เมื่อผู้ใช้กรอกเสร็จช่องนั้น (blur) หรือกดสมัครแล้ว
  const show = (key: string) =>
    touched[key] || submitted ? errors[key] : "";

  const baseInput =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-primary";
  const inputCls = (hasError: boolean, extra = "") =>
    `${baseInput} ${hasError ? "border-red-400" : "border-gray-200"} ${extra}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) {
      scrollToFirstError();
      return;
    }

    const formData = new FormData();
    formData.append("shop_name", shopData.shop_name);
    formData.append("owner_name", shopData.owner_name || shopData.id_name);
    formData.append("id_card", shopData.id_card);
    formData.append("id_name", shopData.id_name);
    formData.append("email", shopData.email);
    formData.append("contact", shopData.contact);
    formData.append("location", shopData.location);
    formData.append("latitude", shopData.latitude.toString());
    formData.append("longitude", shopData.longitude.toString());
    formData.append("province", shopData.province);
    formData.append("district", shopData.district);
    formData.append("subdistrict", shopData.subdistrict);
    formData.append("zipcode", shopData.zipcode);
    formData.append("bank", shopData.bank);
    formData.append("bank_account_name", shopData.bank_account_name.trim());
    formData.append("bank_number", shopData.bank_number);
    formData.append("password", shopData.password);

    if (shopData.image_card) {
      formData.append("image_card", shopData.image_card);
    }
    if (shopData.image) {
      formData.append("image", shopData.image);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/registerShop",
        formData
      );

      if (res.data.message) {
        setRegis(false);
        setMessage("สมัครสมาชิกร้านค้าสำเร็จ");
      } else {
        setMessage(res.data.error || "กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
    }
  }

  return (
    <section className="w-full bg-white px-8 py-4">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-navy">
          สมัครสมาชิกร้านค้า
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              maxLength={100}
              placeholder="ชื่อร้านค้า"
              value={shopData.shop_name}
              onChange={(e) =>
                setShopData({ ...shopData, shop_name: e.target.value })
              }
              onBlur={() => touch("shop_name")}
              className={inputCls(!!show("shop_name"))}
            />
            <FieldError message={show("shop_name")} />
          </div>

          <div>
            <input
              type="text"
              maxLength={100}
              placeholder="ชื่อในบัตรประชาชน"
              value={shopData.id_name}
              onChange={(e) =>
                setShopData({
                  ...shopData,
                  id_name: e.target.value,
                  owner_name: e.target.value,
                })
              }
              onBlur={() => touch("id_name")}
              className={inputCls(!!show("id_name"))}
            />
            <FieldError message={show("id_name")} />
          </div>

          <div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={13}
              placeholder="เลขบัตรประชาชน (13 หลัก)"
              value={shopData.id_card}
              onChange={(e) =>
                setShopData({
                  ...shopData,
                  id_card: e.target.value.replace(/\D/g, ""),
                })
              }
              onBlur={() => touch("id_card")}
              className={inputCls(!!show("id_card"))}
            />
            <FieldError message={show("id_card")} />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                รูปภาพถ่ายคู่กับบัตรประชาชน
              </label>
              <button
                type="button"
                onClick={() => setShowExampleModal(true)}
                className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                <FileText size={14} />
                ดูตัวอย่าง
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setShopData({
                  ...shopData,
                  image_card: e.target.files?.[0] || null,
                });
                touch("image_card");
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm ${
                show("image_card") ? "border-red-400" : "border-gray-200"
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              กรุณาแนบรูปถ่ายคู่กับบัตรประชาชนเพื่อยืนยันตัวตน (ไม่เกิน 5MB)
            </p>
            <FieldError message={show("image_card")} />
          </div>

          <div>
            <input
              type="email"
              maxLength={100}
              placeholder="Email "
              value={shopData.email}
              onChange={(e) =>
                setShopData({ ...shopData, email: e.target.value })
              }
              onBlur={() => touch("email")}
              className={inputCls(!!show("email"))}
            />
            <FieldError message={show("email")} />
          </div>

          <div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="เบอร์โทรศัพท์ (10 หลัก)"
              value={shopData.contact}
              onChange={(e) =>
                setShopData({
                  ...shopData,
                  contact: e.target.value.replace(/\D/g, ""),
                })
              }
              onBlur={() => touch("contact")}
              className={inputCls(!!show("contact"))}
            />
            <FieldError message={show("contact")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              เลือกตำแหน่งร้านบนแผนที่
            </label>
            <MapPicker
              onSelect={(location: LocationData) => {
                setShopData((prev) => ({
                  ...prev,
                  latitude: location.lat,
                  longitude: location.lng,
                  province: location.province,
                  district: location.district,
                  subdistrict: location.subdistrict,
                  zipcode: location.zipcode,
                  location: location.display_name || prev.location,
                }));
              }}
            />
            <FieldError message={show("location")} />
          </div>

          <div>
            <input
              type="text"
              maxLength={250}
              placeholder="รายละเอียดที่อยู่ (เช่น ชื่อซอย/ถนน/จุดสังเกต) (สูงสุด 250 ตัวอักษร)"
              value={shopData.location}
              onChange={(e) =>
                setShopData({ ...shopData, location: e.target.value })
              }
              onBlur={() => touch("location")}
              className={inputCls(!!show("location"))}
            />
            <FieldError message={show("location")} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              รูปร้านค้า
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setShopData({
                  ...shopData,
                  image: e.target.files?.[0] || null,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <div className="relative" ref={bankDropdownRef}>
              <button
                type="button"
                onClick={() => setIsBankOpen(!isBankOpen)}
                className={`w-full flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm outline-none text-left focus:border-primary transition ${
                  show("bank") ? "border-red-400" : "border-gray-200"
                }`}
              >
                <span
                  className={
                    shopData.bank ? "text-gray-900 font-medium" : "text-gray-400"
                  }
                >
                  {banks.find((b) => b.code === shopData.bank)?.name ||
                    "เลือกธนาคาร"}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isBankOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isBankOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-gray-100 bg-white shadow-xl max-h-48 overflow-y-auto divide-y divide-gray-50">
                  {banks.map((bank) => (
                    <div
                      key={bank.code}
                      onClick={() => {
                        setShopData((prev) => ({ ...prev, bank: bank.code }));
                        setIsBankOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-blue-50 hover:text-primary ${
                        shopData.bank === bank.code
                          ? "bg-blue-50/60 font-medium text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      {bank.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <FieldError message={show("bank")} />
          </div>

          <div>
            <input
              type="text"
              maxLength={100}
              placeholder="ชื่อบัญชีธนาคาร"
              value={shopData.bank_account_name}
              onChange={(e) =>
                setShopData({ ...shopData, bank_account_name: e.target.value })
              }
              onBlur={() => touch("bank_account_name")}
              className={inputCls(!!show("bank_account_name"))}
            />
            <FieldError message={show("bank_account_name")} />
          </div>

          <div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={12}
              placeholder="เลขบัญชีธนาคาร (10-12 หลัก)"
              value={shopData.bank_number}
              onChange={(e) =>
                setShopData({
                  ...shopData,
                  bank_number: e.target.value.replace(/\D/g, ""),
                })
              }
              onBlur={() => touch("bank_number")}
              className={inputCls(!!show("bank_number"))}
            />
            <FieldError message={show("bank_number")} />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                maxLength={50}
                placeholder="รหัสผ่าน"
                value={shopData.password}
                onChange={(e) =>
                  setShopData({ ...shopData, password: e.target.value })
                }
                onFocus={() => touch("passwordFocus")}
                onBlur={() => touch("password")}
                className={inputCls(!!show("password"), "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <PasswordChecklist
              value={shopData.password}
              visible={!!touched.passwordFocus || !!touched.password || submitted}
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                maxLength={50}
                placeholder="ยืนยันรหัสผ่าน"
                value={shopData.confirmPassword}
                onChange={(e) =>
                  setShopData({ ...shopData, confirmPassword: e.target.value })
                }
                onBlur={() => touch("confirmPassword")}
                className={inputCls(!!show("confirmPassword"), "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <FieldError message={show("confirmPassword")} />
          </div>

          <div>
            <div className="flex items-start gap-2.5 text-xs text-gray-500 pt-1">
              <input
                type="checkbox"
                id="agree-shop"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  touch("agreed");
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="agree-shop" className="leading-relaxed cursor-pointer">
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
            <FieldError message={show("agreed")} />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-white text-sm font-medium hover:opacity-90 transition shadow-sm shadow-primary/20"
          >
            สมัครร้านค้า
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          มีบัญชีร้านค้าอยู่แล้ว?{" "}
          <span
            onClick={() => setRegis(false)}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            เข้าสู่ระบบที่นี่
          </span>
        </p>
      </div>

      {showExampleModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setShowExampleModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
              ตัวอย่างการถ่ายรูปคู่บัตรประชาชน
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img
                src="./example.jpg"
                alt="ตัวอย่างการถ่ายรูปคู่บัตรประชาชน"
                className="w-full h-auto object-cover"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setShowExampleModal(false)}
              className="mt-5 w-full rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      {/* Improved PDPA Modal Design for Shop */}
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
                  เงื่อนไขและนโยบายสำหรับพาร์ทเนอร์ร้านค้า
                </h3>
                <p className="text-xs text-slate-400">
                  ข้อมูลการยืนยันตัวตนและการคุ้มครองข้อมูลส่วนบุคคล (PDPA)
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
                  1. เงื่อนไขสำหรับร้านค้าพาร์ทเนอร์
                </h4>
                <p className="pl-3">• ร้านค้าต้องระบุข้อมูลสถานที่ พิกัด และเอกสารยืนยันตัวตน (รูปคู่บัตรประชาชน) ที่ถูกต้องตรงตามจริง[cite: 8]</p>
                <p className="pl-3">• หากมีการแก้ไขข้อมูลบัญชีธนาคาร จะต้องผ่านการตรวจสอบและอนุมัติจากผู้ดูแลระบบ (Admin) ใหม่[cite: 8]</p>
                <p className="pl-3">• ร้านค้าต้องให้บริการงานพิมพ์ด้วยความซื่อสัตย์และรักษามาตรฐานตามที่แพลตฟอร์มกำหนด[cite: 8]</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  2. นโยบายความเป็นส่วนตัว (PDPA)
                </h4>
                <p className="pl-3">• <strong>การจัดเก็บข้อมูล:</strong> จัดเก็บข้อมูลผู้ประกอบการ บัตรประชาชน และบัญชีธนาคารเพื่อยืนยันตัวตนและโอนเงินรายได้[cite: 8]</p>
                <p className="pl-3">• <strong>ความปลอดภัย:</strong> ข้อมูลบัตรประชาชนจะถูกเก็บเป็นความลับสูงสุด ใช้สำหรับตรวจสอบความถูกต้องโดยแอดมินเท่านั้น[cite: 8]</p>
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