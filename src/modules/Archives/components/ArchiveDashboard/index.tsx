import React from "react";
import AnalysisChart from "../../../Intervention/components/AnalysisChart";
import RootCauseAnalysis from "../../../Intervention/components/RootCauseAnalysis";
import SubLevelAnalysis from "../../../Intervention/components/SubLevelAnalysis";
import "./ArchiveIntervention.css";
import { Steps } from "intro.js-react";
import HelpState from "./../../../Intervention/state/help";
import IndividualArchiveHeader from "./Individual-Archive-Header";
import IndividualArchiveHeaderInfoSummary from "./Individual-Archive-Header-info-Summary";
import { ARCHIVE_INDIVIDUAL_INTERVENTION_CONFIGURATION_HELP } from "../../.././.././constants/help/Intervention";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import { useRecoilState, useRecoilValue } from "recoil";
import RemarksArea from "./RemarksArea";
import { UserAuthority } from "../../../../core/state/user";

export default function InterventionArchive(): React.ReactElement {
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);



  const onHelpExit = () => {
    setHelpEnabled(false);
  };
  return (
    <div className="main-container">
      <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={ARCHIVE_INDIVIDUAL_INTERVENTION_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
      <IndividualArchiveHeader />
      <div className="cards">
        <IndividualArchiveHeaderInfoSummary />
        <RemarksArea />
        <AnalysisChart />
        <SubLevelAnalysis />
        <RootCauseAnalysis />
      </div>
    </div>
  );
}
