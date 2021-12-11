import { Steps } from "intro.js-react";
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { INTERVENTION_DETERMINANT_CONFIGURATION_HELP } from "../../../../constants/help/intervention-configuration";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import { SelectedIndicatorId } from "../../state/edit";
import HelpState from "./../../../Intervention/state/help";
import DeterminantArea from "./components/DeterminantArea";
import IndicatorConfiguration from "./components/IndicatorConfiguration";
import "./Determinant.css";

export default function DeterminantsConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const selectedIndicator = useRecoilValue(SelectedIndicatorId(id));

  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);

  const onHelpExit = () => {
    setHelpEnabled(false);
  };

  return (
    <div className="determinant-main-container">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_DETERMINANT_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />

      <div className="determinant-area-container">
        <DeterminantArea />
      </div>
      <div className="indicator-configuration-container">{selectedIndicator && <IndicatorConfiguration />}</div>
    </div>
  );
}
