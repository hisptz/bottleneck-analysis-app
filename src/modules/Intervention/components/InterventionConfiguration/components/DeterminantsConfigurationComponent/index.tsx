import React from "react";
import DeterminantComponent from "./components/DeterminantComponent";
import SelectedItermComponent from "./components/SelectedItermComponent";
import "./DeterminantConfigrationComponent.css";

export default function DeterminantsConfigurationComponent() {
  return (
    <div className="determinantMain">
      <DeterminantComponent />
      <SelectedItermComponent />
    </div>
  );
}
