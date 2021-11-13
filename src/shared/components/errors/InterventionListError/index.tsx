import "./intervention-list-error.css";
import i18n from "@dhis2/d2-i18n";
import { Button, colors, IconError24 } from "@dhis2/ui";
import React from "react";
import { ErrorBoundaryComponentProps } from "../../../interfaces/error";

export default function InterventionListError({ error, resetErrorBoundary }: ErrorBoundaryComponentProps) {
  return (
    <div className="row w-100 center align-center gap">
      <IconError24 size={"24px"} color={colors.grey700} />
      <p style={{ color: colors.grey700 }} className="error-text">
        {error?.message ?? i18n.t("Something went wrong. Please check the console for more details")}
      </p>
      {resetErrorBoundary ? <Button>{i18n.t("Try again")}</Button> : null}
    </div>
  );
}
