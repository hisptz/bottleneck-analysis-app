import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import React from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { MapConfigState } from "../../state/config";
import { MapIndicatorData } from "../../state/data";

const defaultStyle = {
  weight: 1,
  color: colors.grey900,
  fillColor: colors.grey900,
  fillOpacity: 0.0,
};

export default function ThematicLayer() {
  const { id } = useParams<{ id: string }>();
  const config = useRecoilValue(MapConfigState(id)) ?? {
    enabled: {
      boundary: false,
    },
  };
  const indicatorData = useRecoilValue(MapIndicatorData(id)) ?? [];
  const enabled = config?.enabled?.boundary;

  console.log(indicatorData);

  return (
    <LayersControl.Overlay checked={enabled} name={i18n.t("Boundaries")}>
      <LayerGroup>
        <div>Test</div>
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
