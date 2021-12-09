import React from "react";
import AnalysisChart from "../../../Intervention/components/AnalysisChart";
import RootCauseAnalysis from "../../../Intervention/components/RootCauseAnalysis";
import SubLevelAnalysis from "../../../Intervention/components/SubLevelAnalysis";
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
