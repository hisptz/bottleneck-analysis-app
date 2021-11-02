import { IconDownload24, IconView24 } from "@dhis2/ui";
import React from "react";
import DashboardCard from "../DashboardCard";

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
          icon: <IconView24 />,
          callback: () => {
            console.log("full page");
          },
        },
      ]}
      title={"Analysis Analysis"}>
      Analysis here
    </DashboardCard>
  );
}
