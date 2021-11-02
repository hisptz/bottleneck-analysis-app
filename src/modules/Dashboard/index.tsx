/* eslint-disable import/order */
import React from "react";
import "./dashboard.css";
import DashboardCard, { DashboardCardProps } from "./components/DashboardCard";
import DashboardHeader from "./components/DashboardHeader";
import i18n from "@dhis2/d2-i18n";

const dashboardCards: Array<DashboardCardProps> = [
  {
    title: i18n.t("Bottleneck Analysis Chart"),
    menu: [
      {
        callback: () => console.log("download"),
        label: i18n.t("Download"),
      },
      {
        callback: () => console.log("full screen"),
        label: i18n.t("View Full Screen"),
      },
    ],
    content: <div>Bottleneck Analysis Chart</div>,
  },
  {
    title: i18n.t("Bottleneck Sublevel Analysis "),
    menu: [
      {
        callback: () => console.log("download"),
        label: i18n.t("Download"),
      },
      {
        callback: () => console.log("full screen"),
        label: i18n.t("View Full Screen"),
      },
    ],
    content: <div>Bottleneck Sublevel Analysis</div>,
  },
  {
    title: i18n.t("Root Cause Analysis "),
    menu: [
      {
        callback: () => console.log("download"),
        label: i18n.t("Download"),
      },
      {
        callback: () => console.log("full screen"),
        label: i18n.t("View Full Screen"),
      },
    ],
    content: <div>Bottleneck Sublevel Analysis</div>,
  },
];

export default function Dashboard() {
  return (
    <div className="main-container">
      <DashboardHeader />
      <div className="cards">
        {dashboardCards?.map((card, index) => (
          <DashboardCard key={`${index}-dashboard-card`} {...card} />
        ))}
      </div>
    </div>
  );
}
