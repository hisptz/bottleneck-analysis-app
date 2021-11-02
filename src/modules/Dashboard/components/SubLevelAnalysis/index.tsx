import React from "react";
import DashboardCard from "../DashboardCard";
import "./sub-level-analysis.css";
import SubLevelActions from "./components/SubLevelActions";
import { useRecoilValue } from "recoil";
import SubLevelHeader from "./components/SubLevelHeader";
import { tabs } from "./constants/tabs";
import { ActiveTab } from "./state/tabs";
import { find } from "lodash";

export default function SubLevelAnalysis() {
  const activeTabKey = useRecoilValue(ActiveTab);
  const activeTab = find(tabs, ["key", activeTabKey]);
  return (
    <DashboardCard actions={<SubLevelActions />} title={<SubLevelHeader />}>
      <div className="sub-level-container">{activeTab?.component}</div>
    </DashboardCard>
  );
}
