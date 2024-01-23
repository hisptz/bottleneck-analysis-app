import GeneralConfigurationComponent from "../components/General";
import DeterminantsConfigurationComponent from "../components/Determinants";
import AccessConfigurationComponent from "../components/Access";
import React from "react";
import { ConfigStep } from "../interfaces";
import i18n from "@dhis2/d2-i18n";
import MapConfiguration from "../components/Map";

export const CONFIG_STEPS: Array<ConfigStep> = [
  {
    label: i18n.t("General"),
    component: GeneralConfigurationComponent,
    helpSteps: [],
    validationKeys: [
      "name"
    ]
  },
  {
    label: i18n.t("Determinants"),
    component: DeterminantsConfigurationComponent,
    helpSteps: [],
    validationKeys: [
      "dataSelection.groups"
    ]
  },
  {
    label: i18n.t("Map"),
    component: MapConfiguration,
    helpSteps: [],
    validationKeys: [
      "maps"
    ]
  },
  {
    label: i18n.t("Access"),
    component: AccessConfigurationComponent,
    helpSteps: [],
    validationKeys: []
  }
];
