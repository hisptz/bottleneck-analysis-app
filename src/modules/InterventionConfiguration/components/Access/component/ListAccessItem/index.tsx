import { useOnlineStatus } from "@dhis2/app-runtime";
import { SingleSelectField, SingleSelectOption, Divider } from "@dhis2/ui";
import React, { useContext, useState } from "react";
import { isRemovableTarget } from "../../../../helper/index";
import DestructiveSelectOption from "../DestructiveSelectOption";
import ListItemIcon from "../ListAccessItemIcon";
import ListItemContext from "../ListItemContext";
import "./ListAccessItem.css";

export default function ListItem({
  name,
  target,
  access,
  accessOptions = [],
  disabled,
  onChange,
  onRemove,
}: {
  name: string;
  target: any;
  access: any;
  accessOptions: any[];
  disabled: boolean;
  onChange: any;
  onRemove: any;
}) {
  const [isFetching, setIsFetching] = useState(false);
  const { offline } = useOnlineStatus();
  const valueToLabel: any = {
    ACCESS_NONE: "No access",
    ACCESS_VIEW_ONLY: "View only",
    ACCESS_VIEW_AND_EDIT: "View and edit",
  };

  return (
    <>
      <div className="wrapper">
        <div className="details">
          <div className="details-logo">
            <ListItemIcon target={target} name={name} />
          </div>
          <div className="details-text">
            <p className="details-name">{name}</p>
            <ListItemContext access={access} />
          </div>
        </div>
        <div className="select">
          <SingleSelectField
            disabled={disabled || offline || isFetching}
            prefix={"Metadata"}
            selected={access}
            helpText={offline ? "Not available offline" : ""}
            onChange={({ selected }) => onChange(selected)}>
            {accessOptions?.map((value) => (
              <SingleSelectOption key={value} label={valueToLabel[value]} value={value} active={value === access} />
            ))}
            {isRemovableTarget(target) && <DestructiveSelectOption onClick={onRemove} label={"Remove access"} />}
          </SingleSelectField>
        </div>
      </div>
      <Divider />
    </>
  );
}
