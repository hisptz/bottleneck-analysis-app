import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilRefresher_UNSTABLE, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { UserState } from "../../../../../../../../../core/state/user";
import { createArchive, uploadArchive } from "../../../../../../../../../shared/services/archives";
import { InterventionArchiveIds } from "../../../../../../../state/archiving";
import { InterventionState } from "../../../../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../../../../state/selections";
import { ChartData } from "../../../../../../AnalysisChart/state/data";
import { RootCauseData } from "../../../../../../RootCauseAnalysis/state/data";
import { SubLevelAnalyticsData } from "../../../../../../SubLevelAnalysis/state/data";

export default function useArchive(onClose: () => void) {
  const { id } = useParams<{ id: string }>();
  const engine = useDataEngine();
  const [archiving, setArchiving] = useState(false);
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));
  const period = useRecoilValue(InterventionPeriodState(id));
  const [remarks, setRemarks] = useState<string | undefined>();
  const intervention = useRecoilValue(InterventionState(id));
  const interventionArchivesState = useRecoilValueLoadable(InterventionArchiveIds(id));
  const resetInterventionArchiveState = useRecoilRefresher_UNSTABLE(InterventionArchiveIds(id));

  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const archiveExists = useMemo(() => {
    if (interventionArchivesState.state !== "hasValue") {
      return;
    }
    return interventionArchivesState.contents.includes(`${id}_${orgUnit.id}_${period.id}`);
  }, [id, interventionArchivesState.contents, interventionArchivesState.state, orgUnit.id, period.id]);

  const onArchiveClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        if (remarks) {
          try {
            setArchiving(true);
            const intervention = await snapshot.getPromise(InterventionState(id));
            const user = await snapshot.getPromise(UserState);
            const chartAnalytics = await snapshot.getPromise(ChartData(id));
            const subLevelAnalytics = await snapshot.getPromise(SubLevelAnalyticsData(id));
            const rootCauseData = await snapshot.getPromise(RootCauseData(id));
            const archive = createArchive({
              intervention,
              chartAnalytics,
              subLevelAnalytics,
              user,
              orgUnit: orgUnit.id,
              period: period.id,
              remarks,
              rootCauseData,
            });
            await uploadArchive(engine, archive, archiveExists);
            show({
              message: i18n.t("Intervention successfully archived"),
              type: { success: true },
            });
            setArchiving(false);
            resetInterventionArchiveState();
            onClose();
          } catch (e: any) {
            show({
              message: e.message,
              type: { info: true },
            });
            setArchiving(false);
          }
        }
      },
    [engine, id, onClose, orgUnit.id, period.id, remarks, show]
  );
  console.log(interventionArchivesState);

  return {
    onArchiveClick,
    archiving,
    remarks,
    setRemarks,
    intervention,
    orgUnit,
    period,
    loading: interventionArchivesState.state === "loading",
    archiveExists,
  };
}