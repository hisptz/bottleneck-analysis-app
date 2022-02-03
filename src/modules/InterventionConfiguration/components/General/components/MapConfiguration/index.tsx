import i18n from "@dhis2/d2-i18n";
import { CheckboxField, Field } from "@dhis2/ui";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import OtherLayers from "./components/OtherLayers";
import ThematicLayerConfig from "./components/ThematicLayer";

export default function MapConfiguration(): React.ReactElement {
  const { watch } = useFormContext();
  const enabled = watch("map.enabled");

  return (
    <Field label={i18n.t("Map Configuration")}>
      <div className="column gap">
        <Controller
          name={"map.enabled"}
          render={({ field, fieldState }) => (
            <CheckboxField
              {...field}
              {...fieldState}
              checked={field.value}
              error={fieldState.error}
              validationText={fieldState.error?.message}
              onChange={({ checked }: { checked: boolean }) => field.onChange(checked)}
              label={i18n.t("Enable map")}
            />
          )}
        />
        {enabled && (
          <>
            <ThematicLayerConfig />
            <OtherLayers />
          </>
        )}
      </div>
    </Field>
  );
}
