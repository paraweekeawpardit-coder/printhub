"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import L from "leaflet";
import axios from "axios";
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

const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018];

// หมุดสีแดงสไตล์ Google Maps Pin
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

export default function MapPicker({ onSelect }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [targetBounds, setTargetBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"locating" | "done" | "denied">("locating");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ค้นหาที่อยู่แบบ Reverse Geocoding
  const resolveAddress = useCallback(
    async (lat: number, lng: number) => {
      setAddressLoading(true);
      try {
        const { data } = await nominatimApi.get("/reverse", {
          params: {
            format: "json",
            lat,
            lon: lng,
          },
        });

        const address = data.address || {};

        onSelect({
          lat,
          lng,
          province: address.state || address.province || "",
          district:
            address.city_district ||
            address.district ||
            address.county ||
            address.city ||
            "",
          subdistrict:
            address.suburb ||
            address.subdistrict ||
            address.village ||
            address.town ||
            "",
          zipcode: address.postcode || "",
          display_name: data.display_name || "",
        });
      } catch (error) {
        console.error("Reverse geocoding error:", error);
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

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data } = await nominatimApi.get<SearchResultItem[]>("/search", {
        params: {
          format: "json",
          q: searchQuery,
          countrycodes: "th",
          limit: 5,
        },
      });

      setSearchResults(data);

      if (data && data.length > 0) {
        setShowDropdown(true);
        applySearchResultToMap(data[0]);
      } else {
        setShowDropdown(false);
      }
    } catch (err) {
      console.error("Search location error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const applySearchResultToMap = (item: SearchResultItem) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    if (item.boundingbox && item.boundingbox.length === 4) {
      const south = parseFloat(item.boundingbox[0]);
      const north = parseFloat(item.boundingbox[1]);
      const west = parseFloat(item.boundingbox[2]);
      const east = parseFloat(item.boundingbox[3]);

      setTargetBounds([
        [south, west],
        [north, east],
      ]);
    } else {
      setTargetBounds(null);
    }

    setPosition([lat, lng]);
    resolveAddress(lat, lng);
    setShowDropdown(false);
  };

  const handleSelectDropdownItem = (item: SearchResultItem) => {
    setSearchQuery(item.display_name.split(",")[0]);
    applySearchResultToMap(item);
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

  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      setPosition(DEFAULT_CENTER);
      setTargetBounds(null);
      resolveAddress(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
      return;
    }

    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus("done");
        handleSelect(pos.coords.latitude, pos.coords.longitude);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setGeoStatus("denied");
        if (!position) {
          setPosition(DEFAULT_CENTER);
          setTargetBounds(null);
          resolveAddress(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [handleSelect, resolveAddress, position]);

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const hintText =
    geoStatus === "locating"
      ? "กำลังค้นหาตำแหน่งของคุณ..."
      : addressLoading
      ? "กำลังค้นหาที่อยู่..."
      : !position
      ? "แตะบนแผนที่ หรือลากหมุดเพื่อเลือกตำแหน่ง"
      : null;

  return (
    <div className="relative z-0 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg font-sans">
      {/* ช่องค้นหาด้านบน */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-[1000] max-w-sm" ref={searchContainerRef}>
        <div className="relative flex items-center bg-white rounded-xl shadow-md border border-slate-200 px-3.5 py-1">
          <input
            type="text"
            placeholder="พิมพ์สถานที่แล้วกดค้นหา..."
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
            className="w-full py-2 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
          />

          {searchQuery && (
            <button
              type="button"
              className="bg-transparent border-none text-slate-400 hover:text-slate-600 text-sm px-2 cursor-pointer"
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
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg p-2 cursor-pointer transition-colors flex-shrink-0"
            onClick={handleSearchSubmit}
            title="ค้นหา"
          >
            {isSearching ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </div>

        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto z-[1001]">
            {searchResults.map((item) => (
              <div
                key={item.place_id}
                className="p-3 px-3.5 text-xs text-slate-700 cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                onClick={() => handleSelectDropdownItem(item)}
              >
                <div className="font-medium line-clamp-2">{item.display_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* แถบแจ้งสถานะ */}
      {hintText && (
        <div className="absolute bottom-6 left-5 z-[1000] bg-white/95 text-slate-800 text-xs font-medium px-4 py-2 rounded-full shadow-md flex items-center gap-2 pointer-events-none">
          {(geoStatus === "locating" || addressLoading) && (
            <span className="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          )}
          {hintText}
        </div>
      )}

      {/* ปุ่มกดตำแหน่งปัจจุบัน */}
      <button
        type="button"
        className="absolute bottom-6 right-5 z-[1000] w-11 h-11 rounded-full bg-white border-none text-blue-600 flex items-center justify-center shadow-lg cursor-pointer transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-blue-500/30 active:translate-y-0"
        onClick={fetchCurrentLocation}
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
        center={position || DEFAULT_CENTER}
        zoom={15}
        minZoom={5}
        maxZoom={20}
        maxBounds={THAILAND_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        className="w-full h-[520px]"
      >
        {/* ใช้ TileLayer ภาษาไทยของ Google Maps ตามโค้ดที่คุณส่งมา */}
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