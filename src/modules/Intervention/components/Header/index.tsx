import { Divider } from "@dhis2/ui";
import React, { Suspense } from "react";
import Header from "./components/InterventionHeader";
import "./intervention-header.css";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { AllInterventionSummary } from "../../../../core/state/intervention";
import InterventionListError from "../../../../shared/components/errors/InterventionListError";
import InterventionList from "./components/InterventionList";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";

export default function InterventionHeader(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const resetInterventionList = useRecoilRefresher_UNSTABLE(AllInterventionSummary);
  return (
    <div className="header-container">
      <ErrorBoundary resetKeys={[id]} onReset={resetInterventionList} FallbackComponent={InterventionListError}>
        <InterventionList />
        <Divider margin={"0"} />
        <Suspense fallback={<div />}>
          <Header />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
