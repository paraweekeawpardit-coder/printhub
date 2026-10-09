"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

export type Coords = { lat: number; lng: number };

type Props = {
  /** พิกัดเริ่มต้นของหมุด (พิกัดเดิมของร้าน) ถ้าไม่มีจะใช้ DEFAULT_CENTER */
  initialPosition: Coords | null;
  /** เรียกเมื่อผู้ใช้ลากหมุด / แตะแผนที่ / เลือกผลค้นหา / กดตำแหน่งปัจจุบัน */
  onChange: (pos: Coords) => void;
  /** ความสูงแผนที่เป็น px (ใช้ inline style เพื่อไม่พึ่ง Tailwind) */
  height?: number;
};

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
const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018];

const pinIcon = L.divIcon({
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
  headers: { "Accept-Language": "th,en" },
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
  position: [number, number];
  bounds: L.LatLngBoundsExpression | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { duration: 1.2, maxZoom: 16, padding: [50, 50] });
    } else {
      map.flyTo(position, Math.max(map.getZoom(), 16), { duration: 1 });
    }
  }, [position, bounds, map]);
  return null;
}

export default function ShopLocationPicker({
  initialPosition,
  onChange,
  height = 380,
}: Props) {
  const [position, setPosition] = useState<[number, number]>(
    initialPosition ? [initialPosition.lat, initialPosition.lng] : DEFAULT_CENTER
  );
  const [targetBounds, setTargetBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [locating, setLocating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ถ้าร้านยังไม่มีพิกัด ให้ลองขอตำแหน่งปัจจุบันตอนเปิด
  // (ถ้ามีพิกัดเดิมอยู่แล้วจะไม่ขอ และไม่แจ้ง onChange เพื่อให้ "ใช้ตำแหน่งเดิม" ได้เลย)
  useEffect(() => {
    if (initialPosition) return;
    goToCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveTo = useCallback(
    (lat: number, lng: number, bounds: L.LatLngBoundsExpression | null = null) => {
      setTargetBounds(bounds);
      setPosition([lat, lng]);
      onChange({ lat, lng });
    },
    [onChange]
  );

  const goToCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        moveTo(pos.coords.latitude, pos.coords.longitude);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const applySearchResult = (item: SearchResultItem) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    let bounds: L.LatLngBoundsExpression | null = null;
    if (item.boundingbox?.length === 4) {
      const [south, north, west, east] = item.boundingbox.map(parseFloat);
      bounds = [
        [south, west],
        [north, east],
      ];
    }
    moveTo(lat, lng, bounds);
    setShowDropdown(false);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const { data } = await nominatimApi.get<SearchResultItem[]>("/search", {
        params: { format: "json", q: searchQuery, countrycodes: "th", limit: 5 },
      });
      setSearchResults(data);
      if (data?.length > 0) {
        setShowDropdown(true);
        applySearchResult(data[0]);
      } else {
        setShowDropdown(false);
      }
    } catch (err) {
      console.error("Search location error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative z-0 w-full overflow-hidden font-sans"
      style={{ height }}
    >
      {/* ช่องค้นหา */}
      <div className="absolute left-3.5 right-3.5 top-3.5 z-[1000] max-w-sm" ref={searchContainerRef}>
        <div className="relative flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-1 shadow-md">
          <input
            type="text"
            placeholder="พิมพ์สถานที่แล้วกดค้นหา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
            className="w-full bg-transparent py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent px-2 text-sm text-slate-400 hover:text-slate-600"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
                setShowDropdown(false);
              }}
            >
              ✕
            </button>
          )}
          <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
            onClick={handleSearchSubmit}
            title="ค้นหา"
          >
            {isSearching ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </div>

        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[1001] max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
            {searchResults.map((item) => (
              <div
                key={item.place_id}
                className="cursor-pointer border-b border-slate-100 p-3 px-3.5 text-xs text-slate-700 transition-colors last:border-b-0 hover:bg-slate-50 hover:text-blue-600"
                onClick={() => {
                  setSearchQuery(item.display_name.split(",")[0]);
                  applySearchResult(item);
                }}
              >
                <div className="line-clamp-2 font-medium">{item.display_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {locating && (
        <div className="pointer-events-none absolute bottom-6 left-5 z-[1000] flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-slate-800 shadow-md">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          กำลังค้นหาตำแหน่งของคุณ...
        </div>
      )}

      {/* ปุ่มตำแหน่งปัจจุบัน */}
      <button
        type="button"
        className="absolute bottom-6 right-5 z-[1000] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-none bg-white text-blue-600 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white"
        onClick={goToCurrentLocation}
        title="ไปที่ตำแหน่งปัจจุบันของคุณ"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      </button>

      <MapContainer
        center={position}
        zoom={16}
        minZoom={5}
        maxZoom={20}
        maxBounds={THAILAND_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        style={{ height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=th"
          maxZoom={20}
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        <Marker
          position={position}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              moveTo(p.lat, p.lng);
            },
          }}
        />
        <MapClickHandler onClick={(lat, lng) => moveTo(lat, lng)} />
        <MapFlyController position={position} bounds={targetBounds} />
      </MapContainer>
    </div>
  );
}