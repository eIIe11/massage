"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { business } from "@/lib/config";

const shop = business.location;

const shopIcon = L.divIcon({
  className: "",
  html: `<div style="transform:translate(-50%,-100%)">
    <div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:#8b2530;transform:rotate(-45deg);box-shadow:0 6px 14px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;border:2px solid #e4cd97">
      <div style="transform:rotate(45deg);color:#faf4ec;font-size:15px">✦</div>
    </div></div>`,
  iconSize: [34, 34],
});

const meIcon = L.divIcon({
  className: "",
  html: `<div style="transform:translate(-50%,-100%)">
    <div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:#111;transform:rotate(-45deg);box-shadow:0 6px 14px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;border:2px solid #fff">
      <div style="transform:rotate(45deg);color:#fff;font-size:13px">●</div>
    </div></div>`,
  iconSize: [30, 30],
});

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.panTo([coords.lat, coords.lng], { animate: true });
  }, [coords, map]);
  return null;
}

export default function MapPicker({
  coords,
  onPick,
}: {
  coords: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={[shop.lat, shop.lng]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[shop.lat, shop.lng]}
        radius={4000}
        pathOptions={{ color: "#8b2530", weight: 1, fillOpacity: 0.06 }}
      />
      <Marker position={[shop.lat, shop.lng]} icon={shopIcon} />
      {coords && (
        <Marker
          position={[coords.lat, coords.lng]}
          icon={meIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              onPick(p.lat, p.lng);
            },
          }}
        />
      )}
      <ClickHandler onPick={onPick} />
      <Recenter coords={coords} />
    </MapContainer>
  );
}
