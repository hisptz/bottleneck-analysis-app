import i18n from "@dhis2/d2-i18n";
import React from "react";
import { LayerGroup, LayersControl } from "react-leaflet";
import { ThematicMapLayer } from "../../../../../../../../../../shared/interfaces/interventionConfig";
import Bubble from "./components/Bubble";
import Choropleth from "./components/Choropleth";
import useMapIndicatorData from "./hooks/data";

export default function IndicatorLayer({ config }: { config: ThematicMapLayer }) {
  const { data, indicator } = useMapIndicatorData(config?.indicator);
  if (!data) return null;

  return (
    <LayersControl.Overlay
      checked={config.enabled}
      name={`${indicator?.displayName} (${config.type === "choropleth" ? i18n.t("Choropleth") : i18n.t("Bubble")})`}>
      <LayerGroup>
        {data?.map((d: any) =>
          d.orgUnit ? config.type === "choropleth" ? <Choropleth indicator={indicator} data={d} /> : <Bubble indicator={indicator} data={d} /> : null
        )}
      </LayerGroup>
    </LayersControl.Overlay>
  );
}
