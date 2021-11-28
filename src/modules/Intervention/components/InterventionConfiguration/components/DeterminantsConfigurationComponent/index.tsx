import { InterventionConfiguationDeterminant } from "../../../../state/intervention";
import React from "react";
import { useRecoilValue } from "recoil";
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
