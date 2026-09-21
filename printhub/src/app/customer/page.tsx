"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ShopCard, { Shop } from "../../component/customer/ShopCard";
import SearchBar from "../../component/customer/SearchBar";
import ServiceCategoryList from "../../component/customer/ServiceCategoryList";
import FilterPillsBar from "../../component/customer/FilterPillsBar";
import LocationMapModal from "../../component/customer/LocationMapModal";
import { MapPinSearch, Loader2 } from "lucide-react";
import NavBar from "../../component/customer/NavBar";

const getServiceIcon = (typeName: string) => {
  if (typeName.includes("เอกสาร") || typeName.includes("ชีท")) return "📄";
  if (typeName.includes("โปสเตอร์")) return "🖼️";
  if (typeName.includes("นามบัตร") || typeName.includes("การ์ด")) return "💳";
  if (typeName.includes("สติกเกอร์") || typeName.includes("ฉลาก")) return "🏷️";
  if (typeName.includes("ไวนิล")) return "🚩";
  return "🖨️";
};

export default function CustomerHomePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  // States ค้นหาและกรอง (FR-1.1, FR-1.3)
  const [keyword, setKeyword] = useState("");
  const [selectedService, setSelectedService] = useState("ทั้งหมด");
  // ✅ 1. ปรับ selectedFinishing ให้เป็น string[] ตาม FilterPillsBar
  const [selectedFinishing, setSelectedFinishing] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("distance"); // "distance" หรือ "rating"
  // ✅ 2. ปรับ minPrice / maxPrice ให้เป็น number | undefined
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  
  // ✅ ข้อ 2: ให้เปิดให้บริการเป็น Default (true)
  const [isOpenOnly, setIsOpenOnly] = useState(true);

  const [isNearest, setIsNearest] = useState(true);
  const [isTopRated, setIsTopRated] = useState(false);


  // หมวดหมู่งานพิมพ์หลัก
  const [serviceCategories, setServiceCategories] = useState<{ name: string; icon: string }[]>([
    { name: "ทั้งหมด", icon: "✨" },
  ]);

  // พิกัดและแผนที่ (FR-1.2)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState("ระบุตำแหน่งของคุณบนแผนที่");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // ดึง GPS เริ่มต้น
  const fetchCurrentGps = useCallback(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationName("ตำแหน่งปัจจุบันของคุณ (GPS)");
        },
        () => {
          setLocationName("แตะเพื่อปักหมุดตำแหน่งบนแผนที่");
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // ดึงประเภทงานพิมพ์หลักจาก Supabase/API
  const fetchServiceTypes = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customer/service-types");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const uniqueTypes = result.data.map((type: string) => ({
          name: type,
          icon: getServiceIcon(type),
        }));
        setServiceCategories([{ name: "ทั้งหมด", icon: "✨" }, ...uniqueTypes]);
      }
    } catch {
      // Fallback หมวดหมู่มาตรฐาน
      setServiceCategories([
        { name: "ทั้งหมด", icon: "✨" },
        { name: "เอกสาร", icon: "📄" },
        { name: "แผ่นสติกเกอร์", icon: "🏷️" },
        { name: "ป้ายไวนิล", icon: "🚩" },
        { name: "นามบัตร", icon: "💳" },
        { name: "โปสเตอร์", icon: "🖼️" },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchCurrentGps();
    fetchServiceTypes();
  }, [fetchCurrentGps, fetchServiceTypes]);

  // คิวรีร้านค้าตามเงื่อนไข (FR-1.1, FR-1.3, FR-1.4)
  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("search", keyword);
      if (selectedService && selectedService !== "ทั้งหมด") params.append("service_type", selectedService);
      
      // ส่ง finishing_service คั่นด้วยจุลภาค
      if (selectedFinishing && selectedFinishing.length > 0) {
        params.append("finishing_service", selectedFinishing.join(", "));
      }

      // แปลงตัวเลขราคาเป็น string
      if (minPrice !== undefined && minPrice !== null) params.append("min_price", minPrice.toString());
      if (maxPrice !== undefined && maxPrice !== null) params.append("max_price", maxPrice.toString());

      if (isOpenOnly) params.append("is_open", "true");

      // กำหนดโหมดการจัดเรียง (รองรับการเปิดพร้อมกันทั้งคู่)
      let sortMode = "";
      if (isNearest && isTopRated) {
        sortMode = "both";
      } else if (isNearest) {
        sortMode = "distance";
      } else if (isTopRated) {
        sortMode = "rating";
      }

      if (sortMode) params.append("sort_by", sortMode);

      if (userCoords) {
        params.append("user_lat", userCoords.lat.toString());
        params.append("user_lng", userCoords.lng.toString());
      }

      const res = await fetch(`http://localhost:5000/api/customer/shops?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        const list: Shop[] = json.data || [];
        setShops(list);
      }
    } catch (err) {
      console.error("Fetch shops error:", err);
    } finally {
      setLoading(false);
    }
  }, [
    keyword,
    selectedService,
    selectedFinishing,
    minPrice,
    maxPrice,
    isOpenOnly,
    isNearest,
    isTopRated,
    userCoords,
  ]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleResetFilters = () => {
    setIsNearest(false);      // ล้างปุ่มระยะทาง
    setIsTopRated(false);     // ล้างปุ่มคะแนน
    setIsOpenOnly(false);     // ล้างปุ่มเปิดให้บริการ
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedFinishing([]);
    setSelectedService("ทั้งหมด");
    setKeyword("");
  };

  // ✅ 3. ล้างตัวกรองย่อยด้วย [] แทน ""
  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedFinishing([]); 
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-800 antialiased pb-12">
    {/*<div className="min-h-screen bg-sky-50 flex flex-col font-sans text-slate-800 antialiased"></div> */}
      <NavBar />

      <main className="max-w-5xl w-full mx-auto px-4 py-4 space-y-4 flex-1">
        {/* แถบระบุพิกัดตำแหน่ง (FR-1.2) */}
        <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs truncate mr-2">
            <MapPinSearch className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-500 font-medium shrink-0">ค้นหาใกล้:</span>
            <span className="font-bold text-slate-900 truncate">{locationName}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 shrink-0 hover:underline cursor-pointer"
          >
            เปลี่ยนตำแหน่ง
          </button>
        </div>

        {/* หมวดหมู่งานพิมพ์หลัก (FR-1.1) */}
        <ServiceCategoryList
          categories={serviceCategories}
          selectedService={selectedService}
          onSelectService={handleServiceChange}
        />

        {/* แถบล็อกตำแหน่งหน้าจอ (Sticky Bar) พร้อมช่องค้นหาและ Filter Pills */}
        <div className="sticky top-0 bg-[#F9FAFB]/95 backdrop-blur-md z-30 py-2.5 space-y-2.5 border-b border-slate-200/80 -mx-4 px-4 shadow-2xs">
          <SearchBar 
            keyword={keyword} 
            onSearchChange={setKeyword}
            placeholder={
              selectedService && selectedService !== "ทั้งหมด"
                ? `ค้นหาร้าน หรือบริการในหมวด${selectedService}...`
                : "ค้นหาชื่อร้าน หรือบริการ..."
            }
          />

          <FilterPillsBar
            selectedCategory={selectedService}
            isNearest={isNearest}
            onToggleNearest={() => setIsNearest(!isNearest)}
            isOpenOnly={isOpenOnly}
            onToggleOpenOnly={() => setIsOpenOnly(!isOpenOnly)}
            isTopRated={isTopRated}
            onToggleTopRated={() => setIsTopRated(!isTopRated)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApplyPrice={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            selectedFinishing={selectedFinishing}
            onSelectFinishing={setSelectedFinishing}
            onResetAll={handleResetFilters}
          />
        </div>

        {/* แสดงผลรายการร้านค้า (FR-1.4) */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span>กำลังค้นหาร้านค้าตามเงื่อนไข...</span>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <p className="text-3xl">🔍</p>
            <p className="text-sm font-bold text-slate-700">ไม่พบร้านค้าที่ตรงกับเงื่อนไข</p>
            <p className="text-xs text-slate-400">ลองปรับคำค้นหา หรือรีเซ็ตตัวกรองใหม่อีกครั้ง</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-1">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </main>

      {/* หน้าต่างปักหมุดแผนที่ (FR-1.2) */}
      <LocationMapModal
        isOpen={isMapModalOpen}
        initialCoords={userCoords || { lat: 13.7298, lng: 100.7782 }}
        onClose={() => setIsMapModalOpen(false)}
        onConfirmLocation={(coords, placeName) => {
          setUserCoords(coords);
          setLocationName(placeName || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
          setIsMapModalOpen(false);
        }}
        onUseGps={fetchCurrentGps}
      />
    </div>
  );
}