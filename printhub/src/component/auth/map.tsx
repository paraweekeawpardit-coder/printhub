"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
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

const customIcon = new L.Icon({
  iconUrl: "/gps.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function LocationMarker({ onSelect }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

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
          province:
            address.state ||
            address.province ||
            "",
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
        onSelect({
          lat,
          lng,
          province: "",
          district: "",
          subdistrict: "",
          zipcode: "",
        });
      }
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
}

export default function MapPicker({ onSelect }: MapPickerProps) {
  return (
    <MapContainer
      center={[13.7563, 100.5018]}
      zoom={12}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        zIndex: 1,
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker onSelect={onSelect} />
    </MapContainer>
  );
}