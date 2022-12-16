import { ThematicMapLayer } from "../../../../../../../../shared/interfaces/interventionConfig";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { defaultClasses, defaultColorScaleName } from "../ColorScaleSelect/utils/colors";
import React, { useCallback, useMemo, useState } from "react";
import { DevTool } from "@hookform/devtools";
import {
  Button,
  ButtonStrip,
  Field,
  InputField,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Radio,
  SingleSelectField,
  SingleSelectOption
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import IndicatorSelectorModal from "../IndicatorSelectorModal";
import { compact, isEmpty } from "lodash";
import ColorScaleSelect from "../ColorScaleSelect";
import { useDataQuery } from "@dhis2/app-runtime";
import { LegendSet } from "@hisptz/dhis2-utils";


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
              validationText={fieldState.error?.message}
              error={Boolean(fieldState.error)}
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
          render={({ field }) => (
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
                       selected={!isEmpty(options) ? selected : undefined}
                       loadingText={i18n.t("Please wait...")}
                       onChange={({ selected }: { selected: string }) => onChange(selected)} loading={loading}>
      {
        options?.map(({ label, value }) => (<SingleSelectOption label={label} value={value} />))
      }
    </SingleSelectField>
  );
}


export function ThematicLayerConfigModal({
                                           selectedIndicators,
                                           onClose,
                                           open,
                                           config,
                                           onChange
                                         }: { selectedIndicators?: string[], onChange: (value: ThematicMapLayer) => void; onClose: () => void, open: boolean, config: ThematicMapLayer }) {
  const form = useForm<ThematicMapLayer>({
    defaultValues: {
      ...config,
      legendConfig: config.legendConfig?.legendSet ? config?.legendConfig : {
        ...config.legendConfig,
        scale: config.legendConfig?.scale ?? defaultClasses,
        colorClass: config.legendConfig?.colorClass ?? defaultColorScaleName
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

  const disabled = useMemo(() => selectedIndicators?.filter((indicator) => indicator !== config?.indicator?.id) ?? [], [config, selectedIndicators]);

  return (
    <FormProvider {...form}>
      <DevTool control={form.control} />
      <Modal position="center" onClose={onClose} open={open}>
        <ModalTitle>
          {i18n.t("Thematic layer configuration")}
        </ModalTitle>
        <ModalContent>
          <div className="column gap-16">
            <Controller
              rules={{
                required: i18n.t("Layer type is required")
              }}
              render={
                ({ field, fieldState }) => {
                  return <SingleSelectField label={i18n.t("Layer type")} required error={Boolean(fieldState.error)}
                                            validationText={fieldState.error?.message}
                                            onChange={({ selected }: { selected: string }) => field.onChange(selected)}
                                            selected={field.value}>
                    <SingleSelectOption value={"choropleth"} label={i18n.t("Choropleth")} />
                    <SingleSelectOption value={"bubble"} label={i18n.t("Bubble")} />
                  </SingleSelectField>;
                }
              } name={"type"} />
            <Controller
              rules={{
                validate: {
                  required: (value: { id: string; name: string }) => {
                    return Boolean(value?.id) || i18n.t("An indicator is required");
                  }
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
                    disabled={disabled}
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
