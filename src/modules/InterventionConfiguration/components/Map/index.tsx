import i18n from "@dhis2/d2-i18n";
import { CheckboxField } from "@dhis2/ui";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import BoundaryLayer from "./components/BoundaryLayer";
import ThematicLayerConfig from "./components/ThematicLayer";
import FacilityLayer from "./components/FacilityLayer";
import EarthEngineLayerConfig from "./components/EarthEngineLayer";

export default function MapConfiguration(): React.ReactElement {
  const { watch } = useFormContext();
  const enabled = watch("map.enabled");

  return (
    <div className="w-100 h-100 general-config-container ">
      <div style={{ gap: 32 }} className=" column general-config-area-1">
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
            <BoundaryLayer />
          </>
        )}
      </div>
      {
        enabled && (<div style={{ gap: 32 }} className="column general-config-area-2">
          <FacilityLayer />
          <EarthEngineLayerConfig />
        </div>)
      }
    </div>
  );
}
