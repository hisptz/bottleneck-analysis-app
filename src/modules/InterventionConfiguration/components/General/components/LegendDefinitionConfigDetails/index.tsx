import { Field } from "@dhis2/ui";
import { CustomInput } from "@hisptz/react-ui";
import { cloneDeep, set } from "lodash";
import React from "react";
import "./LegendDefinitionConfig.css";
import { Controller, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionDirtySelector } from "../../../../state/data";

export function LegendDefinitionConfigDetails(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { control } = useFormContext();
  const legendDefinitions = useRecoilValue(
    InterventionDirtySelector({
      id,
      path: ["dataSelection", "legendDefinitions"],
    })
  );

  return (
    <div className="legend-definition-config">
      <Controller
        control={control}
        name={"dataSelection.legendDefinitions"}
        render={({ field, fieldState }) => {
          const onChange = (index: number, value: { value: any; name: string }) => {
            const newValue = cloneDeep(field.value);
            set(newValue, [index], value);
            field.onChange(newValue);
          };

          return (
            <Field error={fieldState.error} validationText={fieldState?.error?.message}>
              {legendDefinitions?.map((legendDefinition: { name: any }, index: number) => (
                <CustomInput
                  key={`${legendDefinition.name}-legendDefinitionConfig`}
                  input={{
                    onChange: (value) => onChange(index, value),
                    value: field.value[index],
                    name: "",
                  }}
                  valueType={"LEGEND_DEFINITION"}
                />
              ))}
            </Field>
          );
        }}
      />
    </div>
  );
}
