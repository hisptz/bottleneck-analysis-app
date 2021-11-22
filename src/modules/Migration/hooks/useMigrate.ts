import { useDataEngine } from "@dhis2/app-runtime";
import { queue } from "async";
import { filter, isEmpty, uniqBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { BNA_DASHBOARDS_PREFIX } from "../../../constants/dataStore";
import { InterventionSummary } from "../../../core/state/intervention";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";
import { OldInterventionConfig } from "../../../shared/interfaces/oldInterventionConfig";
import { getInterventionKeys } from "../../../shared/services/getInterventions";
import getOldInterventions, { getOldInterventionKeys } from "../../../shared/services/getOldInterventions";
import { createInterventionSummaries, uploadInterventionSummary } from "../../../shared/services/interventionSummary";
import { RootCauseConfig } from "../../Intervention/components/RootCauseAnalysis/state/config";
import { convertIntervention, migrateIntervention, migrateRootCauseDataByIntervention } from "../services/migrate";

export default function useMigrate(onComplete: () => void) {
  const interventionSummary = useRecoilValue(InterventionSummary);
  const [error, setError] = useState<any>();
  const [progress, setProgress] = useState<number>(0);
  const [totalMigration, setTotalMigration] = useState<number>(0);
  const rootCauseConfig = useRecoilValue(RootCauseConfig);
  const migrate = async (intervention: InterventionConfig) => {
    await migrateIntervention(intervention, engine);
    await migrateRootCauseDataByIntervention(engine, intervention.id, rootCauseConfig);
  };
  const q = useRef(queue(migrate));
  const engine = useDataEngine();
  useEffect(() => {
    async function effect() {
      try {
        const interventionKeys: Array<string> = await getInterventionKeys(engine);
        const oldInterventionsKeys: Array<string> = await getOldInterventionKeys(engine);
        const filteredKeys: Array<string> = filter(oldInterventionsKeys, (key: string) => {
          const sanitizedKey = key.replace(BNA_DASHBOARDS_PREFIX, "");
          return !interventionKeys.includes(sanitizedKey);
        });
        if (!isEmpty(filteredKeys)) {
          setTotalMigration(filteredKeys.length);
          const oldInterventions: Array<OldInterventionConfig> = await getOldInterventions(engine, filteredKeys);
          const newInterventions = oldInterventions.map(convertIntervention);
          const summaries = createInterventionSummaries(newInterventions);
          q.current.push(newInterventions, (err) => {
            if (!err) {
              setProgress((prevState) => prevState + 1);
            }
          });
          q.current.drain(async () => {
            await uploadInterventionSummary(uniqBy([...(interventionSummary ?? []), ...summaries], "id"), engine);
            onComplete();
          });
        } else {
          onComplete();
        }
      } catch (e) {
        setError(e);
      }
    }

    effect();
  }, []);

  return {
    error,
    progress,
    totalMigration,
  };
}
