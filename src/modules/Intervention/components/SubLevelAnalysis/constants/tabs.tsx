import i18n from "@dhis2/d2-i18n";
import { IconInfo16, IconList16, IconWorld16 } from "@dhis2/ui";
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
    icon: <IconList16 />,
    label: i18n.t("Table View"),
    component: Table,
  },
  {
    key: "dictionary",
    icon: <IconInfo16 />,
    label: i18n.t("Dictionary View"),
    component: Dictionary,
  },
  {
    key: "map",
    icon: <IconWorld16 />,
    label: i18n.t("Map View"),
    component: Map,
  },
];
