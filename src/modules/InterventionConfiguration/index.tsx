import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, IconDelete24, IconQuestion16 } from "@dhis2/ui";
import { ConfigurationStepper } from "@hisptz/react-ui";
import { findIndex } from "lodash";
import React, { useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserAuthority, UserAuthorityOnIntervention } from "../../core/state/user";
import AuthorityError from "../../shared/components/errors/AuthorityError";
import InterventionAccessError from "../../shared/components/errors/InterventionAccessError";
import HelpState from "../Intervention/state/help";
import AccessConfigurationComponent from "./components/Access";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import DeterminantsConfigurationComponent from "./components/Determinants";
import GeneralConfigurationComponent from "./components/General";
import "./InterventionConfiguration.css";
import useDelete from "./hooks/delete";
import useSaveIntervention from "./hooks/save";
import { InterventionDirtySelector } from "./state/data";
import { IsNewConfiguration } from "./state/edit";

export default function InterventionConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const isNew = useRecoilValue(IsNewConfiguration(id));
  const authorities = useRecoilValue(UserAuthority);
  const access = useRecoilValue(UserAuthorityOnIntervention(id));
  const interventionName = useRecoilValue(InterventionDirtySelector({ id, path: ["name"] }));
  const onSetHelper = useSetRecoilState(HelpState);
  const {
    accessForm,
    generalForm,
    determinantsForm,
    saving,
    onSave,
    onSaveAndContinue: onSaveFormAndContinue,
    saveAndContinueLoader,
    onExitReset,
  } = useSaveIntervention();

  const steps = useMemo(
    () => [
      {
        label: "General",
        component: () => <GeneralConfigurationComponent form={generalForm} />,
        helpSteps: [],
      },
      {
        label: "Determinants",
        component: () => <DeterminantsConfigurationComponent form={determinantsForm} />,
        helpSteps: [],
      },
      {
        label: "Access",
        component: () => <AccessConfigurationComponent form={accessForm} />,
        helpSteps: [],
      },
    ],
    [accessForm, determinantsForm, generalForm]
  );
  const [activeStep, setActiveStep] = useState<any>(isNew ? steps[1] : steps[0]);

  const isLastStep = useMemo(() => {
    return steps.length === findIndex(steps, (step) => step.label === activeStep.label) + 1;
  }, [activeStep, steps]);

  const history = useHistory();
  const { openDeleteConfirm, onDelete, onConfirmDelete, onDeleteCancel } = useDelete();

  const onStepChange = async (from: number) => {
    if (from === 0) {
      return await generalForm.trigger();
    }
    if (from === 1) {
      return await determinantsForm.trigger();
    }
    if (from === 2) {
      return await accessForm.trigger();
    }
    return true;
  };

  const onExit = () => {
    onExitReset();
    if (id) {
      history.replace(`/interventions/${id}`);
    } else {
      history.replace("/");
    }
  };

  const onSaveAndContinue = async () => {
    if (activeStep.label === "General") {
      const isValid = await generalForm.trigger();
      if (isValid) {
        await onSaveFormAndContinue(generalForm, "General");
        setActiveStep((prevStep: any) => {
          const stepIndex = findIndex(steps, (step: any) => step.label === prevStep.label);
          if (stepIndex < steps.length - 1) {
            return steps[stepIndex + 1];
          }
        });
      }
    }
    if (activeStep.label === "Determinants") {
      const isValid = await determinantsForm.trigger();
      if (isValid) {
        await onSaveFormAndContinue(determinantsForm, "Determinants");
        setActiveStep((prevStep: any) => {
          const stepIndex = findIndex(steps, (step: any) => step.label === prevStep.label);
          if (stepIndex < steps.length - 1) {
            return steps[stepIndex + 1];
          }
        });
      }
    }
  };

  if (!authorities?.intervention?.edit) {
    return <AuthorityError actionType={"edit"} />;
  }

  if (id && !access?.write) {
    return <InterventionAccessError access={access} />;
  }

  return (
    <div className="configuration-main-container">
      <div className="stepper-config-header">
        <h2 style={{ margin: 4 }}>{`${i18n.t("Manage")} ${interventionName ?? "new intervention"}`}</h2>
        <div className="config-intial-action">
          <Button
            onClick={() => {
              onSetHelper(true);
            }}
            icon={<IconQuestion16 color="#212529" />}>
            {i18n.t("Help")}
          </Button>
          {id && authorities?.intervention?.delete && (
            <Button onClick={onDelete} icon={<IconDelete24 />}>
              {i18n.t("Delete")}
            </Button>
          )}
          {openDeleteConfirm && <ConfirmDeleteDialog name={interventionName} hide={!openDeleteConfirm} onClose={onDeleteCancel} onConfirm={onConfirmDelete} />}
        </div>
      </div>
      <div className="flex-1">
        <ConfigurationStepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          onStepChange={onStepChange}
          steps={steps}
          onLastAction={onSave}
          activeStepperBackGroundColor={"#00695c"}
          onCancelLastAction={onExit}
          onLastActionButtonName={saving ? `${i18n.t("Saving")}...` : i18n.t("Save")}
        />
      </div>
      <ButtonStrip middle>
        <Button loading={saving} dataTest={"save-exit-intervention-button"} onClick={onSave} disabled={saving || saveAndContinueLoader}>
          {saving ? `${i18n.t("Saving")}...` : i18n.t("Save and Exit")}
        </Button>
        {!isLastStep && (
          <Button loading={saveAndContinueLoader} dataTest={"save-exit-intervention-button"} onClick={onSaveAndContinue} disabled={saveAndContinueLoader}>
            {saving ? `${i18n.t("Saving")}...` : i18n.t("Save and Continue")}
          </Button>
        )}
        <Button onClick={onExit}>{i18n.t("Exit Without Saving")}</Button>
      </ButtonStrip>
    </div>
  );
}
