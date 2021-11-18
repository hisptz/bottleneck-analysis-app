import { Divider } from "@dhis2/ui";
import React from "react";
import Header from "./components/InterventionHeader";
import "./intervention-header.css";
import { useResetRecoilState } from "recoil";
import { InterventionSummary } from "../../../../core/state/intervention";
import InterventionListError from "../../../../shared/components/errors/InterventionListError";
import InterventionList from "./components/InterventionList";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";

export default function InterventionHeader() {
  const { id } = useParams<{ id: string }>();
  const resetInterventionList = useResetRecoilState(InterventionSummary);
  return (
    <div className="header-container">
      <ErrorBoundary resetKeys={[id]} onReset={resetInterventionList} FallbackComponent={InterventionListError}>
        <InterventionList />
        <Divider margin={"0"} />
        <Header />
      </ErrorBoundary>
    </div>
  );
}
