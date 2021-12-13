import i18n from "@dhis2/d2-i18n";
import { Button, colors, IconArchive24 } from "@dhis2/ui";
import React from "react";
import { useHistory } from "react-router-dom";
import InterventionError from "../../../../shared/components/errors/InterventionError";
import { ErrorBoundaryComponentProps } from "../../../../shared/interfaces/error";

export default function NoArchivesFound({ error, resetErrorBoundary }: ErrorBoundaryComponentProps): React.ReactElement {
  const history = useHistory();

  if (error?.details?.httpStatusCode === 404)
    return (
      <div className="column w-100 h-100 center align-center gap">
        <span className="icon-72">
          <IconArchive24 color={colors.grey700} />
        </span>
        <h2 style={{ color: colors.grey800, margin: 0 }}>{i18n.t("There are currently no archived interventions")}</h2>
        <Button primary onClick={() => history.replace("/")}>
          {i18n.t("Back To Interventions")}
        </Button>
      </div>
    );
  return <InterventionError error={error} resetErrorBoundary={resetErrorBoundary} />;
}
