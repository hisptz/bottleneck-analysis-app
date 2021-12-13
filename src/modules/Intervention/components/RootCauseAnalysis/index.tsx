import i18n from "@dhis2/d2-i18n";
import { colors, IconDownload24 } from "@dhis2/ui";
import React, { Suspense, useRef } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import CardLoader from "../../../../shared/components/loaders/CardLoader";
import { downloadExcelFromTable } from "../../../../shared/utils/download";
import { InterventionStateSelector } from "../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../state/selections";
import InterventionCard from "../Card";
import RootCauseTable from "./components/RootCauseTable";

export default function RootCauseAnalysis(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const handle = useFullScreenHandle();
  const interventionName = useRecoilValue<string>(InterventionStateSelector({ id, path: ["name"] })) ?? "";
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));
  const period = useRecoilValue(InterventionPeriodState(id));
  const tableRef = useRef(null);

  const onDownload = () => {
    downloadExcelFromTable(tableRef, `${interventionName}-${i18n.t("Root cause analysis")}`);
  };

  return (
    <InterventionCard
      allowFullScreen
      fullScreenHandle={handle}
      menu={[
        {
          label: "Download Excel",
          callback: onDownload,
          icon: <IconDownload24 />,
        },
      ]}
      title={
        <div className="row" style={{ gap: 8 }}>
          <h4>{i18n.t("Root Cause Analysis")}: </h4>
          <h4 style={{ color: colors.grey700 }}>{`${orgUnit.displayName ?? ""} - ${period.name ?? ""} `}</h4>
        </div>
      }>
      <Suspense fallback={<CardLoader />}>
        <RootCauseTable tableRef={tableRef} />
      </Suspense>
    </InterventionCard>
  );
}
