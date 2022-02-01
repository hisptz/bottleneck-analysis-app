import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import BoundaryLayer from "./components/BoundaryLayer";
import useMapData from "./hooks/useMapData";

export default function Map() {
  const { center, bounds } = useMapData();
  return (
    <>
      <MapContainer bounds={bounds} bounceAtZoomLimits center={center} style={{ height: "100%", width: "100%", minHeight: 900 }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/attribution">CARTO</a>'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        <BoundaryLayer />
      </MapContainer>
    </>
  );
}
