import { IconDownload24, IconFullscreen24 } from "@dhis2/ui";
import React from "react";
import InterventionCard from "../Card";
import Chart from "./components";
import ChartLabelComponent from "./components/ChartLabelComponent";

export default function AnalysisChart() {
  return (
    <InterventionCard
      menu={[
        {
          label: "Download",
          callback: () => {},
          icon: <IconDownload24 />,
        },
        {
          label: "View Full Page",
          icon: <IconFullscreen24 />,
          callback: () => {},
        },
      ]}
      title={"Analysis Analysis"}>
      <Chart />
      <ChartLabelComponent />
    </InterventionCard>
  );
}
