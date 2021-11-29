import { TabBar, Tab } from "@dhis2/ui";
import React, { useState } from "react";
import { ACCESS_NONE, ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT, VISUALIZATION, DASHBOARD } from "../../../../../../constants/constants";
import AccessAdd from "../Access-Add";
import AccessList from "../AccessList";

export default function TabbedContent({id, users, groups, publicAccess, allowPublicAccess, type, onAdd, onChange, onRemove}) {

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  function onAdd() {
    return "";
  }

  return (
    <>
      <AccessAdd onAdd={onAdd} />
      <AccessList users={users} groups={groups} publicAccess={publicAccess} allowPublicAccess={allowPublicAccess} onChange={onChange} onRemove={onRemove} />
    </>
  );
}
