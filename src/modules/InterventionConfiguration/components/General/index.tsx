import React from "react";
import "./General.css";
import InterventionConfigDetails from "./components/InterventionConfigDetails";
import { LegendDefinitionConfigDetails } from "./components/LegendDefinitionConfigDetails";

export default function GeneralConfigurationComponent() {
  return (
    <>
      <div className="generalConfig">
        <InterventionConfigDetails />
        <LegendDefinitionConfigDetails />
      </div>
    </>
  );
}
