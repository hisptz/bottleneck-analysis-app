import { useOnlineStatus } from "@dhis2/app-runtime";
import { Button, Divider, IconDelete24, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import React from "react";
import { useRecoilValue } from "recoil";
import { AccessEntityDetails } from "../../state/data";
import ListItemIcon from "../ListAccessItemIcon";
import ListItemContext from "../ListItemContext";
import "./ListAccessItem.css";

import i18n from "@dhis2/d2-i18n";

export default function ListItem({
  id,
  name,
  target,
  access,
  accessOptions = [],
  disabled,
  onChange,
  onRemove,
  accessLabel,
}: {
  id?: string;
  name?: string;
  target: any;
  access: any;
  accessOptions: any[];
  disabled: boolean;
  onChange: any;
  onRemove: () => void;
  accessLabel?: string;
}) {
  const { offline } = useOnlineStatus();
  const entity = useRecoilValue(AccessEntityDetails({ id, type: target }));
  return (
    <>
      <div className="wrapper">
        <div className="details">
          <div className="details-logo">
            <ListItemIcon target={target} name={name ?? entity?.name ?? entity?.displayName ?? ""} />
          </div>
          <div className="details-text">
            <p className="details-name">{name ?? entity?.name ?? entity?.displayName ?? ""}</p>
            <ListItemContext access={accessLabel} />
          </div>
        </div>
        <div className="select">
          <div className="flex-1">
            <SingleSelectField
              fullWidth
              disabled={disabled || offline}
              selected={access}
              helpText={offline ? i18n.t("Not available offline") : ""}
              onChange={({ selected }: { selected: any }) => onChange(selected)}
            >
              {accessOptions?.map(({ value, label }) => (
                <SingleSelectOption key={value} label={label} value={value} active={value === access} />
              ))}
            </SingleSelectField>
          </div>
          <Button onClick={onRemove} icon={<IconDelete24 />}>
            {i18n.t("Delete")}
          </Button>
        </div>
      </div>
      <Divider />
    </>
  );
}

export const ListItemLoader = (): React.ReactElement => {
  return (
    <>
      <div className="wrapper">
        <div className="details">
          <div className="details-logo">
            <div className="logo-shimmer shimmer" />
          </div>
          <div className="details-text">
            <div className="title-shimmer shimmer" />
            <div className="subtitle-shimmer shimmer" />
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
};
