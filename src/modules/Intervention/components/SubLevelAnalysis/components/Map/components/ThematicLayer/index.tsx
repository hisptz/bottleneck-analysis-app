import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ThematicMapLayer } from "../../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../../state/intervention";
import IndicatorLayer from "./components/IndicatorLayer";

export default function ThematicLayer() {
  const { id } = useParams<{ id: string }>();
  const thematicLayers: Array<ThematicMapLayer> = useRecoilValue(InterventionStateSelector({ id, path: ["map", "coreLayers", "thematicLayers"] }));
  return (
    <>
      {thematicLayers?.map((layer) => (
        <IndicatorLayer config={layer} key={`${layer.indicator}-parent-layer`} />
      ))}
    </>
  );
}
