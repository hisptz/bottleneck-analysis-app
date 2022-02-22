import { useConfig } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { icon } from "leaflet";
import React, { useMemo } from "react";
import { LayerGroup, LayersControl, Marker, Tooltip } from "react-leaflet";
import useFacilityData from "./hooks/data";

export default function FacilityLayer() {
  const { data, config } = useFacilityData();
  const { baseUrl, apiVersion } = useConfig();

  const facilityIcon = useMemo(() => {
    return icon({
      iconUrl: `${baseUrl}/api/${apiVersion}/icons/home_positive/icon.svg`,
      iconSize: [16, 16],
      iconAnchor: [6, 6],
      popupAnchor: [0, -6],
    });
  }, [baseUrl, apiVersion]);

  return (
    <LayersControl.Overlay checked={config.enabled} name={i18n.t("Facilities")}>
      <LayerGroup>
        {data?.map((d: any) => (
          <Marker icon={facilityIcon} key={`${d.id}-layer`} position={d.co}>
            <Tooltip>{d.name}</Tooltip>
          </Marker>
        ))}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
