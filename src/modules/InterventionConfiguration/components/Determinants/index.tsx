import React from "react";
import { useRecoilValue } from "recoil";
import { InterventionConfiguationDeterminant } from "../../../Intervention/state/intervention";
import DeterminantArea from "./components/DeterminantArea";
import IndicatorConfiguration from "./components/IndicatorConfiguration";
import "./Determinant.css";

export default function DeterminantsConfiguration() {
  const useSelectectedItemConfigState = useRecoilValue(InterventionConfiguationDeterminant);
  return (
    <div className="determinant-main-container">
      <div className="determinant-area-container">
        <DeterminantArea />
      </div>
      <div className="indicator-configuration-container">{useSelectectedItemConfigState && <IndicatorConfiguration />}</div>
    </div>
  );
}
