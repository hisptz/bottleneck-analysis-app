import { CircularLoader } from "@dhis2/ui";
import { head, isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionSummary } from "../../core/state/intervention";
import { InterventionSummary as InterventionSummaryType } from "../../shared/interfaces/interventionConfig";

export default function Landing() {
  const history = useHistory();
  const interventionSummary = useRecoilValue(InterventionSummary);
  useEffect(() => {
    function navigate() {
      if (interventionSummary && !isEmpty(interventionSummary)) {
        const firstDashboard: InterventionSummaryType | undefined = head(interventionSummary);
        if (firstDashboard) {
          history.replace(`/dashboards/${firstDashboard?.id}`);
        } else {
          history.replace("/no-interventions");
        }
      } else {
        history.replace("/no-interventions");
      }
    }
    navigate();
  }, [interventionSummary]);

  return (
    <div className="w-100 h-100 column center align-center">
      <CircularLoader />
    </div>
  );
}
