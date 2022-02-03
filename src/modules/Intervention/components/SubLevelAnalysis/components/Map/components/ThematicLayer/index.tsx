import { colors } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { MapConfigState, MapIndicatorState } from "../../state/config";
import IndicatorLayer from "./components/IndicatorLayer";

const defaultStyle = {
  weight: 1,
  color: colors.grey900,
  fillColor: colors.grey900,
  fillOpacity: 0.0,
};

export default function ThematicLayer() {
  const { id } = useParams<{ id: string }>();
  const config = useRecoilValue(MapConfigState(id)) ?? {
    enabled: {
      boundary: false,
    },
  };

  const indicators = useRecoilValue(MapIndicatorState(id)) ?? [];

  return (
    <>
      {indicators?.map((indicator) => (
        <IndicatorLayer type={"chloro"} indicatorId={indicator?.id} key={`${indicator?.id}-parent-layer`} />
      ))}
    </>
  );
}
