import { useDataEngine } from "@dhis2/app-runtime";
import { useSetting } from "@dhis2/app-service-datastore";
import { queue } from "async";
import { filter, isEmpty, uniqBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { BNA_DASHBOARDS_PREFIX, DATA_MIGRATION_CHECK } from "../../../constants/dataStore";
import { AuthorizedInterventionSummary } from "../../../core/state/intervention";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";
import { OldInterventionConfig } from "../../../shared/interfaces/oldInterventionConfig";
import { getInterventionKeys } from "../../../shared/services/getInterventions";
import getOldInterventions, { getOldInterventionKeys } from "../../../shared/services/getOldInterventions";
import { createInterventionSummaries, uploadInterventionSummary } from "../../../shared/services/interventionSummary";
import { RootCauseConfig } from "../../Intervention/components/RootCauseAnalysis/state/config";
import { convertIntervention, migrateIntervention, migrateRootCauseDataByIntervention } from "../services/migrate";

export default function useMigrate(onComplete: () => void): { error: any; progress: number; totalMigration: number } {
  const interventionSummary = useRecoilValue(AuthorizedInterventionSummary);
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
  const [, { set: setSkipMigration }] = useSetting(DATA_MIGRATION_CHECK, { global: true });

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
            await uploadInterventionSummary(engine, uniqBy([...(interventionSummary ?? []), ...summaries], "id"));
            setSkipMigration(true);
            onComplete();
          });
        } else {
          setSkipMigration(true);
          onComplete();
        }
      } catch (e) {
        setError(e);
      }
    }

    effect();
  }, [engine, interventionSummary, onComplete, setSkipMigration]);

  return {
    error,
    progress,
    totalMigration,
  };
}
