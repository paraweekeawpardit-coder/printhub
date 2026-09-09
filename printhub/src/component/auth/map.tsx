"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface LocationData {
  lat: number;
  lng: number;
  province: string;
  district: string;
  subdistrict: string;
  zipcode: string;
}

interface MapPickerProps {
  onSelect: (data: LocationData) => void;
}

const THAILAND_BOUNDS: L.LatLngBoundsExpression = [
  [5.61, 97.34],
  [20.46, 105.64],
];

const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018];

const customIcon = L.divIcon({
  className: "printhub-marker",
  html: `
    <div class="printhub-marker__pulse"></div>
    <img src="/gps.png" class="printhub-marker__pin" />
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapFlyController({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.2 });
    }
  }, [position, map]);

  return null;
}

export default function MapPicker({ onSelect }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"locating" | "done" | "denied">("locating");

  const resolveAddress = useCallback(
    async (lat: number, lng: number) => {
      setAddressLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        if (!res.ok) throw new Error("Failed to fetch address");

        const data = await res.json();
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
        });
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        onSelect({ lat, lng, province: "", district: "", subdistrict: "", zipcode: "" });
      } finally {
        setAddressLoading(false);
      }
    },
    [onSelect]
  );

  const handleSelect = useCallback(
    (lat: number, lng: number) => {
      setPosition([lat, lng]);
      resolveAddress(lat, lng);
    },
    [resolveAddress]
  );

  // ฟังก์ชันดึงตำแหน่งของเครื่องผู้ใช้ (เรียกใช้ได้ตลอดเวลา)
  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      setPosition(DEFAULT_CENTER);
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
          resolveAddress(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [handleSelect, resolveAddress, position]);

  // ดึงตำแหน่งครั้งแรกตอนโหลดหน้า
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const hintText =
    geoStatus === "locating"
      ? "กำลังค้นหาตำแหน่งของคุณ..."
      : addressLoading
      ? "กำลังค้นหาที่อยู่..."
      : !position
      ? "แตะบนแผนที่เพื่อเลือกตำแหน่งร้าน"
      : null;

  return (
    <div className="printhub-map-shell">
      {hintText && (
        <div className="printhub-hint">
          {(geoStatus === "locating" || addressLoading) && (
            <span className="printhub-spinner" />
          )}
          {hintText}
        </div>
      )}

      {/* ปุ่มกดเพื่อดึงตำแหน่งปัจจุบันของผู้ใช้กลับมาเสมอ */}
      <button
        type="button"
        className="printhub-locate-btn"
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
        center={DEFAULT_CENTER}
        zoom={6}
        minZoom={5}
        maxBounds={THAILAND_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        style={{ width: "100%", height: "520px" }} /* ปรับความสูงเพิ่มขึ้นจาก 400px เป็น 520px */
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {position && <Marker position={position} icon={customIcon} />}

        <MapClickHandler onClick={handleSelect} />
        <MapFlyController position={position} />
      </MapContainer>

      <style jsx global>{`
        .printhub-map-shell {
          position: relative;
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e5e9f2;
          box-shadow: 0 8px 24px -12px rgba(18, 53, 107, 0.25);
          font-family: "Prompt", sans-serif;
        }

        .printhub-map-shell .leaflet-tile-pane {
          filter: saturate(0.9) brightness(1.02);
        }

        /* ปุ่มกดค้นหาตำแหน่งตัวเอง */
        .printhub-locate-btn {
          position: absolute;
          bottom: 24px;
          right: 20px;
          z-index: 1000;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #ffffff;
          border: none;
          color: #2f6fed;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(18, 53, 107, 0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .printhub-locate-btn:hover {
          transform: translateY(-2px);
          background: #2f6fed;
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(47, 111, 237, 0.35);
        }

        .printhub-locate-btn:active {
          transform: translateY(0);
        }

        .printhub-hint {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          color: #12356b;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(18, 53, 107, 0.18);
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
        }

        .printhub-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid #cfe0ff;
          border-top-color: #2f6fed;
          border-radius: 50%;
          animation: printhub-spin 0.7s linear infinite;
        }

        @keyframes printhub-spin {
          to { transform: rotate(360deg); }
        }

        .printhub-marker {
          position: relative;
          width: 40px;
          height: 40px;
        }
        .printhub-marker__pin {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 34px;
          height: 34px;
          z-index: 2;
          filter: drop-shadow(0 3px 6px rgba(18, 53, 107, 0.35));
          animation: printhub-drop 0.35s ease-out;
        }
        .printhub-marker__pulse {
          position: absolute;
          bottom: 2px;
          left: 50%;
          width: 16px;
          height: 16px;
          margin-left: -8px;
          border-radius: 50%;
          background: rgba(47, 111, 237, 0.35);
          animation: printhub-pulse 1.6s ease-out infinite;
          z-index: 1;
        }

        @keyframes printhub-pulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        @keyframes printhub-drop {
          0% { transform: translate(-50%, -16px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}