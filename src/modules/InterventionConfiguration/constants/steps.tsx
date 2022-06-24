import GeneralConfigurationComponent from "../components/General";
import DeterminantsConfigurationComponent from "../components/Determinants";
import AccessConfigurationComponent from "../components/Access";
import React from "react";
import { ConfigStep } from "../interfaces";

export const CONFIG_STEPS: Array<ConfigStep> = [
  {
    label: "General",
    component: GeneralConfigurationComponent,
    helpSteps: [],
    validationKeys: [
      'name',
    ]
  },
  {
    label: "Determinants",
    component: DeterminantsConfigurationComponent,
    helpSteps: [],
    validationKeys: [
      'dataSelection.groups'
    ]
  },
  {
    label: "Access",
    component: AccessConfigurationComponent,
    helpSteps: [],
    validationKeys: []
  },
];
