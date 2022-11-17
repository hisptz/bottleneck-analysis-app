import React, { useCallback, useState } from "react";
import "./styles/thematic-config.css";
import { Button, CheckboxField, colors, Field, IconAdd16, IconCross16 } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { Controller, FieldError, useFormContext, useWatch } from "react-hook-form";
import { ThematicMapLayer } from "../../../../../../shared/interfaces/interventionConfig";
import { ThematicLayerConfigModal } from "./components/ThematicLayerConfigModal";
import classes from "./styles/ThematicConfig.module.css";
import { IconButton } from "@material-ui/core";
import { filter, isEmpty, remove } from "lodash";
import { uid } from "@hisptz/dhis2-utils";

function SingleThematicLayerConfig({
                                     value,
                                     onChange,
                                     onRemove,
                                     error
                                   }: {
  value: ThematicMapLayer;
  error?: FieldError;
  onChange: (newValue: ThematicMapLayer) => void;
  onRemove: (value: ThematicMapLayer) => void;
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

  const onRemoveClick = useCallback(
    (event: any) => {
      onRemove(value);
    },
    [value]
  );


  const type = value.type;

  return (
    <div className="h-100 w-100">
      <Field className={classes["h-100"]} fullWidth error={!!error} validationText={error?.message}>
        <div style={error ? { borderColor: colors.red600 } : {}} className="thematic-config-card">
          <div className="row space-between align-center">
            <div className="row gap-4 align-items-center">
              <CheckboxField checked={value?.enabled} onChange={onEnableToggle} />
              <h4 className="thematic-config-card-header">{value.indicator?.name}</h4>
            </div>
            <IconButton onClick={onRemoveClick} style={{ padding: 2 }}>
              <IconCross16 />
            </IconButton>
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

  const onRemove = useCallback(
    (value: ThematicMapLayer) => {
      console.log(filter(thematicLayers, (layer) => layer.id !== value.id));
      setValue(`map.coreLayers.thematicLayers`, [...remove(thematicLayers, (layer: ThematicMapLayer) => layer.id !== value.id)]);
    },
    [thematicLayers]
  );


  return (
    <div className="column gap-8 align-items-center">
      <div className="row w-100 space-between align-items-center ">
        <p style={{ margin: 0 }}>{i18n.t("Thematic Layers")}</p>
        <Button onClick={() => setOpenAdd(true)} small icon={<IconAdd16 />}>{i18n.t("Add layer")}</Button>
      </div>
      <div className="w-100"
           style={{ whiteSpace: "normal", display: "grid", gridTemplateColumns: "auto auto", gridGap: 8, justifyItems: "stretch" }}>
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
                  return <SingleThematicLayerConfig {...field} {...fieldState} error={fieldState.error} onRemove={onRemove} />;
                }}
                name={`map.coreLayers.thematicLayers.${i}`}
              />
            );
          })
        }
      </div>
      {
        isEmpty(thematicLayers) && <p>{i18n.t("Click on add layer to add thematic layers")}</p>
      }
      {
        openAdd && <ThematicLayerConfigModal
          selectedIndicators={thematicLayers.map((layer: ThematicMapLayer) => layer?.indicator?.id)}
          onChange={onAdd}
          onClose={() => setOpenAdd(false)}
          open={openAdd}
          config={{
            id: uid(),
            enabled: isEmpty(thematicLayers),
            type: "choropleth"
          } as ThematicMapLayer} />
      }
    </div>
  );
}
