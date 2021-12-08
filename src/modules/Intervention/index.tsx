import React, { Suspense } from "react";
import "./intervention.css";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import InterventionError from "../../shared/components/errors/InterventionError";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import AnalysisChart from "./components/AnalysisChart";
import InterventionDetails from "./components/Details";
import FiltersArea from "./components/FiltersArea";
import InterventionHeader from "./components/Header";
import RootCauseAnalysis from "./components/RootCauseAnalysis";
import SubLevelAnalysis from "./components/SubLevelAnalysis";
import { InterventionDetailsState, InterventionState } from "./state/intervention";

export default function Intervention(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const showDetails = useRecoilValue(InterventionDetailsState(id));
  const reset = useRecoilRefresher_UNSTABLE(InterventionState(id));

  return (
    <div className="main-container">
      <InterventionHeader />
      <FiltersArea />
      <ErrorBoundary resetKeys={[id]} onReset={reset} FallbackComponent={InterventionError}>
        <Suspense fallback={<FullPageLoader />}>
          <div className="cards">
            {showDetails && <InterventionDetails />}
            <AnalysisChart />
            <SubLevelAnalysis />
            <RootCauseAnalysis />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
