import i18n from "@dhis2/d2-i18n";
import { CheckboxField, NoticeBox, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import { filter, find, isEmpty } from "lodash";
import React, { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { OrgUnitLevels } from "../../../../../../core/state/orgUnit";
import { UserOrganisationUnit } from "../../../../../../core/state/user";
import { OrgUnit } from "../../../../../../shared/interfaces/orgUnit";
import { InterventionDirtySelector } from "../../../../state/data";

export default function OrgUnitLevelSelector(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { setValue, getValues } = useFormContext();
  const orgUnitLevel = useRecoilValue<{ id: string; level?: number } | undefined>(
    InterventionDirtySelector({
      id,
      path: ["orgUnitSelection", "subLevel"],
    })
  );
  const userOrgUnit = useRecoilValue(UserOrganisationUnit);
  const [customSubUnitLevel, setCustomSubUnitLevel] = useState<boolean>(Boolean(orgUnitLevel));
  const orgUnitLevelState = useRecoilValueLoadable(OrgUnitLevels);

  // @ts-ignore
  const filteredLevels: Array<OrgUnit> = useMemo(() => {
    if (orgUnitLevelState.state === "hasValue") {
      if (userOrgUnit) {
        return filter(orgUnitLevelState.contents, (orgUnit: OrgUnit) => orgUnit.level >= userOrgUnit?.level);
      }
      return [];
    }
    return [];
  }, [orgUnitLevelState, userOrgUnit]);

  return (
    <div className="column" style={{ gap: 16 }}>
      <div className={"pt-16"}>
        <NoticeBox title={i18n.t("Sub level analysis notice")}>
          {i18n.t(
            "By Default sub level analysis will display data for the immediate user sub organisation unit, however given implementation this may not be the case and" +
              "specific level can be selected instead."
          )}
        </NoticeBox>
      </div>
      <CheckboxField
        onChange={({ checked }: { checked: boolean }) => {
          setCustomSubUnitLevel(checked);
          if (!checked) {
            const orgUnitSelection = getValues("orgUnitSelection");
            setValue("orgUnitSelection", { ...orgUnitSelection, subLevel: undefined });
          }
        }}
        checked={customSubUnitLevel}
        label={i18n.t("Set specific level for sub level analysis")}
        name={"specific-sub-level-check"}
      />
      <Controller
        name={"orgUnitSelection"}
        render={({ field, fieldState }) => (
          <SingleSelectField
            name={field.name}
            error={fieldState.error}
            validationText={fieldState.error?.message}
            selected={!isEmpty(filteredLevels) && field.value?.subLevel?.id}
            loading={orgUnitLevelState.state === "loading"}
            disabled={!customSubUnitLevel || orgUnitLevelState.state !== "hasValue"}
            label={i18n.t("Sub level analysis level")}
            onChange={({ selected }: { selected: string }) => {
              const subLevel = find(orgUnitLevelState?.contents, ["id", selected]);
              field.onChange({
                ...field.value,
                subLevel: {
                  id: subLevel?.id,
                  level: subLevel?.level,
                },
              });
            }}>
            {orgUnitLevelState.state === "hasValue" &&
              filteredLevels?.map(({ displayName: label, id }) => <SingleSelectOption value={id} label={label} key={`${id}-level-option`} />)}
          </SingleSelectField>
        )}
      />
    </div>
  );
}
