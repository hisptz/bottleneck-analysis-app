import "./intervention-error.css";
import i18n from "@dhis2/d2-i18n";
import { Button, colors, IconError24 } from "@dhis2/ui";
import React from "react";
import { ErrorBoundaryComponentProps } from "../../../interfaces/error";

export default function InterventionError({ error, resetErrorBoundary }: ErrorBoundaryComponentProps): React.ReactElement {
  return (
    <div className="loader-container">
      <span className="icon-36">
        <IconError24 color={colors.grey700} />
      </span>
      <h3 style={{ color: colors.grey700 }} className="error-text">
        {error?.message ?? i18n.t("Something went wrong. Please check the console for more details")}
      </h3>
      {resetErrorBoundary ? <Button onClick={resetErrorBoundary}>{i18n.t("Try again")}</Button> : null}
    </div>
  );
}
