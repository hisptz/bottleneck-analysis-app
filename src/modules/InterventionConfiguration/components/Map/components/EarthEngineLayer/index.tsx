import { Controller, FieldError, useFieldArray } from "react-hook-form";
import React, { useCallback, useState } from "react";
import { Button, CheckboxField, colors, Field, IconAdd16, IconCross16 } from "@dhis2/ui";
import classes from "../ThematicLayer/styles/ThematicConfig.module.css";
import { IconButton } from "@material-ui/core";
import i18n from "@dhis2/d2-i18n";
import { EarthEngineLayerConfigModal } from "./components/EarthEngineConfigModal";
import {
  EarthEngineLayerConfig as EarthEngineConfigInterface
} from "@hisptz/react-ui/build/types/components/Map/components/MapLayer/interfaces";
import { capitalize, isEmpty } from "lodash";

function SingleEarthEngineLayerConfig({
                                        value,
                                        onChange,
                                        onRemove,
                                        error
                                      }: {
  value: EarthEngineConfigInterface;
  error?: FieldError;
  onChange: (newValue: EarthEngineConfigInterface) => void;
  onRemove: () => void;
}) {
  const [openConfig, setOpenConfig] = useState(false);
  const onUpdate = useCallback(
    (updatedIndicatorValue: EarthEngineConfigInterface) => {
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
      onRemove();
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
  const { fields: earthEngineLayers, remove, append } = useFieldArray({
    name: "map.earthEngineLayers",
    keyName: "fieldId"
  });
  const [openAdd, setOpenAdd] = useState(false);


  const onAdd = useCallback(
    (value: EarthEngineConfigInterface) => {
      if (isEmpty(earthEngineLayers)) {
        append({ ...value, enabled: true });
      } else {
        append(value);
      }

    },
    [append, earthEngineLayers]
  );

  const onRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove]
  );


  return (
    <div className="column gap-8 align-items-center">
      <div className="row w-100 space-between align-items-center ">
        <p style={{ margin: 0 }}>{i18n.t("Earth engine layers")}</p>
        <Button onClick={() => setOpenAdd(true)} small icon={<IconAdd16 />}>{i18n.t("Add layer")}</Button>
      </div>
      <div className="w-100"
           style={{ whiteSpace: "normal", display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 8, justifyItems: "stretch" }}>
        {
          earthEngineLayers?.map((thematic: any, i: number) => {
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
                  return <SingleEarthEngineLayerConfig {...field} {...fieldState} error={fieldState.error} onRemove={onRemove(i)} />;
                }}
                name={`map.earthEngineLayers.${i}`}
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
          position={"middle"}
          exclude={earthEngineLayers.map(({ id }: any) => id)}
          onChange={onAdd}
          onClose={() => setOpenAdd(false)}
          open={openAdd}
        />
      }
    </div>
  );
}
