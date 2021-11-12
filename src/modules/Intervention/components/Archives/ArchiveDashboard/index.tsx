import React from "react";
import AnalysisChart from "../../AnalysisChart";
import RootCauseAnalysis from "../../RootCauseAnalysis";
import SubLevelAnalysis from "../../SubLevelAnalysis";
import "./ArchiveIntervention.css";
import IndividualArchiveHeader from "./Individual-Archive-Header";
import IndividualArchiveHeaderInfoSummary from "./Individual-Archive-Header-info-Summary";

export default function InterventionArchive() {
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
