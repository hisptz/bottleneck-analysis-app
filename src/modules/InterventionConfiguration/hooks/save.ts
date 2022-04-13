import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { cloneDeep, findIndex } from "lodash";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { AllInterventionSummary, AuthorizedInterventionSummary } from "../../../core/state/intervention";
import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";
import { InterventionState } from "../../Intervention/state/intervention";
import { createIntervention, updateIntervention } from "../services/save";
import { InterventionDirtyState } from "../state/data";
import { ActiveStep, IsNewConfiguration, SelectedDeterminantIndex, SelectedIndicatorIndex } from "../state/edit";
import { validate } from "../utils/validators";
import { CONFIG_STEPS } from "../constants/steps";
import { ConfigStep } from "../interfaces";

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
  const activeStep: ConfigStep = useRecoilValue(ActiveStep(interventionId));

  const form = useForm({
    defaultValues: {
      ...intervention
    }

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
        reset(ActiveStep(interventionId));
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
            ...data
          };

          if (validate(newIntervention)) {
            if (!interventionId || interventionId !== newIntervention?.id) {
              await createIntervention(engine, newIntervention, interventionSummaries ?? []);
              show({
                message: i18n.t("Intervention created successfully"),
                type: { success: true }
              });
            } else {
              await updateIntervention(engine, newIntervention, interventionSummaries ?? []);
              show({
                message: i18n.t("Changes saved successfully"),
                type: { success: true }
              });
            }
            onExitReset();
            history.replace(`/interventions/${newIntervention.id}`);
          } else {
            show({
              message: i18n.t("Intervention name is required. Please provide on in the general page."),
              type: { info: true }
            });
          }
          setSaving(false);
        } catch (e: any) {
          show({
            message: e.message ?? e.toString(),
            type: { info: true }
          });
          setSaving(false);
        }
      },
    [engine, form, history, interventionId, interventionSummaries, resetIntervention, resetSummary, show]
  );

  const onSaveAndContinue = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        await form.trigger(activeStep?.validationKeys ?? [] as any);
        console.log(activeStep);
        await form.handleSubmit(async (data: any) => {
          setSavingAndContinueLoader(true);

          try {
            const oldIntervention = cloneDeep(await snapshot.getPromise(InterventionDirtyState(interventionId))) as InterventionConfig;
            const newIntervention = {
              ...oldIntervention,
              ...data
            };

            if (!interventionId || interventionId !== newIntervention?.id) {
              await createIntervention(engine, newIntervention, interventionSummaries ?? []);
              resetIntervention();
              resetSummary();
              const currentStep = await snapshot.getPromise(ActiveStep(interventionId));
              reset(ActiveStep(interventionId));
              set(ActiveStep(newIntervention?.id), (prevState) => {
                const index = findIndex(CONFIG_STEPS, { label: currentStep.label }) + 1;
                if (index < CONFIG_STEPS.length) {
                  return CONFIG_STEPS[index];
                }
                return prevState;
              });
              history.replace(`${newIntervention?.id}/configuration`);
            } else {
              await updateIntervention(engine, newIntervention, interventionSummaries ?? []);
              set(ActiveStep(newIntervention?.id), (prevState) => {
                const index = findIndex(CONFIG_STEPS, { label: prevState.label }) + 1;
                if (index < CONFIG_STEPS.length) {
                  return CONFIG_STEPS[index];
                }
                return prevState;
              });
            }
          } catch (e: any) {
            show({
              message: e.message ?? e.toString(),
              type: { info: true }
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
    onExitReset
  };
}
