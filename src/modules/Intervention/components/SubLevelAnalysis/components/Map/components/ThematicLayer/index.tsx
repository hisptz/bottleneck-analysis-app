import i18n from "@dhis2/d2-i18n";
import { Button, IconLegend24, Tooltip } from "@dhis2/ui";
import React from "react";
import Control from "react-leaflet-custom-control";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { ThematicMapLayer } from "../../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../../state/intervention";
import IndicatorLayer from "./components/IndicatorLayer";
import { ShowLegend } from "./state/legend";

export default function ThematicLayer() {
  const { id } = useParams<{ id: string }>();
  const thematicLayers: Array<ThematicMapLayer> = useRecoilValue(InterventionStateSelector({ id, path: ["map", "coreLayers", "thematicLayers"] })) ?? [];
  const [showLegend, setShowLegend] = useRecoilState(ShowLegend(id));
  return (
    <>
      {thematicLayers?.map((layer) => (
        <IndicatorLayer config={layer} key={`${layer.indicator}-parent-layer`} />
      ))}
      <Control position="topleft">
        <Tooltip content={`${showLegend ? i18n.t("Hide") : i18n.t("Show")} Legends`}>
          <Button toggled={showLegend} onClick={() => setShowLegend((prev) => !prev)} icon={<IconLegend24 />} />
        </Tooltip>
      </Control>
    </>
  );
}
