import i18n from "@dhis2/d2-i18n";
import { CheckboxField, NoticeBox, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { OrgUnitLevels } from "../../../../../../core/state/orgUnit";
import { InterventionDirtySelector } from "../../../../state/data";

export default function OrgUnitLevelSelector() {
  const { id } = useParams<{ id: string }>();
  const [customPeriodType, setCustomPeriodType] = useState<boolean>(false);
  const [orgUnitLevel, setOrgUnitLevel] = useRecoilState<string>(
    InterventionDirtySelector({
      id,
      path: ["orgUnitSelection", "subLevel"],
    })
  );
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
        onChange={({ checked }: { checked: boolean }) => setCustomPeriodType(checked)}
        checked={customPeriodType}
        label={i18n.t("Set specific level for sub level analysis")}
        name={"specific-sub-level-check"}
      />
      <SingleSelectField
        selected={orgUnitLevel}
        loading={orgUnitLevelState.state === "loading"}
        disabled={!customPeriodType || orgUnitLevelState.state !== "hasValue"}
        label={i18n.t("Sub level analysis level")}
        className="select"
        onChange={({ selected }: { selected: string }) => {
          setOrgUnitLevel(selected);
        }}>
        {orgUnitLevelState.state === "hasValue" &&
          orgUnitLevelState?.contents?.map(({ displayName: label, id }) => <SingleSelectOption value={id} label={label} key={`${id}-level-option`} />)}
      </SingleSelectField>
    </div>
  );
}
