import React, { useCallback, useState } from "react";
import "./styles/thematic-config.css";
import { Button, CheckboxField, colors, Field, IconAdd16 } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { Controller, FieldError, useFormContext, useWatch } from "react-hook-form";
import { ThematicMapLayer } from "../../../../../../../../shared/interfaces/interventionConfig";
import { ThematicLayerConfigModal } from "./components/ThematicLayerConfigModal";
import classes from "./styles/ThematicConfig.module.css";

function SingleThematicLayerConfig({
                                     value,
                                     onChange,
                                     error
                                   }: {
  value: ThematicMapLayer;
  error?: FieldError;
  onChange: (newValue: ThematicMapLayer) => void;
}) {
  const [openConfig, setOpenConfig] = useState(false);
  const onUpdate = useCallback(
    (updatedIndicatorValue: ThematicMapLayer) => {
      onChange(updatedIndicatorValue);
    },
    [onChange, value]
  );

  const onEnableToggle = useCallback(
    ({ checked }: { checked: boolean }) => {
      onChange({ ...value, enabled: checked });
    },
    [onChange, value]
  );

  const type = value.type;

  return (
    <div className="h-100 w-100">
      <Field className={classes["h-100"]} fullWidth error={!!error} validationText={error?.message}>
        <div style={error ? { borderColor: colors.red600 } : {}} className="thematic-config-card">
          <div className="row space-between align-center">
            <h4 className="thematic-config-card-header">{value.indicator?.name}</h4>
            <CheckboxField checked={value?.enabled} onChange={onEnableToggle} />
          </div>
          <div className="column gap-8 ">
            <p style={{ margin: 0 }}>{i18n.t("Type")}: {type === "choropleth" ? i18n.t("Choropleth Layer") : i18n.t("Bubble Layer")}</p>
            <Button onClick={() => setOpenConfig(true)}>{value?.indicator?.id ? i18n.t("Update") : i18n.t("Configure")}</Button>
            {openConfig && (
              <ThematicLayerConfigModal

                onChange={onUpdate}
                config={value} onClose={() => setOpenConfig(false)}
                open={openConfig}
              />
            )}
          </div>
        </div>
      </Field>
    </div>
  );
}

export default function ThematicLayerConfig() {
  const { setValue } = useFormContext();
  const thematicLayers = useWatch({
    name: "map.coreLayers.thematicLayers"
  });
  const [openAdd, setOpenAdd] = useState(false);


  const onAdd = useCallback(
    (value: ThematicMapLayer) => {
      setValue(`map.coreLayers.thematicLayers.${thematicLayers.length}`, value);
    },
    [thematicLayers]
  );


  return (
    <div className="column gap-8">
      <div className="row space-between align-items-center ">
        <p style={{ margin: 0 }}>{i18n.t("Thematic Layers")}</p>
        <Button onClick={() => setOpenAdd(true)} small icon={<IconAdd16 />}>{i18n.t("Add layer")}</Button>
      </div>
      <div style={{ whiteSpace: "normal", display: "grid", gridTemplateColumns: "auto auto", gridGap: 8, justifyItems: "stretch" }}>
        {
          thematicLayers.map((thematic: ThematicMapLayer, i: number) => {
            return (
              <Controller
                rules={{
                  validate: (value) => {
                    if (value.enabled && !value.indicator?.id) {
                      return i18n.t("Please select an indicator");
                    }
                    return true;
                  }
                }}
                render={({ field, fieldState }) => {
                  return <SingleThematicLayerConfig {...field} {...fieldState} error={fieldState.error} />;
                }}
                name={`map.coreLayers.thematicLayers.${i}`}
              />
            );
          })
        }
      </div>
      {
        openAdd && <ThematicLayerConfigModal
          selectedIndicators={thematicLayers.map((layer: ThematicMapLayer) => layer?.indicator?.id)}
          onChange={onAdd}
          onClose={() => setOpenAdd(false)}
          open={openAdd} config={{
          enabled: false,
          type: "choropleth"
        } as ThematicMapLayer} />
      }
    </div>
  );
}
