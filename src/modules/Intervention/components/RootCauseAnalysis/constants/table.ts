import i18n from "@dhis2/d2-i18n";
import { TableColumn } from "../interfaces/table";

export const ROOT_CAUSE_TABLE_COLUMNS: Array<TableColumn> = [
  {
    label: i18n.t("Organisation Unit"),
    key: "OrgUnit",
    disabled: true,
  },
  {
    key: "Period",
    label: i18n.t("Period"),
    disabled: true,
  },
  {
    key: "Intervention",
    label: i18n.t("Intervention"),
    disabled: true,
  },
  {
    key: "Bottleneck",
    label: i18n.t("Bottleneck"),
    disabled: false,
  },
  {
    key: "Indicator",
    label: i18n.t("Indicator"),
    disabled: false,
  },
  {
    key: "Root cause",
    label: i18n.t("Possible Root Cause"),
    disabled: false,
  },
  {
    key: "Solution",
    label: i18n.t("Possible Solutions"),
    disabled: false,
  },
  {
    key: "Actions",
    label: i18n.t("Actions"),
    disabled: false,
  },
];
