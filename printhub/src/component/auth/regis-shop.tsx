"use client";

import { useState,useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import dynamic from "next/dynamic";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

const MapPicker = dynamic(() => import("./map"), { ssr: false });

export default function RegisFormShop({setRegis }: RegisFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
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
    bank_number: "",
    password: "",
    confirmPassword: "",
  });

  const banks = [
    { code: "BBL", name: "ธนาคารกรุงเทพ" },
    { code: "KBANK", name: "ธนาคารกสิกรไทย" },
    { code: "KTB", name: "ธนาคารกรุงไทย" },
    { code: "SCB", name: "ธนาคารไทยพาณิชย์" },
    { code: "BAY", name: "ธนาคารกรุงศรีอยุธยา" },
    { code: "TTB", name: "ธนาคารทหารไทยธนชาต" },
    { code: "GSB", name: "ธนาคารออมสิน" },
    { code: "BAAC", name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร" },
    { code: "GHB", name: "ธนาคารอาคารสงเคราะห์" },
    { code: "UOB", name: "ธนาคารยูโอบี" },
    { code: "CIMB", name: "ธนาคารซีไอเอ็มบี ไทย" },
    { code: "KKP", name: "ธนาคารเกียรตินาคินภัทร" },
    { code: "TISCO", name: "ธนาคารทิสโก้" },
    { code: "LHBANK", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์" },
    { code: "ICBC", name: "ธนาคารไอซีบีซี (ไทย)" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (shopData.password !== shopData.confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!shopData.image_card) {
      setMessage("กรุณาอัปโหลดรูปภาพบัตรประชาชน");
      return;
    }

    // แปลงข้อมูลใส่ FormData เพื่อส่งไฟล์และข้อมูลไปยัง Express Backend
    const formData = new FormData();
    formData.append("shop_name", shopData.shop_name);
    formData.append("owner_name", shopData.owner_name);
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
    formData.append("bank_number", shopData.bank_number);
    formData.append("password", shopData.password);

    // อัปโหลดไฟล์รูปภาพ
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
        setMessage("registed successed")
      } else {
        setMessage(res.data.error || "Please try again");
      }

    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || "server error");
    }
  }

  return (
    <section className="w-full bg-white px-8 py-10">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-navy">
          สมัครสมาชิกร้านค้า
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-red-500">
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ชื่อร้าน"
            value={shopData.shop_name}
            onChange={(e) =>
              setShopData({ ...shopData, shop_name: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <input
            type="text"
            placeholder="ชื่อเจ้าของร้าน"
            value={shopData.owner_name}
            onChange={(e) =>
              setShopData({ ...shopData, owner_name: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <input
            type="text"
            placeholder="เลขบัตรประชาชนของเจ้าของ"
            value={shopData.id_card}
            onChange={(e) =>
              setShopData({ ...shopData, id_card: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <input
            type="text"
            placeholder="ชื่อในบัตรประชาชน (ของเจ้าของร้าน)"
            value={shopData.id_name}
            onChange={(e) =>
              setShopData({ ...shopData, id_name: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              รูปภาพบัตรประชาชนพร้อมลายเซ็น
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setShopData({
                  ...shopData,
                  image_card: e.target.files?.[0] || null,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              กรุณาแนบสำเนาบัตรประชาชนพร้อมลายเซ็นกำกับ สำเนาถูกต้อง
            </p>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={shopData.email}
            onChange={(e) =>
              setShopData({ ...shopData, email: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <input
            type="tel"
            placeholder="เบอร์โทรศัพท์"
            value={shopData.contact}
            onChange={(e) =>
              setShopData({ ...shopData, contact: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              เลือกตำแหน่งร้านบนแผนที่
            </label>
            <MapPicker
              onSelect={(location: any) => {
                setShopData({
                  ...shopData,
                  latitude: location.lat,
                  longitude: location.lng,
                  province: location.province,
                  district: location.district,
                  subdistrict: location.subdistrict,
                  zipcode: location.zipcode,
                });
              }}
            />
          </div>

          <input
            type="text"
            placeholder="รายละเอียดที่อยู่ (เช่น ชื่อซอย/ถนน/จุดสังเกต)"
            value={shopData.location}
            onChange={(e) =>
              setShopData({ ...shopData, location: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
          />

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

          <select
            value={shopData.bank}
            onChange={(e) =>
              setShopData({ ...shopData, bank: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          >
            <option value="">เลือกธนาคาร</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="เลขบัญชีธนาคาร"
            value={shopData.bank_number}
            onChange={(e) =>
              setShopData({ ...shopData, bank_number: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              value={shopData.password}
              onChange={(e) =>
                setShopData({ ...shopData, password: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm outline-none focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              value={shopData.confirmPassword}
              onChange={(e) =>
                setShopData({ ...shopData, confirmPassword: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm outline-none focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-white text-sm font-medium hover:opacity-90 transition"
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
    </section>
  );
}