import i18n from "@dhis2/d2-i18n";
import { CheckboxField, NoticeBox, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import { find } from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { OrgUnitLevels } from "../../../../../../core/state/orgUnit";
import { InterventionDirtySelector } from "../../../../state/data";

export default function OrgUnitLevelSelector(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [orgUnitLevel, setOrgUnitLevel] = useRecoilState<{ id: string; level?: number } | undefined>(
    InterventionDirtySelector({
      id,
      path: ["orgUnitSelection", "subLevel"],
    })
  );
  const [customSubUnitLevel, setCustomSubUnitLevel] = useState<boolean>(Boolean(orgUnitLevel));

  const orgUnitLevelState = useRecoilValueLoadable(OrgUnitLevels);
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
            setOrgUnitLevel(undefined);
          }
        }}
        checked={customSubUnitLevel}
        label={i18n.t("Set specific level for sub level analysis")}
        name={"specific-sub-level-check"}
      />
      <SingleSelectField
        selected={orgUnitLevel?.id}
        loading={orgUnitLevelState.state === "loading"}
        disabled={!customSubUnitLevel || orgUnitLevelState.state !== "hasValue"}
        label={i18n.t("Sub level analysis level")}
        onChange={({ selected }: { selected: string }) => {
          const subLevel = find(orgUnitLevelState?.contents, ["id", selected]);
          setOrgUnitLevel({
            id: subLevel?.id,
            level: subLevel?.level,
          });
        }}
      >
        {orgUnitLevelState.state === "hasValue" &&
          orgUnitLevelState?.contents?.map(({ displayName: label, id }) => <SingleSelectOption value={id} label={label} key={`${id}-level-option`} />)}
      </SingleSelectField>
    </div>
  );
}
