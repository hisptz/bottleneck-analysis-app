import { TabBar, Tab } from "@dhis2/ui";
import React, { useState } from "react";
import { ACCESS_NONE, ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT, VISUALIZATION, DASHBOARD } from "../../../../../../constants/constants";
import AccessAdd from "../Access-Add";

export default function TabbedContent() {
  //id, users, group, publicAccess, allowPublicAccess, type, onAdd, onChange, onRemove
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  function onAdd() {
    return "";
  }

  return (
    <>
      <AccessAdd onAdd={onAdd} />
    </>
  );
}
