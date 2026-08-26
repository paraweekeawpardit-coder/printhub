// 'use client';

// import { useEffect, useState, useCallback, useRef } from 'react';
// import ShopCard, { Shop } from '../../component/customer/ShopCard';
// import Link from 'next/link';

// // แมปไอคอนตามประเภทงานพิมพ์จริงจาก Supabase
// const getServiceIcon = (typeName: string) => {
//   if (typeName.includes('เอกสาร') || typeName.includes('ชีท')) return '📄';
//   if (typeName.includes('โปสเตอร์')) return '🖼️';
//   if (typeName.includes('นามบัตร') || typeName.includes('การ์ด')) return '💳';
//   if (typeName.includes('สติ๊กเกอร์') || typeName.includes('ฉลาก')) return '🏷️';
//   if (typeName.includes('ไวนิล')) return '🚩';
//   if (typeName.includes('เข้าเล่ม') || typeName.includes('กาว')) return '📚';
//   if (typeName.includes('แปลน') || typeName.includes('CAD')) return '📐';
//   if (typeName.includes('เคลือบ')) return '🛡️';
//   return '🖨️';
// };

// export default function CustomerHomePage() {
//   const [shops, setShops] = useState<Shop[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Filter States
//   const [search, setSearch] = useState<string>('');
//   const [selectedService, setSelectedService] = useState<string>('ทั้งหมด');
//   const [isOpenOnly, setIsOpenOnly] = useState<boolean>(false);
//   const [isUnderPrice, setIsUnderPrice] = useState<boolean>(false);
//   const [isHighRating, setIsHighRating] = useState<boolean>(false);
//   const [sortBy, setSortBy] = useState<string>('');

//   // UI Category, Dropdown & Geolocation States
//   const [serviceCategories, setServiceCategories] = useState<{ name: string; icon: string }[]>([
//     { name: 'ทั้งหมด', icon: '✨' },
//   ]);
//   const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
//     lat: 13.7298,
//     lng: 100.7782,
//   });
//   const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

//   // ฟังก์ชันเลื่อนหน้าจอ (ตรวจจับระยะก่อนเลื่อนเพื่อป้องกันหน้าจอสั่น)
//   const scrollToStickyArea = () => {
//     if (typeof window !== 'undefined' && window.scrollY > 120) {
//       window.scrollTo({
//         top: 0,
//         behavior: 'smooth',
//       });
//     }
//   };

//   // ดึงพิกัด Geolocation ปัจจุบัน[cite: 1]
//   useEffect(() => {
//     if (typeof window !== 'undefined' && navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setUserLocation({
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           });
//         },
//         (err) => console.log('Location access note:', err.message),
//         { enableHighAccuracy: true, timeout: 5000 }
//       );
//     }
//   }, []);

//   // ดึงรายการประเภทบริการจริงจากฐานข้อมูล Supabase[cite: 1]
//   useEffect(() => {
//     const fetchServiceTypes = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/customer/service-types');
//         const result = await res.json();
//         if (result.success && Array.isArray(result.data)) {
//           const uniqueTypes = result.data.map((type: string) => ({
//             name: type,
//             icon: getServiceIcon(type),
//           }));
//           setServiceCategories([{ name: 'ทั้งหมด', icon: '✨' }, ...uniqueTypes]);
//         }
//       } catch (err) {
//         console.error('Fetch service types error:', err);
//       }
//     };

//     fetchServiceTypes();
//   }, []);

//   // ดึงข้อมูลร้านค้าตามตัวกรองที่เลือก[cite: 1]
//   const fetchShops = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (search.trim()) params.append('search', search.trim());
//       if (selectedService && selectedService !== 'ทั้งหมด') {
//         params.append('service_type', selectedService);
//       }
//       if (isUnderPrice) params.append('max_price', '50');
//       if (isOpenOnly) params.append('is_open', 'true');
//       if (sortBy) params.append('sort_by', sortBy);

//       if (userLocation) {
//         params.append('user_lat', userLocation.lat.toString());
//         params.append('user_lng', userLocation.lng.toString());
//       }

//       const res = await fetch(`http://localhost:5000/api/customer/shops?${params.toString()}`);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       const data = await res.json();
//       if (data.success) {
//         let result = data.data;
//         if (isHighRating) {
//           result = result.filter((s: Shop) => s.rating >= 4.5 || s.rating === 0);
//         }
//         setShops(result);
//       }
//     } catch (error) {
//       console.error('Fetch shops error:', error);
//       setShops([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [search, selectedService, isUnderPrice, isOpenOnly, isHighRating, sortBy, userLocation]);

//   // Debounce การค้นหา[cite: 1]
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchShops();
//     }, 250);
//     return () => clearTimeout(timer);
//   }, [fetchShops]);

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans relative text-slate-800 antialiased">
//       {/* 1. Header / Navbar */}
//       <header className="bg-white border-b border-slate-100 z-30">
//         <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
//               🖨️
//             </div>
//             <span className="text-xl font-bold text-slate-900 tracking-tight">PrintHub</span>
//           </div>

//           <nav className="flex items-center gap-6 text-sm font-semibold">
//             <Link href="/customer" className="text-blue-600 border-b-2 border-blue-600 pb-0.5">
//               หน้าแรก
//             </Link>
//             <a href="#" className="text-slate-500 hover:text-slate-900 transition">
//               เกี่ยวกับเรา
//             </a>
//             <Link href="/customer/orders" className="text-slate-500 hover:text-slate-900 transition">
//               คำสั่งซื้อของฉัน
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* 2. Main Content Container */}
//       <main className="max-w-5xl w-full mx-auto px-4 py-4 space-y-6 flex-1">
//         {/* ส่วนเลือกประเภทงานปริ้นท์ทรงกลม (ดึงจาก Supabase) */}
//         <div className="space-y-3.5 pt-1">
//           <div className="flex items-center justify-between">
//             <h2 className="text-base font-bold text-slate-900">เลือกประเภทงานปริ้นท์</h2>
//             <span className="text-xs text-slate-400 font-medium">เลื่อนดูเพิ่มเติม →</span>
//           </div>

//           <div className="flex items-start gap-5 overflow-x-auto pb-3 pt-2 px-1 no-scrollbar scroll-smooth">
//             {serviceCategories.map((cat, idx) => {
//               const isSelected = selectedService === cat.name;
//               return (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => setSelectedService(cat.name)}
//                   className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none w-[78px]"
//                 >
//                   <div
//                     className={`w-15 h-15 rounded-full flex items-center justify-center text-2xl transition-all duration-200 ${
//                       isSelected
//                         ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-offset-2 ring-blue-600'
//                         : 'bg-white text-slate-700 border border-slate-200/80 shadow-xs group-hover:border-blue-400 group-hover:bg-blue-50/40 group-hover:scale-105'
//                     }`}
//                   >
//                     {cat.icon}
//                   </div>
//                   <span
//                     className={`text-xs leading-snug text-center transition-colors line-clamp-2 h-7 flex items-center justify-center whitespace-pre-line ${
//                       isSelected
//                         ? 'font-bold text-blue-600'
//                         : 'font-medium text-slate-700 group-hover:text-slate-900'
//                     }`}
//                   >
//                     {cat.name}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* จุด Anchor สำหรับให้อิงพิกัด Scroll */}
//         <div ref={scrollAnchorRef} className="h-0 w-full" />

//         {/* ส่วน Sticky Search Bar & แถบตัวกรอง Pills Bar */}
//         <div className="sticky top-0 bg-[#F9FAFB] z-20 py-3 space-y-3 border-b border-slate-200/50 -mx-4 px-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)]">
//           {/* พิกัดตำแหน่ง */}
//           <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
//             <span className="text-blue-600">📍</span>
//             <span>{userLocation ? 'กำลังอ้างอิงพิกัดตำแหน่งปัจจุบันของคุณ' : 'กำลังค้นหาพิกัดตำแหน่งของคุณ...'}</span>
//           </div>

//           {/* ช่องค้นหา */}
//           <div className="relative">
//             <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
//               <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
//               </svg>
//             </span>
//             <input
//               type="text"
//               placeholder="ค้นหาชื่อร้านค้า หรือบริการปริ้นท์ที่ต้องการ..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-full pl-11 pr-4 py-2.5 border border-transparent focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition outline-none shadow-xs"
//             />
//           </div>

//           {/* แถบตัวกรอง Pills Bar */}
//           <div className="flex items-center gap-2 overflow-visible pb-1 text-xs font-semibold relative">
//             {/* 1. ปุ่ม Dropdown เรียงลำดับ */}
//             <div className="relative shrink-0">
//               <button
//                 type="button"
//                 onClick={() => setShowSortDropdown(!showSortDropdown)}
//                 className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
//                   sortBy !== ''
//                     ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
//                     : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
//                 }`}
//               >
//                 <span>{sortBy === 'distance' ? '📍' : sortBy === 'rating' ? '⭐' : '⇅'}</span>
//                 <span>
//                   {sortBy === 'distance'
//                     ? 'ระยะทางใกล้ที่สุด'
//                     : sortBy === 'rating'
//                     ? 'คะแนนรีวิวสูงสุด'
//                     : 'เรียงลำดับ'}
//                 </span>
//                 <svg
//                   className={`w-3.5 h-3.5 transition-transform ${
//                     showSortDropdown ? 'rotate-180 text-blue-600' : 'text-slate-400'
//                   }`}
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>

//               {/* เมนู Dropdown ลอยลงมา */}
//               {showSortDropdown && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-20 cursor-default"
//                     onClick={() => setShowSortDropdown(false)}
//                   />
//                   <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-30 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSortBy('distance');
//                         setShowSortDropdown(false);
//                         scrollToStickyArea();
//                       }}
//                       className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition ${
//                         sortBy === 'distance'
//                           ? 'bg-blue-50 text-blue-700 font-bold'
//                           : 'text-slate-700 hover:bg-slate-50 font-medium'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <span>📍</span>
//                         <span>ระยะทางใกล้ที่สุด</span>
//                       </div>
//                       {sortBy === 'distance' && <span className="text-blue-600 font-bold">✓</span>}
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSortBy('rating');
//                         setShowSortDropdown(false);
//                         scrollToStickyArea();
//                       }}
//                       className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition ${
//                         sortBy === 'rating'
//                           ? 'bg-blue-50 text-blue-700 font-bold'
//                           : 'text-slate-700 hover:bg-slate-50 font-medium'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <span>⭐</span>
//                         <span>คะแนนรีวิวสูงสุด</span>
//                       </div>
//                       {sortBy === 'rating' && <span className="text-blue-600 font-bold">✓</span>}
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* 2. Pill: เปิดให้บริการ[cite: 1] */}
//             <button
//               type="button"
//               onClick={() => {
//                 setIsOpenOnly(!isOpenOnly);
//                 scrollToStickyArea();
//               }}
//               className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
//                 isOpenOnly
//                   ? 'bg-emerald-50 border-emerald-600 text-emerald-700 font-bold'
//                   : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
//               }`}
//             >
//               <span className={`w-2 h-2 rounded-full ${isOpenOnly ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
//               <span>เปิดให้บริการ</span>
//             </button>

//             {/* 3. Pill: ราคาประหยัด[cite: 1] */}
//             <button
//               type="button"
//               onClick={() => {
//                 setIsUnderPrice(!isUnderPrice);
//                 scrollToStickyArea();
//               }}
//               className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
//                 isUnderPrice
//                   ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
//                   : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
//               }`}
//             >
//               <span>🏷️</span>
//               <span>ราคาประหยัด &lt; ฿50</span>
//             </button>

//             {/* 4. Pill: 4.5 ขึ้นไป[cite: 1] */}
//             <button
//               type="button"
//               onClick={() => {
//                 setIsHighRating(!isHighRating);
//                 scrollToStickyArea();
//               }}
//               className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
//                 isHighRating
//                   ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold'
//                   : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
//               }`}
//             >
//               <span>⭐</span>
//               <span>4.5 ขึ้นไป</span>
//             </button>

//             {/* 5. ปุ่มล้างตัวกรอง (อยู่ท้ายสุดของแถว)[cite: 1] */}
//             {(selectedService !== 'ทั้งหมด' ||
//               isOpenOnly ||
//               isUnderPrice ||
//               isHighRating ||
//               sortBy !== '' ||
//               search.trim() !== '') && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedService('ทั้งหมด');
//                   setIsOpenOnly(false);
//                   setIsUnderPrice(false);
//                   setIsHighRating(false);
//                   setSortBy('');
//                   setSearch('');
//                   setShowSortDropdown(false);
//                   scrollToStickyArea();
//                 }}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 active:scale-95 transition-all shrink-0 font-bold shadow-xs animate-in fade-in zoom-in-95 duration-150"
//                 title="ล้างตัวกรองทั้งหมด"
//               >
//                 <span className="text-[11px] font-extrabold">✕</span>
//                 <span>ล้างตัวกรอง</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* 3. Section: รายการร้านค้าใกล้ฉัน[cite: 1] */}
//         <section className="space-y-4 pt-1 min-h-[750px]">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-lg font-bold text-slate-900">ร้านยอดนิยมใกล้ฉัน</h2>
//               <p className="text-xs text-slate-500 font-medium">พบ {shops.length} ร้านค้าที่พร้อมให้บริการ</p>
//             </div>
//             {(selectedService !== 'ทั้งหมด' || isOpenOnly || isUnderPrice || isHighRating || search.trim() !== '') && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedService('ทั้งหมด');
//                   setIsOpenOnly(false);
//                   setIsUnderPrice(false);
//                   setIsHighRating(false);
//                   setSortBy('');
//                   setSearch('');
//                   scrollToStickyArea();
//                 }}
//                 className="text-xs text-blue-600 font-semibold hover:underline"
//               >
//                 {/* ล้างตัวกรอง ✕ */}
//               </button>
//             )}
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//               {[1, 2, 3, 4, 5, 6].map((n) => (
//                 <div key={n} className="h-[340px] bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col justify-between animate-pulse shadow-xs">
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <div className="h-5 bg-slate-200 rounded w-1/2"></div>
//                       <div className="h-4 bg-slate-100 rounded-full w-12"></div>
//                     </div>
//                     <div className="w-full h-36 bg-slate-100 rounded-xl"></div>
//                     <div className="space-y-2 pt-1">
//                       <div className="h-3 bg-slate-200 rounded w-1/4"></div>
//                       <div className="h-3 bg-slate-100 rounded w-3/4"></div>
//                       <div className="h-3 bg-slate-100 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                   <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
//                     <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
//                     <div className="h-4 bg-slate-100 rounded w-16"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : shops.length === 0 ? (
//             <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
//               <p className="text-slate-400 text-sm font-medium">ไม่พบร้านค้าที่ตรงกับเงื่อนไขการค้นหาของคุณ</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
//               {shops.map((shop) => (
//                 <ShopCard key={shop.id} shop={shop} />
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import ShopCard, { Shop } from '../../component/customer/ShopCard';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// โหลดคอมโพเนนต์แผนที่แบบ Dynamic ป้องกัน Error บน Client-side
const LocationPickerMap = dynamic(
  () => import('../../component/customer/LocationPickerMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 sm:h-80 w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">
        กำลังโหลดแผนที่...
      </div>
    ),
  }
);

// พิกัดเริ่มต้น (Default Fallback)
const DEFAULT_COORDS = {
  lat: 13.7298,
  lng: 100.7782,
};

const getServiceIcon = (typeName: string) => {
  if (typeName.includes('เอกสาร') || typeName.includes('ชีท')) return '📄';
  if (typeName.includes('โปสเตอร์')) return '🖼️';
  if (typeName.includes('นามบัตร') || typeName.includes('การ์ด')) return '💳';
  if (typeName.includes('สติ๊กเกอร์') || typeName.includes('ฉลาก')) return '🏷️';
  if (typeName.includes('ไวนิล')) return '🚩';
  if (typeName.includes('เข้าเล่ม') || typeName.includes('กาว')) return '📚';
  if (typeName.includes('แปลน') || typeName.includes('CAD')) return '📐';
  if (typeName.includes('เคลือบ')) return '🛡️';
  return '🖨️';
};

export default function CustomerHomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [search, setSearch] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('ทั้งหมด');
  const [minPrice, setMinPrice] = useState<string>(''); // US-3: ราคาต่ำสุด
  const [maxPrice, setMaxPrice] = useState<string>(''); // US-3: ราคาสูงสุด
  const [isOpenOnly, setIsOpenOnly] = useState<boolean>(false);
  const [isHighRating, setIsHighRating] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('distance'); // ค่าเริ่มต้นเรียงตามระยะทาง (US-1)

  // Location States (US-1)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(DEFAULT_COORDS);
  const [locationName, setLocationName] = useState<string>('ตำแหน่งปัจจุบันของคุณ (GPS)');
  const [isCustomLocation, setIsCustomLocation] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [tempMapCoords, setTempMapCoords] = useState<{ lat: number; lng: number }>(DEFAULT_COORDS);

  // UI Dropdown & Popover States
  const [showPriceDropdown, setShowPriceDropdown] = useState<boolean>(false);
  const [tempMinPrice, setTempMinPrice] = useState<string>('');
  const [tempMaxPrice, setTempMaxPrice] = useState<string>('');
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);

  const [serviceCategories, setServiceCategories] = useState<{ name: string; icon: string }[]>([
    { name: 'ทั้งหมด', icon: '✨' },
  ]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const scrollToStickyArea = () => {
    if (typeof window !== 'undefined' && window.scrollY > 120) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // ดึงพิกัด GPS จริงจาก Browser พร้อม Fallback คืนค่าทันที
  const fetchCurrentGPS = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          setTempMapCoords(coords);
          setLocationName('ตำแหน่งปัจจุบันของคุณ (GPS)');
          setIsCustomLocation(false);
        },
        (err) => {
          console.log('Location note:', err.message);
          // หาก GPS ใช้งานไม่ได้ ให้คืนค่าพิกัดเริ่มต้น Default ทันที
          setUserLocation(DEFAULT_COORDS);
          setTempMapCoords(DEFAULT_COORDS);
          setLocationName('ตำแหน่งเริ่มต้น (ลาดกระบัง)');
          setIsCustomLocation(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation(DEFAULT_COORDS);
      setTempMapCoords(DEFAULT_COORDS);
      setLocationName('ตำแหน่งเริ่มต้น (ลาดกระบัง)');
      setIsCustomLocation(false);
    }
  };

  // ✅ ฟังก์ชันรีเซ็ตค่าตัวกรองและคืนค่าตำแหน่งกลับเป็นค่าเริ่มต้น (GPS)
  const handleResetAllFilters = () => {
    setSelectedService('ทั้งหมด');
    setIsOpenOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setTempMinPrice('');
    setTempMaxPrice('');
    setIsHighRating(false);
    setSortBy('distance');
    setSearch('');
    setShowSortDropdown(false);
    setShowPriceDropdown(false);
    
    // คืนค่าตำแหน่งเป็นค่าเริ่มต้นและดึง GPS
    fetchCurrentGPS();
    scrollToStickyArea();
  };

  useEffect(() => {
    fetchCurrentGPS();
  }, []);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/customer/service-types');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          const uniqueTypes = result.data.map((type: string) => ({
            name: type,
            icon: getServiceIcon(type),
          }));
          setServiceCategories([{ name: 'ทั้งหมด', icon: '✨' }, ...uniqueTypes]);
        }
      } catch (err) {
        console.error('Fetch service types error:', err);
      }
    };

    fetchServiceTypes();
  }, []);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedService && selectedService !== 'ทั้งหมด') {
        params.append('service_type', selectedService);
      }

      // แนบช่วงราคา (US-3)
      if (minPrice.trim() !== '') params.append('min_price', minPrice.trim());
      if (maxPrice.trim() !== '') params.append('max_price', maxPrice.trim());

      if (isOpenOnly) params.append('is_open', 'true');
      if (sortBy) params.append('sort_by', sortBy);

      // แนบพิกัดเพื่อคำนวณระยะทาง (US-1)
      if (userLocation) {
        params.append('user_lat', userLocation.lat.toString());
        params.append('user_lng', userLocation.lng.toString());
      }

      const res = await fetch(`http://localhost:5000/api/customer/shops?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.success) {
        let result = data.data;
        if (isHighRating) {
          result = result.filter((s: Shop) => s.rating >= 4.5 || s.rating === 0);
        }
        setShops(result);
      }
    } catch (error) {
      console.error('Fetch shops error:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedService, minPrice, maxPrice, isOpenOnly, isHighRating, sortBy, userLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShops();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchShops]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans relative text-slate-800 antialiased">
      {/* 1. Header / Navbar */}
      <header className="bg-white border-b border-slate-100 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🖨️
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PrintHub</span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/customer" className="text-blue-600 border-b-2 border-blue-600 pb-0.5">
              หน้าแรก
            </Link>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition">
              เกี่ยวกับเรา
            </a>
            <Link href="/customer/orders" className="text-slate-500 hover:text-slate-900 transition">
              คำสั่งซื้อของฉัน
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="max-w-5xl w-full mx-auto px-4 py-4 space-y-6 flex-1">
        {/* ส่วนเลือกประเภทงานปริ้นท์ */}
        <div className="space-y-3.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">เลือกประเภทงานปริ้นท์</h2>
            <span className="text-xs text-slate-400 font-medium">เลื่อนดูเพิ่มเติม →</span>
          </div>

          <div className="flex items-start gap-5 overflow-x-auto pb-3 pt-2 px-1 no-scrollbar scroll-smooth">
            {serviceCategories.map((cat, idx) => {
              const isSelected = selectedService === cat.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedService(cat.name)}
                  className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none w-[78px]"
                >
                  <div
                    className={`w-15 h-15 rounded-full flex items-center justify-center text-2xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-offset-2 ring-blue-600'
                        : 'bg-white text-slate-700 border border-slate-200/80 shadow-xs group-hover:border-blue-400 group-hover:bg-blue-50/40 group-hover:scale-105'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className={`text-xs leading-snug text-center transition-colors line-clamp-2 h-7 flex items-center justify-center whitespace-pre-line ${
                      isSelected
                        ? 'font-bold text-blue-600'
                        : 'font-medium text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* จุด Anchor สำหรับให้อิงพิกัด Scroll */}
        <div ref={scrollAnchorRef} className="h-0 w-full" />

        {/* ส่วน Sticky Search Bar & แถบตัวกรอง Pills Bar */}
        <div className="sticky top-0 bg-[#F9FAFB] z-30 py-3 space-y-3 border-b border-slate-200/50 -mx-4 px-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)]">
          {/* แถบพิกัดตำแหน่ง */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
              <span className="text-blue-600 text-sm shrink-0">📍</span>
              <span className="truncate">
                {isCustomLocation ? 'ปักหมุดที่: ' : 'อ้างอิง: '}
                <strong className="text-slate-900 font-bold">{locationName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTempMapCoords(userLocation);
                  setShowLocationModal(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-lg transition active:scale-95 flex items-center gap-1"
              >
                <span>🗺️</span>
                <span>เปลี่ยนตำแหน่ง</span>
              </button>
              {isCustomLocation && (
                <button
                  type="button"
                  onClick={fetchCurrentGPS}
                  className="text-slate-500 hover:text-slate-800 font-medium hover:underline text-[11px]"
                  title="กลับไปใช้ตำแหน่ง GPS จริง"
                >
                  ใช้ GPS จริง ↺
                </button>
              )}
            </div>
          </div>

          {/* ช่องค้นหา */}
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="ค้นหาชื่อร้านค้า หรือบริการปริ้นท์ที่ต้องการ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-full pl-11 pr-4 py-2.5 border border-transparent focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition outline-none shadow-xs"
            />
          </div>

          {/* แถบตัวกรอง Pills Bar */}
          <div className="flex items-center gap-2 overflow-visible pb-1 text-xs font-semibold relative z-40">
            {/* 1. ปุ่ม Dropdown เรียงลำดับ */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowPriceDropdown(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
                  sortBy !== ''
                    ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{sortBy === 'distance' ? '📍' : sortBy === 'rating' ? '⭐' : '⇅'}</span>
                <span>
                  {sortBy === 'distance'
                    ? 'ระยะทางใกล้ที่สุด'
                    : sortBy === 'rating'
                    ? 'คะแนนรีวิวสูงสุด'
                    : 'เรียงลำดับ'}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${
                    showSortDropdown ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy('distance');
                        setShowSortDropdown(false);
                        scrollToStickyArea();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition ${
                        sortBy === 'distance'
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>ระยะทางใกล้ที่สุด</span>
                      </div>
                      {sortBy === 'distance' && <span className="text-blue-600 font-bold">✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSortBy('rating');
                        setShowSortDropdown(false);
                        scrollToStickyArea();
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition ${
                        sortBy === 'rating'
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>⭐</span>
                        <span>คะแนนรีวิวสูงสุด</span>
                      </div>
                      {sortBy === 'rating' && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 2. Pill: กำหนดช่วงราคา (US-3) */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTempMinPrice(minPrice);
                  setTempMaxPrice(maxPrice);
                  setShowPriceDropdown(!showPriceDropdown);
                  setShowSortDropdown(false);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
                  minPrice !== '' || maxPrice !== ''
                    ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>🏷️</span>
                <span>
                  {minPrice !== '' && maxPrice !== ''
                    ? `฿${minPrice} - ฿${maxPrice}`
                    : minPrice !== ''
                    ? `฿${minPrice} ขึ้นไป`
                    : maxPrice !== ''
                    ? `ไม่เกิน ฿${maxPrice}`
                    : 'กำหนดช่วงราคา'}
                </span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    showPriceDropdown ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Popover กล่องกรอกช่วงราคา */}
              {showPriceDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowPriceDropdown(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">ระบุช่วงราคา (บาท)</span>
                      {(tempMinPrice !== '' || tempMaxPrice !== '') && (
                        <button
                          type="button"
                          onClick={() => {
                            setTempMinPrice('');
                            setTempMaxPrice('');
                          }}
                          className="text-[11px] text-rose-500 hover:underline"
                        >
                          ล้างค่า
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">฿</span>
                        <input
                          type="number"
                          placeholder="ต่ำสุด"
                          value={tempMinPrice}
                          onChange={(e) => setTempMinPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-2 py-1.5 text-xs outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                      <span className="text-slate-400 font-medium">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">฿</span>
                        <input
                          type="number"
                          placeholder="สูงสุด"
                          value={tempMaxPrice}
                          onChange={(e) => setTempMaxPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-2 py-1.5 text-xs outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setMinPrice('');
                          setMaxPrice('');
                          setTempMinPrice('');
                          setTempMaxPrice('');
                          setShowPriceDropdown(false);
                          scrollToStickyArea();
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMinPrice(tempMinPrice);
                          setMaxPrice(tempMaxPrice);
                          setShowPriceDropdown(false);
                          scrollToStickyArea();
                        }}
                        className="bg-blue-600 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl hover:bg-blue-700 active:scale-95 transition shadow-xs"
                      >
                        นำไปใช้
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. Pill: เปิดให้บริการ */}
            <button
              type="button"
              onClick={() => {
                setIsOpenOnly(!isOpenOnly);
                scrollToStickyArea();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
                isOpenOnly
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpenOnly ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
              <span>เปิดให้บริการ</span>
            </button>

            {/* 4. Pill: 4.5 ขึ้นไป */}
            <button
              type="button"
              onClick={() => {
                setIsHighRating(!isHighRating);
                scrollToStickyArea();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
                isHighRating
                  ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>⭐</span>
              <span>4.5 ขึ้นไป</span>
            </button>

            {/* 5. ปุ่มล้างตัวกรอง (แถบ Pills Bar) */}
            {(selectedService !== 'ทั้งหมด' ||
              isOpenOnly ||
              minPrice !== '' ||
              maxPrice !== '' ||
              isHighRating ||
              sortBy !== 'distance' ||
              search.trim() !== '' ||
              isCustomLocation) && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 active:scale-95 transition-all shrink-0 font-bold shadow-xs animate-in fade-in zoom-in-95 duration-150"
                title="ล้างตัวกรองทั้งหมดและคืนค่าตำแหน่งเริ่มต้น"
              >
                <span className="text-[11px] font-extrabold">✕</span>
                <span>ล้างตัวกรอง</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Section: รายการร้านค้า */}
        <section className="space-y-4 pt-1 min-h-[750px]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">ร้านยอดนิยมใกล้ฉัน</h2>
              <p className="text-xs text-slate-500 font-medium">
                พบ {shops.length} ร้านค้าที่พร้อมให้บริการ (คำนวณจาก: {locationName})
              </p>
            </div>
            {(selectedService !== 'ทั้งหมด' ||
              isOpenOnly ||
              minPrice !== '' ||
              maxPrice !== '' ||
              isHighRating ||
              search.trim() !== '' ||
              isCustomLocation) && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                ล้างตัวกรอง ✕
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-[340px] bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col justify-between animate-pulse shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-12"></div>
                    </div>
                    <div className="w-full h-36 bg-slate-100 rounded-xl"></div>
                    <div className="space-y-2 pt-1">
                      <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
                    <div className="h-4 bg-slate-100 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 text-sm font-medium">
                ไม่พบร้านค้าที่ตรงกับเงื่อนไขการค้นหาของคุณในบริเวณนี้
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal แผนที่ปักหมุดเลือกตำแหน่ง (Leaflet - US-1) */}
      {showLocationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 relative text-slate-800 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">เลือกตำแหน่งร้านบนแผนที่</h3>
                  <p className="text-[11px] text-slate-400">คลิกหรือลากหมุดบนแผนที่ เพื่อหาร้านใกล้จุดหมายของคุณ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <LocationPickerMap
              initialLat={tempMapCoords.lat}
              initialLng={tempMapCoords.lng}
              onLocationSelect={(lat, lng) => {
                setTempMapCoords({ lat, lng });
              }}
            />

            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600 border border-slate-100">
              <span>พิกัดที่เลือก:</span>
              <span className="font-mono font-bold text-blue-600">
                {tempMapCoords.lat.toFixed(4)}, {tempMapCoords.lng.toFixed(4)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  fetchCurrentGPS();
                  setShowLocationModal(false);
                }}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                📍 ใช้ตำแหน่ง GPS จริงของฉัน
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserLocation(tempMapCoords);
                  setLocationName(`พิกัดที่ปักหมุด (${tempMapCoords.lat.toFixed(4)}, ${tempMapCoords.lng.toFixed(4)})`);
                  setIsCustomLocation(true);
                  setShowLocationModal(false);
                  scrollToStickyArea();
                }}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-xs"
              >
                ยืนยันตำแหน่งนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}