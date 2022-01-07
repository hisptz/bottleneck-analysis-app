import React from "react";
import useInterventionConfig from "../../../../../../../shared/hooks/useInterventionConfig";
import { LegendDefinition as LegendDefinitionType } from "../../../../../../../shared/interfaces/interventionConfig";

function LegendDefinition({ color, name }: LegendDefinitionType) {
  return (
    <div className="row gap align-center">
      <div style={{ height: 32, width: 72, background: color, border: "1px solid #A0ADBA" }} />
      {name}
    </div>
  );
}

export default function LegendsDefinition() {
  const intervention = useInterventionConfig();
  const { dataSelection } = intervention ?? {};
  const legendDefinitions: Array<LegendDefinitionType> = dataSelection?.legendDefinitions;
  return (
    <div className="row gap">
      {legendDefinitions?.map((definition) => (
        <LegendDefinition key={definition?.id} {...definition} />
      ))}
    </div>
  );
}
