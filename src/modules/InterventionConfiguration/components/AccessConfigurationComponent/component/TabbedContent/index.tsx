import React from "react";
import AccessAdd from "../Access-Add";
import AccessList from "../AccessList";

export default function TabbedContent({id, users, groups, publicAccess, allowPublicAccess, type, onAdd, onChange, onRemove}) {
  function onAdd() {
    return "";
  }

  return (
    <div>
      <AccessAdd onAdd={onAdd} />
      <AccessList users={users} groups={groups} publicAccess={publicAccess} allowPublicAccess={allowPublicAccess} onChange={onChange} onRemove={onRemove} />
    </div>
  );
}
