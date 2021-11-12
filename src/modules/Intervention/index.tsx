import React, { Suspense } from "react";
import "./intervention.css";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import AnalysisChart from "./components/AnalysisChart";
import InterventionDetails from "./components/Details";
import InterventionHeader from "./components/Header";
import RootCauseAnalysis from "./components/RootCauseAnalysis";
import SubLevelAnalysis from "./components/SubLevelAnalysis";
import { InterventionDetailsState } from "./state/intervention";

export default function Intervention() {
  const { id } = useParams<{ id: string }>();
  const showDetails = useRecoilValue(InterventionDetailsState(id));
  return (
    <div className="main-container">
      <InterventionHeader />
      <Suspense fallback={<FullPageLoader />}>
        <div className="cards">
          {showDetails && <InterventionDetails />}
          <AnalysisChart />
          <SubLevelAnalysis />
          <RootCauseAnalysis />
        </div>
      </Suspense>
    </div>
  );
}
