import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import { LeafletMouseEvent } from "leaflet";
import React, { useEffect } from "react";
import { LayerGroup, LayersControl, Polygon, Popup, Tooltip, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import useMapData from "../../hooks/useMapData";
import { MapConfigState } from "../../state/config";

const defaultStyle = {
  weight: 1,
  color: colors.grey900,
  fillColor: colors.grey900,
  fillOpacity: 0.0,
};

function highlightFeature(e: LeafletMouseEvent) {
  const layer = e.target;
  layer.setStyle({
    weight: 2,
    color: colors.grey900,
    dashArray: "",
    fillOpacity: 0.1,
  });
  layer.bringToFront();
}

function resetHighlight(map: any, e: LeafletMouseEvent) {
  const layer = e.target;
  layer.setStyle(defaultStyle);
}

export default function BoundaryLayer() {
  const { id } = useParams<{ id: string }>();
  const { data, bounds } = useMapData();
  const config = useRecoilValue(MapConfigState(id)) ?? {
    enabled: {
      boundary: false,
    },
  };
  const enabled = config?.enabled?.boundary;
  console.log({ config });
  const map = useMap();

  useEffect(() => {
    if (data) {
      map.fitBounds(bounds);
    }
  }, [bounds, data, map]);
  return (
    <LayersControl.Overlay checked={enabled} name={i18n.t("Boundaries")}>
      <LayerGroup>
        {data?.map((area: { co: Array<any>; id: string; name: string; level: number }) => {
          return (
            <Polygon
              interactive
              eventHandlers={{ mouseover: highlightFeature, mouseout: (e) => resetHighlight(map, e) }}
              key={`${area.id}-polygon`}
              pathOptions={defaultStyle}
              positions={area.co}>
              <Tooltip>{area.name}</Tooltip>
              <Popup minWidth={80}>
                <div>{area.name}</div>
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
