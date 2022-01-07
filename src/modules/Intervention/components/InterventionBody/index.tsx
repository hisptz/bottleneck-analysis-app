import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { InterventionDoesNotExist } from "../../../../core/state/intervention";
import { UserAuthority, UserAuthorityOnIntervention } from "../../../../core/state/user";
import AuthorityError from "../../../../shared/components/errors/AuthorityError";
import InterventionAccessError from "../../../../shared/components/errors/InterventionAccessError";
import InterventionError from "../../../../shared/components/errors/InterventionError";
import InterventionNotFoundError from "../../../../shared/components/errors/InterventionNotFoundError";
import FullPageLoader from "../../../../shared/components/loaders/FullPageLoader";
import { DisplayInterventionDetailsState, InterventionState } from "../../state/intervention";
import AnalysisChart from "../AnalysisChart";
import InterventionDetails from "../Details";
import FiltersArea from "../FiltersArea";
import RootCauseAnalysis from "../RootCauseAnalysis";
import SubLevelAnalysis from "../SubLevelAnalysis";

export default function InterventionBody(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const interventionDoesNotExist = useRecoilValue(InterventionDoesNotExist(id));
  const authorities = useRecoilValue(UserAuthority);
  const showDetails = useRecoilValue(DisplayInterventionDetailsState(id));
  const reset = useRecoilRefresher_UNSTABLE(InterventionState(id));
  const access = useRecoilValue(UserAuthorityOnIntervention(id));

  if (interventionDoesNotExist) {
    return <InterventionNotFoundError />;
  }

  if (!authorities?.intervention?.view) {
    return <AuthorityError actionType={"view"} />;
  }

  if (!access.read) {
    return <InterventionAccessError access={access} />;
  }

  return (
    <ErrorBoundary resetKeys={[id]} onReset={reset} FallbackComponent={InterventionError}>
      <Suspense fallback={<FullPageLoader />}>
        <FiltersArea />
        <div className="cards">
          {showDetails && <InterventionDetails />}
          <AnalysisChart />
          <SubLevelAnalysis />
          <RootCauseAnalysis />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
