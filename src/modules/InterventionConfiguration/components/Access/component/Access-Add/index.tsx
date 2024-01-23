import { useOnlineStatus } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Button, colors, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import { cloneDeep, uniqBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { ACCESS_TYPES } from "../../../../../../constants/constants";
import { InterventionDirtySelector } from "../../../../state/data";
import SharingAutoComplete from "../SharingAutocomplete";
import Title from "../Title";
import { useController } from "react-hook-form";

export default function AccessAdd(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { field: userAccessField } = useController({ name: "userAccess" });
  const { field: userGroupAccessField } = useController({ name: "userGroupAccess" });
  const ref = useRef<HTMLFormElement>(null);
  const { offline } = useOnlineStatus();
  const [entity, setEntity] = useState<{ id: string; type: string; name?: string; displayName?: string } | undefined>();
  const [access, setAccess] = useState("");

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (entity?.type === "user") {
      userAccessField.onChange(
        uniqBy(
          [
            ...userAccessField.value,
            {
              id: entity.id,
              access,
            },
          ],
          "id"
        )
      );
    }
    if (entity?.type === "userGroup") {
      userGroupAccessField.onChange(
        uniqBy(
          [
            ...userGroupAccessField.value,
            {
              id: entity.id,
              access,
            },
          ],
          "id"
        )
      );
    }
    setEntity(undefined);
    setAccess("");
  };

  return (
    <div className="access-config-add-user">
      <Title title={i18n.t("Give Access to a user , group or role")} />
      <form ref={ref} style={{ display: "flex", gap: 16 }} onSubmit={onSubmit}>
        <div className="flex-1 access-config-add-user-search">
          <SharingAutoComplete selected={entity} onSelection={setEntity} />
        </div>
        <div className="select-wrapper access-config-add-user-select-wrapper">
          <SingleSelectField
            label={i18n.t("Access level")}
            placeholder={i18n.t("Select a level")}
            dataTest={"access-level-list-test"}
            disabled={offline}
            selected={access}
            helpText={offline ? i18n.t("Not available offline") : ""}
            onChange={({ selected }: any) => setAccess(selected)}>
            {ACCESS_TYPES.map(({ value, label }) => (
              <SingleSelectOption dataTest={"access-level-option-list-test"} key={value} label={label} value={value} active={value === access} />
            ))}
          </SingleSelectField>
        </div>
        <Button className={"access-config-add-user-access-action"} type="submit" disabled={!entity || !access}>
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
    </div>
  );
}
