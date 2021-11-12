/* eslint-disable no-unused-vars */
import { ButtonStrip, Button, IconInfo24 } from "@dhis2/ui";
import React from "react";
import { useHistory } from "react-router-dom";
import AnalysisChart from "../../AnalysisChart";
import RootCauseAnalysis from "../../RootCauseAnalysis";
import SubLevelAnalysis from "../../SubLevelAnalysis";
import "./ArchiveDashboard.css";
import IndividualArchiveHeader from "./Individual-Archive-Header";
import IndividualArchiveHeaderInfoSummary from "./Individual-Archive-Header-info-Summary";
export default function DashboardArchive() {
  const history = useHistory();
  return (
    <div className="main-container">
      <IndividualArchiveHeader />
      <IndividualArchiveHeaderInfoSummary />
      <div className="cards">
        <AnalysisChart />
        <SubLevelAnalysis />
        <RootCauseAnalysis />
      </div>
    </div>
  );
}
