import { useOnlineStatus } from "@dhis2/app-runtime";
import { Divider, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import React, { useState } from "react";
import { isRemovableTarget } from "../../../../helper/index";
import ListItemIcon from "../ListAccessItemIcon";
import ListItemContext from "../ListItemContext";
import "./ListAccessItem.css";
import i18n from "@dhis2/d2-i18n";
import { ACCESS_NONE } from "../../../../../../constants/constants";

export default function ListItem({
  name,
  target,
  access,
  accessOptions = [],
  disabled,
  onChange,
  onRemove,
  accessLabel,
}: {
  name: string;
  target: any;
  access: any;
  accessOptions: any[];
  disabled: boolean;
  onChange: any;
  onRemove: any;
  accessLabel?: string;
}) {
  const [isFetching, setIsFetching] = useState(false);
  const { offline } = useOnlineStatus();

  return (
    <>
      <div className="wrapper">
        <div className="details">
          <div className="details-logo">
            <ListItemIcon target={target} name={name} />
          </div>
          <div className="details-text">
            <p className="details-name">{name}</p>
            <ListItemContext access={accessLabel} />
          </div>
        </div>
        <div className="select">
          <SingleSelectField
            fullWidth
            disabled={disabled || offline || isFetching}
            selected={access}
            helpText={offline ? i18n.t("Not available offline") : ""}
            onChange={({ selected }: { selected: any }) => onChange(selected)}>
            {accessOptions?.map(({ value, label }) => (
              <SingleSelectOption key={value} label={label} value={value} active={value === access} />
            ))}
            {isRemovableTarget(target) && <SingleSelectOption value={ACCESS_NONE.value} onClick={onRemove} label={i18n.t("Remove access")} />}
          </SingleSelectField>
        </div>
      </div>
      <Divider />
    </>
  );
}
