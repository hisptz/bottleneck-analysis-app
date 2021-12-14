import { Steps } from "intro.js-react";
import React, { Suspense } from "react";
import "./intervention.css";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from "recoil";
import { INTERVENTION_HELP_STEPS } from "../../constants/help/Intervention";
import { STEP_OPTIONS } from "../../constants/help/options";
import { UserAuthority } from "../../core/state/user";
import HelpState from "../../modules/Intervention/state/help";
import AuthorityError from "../../shared/components/errors/AuthorityError";
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
  const authorities = useRecoilValue(UserAuthority);
  const showDetails = useRecoilValue(InterventionDetailsState(id));
  const reset = useRecoilRefresher_UNSTABLE(InterventionState(id));
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);
  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  if (!authorities?.intervention?.view) {
    return <AuthorityError actionType={"view"} />;
  }

  return (
    <div className="main-container">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_HELP_STEPS} onExit={onHelpExit} initialStep={0} />
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
