import { colors } from "@dhis2/ui";
import { head } from "lodash";
import React from "react";
import { LayerGroup, LayersControl, Polygon, Popup, Tooltip } from "react-leaflet";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { MapIndicatorSelector } from "../../../../state/config";
import { MapIndicatorData } from "../../../../state/data";
import { getColorFromLegendSet, highlightFeature, resetHighlight } from "../../../../utils/map";

const defaultStyle = {
  weight: 1,
};
const highlightStyle = {
  weight: 2,
};

export default function IndicatorLayer({ type, indicatorId }: { type: "bubble" | "chloro"; indicatorId: string }) {
  const { id: interventionId } = useParams();
  const data = useRecoilValue(MapIndicatorData(interventionId));
  const indicator = useRecoilValue(MapIndicatorSelector({ id: interventionId, indicatorId }));
  const indicatorData = data[indicatorId];

  if (!indicatorData) return null;

  return (
    <LayersControl.Overlay name={indicator?.displayName}>
      <LayerGroup>
        {indicatorData?.map((d: any) =>
          d.orgUnit ? (
            <Polygon
              eventHandlers={{ mouseover: (e) => highlightFeature(e, highlightStyle), mouseout: (e) => resetHighlight(e, defaultStyle) }}
              pathOptions={{
                fillColor: getColorFromLegendSet(head(indicator?.legendSets), d.data),
                fillOpacity: 1,
                color: colors.grey900,
                weight: 1,
              }}
              key={`${d.indicator.id}-layer`}
              positions={d.orgUnit.co}>
              <Tooltip>
                {d?.orgUnit?.name} ({d?.data})
              </Tooltip>
              <Popup minWidth={80}>
                <h3>{d?.orgUnit?.name}</h3>
                <div>
                  <b>Level: </b>
                  {d?.orgUnit?.level}
                </div>
                <div>
                  <b>{indicator?.displayName}: </b>
                  {d?.data}
                </div>
              </Popup>
            </Polygon>
          ) : null
        )}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
