import { Field } from "@dhis2/ui";
import { CustomInput } from "@hisptz/react-ui";
import { cloneDeep, set } from "lodash";
import React from "react";
import "./LegendDefinitionConfig.css";
import { Controller } from "react-hook-form";

export function LegendDefinitionConfigDetails(): React.ReactElement {
  return (
    <div className="legend-definition-config">
      <Controller
        name={"legendDefinitions"}
        render={({ field, fieldState }) => {
          const onChange = (index: number, value: { value: any; name: string }) => {
            const newValue = cloneDeep(field.value);
            set(newValue, [index], value);
            field.onChange(newValue);
          };

          return (
            <Field error={fieldState.error} validationText={fieldState?.error?.message}>
              {field.value?.map((legendDefinition: { name: any }, index: number) => (
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
