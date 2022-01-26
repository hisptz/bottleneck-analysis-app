import { useDataEngine } from "@dhis2/app-runtime";
import { useSetting } from "@dhis2/app-service-datastore";
import { compact, filter, isEmpty, uniqBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
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
import useQueue from "./useQueue";

export default function useMigrate(onComplete: () => void): {
  error: any;
  progress: number;
  migrationStarted: boolean;
} {
  const interventionSummary = useRecoilValue(AuthorizedInterventionSummary);
  const [error, setError] = useState<any>();
  const rootCauseConfig = useRecoilValue(RootCauseConfig);
  const engine = useDataEngine();
  const [, { set: setSkipMigration }] = useSetting(DATA_MIGRATION_CHECK, { global: true });

  const migrate = useCallback(
    async (intervention: InterventionConfig) => {
      try {
        await migrateIntervention(intervention, engine);
        await migrateRootCauseDataByIntervention(engine, intervention.id, rootCauseConfig);
      } catch (e) {
        setError(e);
      }
    },
    [engine, rootCauseConfig]
  );

  const onMigrationComplete = useCallback(() => {
    setSkipMigration(true);
    onComplete();
  }, [onComplete, setSkipMigration]);

  const { add, started, progress, length } = useQueue({
    drain: onMigrationComplete,
    task: migrate,
  });

  const onMigrateTrigger = useCallback(async () => {
    try {
      const interventionKeys: Array<string> = await getInterventionKeys(engine);
      const oldInterventionsKeys: Array<string> = await getOldInterventionKeys(engine);
      const filteredKeys: Array<string> = filter(oldInterventionsKeys, (key: string) => {
        const sanitizedKey = key.replace(BNA_DASHBOARDS_PREFIX, "");
        return !interventionKeys.includes(sanitizedKey);
      });
      if (!isEmpty(filteredKeys)) {
        const oldInterventions: Array<OldInterventionConfig> = compact(await getOldInterventions(engine, filteredKeys));
        if (oldInterventions) {
          const newInterventions = oldInterventions.map(convertIntervention);
          const summaries = createInterventionSummaries(newInterventions);
          for (const intervention of newInterventions) {
            add(intervention);
          }
          await uploadInterventionSummary(engine, uniqBy([...(interventionSummary ?? []), ...summaries], "id"));
        }
      } else {
        setSkipMigration(true);
        onComplete();
      }
    } catch (e) {
      setError(e);
    }
  }, [add, engine, interventionSummary, onComplete, setSkipMigration]);

  useEffect(() => {
    onMigrateTrigger();
  }, []);

  return {
    error,
    progress: progress / (progress + length),
    migrationStarted: started,
  };
}
