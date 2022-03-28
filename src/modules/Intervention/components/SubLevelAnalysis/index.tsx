import i18n from "@dhis2/d2-i18n";
import { IconDownload24 } from "@dhis2/ui";
import { find } from "lodash";
import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useSetRecoilState } from "recoil";
import CardError from "../../../../shared/components/errors/CardError";
import { downloadExcelFromTable } from "../../../../shared/utils/download";
import { FullPageState } from "../../state/config";
import { InterventionStateSelector } from "../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../state/selections";
import InterventionCard, { InterventionMenu } from "../Card";
import "./sub-level-analysis.css";
import SubLevelActions from "./components/SubLevelActions";
import SubLevelHeader from "./components/SubLevelHeader";
import { tabs } from "./constants/tabs";
import { SubLevelAnalyticsData } from "./state/data";
import { SubLevelTableRef } from "./state/table";
import { ActiveTab } from "./state/tabs";

export default function SubLevelAnalysis(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const activeTabKey = useRecoilValue(ActiveTab);
  const setFullPageState = useSetRecoilState(FullPageState("subLevelAnalysis"));
  const interventionName = useRecoilValue<string>(InterventionStateSelector({ id, path: ["name"] })) ?? "";
  const { name: periodName } = useRecoilValue(InterventionPeriodState(id)) ?? {};
  const { displayName: orgUnitName } = useRecoilValue(InterventionOrgUnitState(id)) ?? {};
  const activeTab = find(tabs, ["key", activeTabKey]);
  const tableRef = useRecoilValue(SubLevelTableRef(id));
  const resetData = useRecoilRefresher_UNSTABLE(SubLevelAnalyticsData(id));

  const handle = useFullScreenHandle();

  const onDownloadExcel = () => {
    if (tableRef) {
      downloadExcelFromTable(tableRef, `${interventionName}_${orgUnitName}_${periodName}`);
    } else {
      console.error("Table ref is not defined");
    }
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
  }, [handle, setFullPageState]);

  return (
    <InterventionCard
      maxHeight={handle.active ? "100%" : 900}
      fullScreenHandle={handle}
      allowFullScreen
      menu={menus}
      actions={<SubLevelActions />}
      title={<SubLevelHeader activeTab={activeTab} />}>
      <ErrorBoundary onReset={resetData} resetKeys={[activeTabKey, id]} FallbackComponent={CardError}>
        <div style={{ overflow: "hidden", maxHeight: handle.active ? "calc(100vh - 120px)" : 500 }} className="sub-level-container">
          <ActiveComponent />
        </div>
      </ErrorBoundary>
    </InterventionCard>
  );
}
