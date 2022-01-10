import i18n from "@dhis2/d2-i18n";
import { colors } from "@dhis2/ui";
import React from "react";
import useInterventionConfig from "../../../../../../shared/hooks/useInterventionConfig";
import LegendsDefinition from "./components/LegendsDefinition";

export default function SubLevelHeader({ activeTab }: { activeTab: any }) {
  const intervention = useInterventionConfig();
  return (
    <div className="column pt-8 sub-level-header">
      <div className="row space-between align-items-center">
        <div className="row" style={{ gap: 8 }}>
          <h4 style={{ margin: 0 }}>{`${i18n.t("Bottleneck Sub-level Analysis")}:`}</h4>
          <h4 style={{ margin: 0, color: colors.grey700 }}>{`${intervention?.name}`}</h4>
        </div>
        <div className="column">{activeTab.key === "table" && <LegendsDefinition />}</div>
      </div>
    </div>
  );
}
