"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { LocationData } from "./LocationPickerMap";
import { MapPinSearch, MapPinCheck } from "lucide-react";

const MapPicker = dynamic<any>(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">
      กำลังโหลดแผนที่...
    </div>
  ),
});

interface Coords {
  lat: number;
  lng: number;
}

interface LocationMapModalProps {
  isOpen: boolean;
  initialCoords: Coords;
  onClose: () => void;
  onConfirmLocation: (coords: Coords, placeName?: string) => void;
  onUseGps: () => void;
}

export default function LocationMapModal({
  isOpen,
  initialCoords,
  onClose,
  onConfirmLocation,
  onUseGps,
}: LocationMapModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    lat: initialCoords.lat,
    lng: initialCoords.lng,
    province: "",
    district: "",
    subdistrict: "",
    zipcode: "",
    display_name: "",
  });

  if (!isOpen) return null;

  const handleLocationSelect = (data: LocationData) => {
    setSelectedLocation(data);
  };

  const displayNameToShow =
    selectedLocation.display_name?.split(",")[0] ||
    [selectedLocation.subdistrict, selectedLocation.district, selectedLocation.province]
      .filter(Boolean)
      .join(" ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 relative text-slate-800 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPinSearch className="w-10 h-10 text-blue-600 shrink-0" />
            <div>
              <h3 className="font-bold text-base text-slate-900">ค้นหาและปักหมุดตำแหน่ง </h3>
              <p className="text-[11px] text-slate-400">พิมพ์ค้นหาสถานที่สำคัญ หรือคลิกลากหมุดบนแผนที่</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        <div className="w-full">
          <MapPicker
            initialLat={initialCoords.lat}
            initialLng={initialCoords.lng}
            onSelect={handleLocationSelect}
          />
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-600 border border-slate-100 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-slate-500 shrink-0">สถานที่:</span>
            <span className="font-bold text-slate-800 text-right truncate">
              {displayNameToShow || "ตำแหน่งที่เลือกบนแผนที่"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-500">พิกัด GPS:</span>
            <span className="font-mono font-bold text-blue-600">
              {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onUseGps();
              onClose();
            }}
            className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline whitespace-nowrap"
          >
            <MapPinCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>ใช้ตำแหน่ง GPS จริงของฉัน</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmLocation(
                { lat: selectedLocation.lat, lng: selectedLocation.lng },
                displayNameToShow
              );
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-xs"
          >
            ยืนยันตำแหน่งนี้
          </button>
        </div>
      </div>
    </div>
  );
}