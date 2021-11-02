import i18n from "@dhis2/d2-i18n";
import React from "react";
import DashboardCard from "../DashboardCard";
import RootCauseTable from "../RootCauseAnalysis/components/rootCauseTable/rootCauseTable";

export default function RootCauseAnalysis() {
  return (
    <DashboardCard title={i18n.t("Root Cause Analysis")}>
      <RootCauseTable />
    </DashboardCard>
  );
}
