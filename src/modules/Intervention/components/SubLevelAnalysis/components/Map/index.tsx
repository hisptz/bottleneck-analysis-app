import React from "react";
import { MapContainer, Marker, Polygon, TileLayer, Tooltip } from "react-leaflet";
import useMapData from "./hooks/useMapData";

export default function Map() {
  const { center, data } = useMapData();
  return (
    <>
      <MapContainer center={center} style={{ height: "100%", width: "100%", minHeight: 900 }} zoom={8} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {center && <Marker position={center} />}
        {data?.map((area: { co: Array<any>; id: string; name: string }) => {
          return (
            <Polygon interactive bubblingMouseEvents key={`${area.id}-polygon`} pathOptions={{ color: "grey" }} positions={area.co}>
              <Tooltip>{area.name}</Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>
    </>
  );
}
