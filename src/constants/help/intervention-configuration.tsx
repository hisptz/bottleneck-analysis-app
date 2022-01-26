import i18n from "@dhis2/d2-i18n";
import React from "react";

export const INTERVENTION_CONFIGURATION_HELP = [
  {
    intro: i18n.t("This is an input field for entering the name of your intervention"),
    element: ".interventionConfigName",
  },
  {
    intro: i18n.t("This is an input field for entering the description of your intervention"),
    element: ".intervnameConfigDesc",
  },
  {
    intro: i18n.t("Use this field for selection of your Bottleneck Perod type, and the respective period for your Bottleneck"),
    element: ".intervnameConfigPeriodType",
  },
  {
    intro: i18n.t("Use this field for selection of your Bottleneck Organisation Unit, and choose your respective Organisation Unit for your Bottleneck"),
    element: ".orgUnit-subLevelAnalysis-config",
  },
  {
    intro: i18n.t("Use this component for your legend configuration to identify your targets"),
    element: ".legend-definition-config",
  },
];

export const INTERVENTION_DETERMINANT_CONFIGURATION_HELP = [
  {
    intro: i18n.t(
      "This is the list of your intervention determinants, you can add and remove determinants from this list, at this stage you can also add indicators for each determinant"
    ),
    element: ".determinant-main-container",
  },
  {
    intro: i18n.t("This is the list of your intervention determinants"),
    element: ".determinant-area-container",
  },
  {
    intro: i18n.t("This contains instruction header of comodoties and it action to clear all determinants"),
    element: ".determinant-main-header",
  },
  {
    intro: i18n.t("This is an action to clear all determinants shown in the list below"),
    element: ".determinant-clear-all-config",
  },
  {
    intro: i18n.t("Here are the list of determinants it counts highlited in brackets to show the number of indicators in that particular determinat"),
    element: ".indicator-data-configuration-area",
  },
  {
    intro: i18n.t("This is an action to add another indicator into the respective determinant"),
    element: ".add-button",
  },
];

export const INTERVENTION_ACCESS_CONFIGURATION_HELP = [
  {
    intro: i18n.t("This is the Component for configuration of your intervention access"),
    element: ".accessConfig",
  },
  {
    intro: i18n.t("Use this section to give access to your specific user or user group or role with their respective access level"),
    element: ".access-config-add-user",
  },
  {
    intro: i18n.t("Here is where you can search your user ,user group or role to assign access level"),
    element: ".access-config-add-user-search",
  },
  {
    intro: i18n.t("Choose here level of access to assign to your user,group or role"),
    element: ".access-config-add-user-select-wrapper",
  },
  {
    intro: i18n.t(
      "After you have choose your access level to a user ,group or specific role ,Use this action comfirm and save your access configuration to that particular group,user or role"
    ),
    element: ".access-config-add-user-access-action",
  },
  {
    intro: i18n.t("This are list in your intervention that have access"),
    element: ".access-list",
  },
  {
    intro: i18n.t("This is Access Level for this particular user,group or role"),
    element: ".access-lists-access-options",
  },
  {
    intro: i18n.t("Use this action to delete your access configuration for this particular user,group or role"),
    element: ".access-lists-access-options-delete-action",
  },
];
