import { useOnlineStatus } from "@dhis2/app-runtime";
import { SingleSelectField, SingleSelectOption, Divider } from "@dhis2/ui";
import { isRemovableTarget } from "../../../../helper/index";
import React, { useContext, useState } from "react";
import DestructiveSelectOption from "../DestructiveSelectOption";
import ListItemIcon from "../ListAccessItemIcon";
import ListItemContext from "../ListItemContext";

export default function ListItem({ name, target, access, accessOptions = [], disabled, onChange, onRemove }) {
  const [isFetching,setIsFetching] = useState(false);
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
          <ListItemIcon target={target} name={name} />
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
            {isRemovableTarget(target) && <DestructiveSelectOption onClick={onRemove} label={i18n.t("Remove access")} />}
          </SingleSelectField>
        </div>
      </div>
      <Divider />
    </>
  );
}
