import i18n from "@dhis2/d2-i18n";
import React from "react";

export const INTERVENTION_CONFIGURATION_HELP = [
  {
    intro: (
      <div>
        <h1>{i18n.t("Welcome to BNA Configuration")}</h1>
        <p>
          {i18n.t(
            "BNA is a structured analysis of the determinants of coverage for a wide range of interventions delivered through the health sector, useful to supporting targeted operational planning"
          )}
        </p>
      </div>
    ),
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".interventionConfigName",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".intervnameConfigDesc",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".intervnameConfigPeriodType",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".orgUnit-subLevelAnalysis-config",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".legend-definition-config",
  },
];

export const INTERVENTION_DETERMINANT_CONFIGURATION_HELP = [
  {
    intro: (
      <div>
        <h1>{i18n.t("Welcome to BNA Configuration")}</h1>
        <p>
          {i18n.t(
            "BNA is a structured analysis of the determinants of coverage for a wide range of interventions delivered through the health sector, useful to supporting targeted operational planning"
          )}
        </p>
      </div>
    ),
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".determinant-main-container",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".determinant-area-container",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".determinant-main-header",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".determinant-clear-all-config",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".indicator-data-configuration-area",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".add-button",
  },
];

export const INTERVENTION_ACCESS_CONFIGURATION_HELP = [
  {
    intro: (
      <div>
        <h1>{i18n.t("Welcome to BNA Configuration")}</h1>
        <p>
          {i18n.t(
            "BNA is a structured analysis of the determinants of coverage for a wide range of interventions delivered through the health sector, useful to supporting targeted operational planning"
          )}
        </p>
      </div>
    ),
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".accessConfig",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".access-config-add-user",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".access-config-add-user-search",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".access-config-add-user-select-wrapper",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".access-config-add-user-access-action",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".access-list",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".access-lists-access-options",
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".access-lists-access-options-delete-action",
  },
];
