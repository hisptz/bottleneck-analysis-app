import i18n from "@dhis2/d2-i18n";
import React, { useMemo } from "react";
import {
  ACCESS_NONE,
  ACCESS_TYPES,
  ACCESS_VIEW_AND_EDIT,
  ACCESS_VIEW_ONLY,
  SHARE_TARGET_GROUP,
  SHARE_TARGET_PUBLIC,
  SHARE_TARGET_USER,
} from "../../../../../../constants/constants";
import ListItem from "../ListAccessItem";
import Title from "../Title";
import "./accesslist.css";
import { cloneDeep, find, findIndex, has, set } from "lodash";
import { useSetRecoilState } from "recoil";
import { InterventionDirtySelector } from "../../../../state/data";
import { useParams } from "react-router-dom";

export default function AccessList({
  onChange,
  onRemove,
  publicAccess,
  allowPublicAccess,
  users = [],
  groups = [],
}: {
  onChange: any;
  onRemove: any;
  publicAccess: any;
  allowPublicAccess: any;
  users: any[];
  groups: any[];
}): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const allUsersAccess = useMemo(() => find(ACCESS_TYPES, ["value", publicAccess]), [publicAccess]);
  const setUserGroupAccess = useSetRecoilState(InterventionDirtySelector({ id, path: ["userGroupAccess"] }));
  const setPublicAccess = useSetRecoilState(InterventionDirtySelector({ id, path: ["publicAccess"] }));
  const setUserAccess = useSetRecoilState(InterventionDirtySelector({ id, path: ["publicAccess"] }));
  const onChangeAccess = (type: string, access: string | { id: string; access: string }) => {
    if (type === "publicAccess") {
      setPublicAccess(access);
      return;
    }
    if (type === "userAccess") {
      if (typeof access !== "string" && has(access, "id")) {
        setUserAccess((prevState: any) => {
          const newState = cloneDeep(prevState);
          const updatedUserGroupIndex = findIndex(newState, ["id", access.id]);
          if (newState[updatedUserGroupIndex]) {
            set(newState[updatedUserGroupIndex], "access", access.access);
          }
          return newState;
        });
      }
      return;
    }
    if (type === "userGroupAccess") {
      if (typeof access !== "string" && has(access, "id")) {
        setUserGroupAccess((prevState: any) => {
          const newState = cloneDeep(prevState);
          const updatedUserGroupIndex = findIndex(newState, ["id", access.id]);
          if (newState[updatedUserGroupIndex]) {
            set(newState[updatedUserGroupIndex], "access", access.access);
          }
          return newState;
        });
      }
      return;
    }
  };

  return (
    <>
      <Title title={i18n.t("Users and groups that currently have access")} />
      <div className="header">
        <div className="header-left-column">{i18n.t("User / Group / Role")}</div>
        <div className="header-right-column">{i18n.t("Access level")}</div>
      </div>
      <div className="list">
        <ListItem
          name={i18n.t("All users")}
          target={SHARE_TARGET_PUBLIC}
          accessLabel={allUsersAccess?.label}
          access={publicAccess}
          accessOptions={[ACCESS_NONE, ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT]}
          disabled={!allowPublicAccess}
          onChange={(newAccess: string) => onChangeAccess("publicAccess", newAccess)}
          onRemove={() => onRemove({ type: "group", id: "id" })}
        />
        {groups.map(({ id, name, access }) => (
          <ListItem
            key={id}
            name={name}
            target={SHARE_TARGET_GROUP}
            access={access}
            accessLabel={find(ACCESS_TYPES, ["value", access])?.label}
            accessOptions={[ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT]}
            onChange={(newAccess: string) => onChangeAccess("userGroupAccess", { id, access: newAccess })}
            onRemove={() => onRemove({ type: "group", id })}
            disabled={false}
          />
        ))}
        {users.map(
          ({ id, name, access }) =>
            access && (
              <ListItem
                key={id}
                name={name}
                accessLabel={find(ACCESS_TYPES, ["value", access])?.label}
                target={SHARE_TARGET_USER}
                access={access}
                accessOptions={[ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT]}
                onChange={(newAccess: string) => onChangeAccess("userAccess", { id, access: newAccess })}
                onRemove={() => onRemove({ type: "user", id })}
                disabled={false}
              />
            )
        )}
      </div>
    </>
  );
}
