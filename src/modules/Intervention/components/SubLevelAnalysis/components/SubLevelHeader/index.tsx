/* eslint-disable prettier/prettier */
import i18n from "@dhis2/d2-i18n";
import { colors, TabBar, Tab, Tooltip, Chip } from "@dhis2/ui";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import useInterventionConfig from "../../../../../../shared/hooks/useInterventionConfig";
import { tabs } from "../../constants/tabs";
import { ActiveTab } from "../../state/tabs";
import LegendsDefinition from "./components/LegendsDefinition";

export default function SubLevelHeader({ activeTab }: { activeTab: any }): React.ReactElement {
  const [activeTabs, setActiveTab] = useRecoilState(ActiveTab);

  const intervention = useInterventionConfig();
  return (
    <div className="column pt-8 sub-level-header">
      <div className="row space-between align-items-center">
        <div className="row" style={{ gap: 8 }}>
          <h4 style={{ margin: 0 }}>{`${i18n.t("Bottleneck Sub-level Analysis")}:`}</h4>
          <h4 style={{ margin: 0, color: colors.grey700 }}>{`${intervention?.name}`}</h4>
        </div>
      </div>
      <TabBar fixed={false}>
        {tabs?.map(({ label, icon, key }) => (
          <Tab icon={icon} key={key} onClick={() => setActiveTab(key)} selected={activeTabs === key ? true : false}>
            {label}
          </Tab>
        ))}
      </TabBar>
      <div style={{ width: "100%", marginBottom: 20 }}></div>
      <div className="column">{activeTab.key === "table" && <LegendsDefinition />}</div>
    </div>
  );
}
