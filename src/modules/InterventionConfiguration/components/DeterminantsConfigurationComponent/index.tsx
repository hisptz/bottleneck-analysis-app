import React from "react";
import { useRecoilValue } from "recoil";
import { InterventionConfiguationDeterminant } from "../../../Intervention/state/intervention";
import DeterminantComponent from "./components/DeterminantComponent";
import SelectedItermComponent from "./components/SelectedItermComponent";
import "./DeterminantConfigrationComponent.css";

export default function DeterminantsConfigurationComponent() {
  const useSelectectedItemConfigState = useRecoilValue(InterventionConfiguationDeterminant);
  return (
    <div className="determinantMain">
      <DeterminantComponent />
      {useSelectectedItemConfigState && <SelectedItermComponent />}
    </div>
  );
}
