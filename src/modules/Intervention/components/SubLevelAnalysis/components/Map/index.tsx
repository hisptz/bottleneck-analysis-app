import React from "react";
import { LayersControl, MapContainer, ScaleControl, TileLayer } from "react-leaflet";
import BoundaryLayer from "./components/BoundaryLayer";
import useBoundaryData from "./components/BoundaryLayer/hooks/data";
import DownloadControl from "./components/DownloadControl";
import FacilityLayer from "./components/FacilityLayer";
import ThematicLayer from "./components/ThematicLayer";
import useInterventionConfig from "../../../../../../shared/hooks/useInterventionConfig";
import CardError from "../../../../../../shared/components/errors/CardError";
import i18n from "@dhis2/d2-i18n";

function MapArea() {
  const { center, bounds } = useBoundaryData();

  return (
    <div id="map-container" style={{ height: "100%", width: "100%" }}>
      <MapContainer bounds={bounds} bounceAtZoomLimits center={center} style={{ height: "100%", width: "100%", minHeight: 500 }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/attribution">CARTO</a>'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        <ScaleControl position={"bottomleft"} />
        <LayersControl position={"topleft"}>
          <DownloadControl />
          <BoundaryLayer />
          <FacilityLayer />
          <ThematicLayer />
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default function Map() {
  const { map } = useInterventionConfig();

  if (!map?.enabled) {
    return (
      <div>
        <CardError error={{ message: i18n.t("Map is disabled for this intervention") }} />
      </div>
    );
  }

  return <MapArea />;
}
