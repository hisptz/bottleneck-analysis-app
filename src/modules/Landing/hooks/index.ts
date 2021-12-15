import { useSetting } from "@dhis2/app-service-datastore";
import { head, isEmpty } from "lodash";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DATA_MIGRATION_CHECK } from "../../../constants/dataStore";
import { InterventionSummary } from "../../../core/state/intervention";
import { InterventionSummary as InterventionSummaryType } from "../../../shared/interfaces/interventionConfig";

export function useAppInit(): void {
  const history = useHistory();
  const interventionSummary = useRecoilValue(InterventionSummary);
  const [migration] = useSetting(DATA_MIGRATION_CHECK, { global: true });
  useEffect(() => {
    function navigate() {
      if (!migration) {
        history.replace("/migrate");
        return;
      }
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
  }, [history, interventionSummary, migration]);
}
