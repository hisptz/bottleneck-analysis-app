import React from "react";
import "./General.css";
import { useRecoilState } from "recoil";
import { INTERVENTION_CONFIGURATION_HELP } from "../../../../constants/help/intervention-configuration";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import HelpState from "./../../../Intervention/state/help";
import InterventionConfigDetails from "./components/InterventionConfigDetails";
import { LegendDefinitionConfigDetails } from "./components/LegendDefinitionConfigDetails";
import { Steps } from "intro.js-react";

export default function GeneralConfigurationComponent() {
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);

  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  return (
    <div className="general-config-container">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
      <div className="general-config-area-1">
        <InterventionConfigDetails />
      </div>
      <div className="general-config-area-2">
        <div className="column gap">
          <LegendDefinitionConfigDetails />
        </div>
      </div>
    </div>
  );
}
