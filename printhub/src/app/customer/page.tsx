// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import ShopCard, { Shop } from '../component/customer/ShopCard';

// export default function CustomerShopSearchPage() {
//   const [shops, setShops] = useState<Shop[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Filter States
//   const [search, setSearch] = useState<string>('');
//   const [serviceType, setServiceType] = useState<string>('');
//   const [minPrice, setMinPrice] = useState<string>('');
//   const [maxPrice, setMaxPrice] = useState<string>('');
//   const [isOpenOnly, setIsOpenOnly] = useState<boolean>(false);
//   const [sortBy, setSortBy] = useState<string>('');
  
//   // Geolocation State
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

//   // ขอพิกัดผู้ใช้จากเบราว์เซอร์
//   useEffect(() => {
//     if (typeof window !== 'undefined' && navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setUserLocation({
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           });
//         },
//         (err) => console.log('Location access denied:', err)
//       );
//     }
//   }, []);

//   // ฟังก์ชันดึงข้อมูลจาก Backend
//   const fetchShops = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append('search', search);
//       if (serviceType) params.append('service_type', serviceType);
//       if (minPrice) params.append('min_price', minPrice);
//       if (maxPrice) params.append('max_price', maxPrice);
//       if (isOpenOnly) params.append('is_open', 'true');
//       if (sortBy) params.append('sort_by', sortBy);
//       if (userLocation) {
//         params.append('user_lat', userLocation.lat.toString());
//         params.append('user_lng', userLocation.lng.toString());
//       }

//       const res = await fetch(`http://localhost:5000/api/customer/shops?${params.toString()}`);
//       const data = await res.json();
//       if (data.success) {
//         setShops(data.data);
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [search, serviceType, minPrice, maxPrice, isOpenOnly, sortBy, userLocation]);

//   // ระบบดึงข้อมูลให้อัตโนมัติทันทีที่มีการเปลี่ยนแปลงค่าตัวกรอง พร้อม Debounce 300ms สำหรับการพิมพ์
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchShops();
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [fetchShops]);

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold text-gray-800">ค้นหาร้านปริ้นท์เอกสาร</h1>

//       {/* แถบเครื่องมือค้นหาและฟิลเตอร์ */}
//       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
//         <div>
//           <input
//             type="text"
//             placeholder="🔍 ค้นหาชื่อร้านค้าได้ทันที..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white focus:outline-blue-500"
//           />
//         </div>

//         <div className="flex flex-wrap gap-3 items-center text-sm">
//           {/* กรองประเภทบริการ */}
//           <select
//             value={serviceType}
//             onChange={(e) => setServiceType(e.target.value)}
//             className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-blue-500"
//           >
//             <option value="">ทุกประเภทบริการ</option>
//             <option value="เอกสาร">เอกสาร</option>
//             <option value="โปสเตอร์">โปสเตอร์</option>
//             <option value="นามบัตร">นามบัตร</option>
//             <option value="สติ๊กเกอร์">สติ๊กเกอร์</option>
//             <option value="ไวนิล">ไวนิล</option>
//           </select>

//           {/* กรองช่วงราคา */}
//           <div className="flex items-center gap-1">
//             <input
//               type="number"
//               placeholder="ราคาต่ำสุด"
//               value={minPrice}
//               onChange={(e) => setMinPrice(e.target.value)}
//               className="border border-gray-300 p-2 rounded-lg w-28 bg-white focus:outline-blue-500"
//             />
//             <span className="text-gray-400">-</span>
//             <input
//               type="number"
//               placeholder="ราคาสูงสุด"
//               value={maxPrice}
//               onChange={(e) => setMaxPrice(e.target.value)}
//               className="border border-gray-300 p-2 rounded-lg w-28 bg-white focus:outline-blue-500"
//             />
//           </div>

//           {/* เรียงลำดับ */}
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-blue-500"
//           >
//             <option value="">เรียงตามค่าเริ่มต้น</option>
//             <option value="rating">คะแนนรีวิวสูงสุด</option>
//             <option value="distance" disabled={!userLocation}>
//               {userLocation ? 'ระยะทางใกล้ที่สุด' : 'ระยะทาง (ต้องเปิด GPS)'}
//             </option>
//           </select>

//           {/* เฉพาะร้านที่เปิด */}
//           <label className="flex items-center gap-2 cursor-pointer text-gray-700 select-none ml-auto">
//             <input
//               type="checkbox"
//               checked={isOpenOnly}
//               onChange={(e) => setIsOpenOnly(e.target.checked)}
//               className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
//             />
//             <span>เฉพาะร้านที่เปิดอยู่</span>
//           </label>
//         </div>
//       </div>

//       {/* พื้นที่แสดงรายการร้านค้า */}
//       {loading ? (
//         <p className="text-center py-10 text-gray-500">กำลังอัปเดตข้อมูลร้านค้า...</p>
//       ) : shops.length === 0 ? (
//         <p className="text-center py-10 text-gray-500">ไม่พบร้านค้าที่ตรงกับเงื่อนไข</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {shops.map((shop) => (
//             <ShopCard key={shop.id} shop={shop} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import ShopCard, { Shop } from '../../component/customer/ShopCard';

// UR-04: รายการหมวดหมู่งานพิมพ์
const PRINT_SERVICES = [
  { name: 'ทั้งหมด', icon: '✨' },
  { name: 'เอกสารและชีทเรียน', icon: '📄' },
  { name: 'โปสเตอร์ & ไวนิล', icon: '🖼️' },
  { name: 'เข้าเล่มสันเกลียว/กาว', icon: '📚' },
  { name: 'สติ๊กเกอร์ & ฉลากสินค้า', icon: '🏷️' },
  { name: 'พิมพ์แบบแปลน/CAD', icon: '📐' },
  { name: 'นามบัตร & การ์ด', icon: '💳' },
  { name: 'เคลือบพลาสติก', icon: '🛡️' },
];

export default function HomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States (UR-01 ถึง UR-06)
  const [search, setSearch] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('ทั้งหมด');
  const [isOpenOnly, setIsOpenOnly] = useState<boolean>(false);
  const [isUnderPrice, setIsUnderPrice] = useState<boolean>(false);
  const [isHighRating, setIsHighRating] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('distance');

  // UI Modal & Refs
  const [showSortModal, setShowSortModal] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  // ฟังก์ชันเลื่อนหน้าจอให้วิ่งกลับมาที่จุด Sticky เป๊ะๆ ทุกครั้งที่กด
  const scrollToStickyArea = () => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // UR-01: ขอ Geolocation พิกัดผู้ใช้
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.log('Location access denied:', err)
      );
    }
  }, []);

  // ดึงข้อมูลร้านค้าจาก Backend
  // ดึงข้อมูลร้านค้าจาก Backend
  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedService && selectedService !== 'ทั้งหมด') {
        params.append('service_type', selectedService);
      }
      if (isUnderPrice) params.append('max_price', '50');
      if (isOpenOnly) params.append('is_open', 'true');
      if (sortBy) params.append('sort_by', sortBy);

      if (userLocation) {
        params.append('user_lat', userLocation.lat.toString());
        params.append('user_lng', userLocation.lng.toString());
      }

      const res = await fetch(`http://localhost:5000/api/customer/shops?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        let result = data.data;
        if (isHighRating) {
          result = result.filter((s: Shop) => s.rating >= 4.5 || s.rating === 0);
        }
        setShops(result);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setShops([]); // คืนค่าเป็นอาร์เรย์ว่างเพื่อไม่ให้ UI พัง
    } finally {
      setLoading(false);
    }
  }, [search, selectedService, isUnderPrice, isOpenOnly, isHighRating, sortBy, userLocation]);

  // Debounce การดึงข้อมูล
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShops();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchShops]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans relative">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-100 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              🖨️
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PrintHub</span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-semibold">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-0.5">หน้าแรก</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition">เกี่ยวกับเรา</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition">คำสั่งซื้อของฉัน</a>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto px-4 py-4 space-y-6 flex-1">
        {/* 1. จุดเลือกประเภทงานปริ้นท์ (Circular Icons) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">เลือกประเภทงานปริ้นท์</h2>
            <span className="text-xs text-slate-400">เลื่อนดูเพิ่มเติม →</span>
          </div>

          <div className="flex items-start gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
            {PRINT_SERVICES.map((cat, idx) => {
              const isSelected = selectedService === cat.name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedService(cat.name);
                    scrollToStickyArea();
                  }}
                  className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none w-[74px]"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-offset-2 ring-blue-600'
                        : 'bg-white text-slate-700 border border-slate-200/80 shadow-sm group-hover:border-blue-400 group-hover:bg-blue-50/40 group-hover:scale-105'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className={`text-[11px] leading-tight text-center transition-colors line-clamp-2 h-7 flex items-center justify-center ${
                      isSelected
                        ? 'font-bold text-blue-600'
                        : 'font-medium text-slate-600 group-hover:text-slate-900'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* จุด Anchor สำหรับให้อิงพิกัด Scroll พอดีเป๊ะ */}
        <div ref={scrollAnchorRef} className="h-0 w-full" />

        {/* 2. รวม Sticky Search Bar & Pills Filter Bar */}
        <div className="sticky top-0 bg-[#F9FAFB] z-20 py-3 space-y-3 border-b border-slate-200/50 -mx-4 px-4 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)]">
          {/* พิกัดตำแหน่ง */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="text-blue-600">📍</span>
            <span>{userLocation ? 'กำลังอ้างอิงพิกัดตำแหน่งปัจจุบันของคุณ' : 'กำลังค้นหาพิกัดตำแหน่งของคุณ...'}</span>
          </div>

          {/* ช่องค้นหา */}
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="ค้นหาชื่อร้านค้า หรือบริการปริ้นท์ที่ต้องการ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-800 text-sm rounded-full pl-11 pr-4 py-3 border border-transparent focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition outline-none shadow-xs"
            />
          </div>

          {/* แถบตัวกรอง Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
            {/* ปุ่มล้างตัวกรอง */}
            <button
              onClick={() => {
                setSelectedService('ทั้งหมด');
                setIsOpenOnly(false);
                setIsUnderPrice(false);
                setIsHighRating(false);
                setSortBy('distance');
                setSearch('');
                scrollToStickyArea();
              }}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 hover:bg-slate-50 active:scale-95 transition shadow-xs"
              title="ล้างตัวกรองทั้งหมด"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </button>

            {/* ปุ่มเปิด Sheet เรียงลำดับ */}
            <button
              onClick={() => setShowSortModal(true)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
                sortBy !== 'distance'
                  ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>⇅</span>
              <span>{sortBy === 'rating' ? 'คะแนนสูงสุด' : 'เรียงลำดับ'}</span>
              <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Pill: เปิดให้บริการ */}
            <button
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

            {/* Pill: ราคาประหยัด */}
            <button
              onClick={() => {
                setIsUnderPrice(!isUnderPrice);
                scrollToStickyArea();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition shrink-0 active:scale-95 shadow-xs ${
                isUnderPrice
                  ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>🏷️</span>
              <span>ราคาประหยัด &lt; ฿50</span>
            </button>

            {/* Pill: 4.5 ขึ้นไป */}
            <button
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
          </div>
        </div>

        {/* 3. Section: รายการร้านค้าใกล้ฉัน */}
        <section className="space-y-4 pt-1 min-h-[600px]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">ร้านยอดนิยมใกล้ฉัน</h2>
              <p className="text-xs text-slate-400">พบ {shops.length} ร้านค้าที่พร้อมให้บริการ</p>
            </div>
            {(selectedService !== 'ทั้งหมด' || isOpenOnly || isUnderPrice || isHighRating || search) && (
              <button
                onClick={() => {
                  setSelectedService('ทั้งหมด');
                  setIsOpenOnly(false);
                  setIsUnderPrice(false);
                  setIsHighRating(false);
                  setSearch('');
                  scrollToStickyArea();
                }}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                ล้างตัวกรอง ✕
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-white rounded-2xl animate-pulse border border-slate-200/60 p-4 space-y-3">
                  <div className="w-full h-40 bg-slate-100 rounded-xl"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 text-sm">ไม่พบร้านค้าที่ตรงกับเงื่อนไขการค้นหาของคุณ</p>
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

      {/* Sort Bottom Sheet / Modal */}
      {showSortModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowSortModal(false)}
        >
          <div
            className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">เรียงลำดับตาม (Sort By)</h3>
              <button
                onClick={() => setShowSortModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => { 
                  setSortBy('distance'); 
                  setShowSortModal(false);
                  scrollToStickyArea();
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">ระยะทางใกล้ที่สุด</p>
                    <p className="text-xs text-slate-400">เรียงจากร้านที่อยู่ใกล้พิกัดของคุณมากที่สุด</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'distance'}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 accent-blue-600"
                />
              </label>

              <label
                onClick={() => { 
                  setSortBy('rating'); 
                  setShowSortModal(false); 
                  scrollToStickyArea();
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">⭐</span>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">คะแนนรีวิวสูงสุด</p>
                    <p className="text-xs text-slate-400">เรียงจากร้านที่ได้คะแนนประเมินสูงสุด</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'rating'}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 accent-blue-600"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}