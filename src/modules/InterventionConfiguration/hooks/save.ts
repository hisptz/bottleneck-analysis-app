import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilRefresher_UNSTABLE, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { InterventionSummary, RequestId } from "../../../core/state/intervention";
import { InterventionState } from "../../Intervention/state/intervention";
import { createIntervention, updateIntervention } from "../services/save";
import { InterventionDirtyState } from "../state/data";
import { SelectedDeterminantId, SelectedIndicatorId } from "../state/edit";

export default function useSaveIntervention(): { onSave: () => void; saving: boolean } {
  const history = useHistory();
  const [saving, setSaving] = useState(false);
  const engine = useDataEngine();
  const { id } = useParams<{ id: string }>();
  const interventionSummaries = useRecoilValue(InterventionSummary);
  const resetSummary = useResetRecoilState(InterventionSummary);
  const resetIntervention = useRecoilRefresher_UNSTABLE(InterventionState(id));
  const setRequestId = useSetRecoilState(RequestId);
  const newIntervention = useRecoilValue(InterventionDirtyState(id));
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const onSave = useRecoilCallback(({ set, reset }) => async () => {
    try {
      setSaving(true);
      if (!id || id !== newIntervention.id) {
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
      setSaving(false);
      set(RequestId, (prevState) => prevState + 1);
      reset(InterventionSummary);
      reset(InterventionDirtyState(id));
      reset(SelectedDeterminantId(id));
      reset(SelectedIndicatorId(id));
      resetIntervention();
      history.replace(`/interventions/${newIntervention.id}`);
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
