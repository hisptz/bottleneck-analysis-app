/* eslint-disable import/order */
import React, { useEffect, useRef } from "react";
import InterventionCard, { InterventionMenu } from "../Card";
import "./sub-level-analysis.css";
import SubLevelActions from "./components/SubLevelActions";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SubLevelHeader from "./components/SubLevelHeader";
import { tabs } from "./constants/tabs";
import { ActiveTab } from "./state/tabs";
import { find } from "lodash";
import i18n from "@dhis2/d2-i18n";
import { IconDownload24 } from "@dhis2/ui";
import { ErrorBoundary } from "react-error-boundary";
import CardError from "../../../../shared/components/errors/CardError";
import { downloadSubLevelExcelData } from "../../../../shared/utils/download";
import { InterventionStateSelector } from "../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../state/selections";
import { useParams } from "react-router-dom";
import { useFullScreenHandle } from "react-full-screen";
import { FullPageState } from "../../state/config";

export default function SubLevelAnalysis() {
  const { id } = useParams<{ id: string }>();
  const activeTabKey = useRecoilValue(ActiveTab);
  const setFullPageState = useSetRecoilState(FullPageState("subLevelAnalysis"));
  const interventionName = useRecoilValue<string>(InterventionStateSelector({ id, path: ["name"] }));
  const { name: periodName } = useRecoilValue(InterventionPeriodState(id));
  const { displayName: orgUnitName } = useRecoilValue(InterventionOrgUnitState(id));
  const activeTab = find(tabs, ["key", activeTabKey]);
  const tableRef = useRef(null);

  const handle = useFullScreenHandle();

  const onDownloadExcel = () => {
    downloadSubLevelExcelData(tableRef, `${interventionName}_${orgUnitName}_${periodName}`);
  };

  const menus: Array<InterventionMenu> = [
    {
      label: i18n.t("Download Excel"),
      callback: onDownloadExcel,
      icon: <IconDownload24 />,
    },
  ];

  const ActiveComponent = activeTab?.component;

  useEffect(() => {
    setFullPageState(handle.active);
  }, [handle]);

  return (
    <InterventionCard
      minHeight={500}
      maxHeight={handle.active ? "100%" : 800}
      fullScreenHandle={handle}
      allowFullScreen
      menu={menus}
      actions={<SubLevelActions />}
      title={<SubLevelHeader activeTab={activeTab} />}>
      <ErrorBoundary resetKeys={[activeTabKey]} FallbackComponent={CardError}>
        <div style={{ overflow: "auto", maxHeight: handle.active ? "calc(100vh - 120px)" : "100%" }} className="sub-level-container">
          <ActiveComponent tableRef={tableRef} />
        </div>
      </ErrorBoundary>
    </InterventionCard>
  );
}
