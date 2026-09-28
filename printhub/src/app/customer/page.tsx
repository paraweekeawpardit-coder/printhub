"use client";

import { useEffect, useState, useCallback } from "react";
import ShopCard, { Shop, checkIsShopOpen } from "../../component/customer/ShopCard";
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

  const [keyword, setKeyword] = useState("");
  const [selectedService, setSelectedService] = useState("ทั้งหมด");
  const [selectedFinishing, setSelectedFinishing] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  
  const [isOpenOnly, setIsOpenOnly] = useState(false);
  const [isNearest, setIsNearest] = useState(false);
  const [isTopRated, setIsTopRated] = useState(false);

  const [serviceCategories, setServiceCategories] = useState<{ name: string; icon: string }[]>([
    { name: "ทั้งหมด", icon: "✨" },
  ]);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState("ระบุตำแหน่งของคุณบนแผนที่");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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

  const fetchServiceTypes = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customer/service-types");
      if (!res.ok) throw new Error("API not found");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const uniqueTypes = result.data.map((type: string) => ({
          name: type,
          icon: getServiceIcon(type),
        }));
        setServiceCategories([{ name: "ทั้งหมด", icon: "✨" }, ...uniqueTypes]);
      }
    } catch {
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

  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("search", keyword);
      if (selectedService && selectedService !== "ทั้งหมด") params.append("service_type", selectedService);
      
      if (selectedFinishing && selectedFinishing.length > 0) {
        params.append("finishing_service", selectedFinishing.join(", "));
      }

      if (minPrice !== undefined && minPrice !== null) params.append("min_price", minPrice.toString());
      if (maxPrice !== undefined && maxPrice !== null) params.append("max_price", maxPrice.toString());

      let sortMode = "distance";
      if (isNearest && isTopRated) {
        sortMode = "both";
      } else if (isTopRated) {
        sortMode = "rating";
      }
      params.append("sort_by", sortMode);

      if (userCoords) {
        params.append("user_lat", userCoords.lat.toString());
        params.append("user_lng", userCoords.lng.toString());
      }

      // 🌟 ยิง API ไปที่ Backend Express Server
      const res = await fetch(`http://localhost:5000/api/customer/shops?${params.toString()}`);
      
      if (!res.ok) {
        setShops([]);
        return;
      }

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        let list: Shop[] = json.data;
        
        // 🌟 กรองเฉพาะร้านที่เปิดทำการจริง
        if (isOpenOnly) {
          list = list.filter((shop) => checkIsShopOpen(shop));
        }

        setShops(list);
      }
    } catch (err) {
      console.error("Fetch shops error:", err);
      setShops([]);
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
    setIsNearest(false);
    setIsTopRated(false);
    setIsOpenOnly(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedFinishing([]);
    setSelectedService("ทั้งหมด");
    setKeyword("");
  };

  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedFinishing([]); 
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-800 antialiased pb-12">
      <NavBar />

      <main className="max-w-5xl w-full mx-auto px-4 py-4 space-y-4 flex-1">
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

        <ServiceCategoryList
          categories={serviceCategories}
          selectedService={selectedService}
          onSelectService={handleServiceChange}
        />

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