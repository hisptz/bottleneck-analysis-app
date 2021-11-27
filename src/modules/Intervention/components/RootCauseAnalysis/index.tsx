import i18n from "@dhis2/d2-i18n";
import { IconDownload24, IconView24 } from "@dhis2/ui";
import React from "react";
import { useFullScreenHandle } from "react-full-screen";
import InterventionCard from "../Card";
import RootCauseTable from "./components/RootCauseTable";

export default function RootCauseAnalysis() {
  const handle = useFullScreenHandle();
  return (
    <InterventionCard
      allowFullScreen
      fullScreenHandle={handle}
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
    </InterventionCard>
  );
}
