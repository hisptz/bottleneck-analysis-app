import React, { useCallback, useMemo, useState } from "react";
import "./styles/thematic-config.css";
import {
  Button,
  CheckboxField,
  colors,
  Field,
  IconWarning16,
  Tag,
  Modal,
  ModalContent,
  ModalTitle,
  ModalActions,
  ButtonStrip,
  InputField,
  Radio,
  SingleSelectField,
  SingleSelectOption
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { Controller, FieldError, useForm, useFormContext, FormProvider, useWatch } from "react-hook-form";
import { useRecoilValueLoadable } from "recoil";
import { IndicatorState } from "../../../../../../../../core/state/data";
import { ThematicLayerType, ThematicMapLayer } from "../../../../../../../../shared/interfaces/interventionConfig";
import { compact, findIndex, head, isEmpty } from "lodash";
import IndicatorSelectorModal from "./components/IndicatorSelectorModal";
import { useDataQuery } from "@dhis2/app-runtime";
import type { LegendSet } from "@hisptz/dhis2-utils";
import { DevTool } from "@hookform/devtools";
import ColorScaleSelect from "./components/ColorScaleSelect";
import { COLOR_PALETTES } from "./components/ColorScaleSelect/constants/colors";
import { defaultClasses, defaultColorScaleName } from "./components/ColorScaleSelect/utils/colors";

const legendSetQuery = {
  legendSets: {
    resource: "legendSets",
    params: {
      fields: [
        "displayName",
        "id"
      ]
    }
  }
};


function CustomLegend() {
  const scale = useWatch({
    name: "legendConfig.scale"
  });

  return (
    <div className="row gap-16 space-between">
      <div style={{ width: "30%" }}>
        <Controller
          name="legendConfig.scale"
          render={({ field, fieldState }) => (
            <SingleSelectField
              selected={field.value?.toString() ?? defaultClasses.toString()}
              label={i18n.t("Classes")}
              onChange={({ selected }: { selected: string }) =>
                field.onChange(parseInt(selected))}
              name="scale">
              {
                [3, 4, 5, 6, 7, 8, 9].map((value) => <SingleSelectOption label={`${value}`} value={value?.toString()} />)
              }

            </SingleSelectField>)}
        />
      </div>
      <div style={{ width: "70%" }}>
        <Controller
          name="legendConfig.colorClass"
          render={({ field, formState }) => (
            <Field label={i18n.t("Colors")}>
              <ColorScaleSelect count={scale ?? defaultClasses} colorClass={field.value ?? defaultColorScaleName} width={300}
                                onChange={field.onChange} />
            </Field>)}
        />
      </div>
    </div>
  );
}


function LegendSetSelector({
                             selected,
                             onChange,
                             error,
                             required,
                             ...props
                           }: { selected?: string, onChange: (value: string) => void, error?: { message?: string }, required?: boolean }) {
  const { loading, data } = useDataQuery(legendSetQuery);

  const options = useMemo(() => {
    if (data) {
      return (data?.legendSets as { legendSets?: LegendSet[] })?.legendSets?.map(({ displayName, id }) => ({
        label: displayName,
        value: id
      }));
    }
    return [];
  }, [data]);

  return (
    <SingleSelectField required={required} error={Boolean(error)} validationText={error?.message} {...props} label={i18n.t("Legend set")}
                       filterable
                       selected={selected}
                       loadingText={i18n.t("Please wait...")}
                       onChange={({ selected }: { selected: string }) => onChange(selected)} loading={loading}>
      {
        options?.map(({ label, value }) => (<SingleSelectOption label={label} value={value} />))
      }
    </SingleSelectField>
  );
}


function ThematicLayerConfigModal({
                                    type,
                                    onClose,
                                    open,
                                    config,
                                    onChange
                                  }: { onChange: (value: ThematicMapLayer) => void, type: string, onClose: () => void, open: boolean, config: ThematicMapLayer }) {
  const form = useForm<ThematicMapLayer>({
    defaultValues: {
      ...config,
      legendConfig: config.legendConfig?.legendSet ? config?.legendConfig : {
        ...config.legendConfig,
        scale: defaultClasses,
        colorClass: defaultColorScaleName
      }
    }
  });
  const [legendType, setLegendType] = useState(config.legendConfig?.legendSet ? "legendSet" : "custom");
  const [dataSelectorOpen, setDataSelectorOpen] = useState(false);

  const onSaveSubmit = useCallback(
    (value: ThematicMapLayer) => {
      onChange(value);
      onClose();
    },
    [onChange]
  );

  const onLegendTypeChange = (type: string) => ({ value }: { value: string }) => {
    if (type === "custom") {
      form.setValue("legendConfig.legendSet", undefined);
      form.setValue("legendConfig.scale", defaultClasses);
      form.setValue("legendConfig.colorClass", defaultColorScaleName);
    } else {
      form.setValue("legendConfig.scale", undefined);
      form.setValue("legendConfig.colorClass", undefined);
    }
    setLegendType(value);
  };

  return (
    <FormProvider {...form}>
      <DevTool control={form.control} />
      <Modal position="center" onClose={onClose} open={open}>
        <ModalTitle>
          {type === "choropleth" ? i18n.t("Choropleth Layer Configuration") : i18n.t("Bubble Layer Configuration")}
        </ModalTitle>
        <ModalContent>
          <div className="column gap-16">
            <Controller rules={{
              validate: (value: { id: string; name: string }) => {
                return Boolean(value.id) || i18n.t("An indicator is required");
              }
            }}
                        render={({ field, fieldState }) => (<>
                          <div className="row gap-16 align-end">
                            <div className="flex-1">
                              <InputField required error={Boolean(fieldState.error)} validationText={fieldState.error?.message} disabled
                                          inputWidth="100%" label={i18n.t("Indicator")} value={field.value?.name} />
                            </div>
                            <Button
                              onClick={() => setDataSelectorOpen(true)}>{field.value?.id ? i18n.t("Change") : i18n.t("Select")}</Button>
                          </div>
                          {
                            dataSelectorOpen && (<IndicatorSelectorModal
                              onUpdate={(values: any[]) => {
                                const [indicator] = values ?? [];
                                field.onChange({
                                  id: indicator.id,
                                  name: indicator.displayName
                                });
                              }}
                              onClose={() => setDataSelectorOpen(false)}
                              hide={!dataSelectorOpen}
                              selected={compact([{
                                id: field.value?.id,
                                displayName: field.value?.name
                              }])}
                            />)
                          }
                        </>)} name={"indicator"} />
            <div>
              <Field label={i18n.t("Legend")}>
                <div className="column gap-8">
                  <div className="row gap-16">
                    <Radio checked={legendType === "legendSet"} label={i18n.t("Legend set")} name="legendSet" value="legendSet"
                           onChange={onLegendTypeChange("legendSet")} />
                    <Radio checked={legendType === "custom"} label={i18n.t("Custom legend")} name="custom" value="custom"
                           onChange={onLegendTypeChange("custom")} />
                  </div>
                  <div>
                    {
                      legendType === "legendSet" && (<Controller
                        rules={{
                          required: i18n.t("Legend set is required")
                        }}
                        name="legendConfig.legendSet"
                        render={({ field, fieldState }) => (<LegendSetSelector required selected={field.value} {...field} {...fieldState} />)}
                      />)
                    }
                    {
                      legendType === "custom" && (<CustomLegend />)
                    }
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <ButtonStrip>
            <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
            <Button onClick={form.handleSubmit(onSaveSubmit)} primary>{i18n.t("Save")}</Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    </FormProvider>
  );
}


function SingleThematicLayerConfig({
                                     type,
                                     value,
                                     onChange,
                                     error
                                   }: {
  type: ThematicLayerType;
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

  return (
    <div className="h-100 w-100">
      <Field fullWidth error={!!error} validationText={error?.message}>
        <div style={error ? { borderColor: colors.red600 } : {}} className="thematic-config-card">
          <div className="row space-between align-center">
            <h4 className="thematic-config-card-header">{type === "choropleth" ? i18n.t("Choropleth Layer") : i18n.t("Bubble Layer")}</h4>
            <CheckboxField checked={value?.enabled} onChange={onEnableToggle} />
          </div>
          {value?.enabled && (
            <div className="column gap-8">
              <p style={{ margin: 0 }}>{value.indicator?.name}</p>
              <Button onClick={() => setOpenConfig(true)}>{value?.indicator?.id ? i18n.t("Update") : i18n.t("Configure")}</Button>
              {openConfig && (
                <ThematicLayerConfigModal onChange={onUpdate} config={value} type={type} onClose={() => setOpenConfig(false)}
                                          open={openConfig} />
              )}
            </div>
          )}
        </div>
      </Field>
    </div>
  );
}

export default function ThematicLayerConfig() {
  const { getValues } = useFormContext();
  const thematicLayers = getValues("map.coreLayers.thematicLayers") as Array<ThematicMapLayer>;
  const choroplethIndex = findIndex(thematicLayers, { type: "choropleth" });
  const bubbleIndex = findIndex(thematicLayers, { type: "bubble" });

  return (
    <Field label={i18n.t("Thematic Layers")}>
      <div style={{ whiteSpace: "normal" }} className="row wrap gap-16 h-100">
        <div style={{ width: "48%" }}>
          <Controller
            rules={{
              validate: (value) => {
                if (value.enabled && !value.indicator) {
                  return i18n.t("Please select an indicator");
                }
                return true;
              }
            }}
            render={({ field, fieldState }) => {
              return <SingleThematicLayerConfig {...field} {...fieldState} error={fieldState.error} type={"choropleth"} />;
            }}
            name={`map.coreLayers.thematicLayers.${choroplethIndex}`}
          />
        </div>
        <div style={{ width: "48%" }}>
          <Controller
            rules={{
              validate: (value) => {
                if (value.enabled && !value.indicator) {
                  return i18n.t("Please select an indicator");
                }
                return true;
              }
            }}
            render={({ field, fieldState }) => {
              return <SingleThematicLayerConfig {...field} {...fieldState} type={"bubble"} />;
            }}
            name={`map.coreLayers.thematicLayers.${bubbleIndex}`}
          />
        </div>
      </div>
    </Field>
  );
}
