"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ShopCard, { Shop, checkIsShopOpen } from "../../component/customer/ShopCard";
import SearchBar from "../../component/customer/SearchBar";
import ServiceCategoryList from "../../component/customer/ServiceCategoryList";
// 🌟 ตรวจสอบ Path ให้ตรงกับโฟลเดอร์ที่คุณวาง FilterPillsBar ไว้ (เช่น ../../component/customer/filter/FilterPillsBar หรือ ../../component/customer/FilterPillsBar)
import FilterPillsBar from "../../component/customer/filter/FilterPillsBar";
import LocationMapModal from "../../component/customer/LocationMapModal";
import { 
  MapPinSearch, 
  Loader2, 
  Layers, 
  FileText, 
  Smile, 
  Flag, 
  Contact, 
  Image as ImageIcon,
  SearchX
} from "lucide-react";
import NavBar from "../../component/customer/NavBar";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { name: "ทั้งหมด", icon: Layers },
  { name: "เอกสาร", icon: FileText },
  { name: "แผ่นสติกเกอร์", icon: Smile },
  { name: "ป้ายไวนิล", icon: Flag },
  { name: "นามบัตร", icon: Contact },
  { name: "โปสเตอร์", icon: ImageIcon },
];

export default function CustomerHomePage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [selectedService, setSelectedService] = useState("ทั้งหมด");
  const [selectedFinishing, setSelectedFinishing] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [isOpenOnly, setIsOpenOnly] = useState(true);
  const [isNearest, setIsNearest] = useState(true);
  const [isTopRated, setIsTopRated] = useState(false);

  const [cartItems, setCartItems] = useState<any[]>([]);

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("ระบุตำแหน่งของคุณบนแผนที่");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const fetchCartData = useCallback(async () => {
    try {
      const customerId = localStorage.getItem("customer_id") || localStorage.getItem("id");
      if (!customerId) return;

      const res = await fetch(`http://localhost:5000/api/customer/cart?customer_id=${customerId}`);
      const json = await res.json();
      if (json.success && json.data) {
        const items =
          json.data.cart_item ||
          json.data.cart_items ||
          json.data.items ||
          (Array.isArray(json.data) ? json.data : []);
        setCartItems(items);
      }
    } catch (err) {
      console.error("Fetch home cart error:", err);
    }
  }, []);

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

  useEffect(() => {
    const savedCoords = localStorage.getItem("user_coords");
    const savedName = localStorage.getItem("user_location_name");

    if (savedName) setLocationName(savedName);

    if (savedCoords) {
      try {
        setUserCoords(JSON.parse(savedCoords));
      } catch {
        fetchCurrentGps();
      }
    } else {
      fetchCurrentGps();
    }

    fetchCartData();
  }, [fetchCurrentGps, fetchCartData]);

  // ฟังก์ชันดึงข้อมูลร้านค้าจาก Backend
  const fetchShops = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("search", keyword);
      if (selectedService && selectedService !== "ทั้งหมด") {
        params.append("service_type", selectedService);
      }

      if (selectedFinishing && selectedFinishing.length > 0) {
        params.append("finishing_service", selectedFinishing.join(","));
      }

      if (minPrice !== undefined && minPrice !== null && Number(minPrice) > 0) {
        params.append("min_price", minPrice.toString());
      }
      if (maxPrice !== undefined && maxPrice !== null && Number(maxPrice) > 0) {
        params.append("max_price", maxPrice.toString());
      }

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

      const res = await fetch(`http://localhost:5000/api/customer/shops?${params.toString()}`);
      if (!res.ok) {
        setShops([]);
        return;
      }

      const json = await res.json();
      const rawList = Array.isArray(json) ? json : json.data;

      if (Array.isArray(rawList)) {
        setShops(rawList);
      } else {
        setShops([]);
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
    isNearest,
    isTopRated,
    userCoords,
  ]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // 🌟 กรองรายการร้านค้าสำรองฝั่งหน้าบ้าน ป้องกันกรณี API ยังไม่ได้กรองหมวดหมู่หรือสถานะร้าน
  const displayedShops = useMemo(() => {
    return shops.filter((shop: any) => {
      // 1. กรองเปิดให้บริการ
      if (isOpenOnly && !checkIsShopOpen(shop)) {
        return false;
      }

      // 2. กรองตามประเภทบริการหลัก (ถ้ามีการเลือกไว้)
      if (selectedService && selectedService !== "ทั้งหมด") {
        const types = shop.service_types || shop.services || shop.service_type || [];
        if (Array.isArray(types) && types.length > 0) {
          const hasMatchingService = types.some((st: any) => {
            const name = typeof st === "string" ? st : (st.type || st.category || "");
            return name.trim().includes(selectedService.trim()) || selectedService.trim().includes(name.trim());
          });
          if (!hasMatchingService) return false;
        }
      }

      return true;
    });
  }, [shops, isOpenOnly, selectedService]);

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
      <NavBar 
        cartCount={cartItems.length}
        onOpenCart={() => router.push("/customer/cart")}
      />

      <main className="max-w-5xl w-full mx-auto px-4 py-4 space-y-4 flex-1">
        <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs truncate mr-2">
            <MapPinSearch className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-500 font-medium shrink-0">ค้นหาใกล้:</span>
            <span 
              className="font-bold text-slate-900 truncate"
              suppressHydrationWarning
            >
              {locationName}
            </span>
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
          categories={CATEGORIES}
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
            onSelectCategory={(category) => {
              setSelectedService(category);
            }}
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
        ) : displayedShops.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2.5 flex flex-col items-center justify-center">
            <div className="p-3 bg-slate-100 text-slate-400 rounded-full">
              <SearchX className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-700">ไม่พบร้านค้าที่ตรงกับเงื่อนไข</p>
            <p className="text-xs text-slate-400">ลองปรับคำค้นหา หรือรีเซ็ตตัวกรองใหม่อีกครั้ง</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-1">
            {displayedShops.map((shop) => (
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
          const finalName = placeName || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
          setUserCoords(coords);
          setLocationName(finalName);
          setIsMapModalOpen(false);

          if (typeof window !== "undefined") {
            localStorage.setItem("user_coords", JSON.stringify(coords));
            localStorage.setItem("user_location_name", finalName);
          }
        }}
        onUseGps={fetchCurrentGps}
      />
    </div>
  );
}