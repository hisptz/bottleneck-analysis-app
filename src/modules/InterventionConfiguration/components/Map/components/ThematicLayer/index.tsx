import React, { useCallback, useMemo, useState } from "react";
import "./styles/thematic-config.css";
import { Button, CheckboxField, colors, Field, IconAdd16, IconCross16, Pagination } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { Controller, FieldError, useFieldArray } from "react-hook-form";
import classes from "./styles/ThematicConfig.module.css";
import { IconButton } from "@material-ui/core";
import { chunk, isEmpty } from "lodash";
import { uid } from "@hisptz/dhis2-utils";
import { ThematicLayerConfigModal } from "@hisptz/react-ui";
import {
  ThematicLayerConfig as ThematicLayerConfigInterface
} from "@hisptz/react-ui/build/types/components/Map/components/MapLayer/interfaces";

function SingleThematicLayerConfig({
                                     value,
                                     onChange,
                                     onRemove,
                                     error
                                   }: {
  value: ThematicLayerConfigInterface;
  error?: FieldError;
  onChange: (newValue: ThematicLayerConfigInterface) => void;
  onRemove: () => void;
}) {
  const [openConfig, setOpenConfig] = useState(false);
  const onUpdate = useCallback(
    (updatedIndicatorValue: ThematicLayerConfigInterface) => {
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
              <h4 className="thematic-config-card-header">{value?.dataItem?.displayName}</h4>
            </div>
            <IconButton onClick={onRemoveClick} style={{ padding: 2 }}>
              <IconCross16 />
            </IconButton>
          </div>
          <div className="column gap-8 ">
            <p style={{ margin: 0 }}>{i18n.t("Type")}: {type === "choropleth" ? i18n.t("Choropleth Layer") : i18n.t("Bubble Layer")}</p>
            <Button onClick={() => setOpenConfig(true)}>{value?.dataItem?.id ? i18n.t("Update") : i18n.t("Configure")}</Button>
            {openConfig && (
              <ThematicLayerConfigModal
                position="middle"
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
  const { fields, append, remove } = useFieldArray({
    name: "map.coreLayers.thematicLayers",
    keyName: "fieldId"
  });
  const [openAdd, setOpenAdd] = useState(false);
  const [page, setPage] = useState(1);

  const onAdd = useCallback(
    (value: ThematicLayerConfigInterface) => {
      append(value);
    },
    [append]
  );

  const onRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove]
  );

  const fieldChunks = useMemo(() => {
    return chunk(fields, 4);
  }, [fields]);

  return (
    <div className="column gap-8 align-items-center">
      <div className="row w-100 space-between align-items-center ">
        <p style={{ margin: 0 }}>{i18n.t("Thematic layers")}</p>
        <Button onClick={() => setOpenAdd(true)} small icon={<IconAdd16 />}>{i18n.t("Add layer")}</Button>
      </div>
      <div className="column gap-8 w-100">
        <div className="w-100"
             style={{ whiteSpace: "normal", display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 32, justifyItems: "stretch" }}>
          {
            fieldChunks[page - 1]?.map((field: any, i: number) => {
              return (
                <Controller
                  key={`${field.id}-${i}-config`}
                  rules={{
                    validate: (value) => {
                      if (value.enabled && !value.indicator?.id) {
                        return i18n.t("Please select an indicator");
                      }
                      return true;
                    }
                  }}
                  render={({ field, fieldState }) => {
                    return <SingleThematicLayerConfig
                      {...field}
                      {...fieldState}
                      error={fieldState.error}
                      onRemove={onRemove(i)} />;
                  }}
                  name={`map.coreLayers.thematicLayers.${i}`}
                />
              );
            })
          }
        </div>
        {
          fieldChunks.length > 1 && (
            <div className="w-100 row end">
              <Pagination
                page={page}
                hidePageSizeSelect
                hidePageSelect
                pageSummaryText={i18n.t("There are a total of {{ count }} layers configured. Click next or previous to view others.", {
                  count: fields?.length
                })}
                onPageChange={(page: number) => {
                  setPage(page);
                }}
                pageCount={fieldChunks.length}
              />
            </div>
          )
        }
      </div>
      {
        isEmpty(fields) && <p>{i18n.t("Click on add layer to add thematic layers")}</p>
      }
      {
        openAdd && <ThematicLayerConfigModal
          position="middle"
          exclude={fields.map((layer: any) => layer?.dataItem?.id)}
          onChange={onAdd}
          onClose={() => setOpenAdd(false)}
          open={openAdd}
          config={{
            id: uid(),
            enabled: isEmpty(fields),
            type: "choropleth"
          } as ThematicLayerConfigInterface} />
      }
    </div>
  );
}
