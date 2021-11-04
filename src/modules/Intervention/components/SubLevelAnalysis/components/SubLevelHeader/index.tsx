import i18n from "@dhis2/d2-i18n";
import React from "react";
import useDashboardConfig from "../../../../../../shared/hooks/useDashboard";
import LegendsDefinition from "./components/LegendsDefinition";

export default function SubLevelHeader() {
  const dashboard = useDashboardConfig();
  return (
    <div className="column pt-8">
      <div className="row space-between">
        <div className="column">
          <h4 style={{ margin: 0 }}>{`${i18n.t("Bottleneck Sublevel Analysis")}: ${dashboard.name}`}</h4>
        </div>
        <div className="column">
          <LegendsDefinition />
        </div>
      </div>
    </div>
  );
}
