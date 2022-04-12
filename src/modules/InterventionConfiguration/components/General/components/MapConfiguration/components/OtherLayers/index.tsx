import i18n from "@dhis2/d2-i18n";
import { CheckboxField, Field } from "@dhis2/ui";
import React from "react";
import { Controller } from "react-hook-form";

export default function OtherLayers() {
  return (
    <div className="column gap">
      <Field label={i18n.t("Other Layers")}>
        <Controller
          render={({ field }) => {
            return <CheckboxField label={i18n.t("Boundary")} checked={field.value} onChange={({ checked }: { checked: boolean }) => field.onChange(checked)} />;
          }}
          name={"map.coreLayers.boundaryLayer.enabled"}
        />
        <Controller
          render={({ field }) => {
            return <CheckboxField label={i18n.t("Facility")} checked={field.value} onChange={({ checked }: { checked: boolean }) => field.onChange(checked)} />;
          }}
          name={"map.coreLayers.facilityLayer.enabled"}
        />
      </Field>
    </div>
  );
}
