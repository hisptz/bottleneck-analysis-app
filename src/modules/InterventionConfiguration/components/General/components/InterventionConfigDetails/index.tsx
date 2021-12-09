import i18n from "@dhis2/d2-i18n";
import { InputField, SingleSelectField, SingleSelectOption, TextAreaField } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import React, { useMemo } from "react";
import "./InterventionConfigDetails.css";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { InterventionDirtySelector } from "../../../../state/data";
import OrgUnitLevelSelector from "../OrgUnitLevelSelector";

export default function InterventionConfigDetails(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useRecoilState(InterventionDirtySelector({ id, path: ["name"] }));
  const [description, setDescription] = useRecoilState(InterventionDirtySelector({ id, path: ["description"] }));

  const [periodType, setPeriodType] = useRecoilState(
    InterventionDirtySelector({
      id,
      path: ["periodSelection", "type"],
    })
  );
  const periodTypes = useMemo(() => {
    const periodInstance = new Period().setPreferences({ allowFuturePeriods: true });
    // @ts-ignore
    return periodInstance?._periodType?._periodTypes;
  }, []);

  return (
    <div className="interventionConfig">
      <InputField
        dataTest={"interventionName"}
        value={name}
        onChange={({ value }: { value: string }) => setName(value)}
        name={"name"}
        label={"Intervention Name"}
      />
      <TextAreaField
        value={description}
        label={i18n.t("Description")}
        dataTest={"interventionDescription"}
        name="description"
        onChange={({ value }: { value: string }) => setDescription(value)}
        placeholder={i18n.t("Enter a description")}
      />
      <SingleSelectField
        selected={periodType}
        dataTest={"periodType-selection-menu"}
        name={"periodType"}
        label={i18n.t("Bottleneck Period Type")}
        onChange={({ selected }: { selected: string }) => setPeriodType(selected)}>
        {periodTypes.map(({ id, name }: { id: string; name: string }) => (
          <SingleSelectOption key={`${id}-option`} value={id} label={`${name}`} dataTest={"periodType-selection-menu-item"} />
        ))}
      </SingleSelectField>
      <OrgUnitLevelSelector />
    </div>
  );
}
