import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import ArchiveErrorBoundary from "./components/ArchiveErrorBoundary";
import NoArchivesFound from "./components/NoArchivesFound";

export default function Archive(): React.ReactElement {
  return (
    <ErrorBoundary FallbackComponent={NoArchivesFound}>
      <ArchiveErrorBoundary />
    </ErrorBoundary>
  );
}
