import { Steps } from "intro.js-react";
import React from "react";
import "./General.css";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { INTERVENTION_CONFIGURATION_HELP } from "../../../../constants/help/intervention-configuration";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import { InterventionDirtyState } from "../../state/data";
import HelpState from "./../../../Intervention/state/help";
import InterventionConfigDetails from "./components/InterventionConfigDetails";
import { LegendDefinitionConfigDetails } from "./components/LegendDefinitionConfigDetails";

export default function GeneralConfigurationComponent() {
  const { id: interventionId } = useParams<{ id: string }>();
  const intervention = useRecoilValue(InterventionDirtyState(interventionId));
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);
  const form = useForm({
    defaultValues: {
      name: intervention?.name,
      description: intervention?.description,
      periodSelection: intervention?.periodSelection,
      orgUnitSelection: intervention?.orgUnitSelection,
      legendDefinition: intervention?.dataSelection.legendDefinitions,
      dataSelection: intervention?.dataSelection,
    },
  });

  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  return (
    <FormProvider {...form}>
      <div className="general-config-container">
        <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
        <InterventionConfigDetails />
        <LegendDefinitionConfigDetails />
      </div>
    </FormProvider>
  );
}
