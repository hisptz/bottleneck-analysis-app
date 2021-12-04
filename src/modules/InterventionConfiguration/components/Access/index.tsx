import React from "react";
import TabbedContent from "./component/TabbedContent";
import "./Access.css";
import { UserGroupsWithAccess, UsersWithAccess } from "./state/data";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { InterventionDirtySelector } from "../../state/data";

export default function AccessConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const userGroups = useRecoilValue(UserGroupsWithAccess(id));
  const users = useRecoilValue(UsersWithAccess(id));
  const publicAccess = useRecoilValue(InterventionDirtySelector({ id, path: ["publicAccess"] }));

  const onAdd = (value: any) => {
    console.log(value);
  };

  return (
    <div className="accessConfig">
      <p>Sharing & Access</p>
      <div className="access-config-body">
        <TabbedContent
          id={id}
          users={users}
          groups={userGroups}
          publicAccess={publicAccess}
          allowPublicAccess={true}
          type={"custom"}
          onAdd={onAdd}
          onChange={(change: any) => {
            console.log(change);
          }}
          onRemove={(remove: any) => {
            console.log(remove);
          }}
        />
      </div>
    </div>
  );
}
