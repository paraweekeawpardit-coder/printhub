// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Eye, EyeOff, FileText, X, ChevronDown } from "lucide-react";
// import axios from "axios";
// import dynamic from "next/dynamic";
// import { LocationData } from "./map";

// type RegisFormProps = {
//   setRegis: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const MapPicker = dynamic(() => import("./map"), { ssr: false });



// function isValidThaiIDCard(id: string): boolean {
//   if (!/^\d{13}$/.test(id)) return false;
//   let sum = 0;
//   for (let i = 0; i < 12; i++) {
//     sum += parseInt(id.charAt(i)) * (13 - i);
//   }
//   const checkDigit = (11 - (sum % 11)) % 10;
//   return checkDigit === parseInt(id.charAt(12));
// }

// function isValidThaiPhone(phone: string): boolean {
//   return /^0[689]\d{8}$/.test(phone);
// }

// function isValidEmail(email: string): boolean {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

// export default function RegisFormShop({ setRegis }: RegisFormProps) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showExampleModal, setShowExampleModal] = useState(false);
//   const [isBankOpen, setIsBankOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const bankDropdownRef = useRef<HTMLDivElement>(null);

//   const [shopData, setShopData] = useState({
//     shop_name: "",
//     owner_name: "",
//     id_card: "",
//     id_name: "",
//     image_card: null as File | null,
//     email: "",
//     contact: "",
//     location: "",
//     latitude: 0,
//     longitude: 0,
//     province: "",
//     district: "",
//     subdistrict: "",
//     zipcode: "",
//     image: null as File | null,
//     bank: "",
//     bank_number: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const banks = [
//     { code: "BBL", name: "ธนาคารกรุงเทพ (BBL)" },
//     { code: "KBANK", name: "ธนาคารกสิกรไทย (KBANK)" },
//     { code: "KTB", name: "ธนาคารกรุงไทย (KTB)" },
//     { code: "SCB", name: "ธนาคารไทยพาณิชย์ (SCB)" },
//     { code: "BAY", name: "ธนาคารกรุงศรีอยุธยา (BAY)" },
//     { code: "TTB", name: "ธนาคารทหารไทยธนชาต (ttb)" },
//     { code: "CIMBT", name: "ธนาคารซีไอเอ็มบี ไทย (CIMBT)" },
//     { code: "UOB", name: "ธนาคารยูโอบี (UOB)" },
//     { code: "KKP", name: "ธนาคารเกียรตินาคินภัทร (KKP)" },
//     { code: "TISCO", name: "ธนาคารทิสโก้ (TISCO)" },
//     { code: "LHFG", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)" },
//     { code: "ICBC", name: "ธนาคารไอซีบีซี (ไทย) (ICBC)" },
//     { code: "BOC", name: "ธนาคารแห่งประเทศจีน (ไทย) (BOC)" },
//     { code: "SMBC", name: "ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น (SMBC)" },
//     { code: "GSB", name: "ธนาคารออมสิน (GSB)" },
//     { code: "BAAC", name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)" },
//     { code: "GHB", name: "ธนาคารอาคารสงเคราะห์ (ธอส.)" },
//     { code: "EXIM", name: "ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย (EXIM)" },
//     { code: "SME", name: "ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม (SME Bank)" },
//     { code: "IBANK", name: "ธนาคารอิสลามแห่งประเทศไทย (iBank)" },
//   ];

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         bankDropdownRef.current &&
//         !bankDropdownRef.current.contains(e.target as Node)
//       ) {
//         setIsBankOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setMessage("");

//     if (!shopData.shop_name.trim()) {
//       setMessage("กรุณากรอกชื่อร้านค้า");
//       return;
//     }

//     if (!shopData.id_name.trim()) {
//       setMessage("กรุณากรอกชื่อในบัตรประชาชน");
//       return;
//     }

//     if (!isValidThaiIDCard(shopData.id_card)) {
//       setMessage("เลขบัตรประชาชน 13 หลักไม่ถูกต้อง");
//       return;
//     }

//     if (!shopData.image_card) {
//       setMessage("กรุณาอัปโหลดรูปภาพบัตรประชาชน");
//       return;
//     }

//     if (shopData.image_card.size > 5 * 1024 * 1024) {
//       setMessage("ขนาดรูปภาพบัตรประชาชนต้องไม่เกิน 5MB");
//       return;
//     }

//     if (!isValidEmail(shopData.email)) {
//       setMessage("รูปแบบอีเมลไม่ถูกต้อง");
//       return;
//     }

//     if (!isValidThaiPhone(shopData.contact)) {
//       setMessage("เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นเบอร์มือถือ 10 หลัก)");
//       return;
//     }

//     if (shopData.latitude === 0 || shopData.longitude === 0) {
//       setMessage("กรุณาเลือกตำแหน่งร้านบนแผนที่");
//       return;
//     }

//     if (!shopData.bank) {
//       setMessage("กรุณาเลือกธนาคาร");
//       return;
//     }

//     if (!/^\d{10,12}$/.test(shopData.bank_number)) {
//       setMessage("เลขบัญชีธนาคารต้องเป็นตัวเลข 10-12 หลัก");
//       return;
//     }

//     if (shopData.password.length < 8) {
//       setMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
//       return;
//     }

//     if (shopData.password !== shopData.confirmPassword) {
//       setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
//       return;
//     }


//     const formData = new FormData();
//     formData.append("shop_name", shopData.shop_name);
//     formData.append("owner_name", shopData.owner_name);
//     formData.append("id_card", shopData.id_card);
//     formData.append("id_name", shopData.id_name);
//     formData.append("email", shopData.email);
//     formData.append("contact", shopData.contact);
//     formData.append("location", shopData.location);
//     formData.append("latitude", shopData.latitude.toString());
//     formData.append("longitude", shopData.longitude.toString());
//     formData.append("province", shopData.province);
//     formData.append("district", shopData.district);
//     formData.append("subdistrict", shopData.subdistrict);
//     formData.append("zipcode", shopData.zipcode);
//     formData.append("bank", shopData.bank);
//     formData.append("bank_number", shopData.bank_number);
//     formData.append("password", shopData.password);

//     if (shopData.image_card) {
//       formData.append("image_card", shopData.image_card);
//     }
//     if (shopData.image) {
//       formData.append("image", shopData.image);
//     }

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/auth/registerShop",
//         formData
//       );

//       if (res.data.message) {
//         setRegis(false);
//         setMessage("สมัครสมาชิกร้านค้าสำเร็จ");
//       } else {
//         setMessage(res.data.error || "กรุณาลองใหม่อีกครั้ง");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setMessage(err.response?.data?.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
//     }
//   }

//   return (
//     <section className="w-full bg-white px-8 py-4">
//       <div className="w-full max-w-sm mx-auto">
//         <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-navy">
//           สมัครสมาชิกร้านค้า
//         </h2>

//         {message && (
//           <p className="mb-4 text-center text-sm font-medium text-red-500">
//             {message}
//           </p>
//         )}

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="ชื่อร้านค้า"
//             value={shopData.shop_name}
//             onChange={(e) =>
//               setShopData({ ...shopData, shop_name: e.target.value })
//             }
//             className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
//             required
//           />

//           <input
//             type="text"
//             placeholder="ชื่อในบัตรประชาชน"
//             value={shopData.id_name}
//             onChange={(e) =>
//               setShopData({
//                 ...shopData,
//                 id_name: e.target.value,
//                 owner_name: e.target.value,
//               })
//             }
//             className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
//             required
//           />

//           <input
//             type="text"
//             maxLength={13}
//             placeholder="เลขบัตรประชาชน (13 หลัก)"
//             value={shopData.id_card}
//             onChange={(e) =>
//               setShopData({
//                 ...shopData,
//                 id_card: e.target.value.replace(/\D/g, ""),
//               })
//             }
//             className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
//             required
//           />

//           <div>
//             <div className="mb-1 flex items-center justify-between">
//               <label className="text-sm font-medium text-gray-700">
//                 รูปภาพบัตรประชาชนพร้อมลายเซ็น
//               </label>
//               <button
//                 type="button"
//                 onClick={() => setShowExampleModal(true)}
//                 className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
//               >
//                 <FileText size={14} />
//                 ดูตัวอย่าง
//               </button>
//             </div>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) =>
//                 setShopData({
//                   ...shopData,
//                   image_card: e.target.files?.[0] || null,
//                 })
//               }
//               className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
//               required
//             />
//             <p className="mt-1 text-xs text-gray-500">
//               กรุณาแนบสำเนาบัตรประชาชนพร้อมลายเซ็นกำกับ สำเนาถูกต้อง (ไม่เกิน 5MB)
//             </p>
//           </div>

//           <input
//             type="email"
//             placeholder="Email"
//             value={shopData.email}
//             onChange={(e) =>
//               setShopData({ ...shopData, email: e.target.value })
//             }
//             className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
//             required
//           />

//           <input
//             type="tel"
//             maxLength={10}
//             placeholder="เบอร์โทรศัพท์ (10 หลัก)"
//             value={shopData.contact}
//             onChange={(e) =>
//               setShopData({
//                 ...shopData,
//                 contact: e.target.value.replace(/\D/g, ""),
//               })
//             }
//             className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
//             required
//           />

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               เลือกตำแหน่งร้านบนแผนที่
//             </label>
//             <MapPicker
//               onSelect={(location: LocationData) => {
//                 setShopData((prev) => ({
//                   ...prev,
//                   latitude: location.lat,
//                   longitude: location.lng,
//                   province: location.province,
//                   district: location.district,
//                   subdistrict: location.subdistrict,
//                   zipcode: location.zipcode,
//                   location: location.display_name || prev.location,
//                 }));
//               }}
//             />
//           </div>

//           <input
//             type="text"
//             placeholder="รายละเอียดที่อยู่ (เช่น ชื่อซอย/ถนน/จุดสังเกต)"
//             value={shopData.location}
//             onChange={(e) =>
//               setShopData({ ...shopData, location: e.target.value })
//             }
//             className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
//           />

//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               รูปร้านค้า
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) =>
//                 setShopData({
//                   ...shopData,
//                   image: e.target.files?.[0] || null,
//                 })
//               }
//               className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
//             />
//           </div>

//           <div className="relative" ref={bankDropdownRef}>
//             <button
//               type="button"
//               onClick={() => setIsBankOpen(!isBankOpen)}
//               className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none text-left focus:border-primary transition"
//             >
//               <span
//                 className={
//                   shopData.bank ? "text-gray-900 font-medium" : "text-gray-400"
//                 }
//               >
//                 {banks.find((b) => b.code === shopData.bank)?.name ||
//                   "เลือกธนาคาร"}
//               </span>
//               <ChevronDown
//                 size={18}
//                 className={`text-gray-400 transition-transform duration-200 ${
//                   isBankOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {isBankOpen && (
//               <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-gray-100 bg-white shadow-xl max-h-48 overflow-y-auto divide-y divide-gray-50">
//                 {banks.map((bank) => (
//                   <div
//                     key={bank.code}
//                     onClick={() => {
//                       setShopData((prev) => ({ ...prev, bank: bank.code }));
//                       setIsBankOpen(false);
//                     }}
//                     className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-blue-50 hover:text-primary ${
//                       shopData.bank === bank.code
//                         ? "bg-blue-50/60 font-medium text-primary"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     {bank.name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <input
//             type="text"
//             maxLength={12}
//             placeholder="เลขบัญชีธนาคาร (10-12 หลัก)"
//             value={shopData.bank_number}
//             onChange={(e) =>
//               setShopData({
//                 ...shopData,
//                 bank_number: e.target.value.replace(/\D/g, ""),
//               })
//             }
//             className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
//             required
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
//               value={shopData.password}
//               onChange={(e) =>
//                 setShopData({ ...shopData, password: e.target.value })
//               }
//               className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm outline-none focus:border-primary"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             >
//               {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
//             </button>
//           </div>

//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="ยืนยันรหัสผ่าน"
//               value={shopData.confirmPassword}
//               onChange={(e) =>
//                 setShopData({ ...shopData, confirmPassword: e.target.value })
//               }
//               className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm outline-none focus:border-primary"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             >
//               {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full rounded-xl bg-primary py-3 text-white text-sm font-medium hover:opacity-90 transition"
//           >
//             สมัครร้านค้า
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-gray-400">
//           มีบัญชีร้านค้าอยู่แล้ว?{" "}
//           <span
//             onClick={() => setRegis(false)}
//             className="font-medium text-primary hover:underline cursor-pointer"
//           >
//             เข้าสู่ระบบที่นี่
//           </span>
//         </p>
//       </div>

//       {showExampleModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
//           <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
//             <button
//               type="button"
//               onClick={() => setShowExampleModal(false)}
//               className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
//             >
//               <X size={20} />
//             </button>

//             <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
//               ตัวอย่างการแนบสำเนาบัตรประชาชน
//             </h3>

//             <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
//               <img
//                 src="/mockup_id.png"
//                 alt="ตัวอย่างสำเนาบัตรประชาชน"
//                 className="w-full h-auto object-cover"
//               />
//             </div>

//             <p className="mt-4 text-center text-xs text-gray-500">
//               * ขีดฆ่าตัวบัตรและเซ็นชื่อรับรอง "ใช้สำหรับสมัครสมาชิกร้านค้าเท่านั้น"
//             </p>

//             <button
//               type="button"
//               onClick={() => setShowExampleModal(false)}
//               className="mt-5 w-full rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
//             >
//               เข้าใจแล้ว
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, FileText, X, ChevronDown } from "lucide-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { LocationData } from "./map";

type RegisFormProps = {
  setRegis: React.Dispatch<React.SetStateAction<boolean>>;
};

const MapPicker = dynamic(() => import("./map"), { ssr: false });

function isValidThaiIDCard(id: string): boolean {
  // เช็กเฉพาะว่าเป็นตัวเลขความยาวครบ 13 หลัก
  return /^\d{13}$/.test(id);
}

function isValidThaiPhone(phone: string): boolean {
  return /^0[689]\d{8}$/.test(phone);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisFormShop({ setRegis }: RegisFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [message, setMessage] = useState("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!shopData.shop_name.trim()) {
      setMessage("กรุณากรอกชื่อร้านค้า");
      return;
    }

    if (!shopData.id_name.trim()) {
      setMessage("กรุณากรอกชื่อในบัตรประชาชน");
      return;
    }

    if (!isValidThaiIDCard(shopData.id_card)) {
      setMessage("เลขบัตรประชาชนต้องเป็นตัวเลขครบ 13 หลัก");
      return;
    }

    if (!shopData.image_card) {
      setMessage("กรุณาอัปโหลดรูปภาพบัตรประชาชน");
      return;
    }

    if (shopData.image_card.size > 5 * 1024 * 1024) {
      setMessage("ขนาดรูปภาพบัตรประชาชนต้องไม่เกิน 5MB");
      return;
    }

    if (!isValidEmail(shopData.email)) {
      setMessage("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    if (!isValidThaiPhone(shopData.contact)) {
      setMessage("เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นเบอร์มือถือ 10 หลัก ขึ้นต้นด้วย 06, 08, 09)");
      return;
    }

    if (shopData.latitude === 0 || shopData.longitude === 0) {
      setMessage("กรุณาเลือกตำแหน่งร้านบนแผนที่");
      return;
    }

    if (!shopData.bank) {
      setMessage("กรุณาเลือกธนาคาร");
      return;
    }

    if (!/^\d{10,12}$/.test(shopData.bank_number)) {
      setMessage("เลขบัญชีธนาคารต้องเป็นตัวเลข 10-12 หลัก");
      return;
    }

    if (shopData.password.length < 8) {
      setMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (shopData.password !== shopData.confirmPassword) {
      setMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ชื่อร้านค้า"
            value={shopData.shop_name}
            onChange={(e) =>
              setShopData({ ...shopData, shop_name: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <input
            type="text"
            placeholder="ชื่อในบัตรประชาชน"
            value={shopData.id_name}
            onChange={(e) =>
              setShopData({
                ...shopData,
                id_name: e.target.value,
                owner_name: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <input
            type="text"
            maxLength={13}
            placeholder="เลขบัตรประชาชน (13 หลัก)"
            value={shopData.id_card}
            onChange={(e) =>
              setShopData({
                ...shopData,
                id_card: e.target.value.replace(/\D/g, ""),
              })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                รูปภาพบัตรประชาชนพร้อมลายเซ็น
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
              กรุณาแนบสำเนาบัตรประชาชนพร้อมลายเซ็นกำกับ สำเนาถูกต้อง (ไม่เกิน 5MB)
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
            maxLength={10}
            placeholder="เบอร์โทรศัพท์ (10 หลัก)"
            value={shopData.contact}
            onChange={(e) =>
              setShopData({
                ...shopData,
                contact: e.target.value.replace(/\D/g, ""),
              })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

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

          <div className="relative" ref={bankDropdownRef}>
            <button
              type="button"
              onClick={() => setIsBankOpen(!isBankOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none text-left focus:border-primary transition"
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

          <input
            type="text"
            maxLength={12}
            placeholder="เลขบัญชีธนาคาร (10-12 หลัก)"
            value={shopData.bank_number}
            onChange={(e) =>
              setShopData({
                ...shopData,
                bank_number: e.target.value.replace(/\D/g, ""),
              })
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
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
              ตัวอย่างการแนบสำเนาบัตรประชาชน
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img
                src="/mockup_id.png"
                alt="ตัวอย่างสำเนาบัตรประชาชน"
                className="w-full h-auto object-cover"
              />
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
              * ขีดฆ่าตัวบัตรและเซ็นชื่อรับรอง "ใช้สำหรับสมัครสมาชิกร้านค้าเท่านั้น"
            </p>

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
    </section>
  );
}