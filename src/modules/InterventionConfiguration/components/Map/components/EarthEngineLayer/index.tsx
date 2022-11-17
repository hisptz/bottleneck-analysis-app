import { Controller, FieldError, useFormContext, useWatch } from "react-hook-form";
import React, { useCallback, useState } from "react";
import { Button, CheckboxField, colors, Field, IconAdd16, IconCross16 } from "@dhis2/ui";
import classes from "../ThematicLayer/styles/ThematicConfig.module.css";
import { IconButton } from "@material-ui/core";
import i18n from "@dhis2/d2-i18n";
import { EarthEngineLayerConfigModal } from "@hisptz/react-ui";
import { CustomGoogleEngineLayer } from "@hisptz/react-ui/build/types/components/Map/components/MapLayer/interfaces";
import { capitalize, filter, isEmpty, remove } from "lodash";

function SingleEarthEngineLayerConfig({
                                        value,
                                        onChange,
                                        onRemove,
                                        error
                                      }: {
  value: CustomGoogleEngineLayer;
  error?: FieldError;
  onChange: (newValue: CustomGoogleEngineLayer) => void;
  onRemove: (value: CustomGoogleEngineLayer) => void;
}) {
  const [openConfig, setOpenConfig] = useState(false);
  const onUpdate = useCallback(
    (updatedIndicatorValue: CustomGoogleEngineLayer) => {
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
              <h4 className="thematic-config-card-header">{capitalize(type)}</h4>
            </div>
            <IconButton onClick={onRemoveClick} style={{ padding: 2 }}>
              <IconCross16 />
            </IconButton>
          </div>
          <div className="column gap-8 ">
            <Button onClick={() => setOpenConfig(true)}>{type ? i18n.t("Update") : i18n.t("Configure")}</Button>
            {openConfig && (
              <EarthEngineLayerConfigModal
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


export default function EarthEngineLayerConfig() {
  const { setValue } = useFormContext();
  const earthEngineLayers = useWatch({
    name: "map.coreLayers.earthEngineLayers"
  });
  const [openAdd, setOpenAdd] = useState(false);


  const onAdd = useCallback(
    (value: CustomGoogleEngineLayer) => {
      if (Array.isArray(earthEngineLayers)) {
        setValue(`map.coreLayers.earthEngineLayers.${earthEngineLayers?.length}`, value);
      } else {
        setValue(`map.coreLayers.earthEngineLayers`, [value]);
      }
    },
    [earthEngineLayers]
  );

  const onRemove = useCallback(
    (value: CustomGoogleEngineLayer) => {
      console.log(filter(earthEngineLayers, (layer) => layer.id !== value.id));
      setValue(`map.coreLayers.earthEngineLayers`, [...remove(earthEngineLayers, (layer: CustomGoogleEngineLayer) => layer.id !== value.id)]);
    },
    [earthEngineLayers]
  );


  return (
    <div className="column gap-8 align-items-center">
      <div className="row w-100 space-between align-items-center ">
        <p style={{ margin: 0 }}>{i18n.t("Earth engine Layers")}</p>
        <Button onClick={() => setOpenAdd(true)} small icon={<IconAdd16 />}>{i18n.t("Add layer")}</Button>
      </div>
      <div className="w-100"
           style={{ whiteSpace: "normal", display: "grid", gridTemplateColumns: "auto auto", gridGap: 8, justifyItems: "stretch" }}>
        {
          earthEngineLayers?.map((thematic: CustomGoogleEngineLayer, i: number) => {
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
                  return <SingleEarthEngineLayerConfig {...field} {...fieldState} error={fieldState.error} onRemove={onRemove} />;
                }}
                name={`map.coreLayers.earthEngineLayers.${i}`}
              />
            );
          })
        }
      </div>
      {
        isEmpty(earthEngineLayers) && <p>{i18n.t("Click on add layer to add earth engine layers")}</p>
      }
      {
        openAdd && <EarthEngineLayerConfigModal
          exclude={[]}
          onChange={onAdd}
          onClose={() => setOpenAdd(false)}
          open={openAdd}
        />
      }
    </div>
  );
}
