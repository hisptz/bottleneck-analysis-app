import { Steps } from "intro.js-react";
import React from "react";
import "./General.css";
import { FormProvider } from "react-hook-form";
import { useRecoilState } from "recoil";
import { INTERVENTION_CONFIGURATION_HELP } from "../../../../constants/help/intervention-configuration";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import HelpState from "./../../../Intervention/state/help";
import InterventionConfigDetails from "./components/InterventionConfigDetails";
import { LegendDefinitionConfigDetails } from "./components/LegendDefinitionConfigDetails";
import MapConfiguration from "./components/MapConfiguration";

export default function GeneralConfigurationComponent({ form }: { form: any }) {
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);

  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  return (
    <FormProvider {...form}>
      <div className="general-config-container">
        <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
        <div className="general-config-area-1">
          <InterventionConfigDetails />
        </div>
        <div className="general-config-area-2">
          <div className="column gap">
            <LegendDefinitionConfigDetails />
            <MapConfiguration />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
