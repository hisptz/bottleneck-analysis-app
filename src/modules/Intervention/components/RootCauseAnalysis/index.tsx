import i18n from "@dhis2/d2-i18n";
import { IconDownload24 } from "@dhis2/ui";
import React, { Suspense, useMemo } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import CardLoader from "../../../../shared/components/loaders/CardLoader";
import { downloadExcelFromTable } from "../../../../shared/utils/download";
import { InterventionStateSelector } from "../../state/intervention";
import InterventionCard from "../Card";
import RootCauseTable from "./components/RootCauseTable";
import { RootCauseDataIsEmpty } from "./state/data";
import { RootCauseTableRef } from "./state/table";
import CardHeader from "../CardHeader";

export default function RootCauseAnalysis(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const handle = useFullScreenHandle();
  const dataEmptyState = useRecoilValueLoadable(RootCauseDataIsEmpty(id));
  const interventionName = useRecoilValue<string>(InterventionStateSelector({ id, path: ["name"] })) ?? "";
  const tableRef = useRecoilValue(RootCauseTableRef(id));

  const onDownload = () => {
    downloadExcelFromTable(tableRef, `${interventionName}-${i18n.t("Root cause analysis")}`);
  };

  const isDataEmpty = useMemo(() => {
    if (dataEmptyState.state === "hasValue") {
      return dataEmptyState.contents;
    }
    return true;
  }, [dataEmptyState]);

  return (
    <InterventionCard
      allowFullScreen
      fullScreenHandle={handle}
      menu={[
        {
          label: "Download Excel",
          callback: onDownload,
          icon: <IconDownload24 />,
          disabled: isDataEmpty,
        },
      ]}
      title={
        <div className="row" style={{ gap: 8 }}>
          <h4>{i18n.t("Root Cause Analysis")}: </h4>
          <CardHeader />
        </div>
      }>
      <Suspense fallback={<CardLoader />}>
        <RootCauseTable />
      </Suspense>
    </InterventionCard>
  );
}
