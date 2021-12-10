import React from "react";
import AnalysisChart from "../../../Intervention/components/AnalysisChart";
import RootCauseAnalysis from "../../../Intervention/components/RootCauseAnalysis";
import SubLevelAnalysis from "../../../Intervention/components/SubLevelAnalysis";
import "./ArchiveIntervention.css";
import IndividualArchiveHeader from "./Individual-Archive-Header";
import IndividualArchiveHeaderInfoSummary from "./Individual-Archive-Header-info-Summary";

export default function InterventionArchive(): React.ReactElement {
  return (
    <div className="main-container">
      <IndividualArchiveHeader />
      <div className="cards">
        <IndividualArchiveHeaderInfoSummary />
        <AnalysisChart />
        <SubLevelAnalysis />
        <RootCauseAnalysis />
      </div>
    </div>
  );
}
