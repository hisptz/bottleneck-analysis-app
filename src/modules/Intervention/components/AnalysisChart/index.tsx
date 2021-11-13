/* eslint-disable prettier/prettier */
import { IconDownload24, IconFullscreen24 } from "@dhis2/ui";
import React from "react";
import InterventionCard from "../Card";
import Chart from "./components";

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
      title={"Analysis Analysis"}
    >
      <Chart />
    </InterventionCard>
  );
}
