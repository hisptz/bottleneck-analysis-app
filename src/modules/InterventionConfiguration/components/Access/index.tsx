import { Steps } from "intro.js-react";
import React, { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "./Access.css";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { INTERVENTION_ACCESS_CONFIGURATION_HELP } from "../../../../constants/help/intervention-configuration";
import { STEP_OPTIONS } from "../../../../constants/help/options";
import { InterventionDirtyState } from "../../state/data";
import HelpState from "./../../../Intervention/state/help";
import TabbedContent from "./component/TabbedContent";

export default function AccessConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const intervention = useRecoilValue(InterventionDirtyState(id));
  const form = useForm({
    defaultValues: {
      publicAccess: intervention?.publicAccess,
      userGroupAccess: intervention?.userGroupAccess,
      userAccess: intervention?.userAccess,
      user: intervention?.user,
    },
  });
  const [helpEnabled, setHelpEnabled] = useRecoilState(HelpState);

  const onHelpExit = () => {
    setHelpEnabled(false);
  };
  return (
    <FormProvider {...form}>
      <div className="accessConfig">
        <Steps options={STEP_OPTIONS} enabled={helpEnabled} steps={INTERVENTION_ACCESS_CONFIGURATION_HELP} onExit={onHelpExit} initialStep={0} />
        <div className="access-config-body accessConfig-helper">
          <Suspense fallback={<div>Loading...</div>}>
            <TabbedContent />
          </Suspense>
        </div>
      </div>
    </FormProvider>
  );
}
