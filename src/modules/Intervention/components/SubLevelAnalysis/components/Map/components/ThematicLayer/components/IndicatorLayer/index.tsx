import i18n from "@dhis2/d2-i18n";
import React from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ThematicMapLayer } from "../../../../../../../../../../shared/interfaces/interventionConfig";
import { ShowLegend } from "../../state/legend";
import Bubble from "./components/Bubble";
import BubbleLegend from "./components/Bubble/components/BubbleLegend";
import Choropleth from "./components/Choropleth";
import ChoroplethLegend from "./components/Choropleth/components/ChoroplethLegend";
import useMapIndicatorData from "./hooks/data";

export default function IndicatorLayer({ config }: { config: ThematicMapLayer }) {
  const { id } = useParams();
  const { data, indicator } = useMapIndicatorData(config?.indicator);
  const showLegends = useRecoilValue(ShowLegend(id));

  if (!data) return null;

  return (
    <>
      <LayersControl.Overlay
        checked={config.enabled}
        name={`${indicator?.displayName} (${config.type === "choropleth" ? i18n.t("Choropleth") : i18n.t("Bubble")})`}>
        <LayerGroup>
          {data?.map((d: any, i: number) =>
            d.orgUnit ? (
              config.type === "choropleth" ? (
                <Choropleth key={`${indicator?.id}-${i}-choro-layer`} indicator={indicator} data={d} />
              ) : (
                <Bubble key={`${indicator?.id}-${i}-bubble-layer`} indicator={indicator} data={d} />
              )
            ) : null
          )}
        </LayerGroup>
      </LayersControl.Overlay>
      {showLegends && (
        <Control position="topright">
          {config.type === "choropleth" && <ChoroplethLegend data={data} indicator={indicator} config={config} />}
          {config.type === "bubble" && <BubbleLegend data={data} indicator={indicator} config={config} />}
        </Control>
      )}
    </>
  );
}
