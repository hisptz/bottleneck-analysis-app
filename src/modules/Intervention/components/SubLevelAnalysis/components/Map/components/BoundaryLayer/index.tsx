import { LeafletMouseEvent } from "leaflet";
import React, { useEffect } from "react";
import { Polygon, Popup, Tooltip, useMap } from "react-leaflet";
import useMapData from "../../hooks/useMapData";

const defaultStyle = {
  weight: 1,
  color: "#000",
  fillColor: "#000",
  fillOpacity: 0.0,
};

function highlightFeature(e: LeafletMouseEvent) {
  const layer = e.target;
  layer.setStyle({
    weight: 2,
    color: "#000",
    dashArray: "",
    fillOpacity: 0.2,
  });
  layer.bringToFront();
}

function resetHighlight(map: any, e: LeafletMouseEvent) {
  const layer = e.target;
  layer.setStyle(defaultStyle);
}

export default function BoundaryLayer() {
  const { data, bounds } = useMapData();
  const map = useMap();

  useEffect(() => {
    if (data) {
      map.fitBounds(bounds);
    }
  }, [bounds, data, map]);

  return data?.map((area: { co: Array<any>; id: string; name: string; level: number }) => {
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
  });
}
