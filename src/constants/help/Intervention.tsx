import i18n from "@dhis2/d2-i18n";
import React from "react";
export const INTERVENTION_HELP_STEPS = [
  {
    intro: (
      <div>
        <h1>{i18n.t("Welcome to Bottleneck Analysis App (BNA)")}</h1>
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
    element: ".intervention-list",
  },
  {
    intro: i18n.t(
      "Here is where you can add a new intervention or clone from an existing one ,also you can access your intervention of interests through searching intput"
    ),
    element: ".add-button",
  },
  {
    intro: i18n.t("Here is where you can search  existing interventions"),
    element: ".search-button",
  },
  {
    intro: i18n.t("Here is where you can view or see the details of the archive intervention"),
    element: ".view-archive",
  },
  {
    intro: i18n.t(
      "You will find Invervention Name ,and respective details such as Org unit, period, Intervention Bookmark status ,Intervention description and important actions (filters, archive and configuration)"
    ),
    element: ".intervention-header-container",
  },
  {
    intro: i18n.t("This is The Name of this Intervention "),
    element: ".intervention-header-text",
  },
  {
    intro: i18n.t(" This is the Org Unit of this Intervention and the respective period of this intervention"),
    element: ".intervention-org-unit",
  },
  {
    intro: i18n.t("This is the archive action status of this intervention, if it is Bookmarked or Not Bookmarked"),
    element: ".intervention-bookmark",
  },
  {
    intro: i18n.t("This is the description of this intervention, you can see the description of this intervention here"),
    element: ".intervention-show-description",
  },
  {
    intro: i18n.t("This is the filter actions of this intervention, you can see the list of filter actions of this intervention here"),
    element: ".intervention-header-dropdown",
  },
  {
    intro: i18n.t("This action helps you to archive this intervention"),
    element: ".archive-intervention",
  },
  {
    intro: i18n.t("This is the configuration actions of this intervention, you can see the list of configuration actions of this intervention here"),
    element: ".configure-intervention",
  },
  {
    intro: i18n.t("This menu give you download options of this components"),
    element: ".downloadOptions-menu",
  },
  {
    intro: i18n.t("This is Chart Component for this intervention with respective indicators configured in this intervention"),
    element: ".chart-block",
  },
  {
    intro: i18n.t("This is the table header components for this intervention with respective indicators highlighted in colors configured in this intervention"),
    element: ".sub-level-header",
  },
  {
    intro: i18n.t("This is the table components for this intervention with respective indicators highlighted in colors configured in this intervention"),
    element: ".sub-level-analysis-table",
  },
  {
    intro: i18n.t("This action help you to flip table components by exchange the table rows and columns"),
    element: ".sub-level-analysis-table-switch",
  },
  {
    intro: i18n.t("This is the intervention table view options of this intervention"),
    element: ".intervention-table-view-option",
  },
  {
    intro: i18n.t("This is an option to view this intervention into dictionary view options"),
    element: ".intervention-dictionary-view-option",
  },
  {
    intro: i18n.t("This is the components for root cause analysis of this intervention with respective indicators configured in this intervention"),
    element: ".root-cause-widget-table",
  },
  {
    intro: i18n.t(
      "Here is where you can add a new intervention or clone from an existing one ,also you can access your intervention of interests through searching intput"
    ),
    element: ".add-new-root-cause",
  },
];

export const ARCHIVE_INTERVENTION_CONFIGURATION_HELP = [
  {
    intro: i18n.t("This is the list of archived Interventions in the system"),
    element: ".archive-interventions",
  },
  {
    intro: i18n.t("This action help you to return to your respective intervention."),
    element: ".archive-intervntion-on-back-action",
  },
  {
    intro: i18n.t("This  menu give you list of options to navigate to a respective archive intervention"),
    element: ".archive-menu-cell-action",
  },
  {
    intro: i18n.t(
      "This widget ,shows number of archived available ,so you can use this as an option to see number of archive interventions depend on your need"
    ),
    element: ".paginationCell",
  },
];

export const ARCHIVE_INDIVIDUAL_INTERVENTION_CONFIGURATION_HELP = [
  {
    intro: i18n.t(
      "This is archived Intervention Header,it also consist helpful actions that you may need , such as action for delete, help and Back to List of Archives Intervention"
    ),
    element: ".archive-header",
  },
  {
    intro: i18n.t("This is an action to return to your list of archives interventions"),
    element: ".archive-header-button",
  },
  {
    intro: i18n.t("This is an action to delete this archived intervention"),
    element: ".archive-intervention-delete",
  },
  {
    intro: i18n.t("This Component consists of basic summary of information based on this archived intervention"),
    element: ".archive-header-info-summary",
  },
  {
    intro: i18n.t("This is Chart Component for this intervention with respective indicators configured in this intervention"),
    element: ".chart-block",
  },
  {
    intro: i18n.t("This is the table header components for this intervention with respective indicators highlighted in colors configured in this intervention"),
    element: ".sub-level-header",
  },
  {
    intro: i18n.t("This is the table components for this intervention with respective indicators highlighted in colors configured in this intervention"),
    element: ".sub-level-analysis-table",
  },
  {
    intro: i18n.t("This action help you to flip table components by exchange the table rows and columns"),
    element: ".sub-level-analysis-table-switch",
  },
  {
    intro: i18n.t("This is the intervention table view options of this intervention"),
    element: ".intervention-table-view-option",
  },
  {
    intro: i18n.t("This is an option to view this intervention into dictionary view options"),
    element: ".intervention-dictionary-view-option",
  },
  {
    intro: i18n.t("This is the components for root cause analysis of this intervention with respective indicators configured in this intervention"),
    element: ".root-cause-widget-table",
  },
];
