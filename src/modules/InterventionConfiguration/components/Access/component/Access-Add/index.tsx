import { useOnlineStatus } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Button, colors, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import React, { useState } from "react";
import { ACCESS_VIEW_AND_EDIT, ACCESS_VIEW_ONLY } from "../../../../../../constants/constants";
import SharingAutoComplete from "../SharingAutocomplete";
import Title from "../Title";

export default function AccessAdd({ onAdd }: any): React.ReactElement {
  const { offline } = useOnlineStatus();
  const [entity, setEntity] = useState({ type: "", id: "", name: "", displayName: "" });
  const [access, setAccess] = useState("");
  const onSubmit = (e: { preventDefault: () => void }) => {
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
      <Title title={i18n.t("Give Access to a user , group or role")} />
      <form style={{ display: "flex", gap: 16 }} onSubmit={onSubmit}>
        <SharingAutoComplete selected={entity?.displayName || entity?.name} onSelection={setEntity} />
        <div className="select-wrapper">
          <SingleSelectField
            label={i18n.t("Access level")}
            placeholder={i18n.t("Select a level")}
            disabled={offline}
            selected={access}
            helpText={offline ? i18n.t("Not available offline") : ""}
            onChange={({ selected }: any) => setAccess(selected)}>
            {accessOptions.map(({ value, label }) => (
              <SingleSelectOption key={value} label={label} value={value} active={value === access} />
            ))}
          </SingleSelectField>
        </div>
        <Button type="submit" disabled={!entity || !access}>
          {i18n.t("Give access")}
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
