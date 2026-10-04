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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 relative text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header ของ Modal (ลดขนาดให้กะทัดรัด) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPinSearch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                ค้นหาและปักหมุดตำแหน่ง
              </h3>
              <p className="text-[11px] text-slate-400">
                พิมพ์ค้นหาสถานที่สำคัญ หรือคลิกลากหมุดบนแผนที่
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition flex items-center justify-center text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* แผนที่ MapPicker (จำกัดความสูงให้พอดี ไม่ดันกล่องล่างหลุดจอ) */}
        <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200/80">
          <MapPicker
            initialLat={initialCoords.lat}
            initialLng={initialCoords.lng}
            onSelect={handleLocationSelect}
          />
        </div>

        {/* กล่องสรุปสถานที่และพิกัดที่เลือก */}
        <div className="bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-slate-700 border border-slate-100 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-slate-500 shrink-0 text-xs">สถานที่:</span>
            <span className="font-bold text-slate-900 text-right truncate text-xs sm:text-sm">
              {displayNameToShow || "ตำแหน่งที่เลือกบนแผนที่"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
            <span className="font-medium text-slate-500 text-xs">พิกัด GPS:</span>
            <span className="font-mono font-bold text-blue-600 text-xs">
              {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Action Buttons ด้านล่าง */}
        <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onUseGps();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:text-blue-700 hover:underline whitespace-nowrap cursor-pointer py-1"
          >
            <MapPinCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
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
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-xl transition shadow-xs cursor-pointer text-center"
          >
            ยืนยันตำแหน่งนี้
          </button>
        </div>
      </div>
    </div>
  );
}