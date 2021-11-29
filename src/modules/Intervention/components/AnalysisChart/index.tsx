import i18n from "@dhis2/d2-i18n";
import { colors, IconDownload24, IconFileDocument24, IconImage24 } from "@dhis2/ui";
import React from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { downloadExcelFromAnalytics } from "../../../../shared/utils/download";
import { InterventionStateSelector } from "../../state/intervention";
import { InterventionOrgUnitState } from "../../state/selections";
import InterventionCard from "../Card";
import Chart from "./components";
import ChartLabelComponent from "./components/ChartLabelComponent";
import { ChartData } from "./state/data";

export default function AnalysisChart() {
  const { id } = useParams<{ id: string }>();
  const interventionName = useRecoilValue(InterventionStateSelector({ id, path: ["name"] }));
  const data = useRecoilValue(ChartData(id));
  const groups = useRecoilValue(InterventionStateSelector({ id, path: ["dataSelection", "groups"] }));
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));

  console.log(orgUnit);

  const handle = useFullScreenHandle();

  const onExcelDownload = () => {
    downloadExcelFromAnalytics({ analytics: data, groups, orgUnit }, interventionName);
  };
  const onPDFDownload = () => {};
  const onImageDownload = () => {};

  return (
    <InterventionCard
      fullScreenHandle={handle}
      allowFullScreen
      menu={[
        {
          label: "Download PDF",
          callback: onPDFDownload,
          icon: <IconFileDocument24 />,
        },
        {
          label: "Download Excel",
          callback: onExcelDownload,
          icon: <IconDownload24 />,
        },
        {
          label: "Download PNG",
          callback: onImageDownload,
          icon: <IconImage24 />,
        },
      ]}
      title={
        <div className="row" style={{ gap: 8 }}>
          <h4>{i18n.t("Bottleneck Analysis Chart")}: </h4>
          <h4 style={{ color: colors.grey700 }}>{`${interventionName}`}</h4>
        </div>
      }>
      <Chart />
      <ChartLabelComponent />
    </InterventionCard>
  );
}
