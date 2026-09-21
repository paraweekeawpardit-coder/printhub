"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import L from "leaflet";
import axios from "axios";
import { Search } from "lucide-react";
import "leaflet/dist/leaflet.css";

export interface LocationData {
  lat: number;
  lng: number;
  province: string;
  district: string;
  subdistrict: string;
  zipcode: string;
  display_name?: string;
}

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onSelect: (data: LocationData) => void;
}

interface SearchResultItem {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string];
}

const THAILAND_BOUNDS: L.LatLngBoundsExpression = [
  [5.61, 97.34],
  [20.46, 105.64],
];

const DEFAULT_CENTER: [number, number] = [13.7298, 100.7782];

const googleMapPinIcon = L.divIcon({
  className: "custom-google-pin",
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: grab;">
      <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 46 17 46C17 46 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="#EA4335"/>
        <circle cx="17" cy="17" r="7" fill="white"/>
      </svg>
      <div style="width: 14px; height: 5px; background-color: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1.5px); margin-top: -3px;"></div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

const nominatimApi = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  headers: {
    "Accept-Language": "th,en",
  },
});

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapFlyController({
  position,
  bounds,
}: {
  position: [number, number] | null;
  bounds: L.LatLngBoundsExpression | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, {
        duration: 1.2,
        maxZoom: 16,
        padding: [50, 50],
      });
    } else if (position) {
      map.flyTo(position, 16, { duration: 1 });
    }
  }, [position, bounds, map]);

  return null;
}

export default function LocationPickerMap({ initialLat, initialLng, onSelect }: MapPickerProps) {
  const startPos: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : DEFAULT_CENTER;
  const [position, setPosition] = useState<[number, number] | null>(startPos);
  const [targetBounds, setTargetBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"locating" | "done" | "denied">("done");

  // State สำหรับการค้นหาและ Dropdown
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false); // Flag สำหรับป้องกันการยิงค้นหาซ้ำตอนคลิกเลือก

  // แปลงพิกัดเป็นชื่อที่อยู่ (Reverse Geocoding)
  const resolveAddress = useCallback(
    async (lat: number, lng: number) => {
      setAddressLoading(true);
      try {
        const { data } = await nominatimApi.get("/reverse", {
          params: { format: "json", lat, lon: lng },
        });

        const address = data.address || {};

        onSelect({
          lat,
          lng,
          province: address.state || address.province || "",
          district: address.city_district || address.district || address.county || address.city || "",
          subdistrict: address.suburb || address.subdistrict || address.village || address.town || "",
          zipcode: address.postcode || "",
          display_name: data.display_name || "",
        });
      } catch (error) {
        onSelect({ lat, lng, province: "", district: "", subdistrict: "", zipcode: "", display_name: "" });
      } finally {
        setAddressLoading(false);
      }
    },
    [onSelect]
  );

  const handleSelect = useCallback(
    (lat: number, lng: number) => {
      setTargetBounds(null);
      setPosition([lat, lng]);
      resolveAddress(lat, lng);
    },
    [resolveAddress]
  );

  // ค้นหาสถานที่สำคัญผ่าน Photon API
  const executeSearch = async (queryText: string) => {
    if (!queryText.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get("https://photon.komoot.io/api/", {
        params: {
          q: queryText.trim(),
          limit: 6,
          lang: "default",
          bbox: "97.34,5.61,105.64,20.46",
        },
      });

      const features = res.data?.features || [];
      const formatted: SearchResultItem[] = features.map((f: any) => {
        const p = f.properties || {};
        const title = p.name || p.street || "สถานที่ที่ค้นพบ";
        const locality = [p.district, p.city, p.state].filter(Boolean).join(", ");
        const fullName = locality ? `${title} (${locality})` : title;

        return {
          place_id: p.osm_id || Math.floor(Math.random() * 1000000),
          display_name: fullName,
          lat: f.geometry.coordinates[1].toString(),
          lon: f.geometry.coordinates[0].toString(),
        };
      });

      setSearchResults(formatted);
      setShowDropdown(formatted.length > 0);
    } catch (err) {
      console.error("Photon search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // ดึงรายการแนะนำขณะพิมพ์ (Debounce 300ms)
  useEffect(() => {
    // ถ้าเพิ่งกดเลือกรายการมา ห้ามยิงค้นหาซ้ำ
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayTimer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    executeSearch(searchQuery);
  };

  const applySearchResultToMap = (item: SearchResultItem) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    setTargetBounds(null);
    setPosition([lat, lng]);
    resolveAddress(lat, lng);
  };

  // เมื่อผู้ใช้กดคลิกเลือกสถานที่จากรายการแนะนำ
  const handleSelectDropdownItem = (item: SearchResultItem) => {
    isSelectingRef.current = true; // ล็อกไม่ให้ยิงค้นหาซ้ำ
    setShowDropdown(false);        // ซ่อน Dropdown ทันที
    setSearchResults([]);          // ล้างข้อมูลเพื่อไม่ให้ค้าง

    const shortName = item.display_name.split("(")[0].trim();
    setSearchQuery(shortName);

    applySearchResultToMap(item);
  };

  // ปิด Dropdown เมื่อคลิกที่อื่น
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }

    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus("done");
        handleSelect(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGeoStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [handleSelect]);

  const hintText =
    geoStatus === "locating"
      ? "กำลังค้นหาตำแหน่งของคุณ..."
      : addressLoading
      ? "กำลังค้นหาที่อยู่..."
      : !position
      ? "แตะบนแผนที่ หรือค้นหาสถานที่สำคัญด้านบน"
      : null;

  return (
    <div className="relative z-0 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md font-sans">
      {/* Search Input Box */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-[1000] max-w-sm" ref={searchContainerRef}>
        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-slate-200/90 px-4 py-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            placeholder="ค้นหาสถานที่ (เช่น kmitl) ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
            className="w-full py-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setShowDropdown(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs mr-1 cursor-pointer"
            >
              ✕
            </button>
          )}

          <button
            type="button"
            className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
            onClick={handleSearchSubmit}
            title="ค้นหา"
          >
            {isSearching ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Dropdown รายการสถานที่แนะนำ */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto z-[1001] py-1 divide-y divide-slate-100">
            {searchResults.map((item) => (
              <div
                key={item.place_id}
                className="p-2.5 px-3.5 text-xs text-slate-700 cursor-pointer hover:bg-blue-50/70 hover:text-blue-600 transition-colors flex items-start gap-2"
                onClick={() => handleSelectDropdownItem(item)}
              >
                <span className="text-blue-500 text-xs mt-0.5">📍</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 line-clamp-1">{item.display_name.split("(")[0]}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.display_name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hintText && (
        <div className="absolute bottom-5 left-4 z-[1000] bg-white/95 text-slate-800 text-[11px] font-medium px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 pointer-events-none">
          {hintText}
        </div>
      )}

      {/* ปุ่มกดหาตำแหน่งปัจจุบัน */}
      <button
        type="button"
        className="absolute bottom-5 right-4 z-[1000] w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-all active:scale-95 border border-slate-100"
        onClick={fetchCurrentLocation}
        title="ตำแหน่งปัจจุบัน"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      </button>

      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={15}
        minZoom={5}
        maxZoom={20}
        maxBounds={THAILAND_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        className="w-full h-[380px] sm:h-[420px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=th"
          maxZoom={20}
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />

        {position && (
          <Marker
            position={position}
            icon={googleMapPinIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                handleSelect(pos.lat, pos.lng);
              },
            }}
          />
        )}

        <MapClickHandler onClick={handleSelect} />
        <MapFlyController position={position} bounds={targetBounds} />
      </MapContainer>
    </div>
  );
}