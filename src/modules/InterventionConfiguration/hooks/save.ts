import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { InterventionSummary } from "../../../core/state/intervention";
import { InterventionState } from "../../Intervention/state/intervention";
import { createIntervention, updateIntervention } from "../services/save";
import { InterventionDirtyState } from "../state/data";

export default function useSaveIntervention(): { onSave: () => void; saving: boolean } {
  const history = useHistory();
  const [saving, setSaving] = useState(false);
  const engine = useDataEngine();
  const { id } = useParams<{ id: string }>();
  const interventionSummaries = useRecoilValue(InterventionSummary);
  const resetIntervention = useRecoilRefresher_UNSTABLE(InterventionState(id));
  const resetInterventionSummary = useRecoilRefresher_UNSTABLE(InterventionSummary);
  const newIntervention = useRecoilValue(InterventionDirtyState(id));
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const onSave = useRecoilCallback(() => async () => {
    try {
      setSaving(true);
      if (!id || id !== newIntervention.id) {
        await createIntervention(engine, newIntervention, interventionSummaries ?? []);
        resetInterventionSummary();
      } else {
        await updateIntervention(engine, newIntervention);
      }
      setSaving(false);
      resetIntervention();
      history.replace(`/interventions/${newIntervention.id}`);
      show({
        message: i18n.t("Changes Saved Successfully"),
        type: { success: true },
      });
    } catch (e: any) {
      show({
        message: e.message ?? e.toString(),
        type: { info: true },
      });
      setSaving(false);
    }
  });

  return {
    onSave,
    saving,
  };
}
