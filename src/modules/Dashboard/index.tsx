/* eslint-disable import/order */
import React from "react";
import "./dashboard.css";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AnalysisChart from "./components/AnalysisChart";
import DashboardDetails from "./components/DashboardDetails";
import DashboardHeader from "./components/DashboardHeader";
import RootCauseAnalysis from "./components/RootCauseAnalysis";
import SubLevelAnalysis from "./components/SubLevelAnalysis";
import { DashboardDetailsState } from "./state/dashboard";

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const showDetails = useRecoilValue(DashboardDetailsState(id));
  return (
    <div className="main-container">
      <DashboardHeader />
      <div className="cards">
        {showDetails && <DashboardDetails />}
        <AnalysisChart />
        <SubLevelAnalysis />
        <RootCauseAnalysis />
      </div>
    </div>
  );
}
