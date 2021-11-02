import React from "react";
import "./dashboard.css";
import AnalysisChart from "./components/AnalysisChart";
import DashboardHeader from "./components/DashboardHeader";
import RootCauseAnalysis from "./components/RootCauseAnalysis";
import SubLevelAnalysis from "./components/SubLevelAnalysis";

export default function Dashboard() {
  return (
    <div className="main-container">
      <DashboardHeader />
      <div className="cards">
        <AnalysisChart />
        <SubLevelAnalysis />
        <RootCauseAnalysis />
      </div>
    </div>
  );
}
