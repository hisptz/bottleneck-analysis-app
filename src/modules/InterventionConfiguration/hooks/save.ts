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
import { generateDeterminantData, generateGeneralData } from "../utils/generators";
import { validate } from "../utils/validators";

export default function useSaveIntervention(): {
  saving: boolean;
  onSaveAndContinue: (args: any, key: string) => Promise<void>;
  saveAndContinueLoader: boolean;
  onSave: () => void;
  determinantsForm: UseFormReturn<any>;
  generalForm: UseFormReturn<any>;
  onExitReset: () => void;
  accessForm: UseFormReturn<any>;
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

  const generalForm = useForm({
    defaultValues: {
      name: intervention?.name,
      description: intervention?.description,
      periodSelection: intervention?.periodSelection,
      orgUnitSelection: intervention?.orgUnitSelection,
      legendDefinitions: intervention?.dataSelection.legendDefinitions,
      map: intervention?.map,
    },
  });
  const determinantsForm = useForm({
    defaultValues: {
      ...intervention?.dataSelection,
    },
  });
  const accessForm = useForm({
    defaultValues: {
      publicAccess: intervention?.publicAccess,
      userGroupAccess: intervention?.userGroupAccess,
      userAccess: intervention?.userAccess,
      user: intervention?.user,
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
        generalForm.reset();
        determinantsForm.reset();
        accessForm.reset();
      },
    [accessForm, determinantsForm, generalForm, interventionId, resetIntervention, resetSummary]
  );

  const onSave = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          setSaving(true);
          const generalData = generalForm.getValues();
          const determinantsData = determinantsForm.getValues();
          const newIntervention = cloneDeep(await snapshot.getPromise(InterventionDirtyState(interventionId))) as InterventionConfig;

          generateGeneralData(newIntervention, generalData);
          generateDeterminantData(newIntervention, determinantsData);

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
    [accessForm, determinantsForm, engine, generalForm, history, interventionId, interventionSummaries, resetIntervention, resetSummary, show]
  );

  const onSaveAndContinue = useRecoilCallback(
    ({ snapshot, set }) =>
      async (form: any, key: string) => {
        await form.handleSubmit(async (data: any) => {
          setSavingAndContinueLoader(true);

          try {
            const newIntervention = cloneDeep(await snapshot.getPromise(InterventionDirtyState(interventionId))) as InterventionConfig;

            if (key === "Determinants") {
              generateDeterminantData(newIntervention, data);
            }
            if (key === "General") {
              generateGeneralData(newIntervention, data);
            }

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
    generalForm,
    determinantsForm,
    accessForm,
    onExitReset,
  };
}
