import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { cloneDeep } from "lodash";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { AllInterventionSummary, AuthorizedInterventionSummary } from "../../../core/state/intervention";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";
import { InterventionState } from "../../Intervention/state/intervention";
import { createIntervention, updateIntervention } from "../services/save";
import { InterventionDirtyState } from "../state/data";
import { IsNewConfiguration, SelectedDeterminantIndex, SelectedIndicatorIndex } from "../state/edit";
import { validate } from "../utils/validators";

export default function useSaveIntervention(): {
  saving: boolean;
  onSaveAndContinue: () => Promise<void>;
  saveAndContinueLoader: boolean;
  onSave: () => void;
  form: UseFormReturn<any>;
  onExitReset: () => void;
} {
  const history = useHistory();
  const [saving, setSaving] = useState(false);
  const [saveAndContinueLoader, setSavingAndContinueLoader] = useState(false);
  const engine = useDataEngine();
  const { id: interventionId } = useParams<{ id: string }>();
  const intervention = useRecoilValue(InterventionDirtyState(interventionId));
  const interventionSummaries = useRecoilValue(AuthorizedInterventionSummary);
  const resetIntervention = useRecoilRefresher_UNSTABLE(InterventionState(interventionId));
  const resetSummary = useRecoilRefresher_UNSTABLE(AllInterventionSummary);
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const form = useForm({
    defaultValues: {
      ...intervention,
    },
  });

  const onSaveTriggered = () => {
    onSave();
  };

  const onExitReset = useRecoilCallback(
    ({ reset }) =>
      () => {
        resetIntervention();
        resetSummary();
        reset(AuthorizedInterventionSummary);
        reset(InterventionDirtyState(interventionId));
        reset(SelectedDeterminantIndex(interventionId));
        reset(SelectedIndicatorIndex(interventionId));
        reset(IsNewConfiguration(interventionId));
        form.reset();
      },
    [form, interventionId, resetIntervention, resetSummary]
  );

  const onSave = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          setSaving(true);
          const data = form.getValues();
          const oldIntervention = cloneDeep(await snapshot.getPromise(InterventionDirtyState(interventionId))) as InterventionConfig;
          const newIntervention = {
            ...oldIntervention,
            ...data,
          };

          if (validate(newIntervention)) {
            if (!interventionId || interventionId !== newIntervention?.id) {
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
            onExitReset();
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
    [engine, form, history, interventionId, interventionSummaries, resetIntervention, resetSummary, show]
  );

  const onSaveAndContinue = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        await form.handleSubmit(async (data: any) => {
          setSavingAndContinueLoader(true);

          try {
            const data = form.getValues();
            const oldIntervention = cloneDeep(await snapshot.getPromise(InterventionDirtyState(interventionId))) as InterventionConfig;
            const newIntervention = {
              ...oldIntervention,
              ...data,
            };

            if (!interventionId || interventionId !== newIntervention?.id) {
              await createIntervention(engine, newIntervention, interventionSummaries ?? []);
              resetIntervention();
              resetSummary();
              set(IsNewConfiguration(newIntervention?.id), true);
              history.replace(`${newIntervention?.id}/configuration`);
            } else {
              await updateIntervention(engine, newIntervention, interventionSummaries ?? []);
            }
          } catch (e: any) {
            show({
              message: e.message ?? e.toString(),
              type: { info: true },
            });
          }
          setSavingAndContinueLoader(false);
        })();
      },
    [engine, history, interventionId, interventionSummaries, resetIntervention, resetSummary, show]
  );

  return {
    onSave: onSaveTriggered,
    saving,
    onSaveAndContinue,
    saveAndContinueLoader,
    form,
    onExitReset,
  };
}
