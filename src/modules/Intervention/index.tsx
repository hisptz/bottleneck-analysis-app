import React from "react";
import "./dashboard.css";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import useMigrate from "../Migration/hooks/useMigrate";
import AnalysisChart from "./components/AnalysisChart";
import DashboardDetails from "./components/Details";
import DashboardHeader from "./components/Header";
import RootCauseAnalysis from "./components/RootCauseAnalysis";
import SubLevelAnalysis from "./components/SubLevelAnalysis";
import { DashboardDetailsState } from "./state/dashboard";

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const showDetails = useRecoilValue(DashboardDetailsState(id));
  useMigrate();
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
