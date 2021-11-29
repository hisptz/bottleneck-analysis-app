import React from "react";
import {
  SHARE_TARGET_PUBLIC,
  SHARE_TARGET_GROUP,
  SHARE_TARGET_USER,
  ACCESS_NONE,
  ACCESS_VIEW_ONLY,
  ACCESS_VIEW_AND_EDIT,
} from "../../../../../../constants/constants";
import ListItem from "../ListAccessItem";
import Title from "../Title";

export default function AccessList({ onChange, onRemove, publicAccess, allowPublicAccess, users = [], groups = [] }) {
  return (
    <>
      <Title title={"Users and groups that currently have access"} />
      <div className="header">
        <div className="header-left-column">{"User / Group / role"}</div>
        <div className="header-right-column">{"Access level"}</div>
      </div>
      <div className="list">
        <ListItem
          name={"All users"}
          target={SHARE_TARGET_PUBLIC}
          access={publicAccess}
          accessOptions={[ACCESS_NONE, ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT]}
          disabled={!allowPublicAccess}
          onChange={(newAccess) => onChange({ type: "public", access: newAccess })}
        />
        {groups.map(({ id, name, access }) => (
          <ListItem
            key={id}
            name={name}
            target={SHARE_TARGET_GROUP}
            access={access}
            accessOptions={[ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT]}
            onChange={(newAccess) =>
              onChange({
                type: "group",
                id,
                access: newAccess,
              })
            }
            onRemove={() => onRemove({ type: "group", id })}
          />
        ))}
        {users.map(
          ({ id, name, access }) =>
            access && (
              <ListItem
                key={id}
                name={name}
                target={SHARE_TARGET_USER}
                access={access}
                accessOptions={[ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT]}
                onChange={(newAccess) =>
                  onChange({
                    type: "user",
                    id,
                    access: newAccess,
                  })
                }
                onRemove={() => onRemove({ type: "user", id })}
              />
            )
        )}
      </div>
    </>
  );
}
