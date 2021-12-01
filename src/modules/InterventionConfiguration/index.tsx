import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip } from "@dhis2/ui";
import { ConfigurationStepper } from "@hisptz/react-ui";
import React from "react";
import DeterminantsConfigurationComponent from "./components/Determinants";
import GeneralConfigurationComponent from "./components/General";
import "./InterventionConfiguration.css";
import AccessConfigurationComponent from "./components/Access";
import { useHistory } from "react-router-dom";
import GeneralConfigurationComponent from "./components/General";

export default function InterventionConfiguration() {
  const history = useHistory();

  const onExit = () => {
    history.goBack();
  };
  return (
    <div className="configuration-main-container">
      <div className="stepper-config-header">
        <h2 style={{ margin: 4 }}>Manage Focused ANC Coverage</h2>
        <Button>{i18n.t("Delete")}</Button>
      </div>
      <div className="flex">
        <ConfigurationStepper
          stepsManagement={[
            {
              label: "General",
              component: GeneralConfigurationComponent,
              helpSteps: [],
            },
            {
              label: "Determinants",
              component: DeterminantsConfigurationComponent,
              helpSteps: [],
            },
            {
              label: "Access",
              component: AccessConfigurationComponent,
              helpSteps: [],
            },
          ]}
          onLastAction={function (value?: any): void {
            throw new Error("Function not implemented.");
          }}
          activeStepperBackGroundColor={"#00695c"}
          onCancelLastAction={function (value?: any): void {
            throw new Error("Function not implemented.");
          }}
          onLastActionButtonName={"Save"}
        />
      </div>
      <ButtonStrip middle>
        <Button color={"blue"}>{i18n.t("Save and exit")}</Button>
        <Button onClick={onExit}>{i18n.t("Exit Without saving")}</Button>
      </ButtonStrip>
    </div>
  );
}
