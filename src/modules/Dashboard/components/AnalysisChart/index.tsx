/* eslint-disable prettier/prettier */
import { IconDownload24, IconFullscreen24 } from "@dhis2/ui";
import React from "react";
import DashboardCard from "../DashboardCard";
import AnalysiChart from "./components";

export default function AnalysisChart() {
  return (
    <DashboardCard
      menu={[
        {
          label: "Download",
          callback: () => {
          },
          icon: <IconDownload24 />,
        },
        {
          label: "View Full Page",
          icon: <IconFullscreen24 />,
          callback: () => {
          },
        },
      ]}
      title={"Analysis Analysis"}>
      <AnalysiChart />
    </DashboardCard>
  );
}
