import React from "react";
import "./GeneralConfigurationComponent.css";
import InterventionConfigDetails from "./GeneralConfigurationComponet/components/InterventionConfigDetails";
import { LegendDefinitionConfigDetails } from "./GeneralConfigurationComponet/components/LegendDefinitionConfigDetails";

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
