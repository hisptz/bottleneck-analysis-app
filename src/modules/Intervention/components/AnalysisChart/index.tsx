import i18n from "@dhis2/d2-i18n";
import { colors, IconDownload24, IconFileDocument24, IconImage24 } from "@dhis2/ui";
import HighchartsReact from "highcharts-react-official";
import React, { useRef } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { downloadExcelFromAnalytics } from "../../../../shared/utils/download";
import { InterventionStateSelector } from "../../state/intervention";
import { InterventionOrgUnitState } from "../../state/selections";
import InterventionCard from "../Card";
import Chart from "./components";
import { ChartData } from "./state/data";

export default function AnalysisChart(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const interventionName = useRecoilValue(InterventionStateSelector({ id, path: ["name"] }));
  const data = useRecoilValueLoadable(ChartData(id));
  const groups = useRecoilValue(InterventionStateSelector({ id, path: ["dataSelection", "groups"] }));
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const handle = useFullScreenHandle();

  const onExcelDownload = () => {
    if (data.state === "hasValue") {
      downloadExcelFromAnalytics({ analytics: data.contents, groups, orgUnit }, interventionName);
    }
  };
  const onPDFDownload = () => {
    chartRef?.current?.chart.exportChart({ type: "application/pdf" }, {});
  };
  const onImageDownload = () => {
    chartRef?.current?.chart.exportChart({ type: "image/png" }, {});
  };

  return (
    <InterventionCard
      fullScreenHandle={handle}
      allowFullScreen
      menu={[
        {
          label: "Download PDF",
          callback: onPDFDownload,
          icon: <IconFileDocument24 />,
          disabled: data.state !== "hasValue",
        },
        {
          label: "Download Excel",
          callback: onExcelDownload,
          icon: <IconDownload24 />,
          disabled: data.state !== "hasValue",
        },
        {
          label: "Download PNG",
          callback: onImageDownload,
          icon: <IconImage24 />,
          disabled: data.state !== "hasValue",
        },
      ]}
      title={
        <div className="row" style={{ gap: 8 }}>
          <h4>{i18n.t("Bottleneck Analysis Chart")}: </h4>
          <h4 style={{ color: colors.grey700 }}>{`${interventionName}`}</h4>
        </div>
      }>
      <Chart chartRef={chartRef} />
    </InterventionCard>
  );
}
