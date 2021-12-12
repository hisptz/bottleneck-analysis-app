import i18n from "@dhis2/d2-i18n";
import { InputField, TextAreaField } from "@dhis2/ui";
import { filter, find } from "lodash";
import React from "react";
import "./InterventionConfigDetails.css";
import { ErrorBoundary } from "react-error-boundary";
import { Controller, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionSummary } from "../../../../../../core/state/intervention";
import OrgUnitLevelSelector from "../OrgUnitLevelSelector";
import OrgUnitLevelError from "../OrgUnitLevelSelector/components/Error";
import PeriodSelector from "../PeriodSelector";

export default function InterventionConfigDetails(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { control } = useFormContext();

  const summaries = useRecoilValue(InterventionSummary);
  const filteredSummaries = filter(summaries, (summary) => summary.id !== id);

  return (
    <div className="interventionConfig">
      <div className="interventionConfigName">
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
      </div>
      <div className="intervnameConfigDesc">
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
      </div>
      <div className="intervnameConfigPeriodType">
        <Controller render={({ field, fieldState }) => <PeriodSelector field={field} fieldState={fieldState} />} name={"periodSelection"} />
      </div>
      <ErrorBoundary FallbackComponent={OrgUnitLevelError}>
        <OrgUnitLevelSelector />
      </ErrorBoundary>
    </div>
  );
}
