import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { AllInterventionSummary, AuthorizedInterventionSummary } from "../../../core/state/intervention";
import { InterventionState } from "../../Intervention/state/intervention";
import { createIntervention, updateIntervention } from "../services/save";
import { InterventionDirtyState } from "../state/data";
import { SelectedDeterminantIndex, SelectedIndicatorIndex } from "../state/edit";
import { validate } from "../utils/validators";

export default function useSaveIntervention(handleSubmit: (fun: (data: any) => void) => () => void): { onSave: () => void; saving: boolean } {
  const history = useHistory();
  const [saving, setSaving] = useState(false);
  const engine = useDataEngine();
  const { id } = useParams<{ id: string }>();
  const interventionSummaries = useRecoilValue(AuthorizedInterventionSummary);
  const resetIntervention = useRecoilRefresher_UNSTABLE(InterventionState(id));
  const resetSummary = useRecoilRefresher_UNSTABLE(AllInterventionSummary);
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const onSaveTriggered = () => {
    handleSubmit(onSave)();
  };

  const onSave = useRecoilCallback(
    ({ reset, snapshot }) =>
      async (data: any) => {
        try {
          setSaving(true);
          const newIntervention = { ...(await snapshot.getPromise(InterventionDirtyState(id))), ...data };

          if (validate(newIntervention)) {
            if (!id || id !== newIntervention?.id) {
              await createIntervention(engine, newIntervention, interventionSummaries ?? []);
              show({
                message: i18n.t("Intervention created successfully"),
                type: { success: true },
              });
            } else {
              await updateIntervention(engine, newIntervention, interventionSummaries ?? []);
              show({
                message: i18n.t("Changes saved successfully"),
                type: { success: true },
              });
            }
            reset(AuthorizedInterventionSummary);
            reset(InterventionDirtyState(id));
            reset(SelectedDeterminantIndex(id));
            reset(SelectedIndicatorIndex(id));
            resetSummary();
            resetIntervention();
            history.replace(`/interventions/${newIntervention.id}`);
          } else {
            show({
              message: i18n.t("Intervention name is required. Please provide on in the general page."),
              type: { info: true },
            });
          }
          setSaving(false);
        } catch (e: any) {
          show({
            message: e.message ?? e.toString(),
            type: { info: true },
          });
          setSaving(false);
        }
      },
    [engine, history, id, interventionSummaries, resetIntervention, show]
  );

  return {
    onSave: onSaveTriggered,
    saving,
  };
}
