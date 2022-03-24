import i18n from "@dhis2/d2-i18n";
import { Field } from "@dhis2/ui";
import { CustomInput } from "@hisptz/react-ui";
import React from "react";
import "./LegendDefinitionConfig.css";
import { Controller } from "react-hook-form";

export function LegendDefinitionConfigDetails(): React.ReactElement {
  return (
    <div className="legend-definition-config w-100">
      <Controller
        name={"dataSelection.legendDefinitions"}
        render={({ field, fieldState }) => {
          return (
            <div className="w-100">
              <Field error={fieldState.error} validationText={fieldState.error?.message}>
                <CustomInput
                  multipleField={{
                    valueType: "LEGEND_DEFINITION",
                    input: {
                      name: "",
                      value: "",
                      onChange: () => {},
                    },
                  }}
                  input={{
                    onChange: field.onChange,
                    value: field.value,
                    name: field.name,
                  }}
                  label={i18n.t("Legend Definitions")}
                  valueType={"MULTIPLE_FIELDS"}
                />
              </Field>
            </div>
          );
        }}
      />
    </div>
  );
}
