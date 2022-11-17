import i18n from "@dhis2/d2-i18n";
import { CheckboxField, Field } from "@dhis2/ui";
import React from "react";
import { Controller } from "react-hook-form";

export default function BoundaryLayer() {
  return (
    <Field label={i18n.t("Boundary Layer")}>
      <div className="column gap-16">
        <Controller
          render={({ field }) => {
            return <CheckboxField label={i18n.t("Enable boundary layer")} checked={field.value}
                                  onChange={({ checked }: { checked: boolean }) => field.onChange(checked)} />;
          }}
          name={"map.coreLayers.boundaryLayer.enabled"}
        />
      </div>
    </Field>

  );
}
