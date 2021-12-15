import { head, isEmpty } from "lodash";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionSummary } from "../../../core/state/intervention";
import { InterventionSummary as InterventionSummaryType } from "../../../shared/interfaces/interventionConfig";

export function useAppInit(): void {
  const history = useHistory();
  const interventionSummary = useRecoilValue(InterventionSummary);
  useEffect(() => {
    function navigate() {
      if (interventionSummary && !isEmpty(interventionSummary)) {
        const firstIntervention: InterventionSummaryType | undefined = head(interventionSummary);
        if (firstIntervention) {
          history.replace(`/interventions/${firstIntervention?.id}`);
        } else {
          history.replace("/no-interventions");
        }
      } else {
        history.replace("/no-interventions");
      }
    }

    navigate();
  }, [history, interventionSummary]);
}
