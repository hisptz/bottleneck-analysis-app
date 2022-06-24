import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import React, { useEffect } from "react";
import { LayerGroup, LayersControl, Polygon, Popup, Tooltip, useMap } from "react-leaflet";
import { useRecoilValue } from "recoil";
import { FullPageState } from "../../../../../../state/config";
import { highlightFeature, resetHighlight } from "../../utils/map";
import useBoundaryConfig from "./hooks/config";
import useBoundaryData from "./hooks/data";

const defaultStyle = {
  weight: 1,
  color: colors.grey900,
  fillColor: colors.grey900,
  fillOpacity: 0.0,
};
const highlightStyle = {
  weight: 2,
  color: colors.grey900,
  dashArray: "",
  fillOpacity: 0.1,
};

export default function BoundaryLayer() {
  const { data, bounds } = useBoundaryData();
  const fullScreen = useRecoilValue(FullPageState("subLevelAnalysis"));
  const { enabled } = useBoundaryConfig();
  const map = useMap();

  useEffect(() => {
    if (data) {
      map.fitBounds(bounds);
    }
  }, [bounds, data, map, fullScreen]);

  return (
    <LayersControl.Overlay checked={enabled} name={i18n.t("Boundaries")}>
      <LayerGroup>
        {data?.map((area: { co: Array<any>; id: string; name: string; level: number }) => {
          return (
            <Polygon
              interactive
              eventHandlers={{ mouseover: (e) => highlightFeature(e, highlightStyle), mouseout: (e) => resetHighlight(e, defaultStyle) }}
              key={`${area.id}-polygon`}
              pathOptions={defaultStyle}
              positions={area.co}>
              <Tooltip>{area.name}</Tooltip>
              <Popup minWidth={80}>
                <h3>{area.name}</h3>
                <div>
                  <b>Level: </b>
                  {area.level}
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
