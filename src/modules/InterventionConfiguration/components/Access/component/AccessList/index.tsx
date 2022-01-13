import i18n from "@dhis2/d2-i18n";
import React, { Suspense } from "react";
import { ACCESS_TYPES, SHARE_TARGET_GROUP, SHARE_TARGET_PUBLIC, SHARE_TARGET_USER } from "../../../../../../constants/constants";
import ListItem, { ListItemLoader } from "../ListAccessItem";
import Title from "../Title";
import "./accesslist.css";
import { find } from "lodash";
import useManageAccess from "./hooks/manage";

export default function AccessList(): React.ReactElement {
  const { allUsersAccess, userGroupAccess, userAccess, onChangeAccess, onRemove, publicAccess } = useManageAccess();

  return (
    <>
      <Title title={i18n.t("Users and groups that currently have access")} />
      <div className="header">
        <div className="header-left-column">{i18n.t("User / Group / Role")}</div>
        <div className="header-right-column">{i18n.t("Access level")}</div>
      </div>
      <div className="access-list">
        <ListItem
          name={i18n.t("All users")}
          target={SHARE_TARGET_PUBLIC}
          accessLabel={allUsersAccess?.label}
          access={publicAccess}
          accessOptions={ACCESS_TYPES}
          disabled={false}
          onChange={(newAccess: string) => onChangeAccess("publicAccess", newAccess)}
          onRemove={() => onRemove({ type: "publicAccess", id: "id" })}
        />
        {userGroupAccess?.map(({ id, access }: { id: string; name: string; access: string }) => (
          <Suspense key={`${id}-access-list`} fallback={<ListItemLoader />}>
            <ListItem
              id={id}
              target={SHARE_TARGET_GROUP}
              access={access}
              accessLabel={find(ACCESS_TYPES, ["value", access])?.label}
              accessOptions={ACCESS_TYPES}
              onChange={(newAccess: string) => onChangeAccess("userGroupAccess", { id, access: newAccess })}
              onRemove={() => onRemove({ type: "userGroupAccess", id })}
              disabled={false}
            />
          </Suspense>
        ))}
        {userAccess?.map(({ id, access }: { id: string; name: string; access: string }) => (
          <Suspense key={`${id}-access-list`} fallback={<ListItemLoader />}>
            <ListItem
              key={id}
              id={id}
              accessLabel={find(ACCESS_TYPES, ["value", access])?.label}
              target={SHARE_TARGET_USER}
              access={access}
              accessOptions={ACCESS_TYPES}
              onChange={(newAccess: string) => onChangeAccess("userAccess", { id, access: newAccess })}
              onRemove={() => onRemove({ type: "userAccess", id })}
              disabled={false}
            />
          </Suspense>
        ))}
      </div>
    </>
  );
}
