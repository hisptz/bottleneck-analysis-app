import i18n from "@dhis2/d2-i18n";
import { CheckboxField, Field } from "@dhis2/ui";
import React from "react";
import { Controller } from "react-hook-form";
import FacilityLayer from "../FacilityLayer";

export default function OtherLayers() {
  return (
    <Field label={i18n.t("Other Layers")}>
      <div className="column gap-16">
        <Controller
          render={({ field }) => {
            return <CheckboxField label={i18n.t("Boundary")} checked={field.value}
                                  onChange={({ checked }: { checked: boolean }) => field.onChange(checked)} />;
          }}
          name={"map.coreLayers.boundaryLayer.enabled"}
        />
        <FacilityLayer />
      </div>
    </Field>

  );
}
