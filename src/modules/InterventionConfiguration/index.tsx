import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, IconDelete24, IconQuestion16 } from "@dhis2/ui";
import { ConfigurationStepper } from "@hisptz/react-ui";
import { findIndex } from "lodash";
import React, { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { UserAuthority, UserAuthorityOnIntervention } from "../../core/state/user";
import AuthorityError from "../../shared/components/errors/AuthorityError";
import InterventionAccessError from "../../shared/components/errors/InterventionAccessError";
import HelpState from "../Intervention/state/help";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import "./InterventionConfiguration.css";
import useDelete from "./hooks/delete";
import useSaveIntervention from "./hooks/save";
import { InterventionDirtySelector } from "./state/data";
import { ActiveStep } from "./state/edit";
import { FormProvider } from "react-hook-form";
import { CONFIG_STEPS } from "./constants/steps";
import { DevTool } from "@hookform/devtools";
import { ConfigStep } from "./interfaces";

export default function InterventionConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const authorities = useRecoilValue(UserAuthority);
  const access = useRecoilValue(UserAuthorityOnIntervention(id));
  const interventionName = useRecoilValue(InterventionDirtySelector({ id, path: ["name"] }));
  const onSetHelper = useSetRecoilState(HelpState);
  const { form, saving, onSave, onSaveAndContinue: onSaveFormAndContinue, saveAndContinueLoader, onExitReset } = useSaveIntervention();
  const [activeStep, setActiveStep] = useRecoilState<ConfigStep | undefined>(ActiveStep(id));

  const steps = CONFIG_STEPS;

  const isLastStep = useMemo(() => {
    if (!activeStep) {
      return true;
    }
    return steps.length === findIndex(steps, (step) => step.label === activeStep.label) + 1;
  }, [activeStep, steps]);

  const history = useHistory();
  const { openDeleteConfirm, onDelete, onConfirmDelete, onDeleteCancel } = useDelete();

  const onStepChange = async (from: number, to: number) => {
    if (from > to) {
      return true;
    }
    return await form.trigger(activeStep?.validationKeys);
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
    const isValid = await form.trigger(activeStep?.validationKeys);

    if (isValid) {
      await onSaveFormAndContinue();
    }
  };

  const onSaveAndExit = async () => {
    if (await form.trigger(activeStep?.validationKeys)) {
      onSave();
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
        <h2 style={{ margin: 4 }}>{`${interventionName != "" ? "Edit intervention" : "New intervention"}`}</h2>
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
          {openDeleteConfirm &&
            <ConfirmDeleteDialog name={interventionName} hide={!openDeleteConfirm} onClose={onDeleteCancel} onConfirm={onConfirmDelete} />}
        </div>
      </div>
      <div className="flex-1">
        <FormProvider {...form}>
          <DevTool /> {/* set up the dev tool */}
          <ConfigurationStepper
            activeStep={activeStep as any}
            setActiveStep={setActiveStep as any}
            onStepChange={onStepChange}
            steps={steps}
            onLastAction={onSave}
            activeStepperBackGroundColor={"#00695c"}
            onCancelLastAction={onExit}
            onLastActionButtonName={saving ? `${i18n.t("Saving")}...` : i18n.t("Save")}
          />
        </FormProvider>
      </div>
      <ButtonStrip middle>
        <Button loading={saving} dataTest={"save-exit-intervention-button"} onClick={onSaveAndExit}
                disabled={saving || saveAndContinueLoader}>
          {saving ? `${i18n.t("Saving")}...` : i18n.t("Save and Exit")}
        </Button>
        {!isLastStep && (
          <Button loading={saveAndContinueLoader} dataTest={"save-continue-intervention-button"} onClick={onSaveAndContinue}
                  disabled={saveAndContinueLoader}>
            {saving ? `${i18n.t("Saving")}...` : i18n.t("Save and Continue")}
          </Button>
        )}
        <Button onClick={onExit}>{i18n.t("Exit Without Saving")}</Button>
      </ButtonStrip>
    </div>
  );
}
