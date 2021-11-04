import React from "react";
import DashboardCard, { DashboardMenu } from "../Card";
import "./sub-level-analysis.css";
import SubLevelActions from "./components/SubLevelActions";
import { useRecoilValue } from "recoil";
import SubLevelHeader from "./components/SubLevelHeader";
import { tabs } from "./constants/tabs";
import { ActiveTab } from "./state/tabs";
import { find } from "lodash";
import i18n from "@dhis2/d2-i18n";
import { IconDownload24, IconFullscreen24 } from "@dhis2/ui";

const menus: Array<DashboardMenu> = [
  {
    label: i18n.t("Download Excel"),
    callback: () => {},
    icon: <IconDownload24 />,
  },
  {
    label: i18n.t("View Full Screen"),
    callback: () => {},
    icon: <IconFullscreen24 />,
  },
];

export default function SubLevelAnalysis() {
  const activeTabKey = useRecoilValue(ActiveTab);
  const activeTab = find(tabs, ["key", activeTabKey]);
  return (
    <DashboardCard maxHeight={500} minHeight={500} menu={menus} actions={<SubLevelActions />} title={<SubLevelHeader />}>
      <div className="sub-level-container">{activeTab?.component}</div>
    </DashboardCard>
  );
}
