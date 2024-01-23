import { RHFLegendDefinitionsField } from "@hisptz/react-ui";
import React from "react";
import "./LegendDefinitionConfig.css";
import useResetLegends from "./hooks/useResetLegends";
import { useFormContext } from "react-hook-form";
import i18n from "@dhis2/d2-i18n";

export function LegendDefinitionConfigDetails(): React.ReactElement {
  const { shouldVerify, onResetLegends } = useResetLegends();
  const { control } = useFormContext();

  return (
    <div className="legend-definition-config w-100">
      <RHFLegendDefinitionsField
        label={i18n.t("Legend definitions")}
        shouldVerify={shouldVerify}
        onResetLegends={onResetLegends}
        name={"dataSelection.legendDefinitions"}
        valueType={""}
        control={control}
      />
    </div>
  );
}
