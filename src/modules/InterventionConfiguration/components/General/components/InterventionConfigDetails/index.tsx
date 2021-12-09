import i18n from "@dhis2/d2-i18n";
import { InputField, SingleSelectField, SingleSelectOption, TextAreaField } from "@dhis2/ui";
import { PeriodType } from "@iapps/period-utilities";
import { filter, find } from "lodash";
import React, { useMemo } from "react";
import "./InterventionConfigDetails.css";
import { Controller, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionSummary } from "../../../../../../core/state/intervention";
import classes from "../../../../General.module.css";
import OrgUnitLevelSelector from "../OrgUnitLevelSelector";

export default function InterventionConfigDetails(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { control } = useFormContext();

  const summaries = useRecoilValue(InterventionSummary);
  const filteredSummaries = filter(summaries, (summary) => summary.id !== id);

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
      <Controller
        rules={{
          required: i18n.t("Name is required"),
          validate: (value) => {
            return (
              !find(filteredSummaries, (summary) => summary.name === value) ||
              i18n.t(
                "An intervention with this name already exists. Please provide a different name. For related interventions, consider using differentiating keywords/version numbers (e.g v2 )"
              )
            );
          },
        }}
        control={control}
        name={"name"}
        render={({ field, fieldState }) => (
          <InputField
            required
            error={fieldState?.error}
            dataTest={"interventionName"}
            validationText={fieldState?.error?.message}
            value={field.value}
            onChange={({ value }: { value: string }) => field.onChange(value)}
            name={field.name}
            label={i18n.t("Intervention Name")}
          />
        )}
      />
      <Controller
        render={({ field, fieldState }) => (
          <TextAreaField
            value={field.value}
            label={i18n.t("Description")}
            dataTest={"interventionDescription"}
            name={field.name}
            onChange={({ value }: { value: string }) => field.onChange(value)}
            placeholder={i18n.t("Enter a description")}
            error={fieldState.error}
            validationText={fieldState.error?.message}
          />
        )}
        name={"description"}
      />
      <Controller
        render={({ field, fieldState }) => (
          <SingleSelectField
            error={fieldState.error}
            validationText={fieldState.error?.message}
            filterable
            dataTest={"periodType-selection-menu"}
            selected={field.value}
            name={field.name}
            label={i18n.t("Bottleneck Period Type")}
            onChange={({ selected }: { selected: string }) => field.onChange(selected)}>
            <SingleSelectOption className={classes["single-select-header"]} disabled label={i18n.t("Fixed Periods")} />
            {periodTypes?.fixed?.map(({ id, name }: { id: string; name: string }) => (
              <SingleSelectOption dataTest={"periodType-selection-menu-item"} key={`${id}-option`} value={id} label={`${name}`} />
            ))}
            <SingleSelectOption className={classes["single-select-header"]} disabled label={i18n.t("Relative Periods")} />
            {periodTypes?.relative?.map(({ id, name }: { id: string; name: string }) => (
              <SingleSelectOption dataTest={"periodType-selection-menu-item"} key={`${id}-option`} value={id} label={`${name}`} />
            ))}
          </SingleSelectField>
        )}
        name={"periodType"}
      />
      <OrgUnitLevelSelector />
    </div>
  );
}
