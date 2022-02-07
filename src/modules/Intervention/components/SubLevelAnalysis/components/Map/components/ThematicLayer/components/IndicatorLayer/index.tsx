import i18n from "@dhis2/d2-i18n";
import { Control } from "leaflet";
import React, { useEffect, useMemo, useRef } from "react";
import { LayerGroup, LayersControl, useMap } from "react-leaflet";
import { ThematicMapLayer } from "../../../../../../../../../../shared/interfaces/interventionConfig";
import Bubble from "./components/Bubble";
import BubbleLegend from "./components/Bubble/components/BubbleLegend";
import Choropleth from "./components/Choropleth";
import ChoroplethLegend from "./components/Choropleth/components/ChoroplethLegend";
import useMapIndicatorData from "./hooks/data";

export default function IndicatorLayer({ config }: { config: ThematicMapLayer }) {
  const { data, indicator } = useMapIndicatorData(config?.indicator);
  const map = useMap();
  const legendControl = useMemo(
    () =>
      new Control({
        position: "bottomright",
      }),
    []
  );

  const choroplethLegendRef = useRef<HTMLDivElement>(null);
  const bubbleLegendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (choroplethLegendRef.current !== null) {
      // @ts-ignore
      legendControl.onAdd = () => choroplethLegendRef?.current;
      map.addControl(legendControl);
    }
    if (bubbleLegendRef.current !== null) {
      // @ts-ignore
      legendControl.onAdd = () => bubbleLegendRef?.current;
      map.addControl(legendControl);
    }
  }, [legendControl, map]);

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
      {config.type === "choropleth" && <ChoroplethLegend ref={choroplethLegendRef} data={data} indicator={indicator} config={config} />}
      {config.type === "bubble" && <BubbleLegend ref={bubbleLegendRef} data={data} indicator={indicator} config={config} />}
    </>
  );
}
