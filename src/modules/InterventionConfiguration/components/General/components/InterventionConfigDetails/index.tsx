import i18n from "@dhis2/d2-i18n";
import { InputField, SingleSelectField, SingleSelectOption, TextAreaField } from "@dhis2/ui";
import { PeriodType } from "@iapps/period-utilities";
import { filter } from "lodash";
import React, { useMemo } from "react";
import "./InterventionConfigDetails.css";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { InterventionSummary } from "../../../../../../core/state/intervention";
import classes from "../../../../General.module.css";
import { InterventionDirtySelector } from "../../../../state/data";
import OrgUnitLevelSelector from "../OrgUnitLevelSelector";

export default function InterventionConfigDetails(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useRecoilState(InterventionDirtySelector({ id, path: ["name"] }));
  const [description, setDescription] = useRecoilState(InterventionDirtySelector({ id, path: ["description"] }));
  const summaries = useRecoilValue(InterventionSummary);

  const [periodType, setPeriodType] = useRecoilState(
    InterventionDirtySelector({
      id,
      path: ["periodSelection", "type"],
    })
  );
  const periodTypes = useMemo(() => {
    const periodTypes = new PeriodType().get();
    const relativePeriodTypes = filter(periodTypes, (type) => type.name.includes("Relative"));
    const fixedPeriodTypes = filter(periodTypes, (type) => !type.name.includes("Relative"));

    return {
      relative: relativePeriodTypes,
      fixed: fixedPeriodTypes,
    };
  }, []);

  return (
    <div className="interventionConfig">
      <InputField value={name} onChange={({ value }: { value: string }) => setName(value)} name={"name"} label={"Intervention Name"} />
      <TextAreaField
        value={description}
        label={i18n.t("Description")}
        name="description"
        onChange={({ value }: { value: string }) => setDescription(value)}
        placeholder={i18n.t("Enter a description")}
      />
      <SingleSelectField
        filterable
        selected={periodType}
        name={"periodType"}
        label={i18n.t("Bottleneck Period Type")}
        onChange={({ selected }: { selected: string }) => setPeriodType(selected)}>
        <SingleSelectOption className={classes["single-select-header"]} disabled label={i18n.t("Fixed Periods")} />
        {periodTypes?.fixed?.map(({ id, name }: { id: string; name: string }) => (
          <SingleSelectOption key={`${id}-option`} value={id} label={`${name}`} />
        ))}
        <SingleSelectOption className={classes["single-select-header"]} disabled label={i18n.t("Relative Periods")} />
        {periodTypes?.relative?.map(({ id, name }: { id: string; name: string }) => (
          <SingleSelectOption key={`${id}-option`} value={id} label={`${name}`} />
        ))}
      </SingleSelectField>
      <OrgUnitLevelSelector />
    </div>
  );
}
