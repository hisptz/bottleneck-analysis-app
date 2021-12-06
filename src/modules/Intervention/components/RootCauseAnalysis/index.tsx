import i18n from "@dhis2/d2-i18n";
import { IconDownload24 } from "@dhis2/ui";
import React, { useRef } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { downloadExcelFromTable } from "../../../../shared/utils/download";
import { InterventionStateSelector } from "../../state/intervention";
import InterventionCard from "../Card";
import RootCauseTable from "./components/RootCauseTable";

export default function RootCauseAnalysis() {
  const { id } = useParams<{ id: string }>();
  const handle = useFullScreenHandle();
  const interventionName = useRecoilValue<string>(InterventionStateSelector({ id, path: ["name"] })) ?? "";

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
      title={i18n.t("Root Cause Analysis")}
    >
      <RootCauseTable tableRef={tableRef} />
    </InterventionCard>
  );
}
