'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// หมุดสีแดงสไตล์ Google Maps Pin
const googleMapPinIcon = L.divIcon({
  className: 'custom-google-pin',
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

interface MapProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

// ควบคุมมุมกล้องให้เลื่อนตามพิกัดใหม่
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1 });
  }, [lat, lng, map]);
  return null;
}

// ตรวจจับการคลิกบนแผนที่
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({ initialLat, initialLng, onLocationSelect }: MapProps) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);

  useEffect(() => {
    setPosition([initialLat, initialLng]);
  }, [initialLat, initialLng]);

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm relative z-0">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* เลเยอร์แผนที่สไตล์ Google Maps Roadmap ภาษาไทย */}
        <TileLayer
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=th"
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />

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

        <MapRecenter lat={position[0]} lng={position[1]} />
        <MapClickHandler onSelect={handleSelect} />
      </MapContainer>
    </div>
  );
}