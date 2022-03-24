import { Steps } from "intro.js-react";
import React, { Suspense } from "react";
import "./Access.css";
import { useRecoilState } from "recoil";
import { INTERVENTION_ACCESS_CONFIGURATION_HELP } from "../../../../constants/help/intervention-configuration";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import HelpState from "./../../../Intervention/state/help";
import TabbedContent from "./component/TabbedContent";

export default function AccessConfiguration(): React.ReactElement {
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);

  const onHelpExit = () => {
    setHelpEnabled(false);
  };
  return (
    <div className="accessConfig">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_ACCESS_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
      <div className="access-config-body accessConfig-helper">
        <Suspense fallback={<div>Loading...</div>}>
          <TabbedContent />
        </Suspense>
      </div>
    </div>
  );
}
