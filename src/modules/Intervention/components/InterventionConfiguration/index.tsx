import { Button } from "@dhis2/ui";
import { ConfigurationStepper } from "@hisptz/react-ui";
import React from "react";
import GeneralConfigurationComponent from "./components";
import AccessConfigurationComponent from "./components/AccessConfigurationComponent";
import "./InterventionConfiguration.css";

export default function InterventionConfiguration() {
  return (
    <div className="stepConfig">
      <div className="stepper-config-header">
        <h2>Manage Focused ANC Coverage</h2>
        <Button>Delete</Button>
      </div>
      <ConfigurationStepper
        stepsManagement={[
          {
            label: "General",
            component: GeneralConfigurationComponent,
            helpSteps: [],
          },
          {
            label: "Determinants",
            component: () => (
              <div className="container">
                <div className="column text-center">
                  <h1>2</h1>
                </div>
              </div>
            ),
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
      <div className="stepper-config-buttom">
        <Button color={"blue"}>Save and exit</Button>
        <Button>Exit Without saving</Button>
      </div>
    </div>
  );
}
