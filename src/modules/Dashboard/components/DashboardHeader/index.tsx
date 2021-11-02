import { Divider } from "@dhis2/ui";
import React from "react";
import DashboardList from "./components/DashboardList";
import InterventionHeader from "./components/InterventionHeader";
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
