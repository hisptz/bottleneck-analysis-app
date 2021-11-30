import { SingleSelectField, SingleSelectOption, Button, colors } from "@dhis2/ui";
import React, { useState } from "react";
import { ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT } from "../../../../../../constants/constants";
import SharingAutoComplete from "../SharingAutocomplete";
import Title from "../Title";

export default function AccessAdd({ onAdd }: any) {
  const [entity, setEntity] = useState({ type: "", id: "", name: "", displayName: "" });
  const [access, setAccess] = useState("");
  //   const { offline } = useOnlineStatus();
  const onSubmit = (e) => {
    e.preventDefault();
    onAdd({
      type: entity.type,
      id: entity.id,
      name: entity.displayName || entity.name,
      access,
    });
    setEntity({ type: "", id: "", name: "", displayName: "" });
    setAccess("");
  };
  const accessOptions = [
    {
      value: ACCESS_VIEW_ONLY,
      label: "View only",
    },
    {
      value: ACCESS_VIEW_AND_EDIT,
      label: "view and edit",
    },
  ];
  return (
    <>
      <Title title={"Give Access to a user , group or role"} />
      <form onSubmit={onSubmit}>
        <SharingAutoComplete selected={entity?.displayName || entity?.name} onSelection={setEntity} />
        <div className="select-wrapper">
          <SingleSelectField
            label={"Access level"}
            placeholder={"Select a level"}
            disabled={false}
            selected={access}
            helpText={false ? "Not available offline" : ""}
            onChange={({ selected }: any) => setAccess(selected)}>
            {accessOptions.map(({ value, label }) => (
              <SingleSelectOption key={value} label={label} value={value} active={value === access} />
            ))}
          </SingleSelectField>
        </div>
        <Button type="submit" disabled={!entity || !access}>
          {"Give access"}
        </Button>
      </form>
      <style>{`
        form {
          background-color: ${colors.grey100};
          color: ${colors.grey900};
          margin-bottom: 21px;
          padding: 8px 12px;
          border-radius: 5px;
          display: flex;
          align-items: flex-end;
        }

        .select-wrapper {
          flex: 1;
        }
      `}</style>
    </>
  );
}
