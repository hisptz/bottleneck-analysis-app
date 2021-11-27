import i18n from "@dhis2/d2-i18n";
import { colors, IconDownload24 } from "@dhis2/ui";
import React from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionStateSelector } from "../../state/intervention";
import InterventionCard from "../Card";
import Chart from "./components";
import ChartLabelComponent from "./components/ChartLabelComponent";

export default function AnalysisChart() {
  const { id } = useParams<{ id: string }>();
  const interventionName = useRecoilValue(InterventionStateSelector({ id, path: ["name"] }));
  const handle = useFullScreenHandle();
  return (
    <InterventionCard
      fullScreenHandle={handle}
      allowFullScreen
      menu={[
        {
          label: "Download",
          callback: () => {},
          icon: <IconDownload24 />,
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
