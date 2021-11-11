import i18n from "@dhis2/d2-i18n";
import { IconDownload24, IconView24 } from "@dhis2/ui";
import React from "react";
import DashboardCard from "../Card";
import RootCauseTable from "./components/RootCauseTable";

export default function RootCauseAnalysis() {
  return (
    <DashboardCard
      menu={[
        {
          label: "Download",
          callback: () => {},
          icon: <IconDownload24 />,
        },
        {
          label: "View Full Page",
          icon: <IconView24 />,
          callback: () => {},
        },
      ]}
      title={i18n.t("Root Cause Analysis")}>
      <RootCauseTable />
    </DashboardCard>
  );
}
