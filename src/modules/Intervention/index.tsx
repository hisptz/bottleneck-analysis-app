import { Steps } from "intro.js-react";
import React, { Suspense } from "react";
import "./intervention.css";
import { useRecoilState } from "recoil";
import { INTERVENTION_HELP_STEPS } from "../../constants/help/Intervention";
import { STEP_OPTIONS } from "../../constants/help/options";
import HelpState from "../../modules/Intervention/state/help";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import InterventionHeader from "./components/Header";
import InterventionBody from "./components/InterventionBody";

export default function Intervention(): React.ReactElement {
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);
  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  return (
    <div className="main-container">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_HELP_STEPS} onExit={onHelpExit} initialStep={0} />
      <InterventionHeader />
      <Suspense fallback={<FullPageLoader />}>
        <InterventionBody />
      </Suspense>
    </div>
  );
}
