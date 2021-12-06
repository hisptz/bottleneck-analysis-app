import i18n from "@dhis2/d2-i18n";
import { IconInfo24, IconList24, IconWorld24 } from "@dhis2/ui";
import React from "react";
import Dictionary from "../components/Dictionary";
import Map from "../components/Map";
import Table from "../components/Table";

export interface Tab {
  key: string;
  label: string;
  icon: JSX.Element;
  component: any;
}

export const tabs: Array<Tab> = [
  {
    key: "table",
    icon: <IconList24 />,
    label: i18n.t("Table View"),
    component: Table,
  },
  {
    key: "dictionary",
    icon: <IconInfo24 />,
    label: i18n.t("Dictionary View"),
    component: Dictionary,
  },
];
