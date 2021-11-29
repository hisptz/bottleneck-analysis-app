import React from "react";
import { useRecoilValue } from "recoil";
import { InterventionConfiguationDeterminant } from "../../../Intervention/state/intervention";
import DeterminantArea from "./components/DeterminantArea";
import IndicatorConfiguration from "./components/IndicatorConfiguration";
import "./Determinant.css";

export default function DeterminantsConfiguration() {
  const useSelectectedItemConfigState = useRecoilValue(InterventionConfiguationDeterminant);
  return (
    <div className="determinantMain">
      <DeterminantArea />
      {useSelectectedItemConfigState && <IndicatorConfiguration />}
    </div>
  );
}
