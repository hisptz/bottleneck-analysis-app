import { IconDownload24, IconFullscreen24 } from "@dhis2/ui";
import React from "react";
import DashboardCard from "../Card";
import Chart from "./components";

export default function AnalysisChart() {
  return (
    <DashboardCard
      menu={[
        {
          label: "Download",
          callback: () => {
            console.log("download");
          },
          icon: <IconDownload24 />,
        },
        {
          label: "View Full Page",
          icon: <IconFullscreen24 />,
          callback: () => {
            console.log("full page");
          },
        },
      ]}
      title={"Analysis Analysis"}>
      <Chart />
    </DashboardCard>
  );
}
