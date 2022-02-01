import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import BoundaryLayer from "./components/BoundaryLayer";
import useMapData from "./hooks/useMapData";

export default function Map() {
  const { center, bounds } = useMapData();
  return (
    <>
      <MapContainer bounds={bounds} bounceAtZoomLimits center={center} style={{ height: "100%", width: "100%", minHeight: 900 }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundaryLayer />
      </MapContainer>
    </>
  );
}
