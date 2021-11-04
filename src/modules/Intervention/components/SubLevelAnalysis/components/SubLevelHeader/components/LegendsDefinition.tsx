import { find } from "lodash";
import React from "react";
import useDashboardConfig from "../../../../../../../shared/hooks/useDashboard";
import { LegendDefinition as LegendDefinitionType } from "../../../../../../../shared/interfaces/oldInterventionConfig";

function LegendDefinition({ color, name }: LegendDefinitionType) {
  return (
    <div className="row gap align-center">
      <div style={{ height: 32, width: 72, background: color, border: "1px solid #A0ADBA" }} />
      {name}
    </div>
  );
}

export default function LegendsDefinition() {
  const dashboard = useDashboardConfig();
  const { globalSelections } = dashboard ?? {};
  const legendDefinitions: Array<LegendDefinitionType> = find(globalSelections, ["dimension", "dx"])?.legendDefinitions ?? [];
  return (
    <div className="row gap">
      {legendDefinitions?.map((definition) => (
        <LegendDefinition key={definition.id} {...definition} />
      ))}
    </div>
  );
}
