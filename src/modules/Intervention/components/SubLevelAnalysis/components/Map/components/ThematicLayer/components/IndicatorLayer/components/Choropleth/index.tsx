import { colors } from "@dhis2/ui";
import { Control } from "leaflet";
import { head } from "lodash";
import React, { useEffect, useMemo, useRef } from "react";
import { Polygon, Popup, Tooltip, useMap } from "react-leaflet";
import { getColorFromLegendSet, highlightFeature, resetHighlight } from "../../../../../../utils/map";
import ChoroplethLegend from "./components/ChoroplethLegend";

const defaultStyle = {
  weight: 1,
};
const highlightStyle = {
  weight: 2,
};

export default function Choropleth({ indicator, data }: { indicator: any; data: any }) {
  return (
    <>
      <Polygon
        eventHandlers={{ mouseover: (e) => highlightFeature(e, highlightStyle), mouseout: (e) => resetHighlight(e, defaultStyle) }}
        pathOptions={{
          fillColor: getColorFromLegendSet(head(indicator?.legendSets), data.data),
          fillOpacity: 1,
          color: colors.grey900,
          weight: 1,
        }}
        key={`${data.indicator.id}-layer`}
        positions={data.orgUnit.co}>
        <Tooltip>
          {data?.orgUnit?.name} ({data?.data})
        </Tooltip>
        <Popup minWidth={80}>
          <h3>{data?.orgUnit?.name}</h3>
          <div>
            <b>Level: </b>
            {data?.orgUnit?.level}
          </div>
          <div>
            <b>{indicator?.displayName}: </b>
            {data?.data}
          </div>
        </Popup>
      </Polygon>
    </>
  );
}
