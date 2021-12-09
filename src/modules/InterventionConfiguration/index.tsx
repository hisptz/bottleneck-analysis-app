import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, IconDelete24 } from "@dhis2/ui";
import { ConfigurationStepper } from "@hisptz/react-ui";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AccessConfigurationComponent from "./components/Access";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import DeterminantsConfigurationComponent from "./components/Determinants";
import GeneralConfigurationComponent from "./components/General";
import "./InterventionConfiguration.css";
import useDelete from "./hooks/delete";
import useSaveIntervention from "./hooks/save";
import { InterventionDirtySelector, InterventionDirtyState } from "./state/data";

export default function InterventionConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const interventionName = useRecoilValue(InterventionDirtySelector({ id, path: ["name"] }));
  const intervention = useRecoilValue(InterventionDirtyState(id));
  const form = useForm({
    defaultValues: {
      name: intervention.name,
      description: intervention.description,
      periodType: intervention.periodType,
      orgUnitSelection: intervention.orgUnitSelection,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const history = useHistory();
  const { saving, onSave } = useSaveIntervention(form.handleSubmit);
  const { openDeleteConfirm, onDelete, onConfirmDelete, onDeleteCancel } = useDelete();

  const onExit = () => {
    if (id) {
      history.replace(`/interventions/${id}`);
    } else {
      window.location.replace("/");
    }
  };

  return (
    <FormProvider {...form}>
      <div className="configuration-main-container">
        <div className="stepper-config-header">
          <h2 style={{ margin: 4 }}>{`${i18n.t("Manage")} ${interventionName ?? "new intervention"}`}</h2>
          {id && (
            <Button onClick={onDelete} icon={<IconDelete24 />}>
              {i18n.t("Delete")}
            </Button>
          )}
          {openDeleteConfirm && <ConfirmDeleteDialog name={interventionName} hide={!openDeleteConfirm} onClose={onDeleteCancel} onConfirm={onConfirmDelete} />}
        </div>
        <div className="flex-1">
          <ConfigurationStepper
            stepsManagement={[
              {
                label: "General",
                component: GeneralConfigurationComponent,
                helpSteps: [],
              },
              {
                label: "Determinants",
                component: DeterminantsConfigurationComponent,
                helpSteps: [],
              },
              {
                label: "Access",
                component: AccessConfigurationComponent,
                helpSteps: [],
              },
            ]}
            onLastAction={onSave}
            activeStepperBackGroundColor={"#00695c"}
            onCancelLastAction={onExit}
            onLastActionButtonName={saving ? `${i18n.t("Saving")}...` : i18n.t("Save")}
          />
        </div>
        <ButtonStrip middle>
          <Button loading={saving} onClick={onSave} disabled={saving} color={"blue"}>
            {saving ? `${i18n.t("Saving")}...` : i18n.t("Save and Exit")}
          </Button>
          <Button onClick={onExit}>{i18n.t("Exit Without Saving")}</Button>
        </ButtonStrip>
      </div>
    </FormProvider>
  );
}
