import { Divider } from "@dhis2/ui";
import React from "react";
import InterventionHeader from "./components/InterventionHeader";
import DashboardList from "./components/InterventionList";
import "./dashboard-header.css";
export default function DashboardHeader() {
  return (
    <div className="header-container">
      <DashboardList />
      <Divider margin={"0"} />
      <InterventionHeader />
    </div>
  );
}
