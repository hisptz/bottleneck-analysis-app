import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  ButtonStrip,
  CheckboxField,
  colors,
  Field,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Radio,
  SingleSelectField,
  SingleSelectOption
} from "@dhis2/ui";
import { Controller, FormProvider, useController, useForm, useFormContext } from "react-hook-form";
import i18n from "@dhis2/d2-i18n";
import { FacilityMapLayer } from "../../../../../../shared/interfaces/interventionConfig";
import { useConfig, useDataQuery } from "@dhis2/app-runtime";
import { isEmpty, padStart } from "lodash";


const groupSetQuery = {
  groupSets: {
    resource: "organisationUnitGroupSets",
    params: {
      fields: [
        "displayName",
        "id"
      ]
    }
  }
};


export function getIconUrl(icon: string, { baseUrl }: { baseUrl: string }) {
  return `${baseUrl}/images/orgunitgroup/${icon ?? "01.png"}`;
}


function IconSelector({
                        selected,
                        onChange,
                        error,
                        required,
                        ...props
                      }: { selected?: string, onChange: (value: string) => void, error?: { message?: string }, required?: boolean }) {

  const { baseUrl } = useConfig();
  const options = Array.from(Array(40).keys()).map((value) => ({
    label: <img alt={`${padStart((value + 1).toString(), 2, "0")}-image`}
                src={getIconUrl(`${padStart((value + 1).toString(), 2, "0")}.${(value + 1) < 26 ? "png" : "svg"}`, { baseUrl })} />,
    value: `${padStart((value + 1).toString(), 2, "0")}.${(value + 1) < 26 ? "png" : "svg"}`
  }));


  return (
    <SingleSelectField selected={selected} onChange={({ selected }: { selected: string }) => onChange(selected)}  {...props}
                       required={required}
                       label={i18n.t("Custom icon")}>
      {
        options.map(option => (
          <SingleSelectOption label={option.label} value={option.value} />
        ))
      }
    </SingleSelectField>
  );
}


function GroupSetSelector({
                            selected,
                            onChange,
                            error,
                            required,
                            ...props
                          }: { selected?: string, onChange: (value: string) => void, error?: { message?: string }, required?: boolean }) {
  const { loading, data } = useDataQuery(groupSetQuery);

  const options = useMemo(() => {
    if (data) {
      return (data?.groupSets as { organisationUnitGroupSets?: Record<string, any>[] })?.organisationUnitGroupSets?.map(({
                                                                                                                           displayName,
                                                                                                                           id
                                                                                                                         }) => ({
        label: displayName,
        value: id
      }));
    }
    return [];
  }, [data]);

  return (
    <SingleSelectField required={required} error={Boolean(error)} validationText={error?.message} {...props} label={i18n.t("Group set")}
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


function FacilityLayerConfigModal({
                                    onChange,
                                    value,
                                    open,
                                    onClose
                                  }: { onChange: (value: FacilityMapLayer) => void; value: FacilityMapLayer, open: boolean, onClose: () => void }) {
  const form = useForm<FacilityMapLayer>({
    defaultValues: value
  });
  const [legendType, setLegendType] = useState(value.style?.icon ? "custom" : "groupSet");

  const onLegendTypeChange = useCallback(
    (value: string) => () => {
      if (value === "groupSet") {
        form.setValue("style.icon", undefined);
      } else {
        form.setValue("style.groupSet", undefined);
      }
      setLegendType(value);
    },
    []
  );

  const onUpdate = useCallback(
    (value: FacilityMapLayer) => {
      onChange(value);
    },
    [onChange]
  );


  return (
    <FormProvider {...form}>
      <Modal position="center" open={open} onClose={onClose}>
        <ModalTitle>{i18n.t("Facility Layer Configuration")}</ModalTitle>
        <ModalContent>
          <div className="column gap-16">
            <div className="row gap-16">
              <Radio checked={legendType === "groupSet"} label={i18n.t("Group set icons")} name="groupSet" value="groupSet"
                     onChange={onLegendTypeChange("groupSet")} />
              <Radio checked={legendType === "custom"} label={i18n.t("Custom icon")} name="custom" value="custom"
                     onChange={onLegendTypeChange("custom")} />
            </div>
            {
              legendType === "groupSet" && (<Controller
                name="style.groupSet"
                rules={{
                  required: i18n.t("Group set is required")
                }}
                render={({ field, fieldState }) => (
                  <GroupSetSelector onChange={field.onChange} required selected={field.value} error={fieldState.error} />)}

              />)
            }
            {
              legendType === "custom" && (<Controller
                rules={{
                  required: i18n.t("Icon is required")
                }}
                name="style.icon"
                render={({ field, fieldState }) => (
                  <IconSelector onChange={field.onChange} required selected={field.value} error={fieldState.error} />)}
              />)
            }
          </div>
        </ModalContent>
        <ModalActions>
          <ButtonStrip>
            <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
            <Button onClick={form.handleSubmit(onUpdate)} primary>{i18n.t("Save")}</Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    </FormProvider>
  );
}


export default function FacilityLayer() {
  const name = "map.coreLayers.facilityLayer";
  const { field, fieldState } = useController({
    name
  });
  const { setValue } = useFormContext();
  const [legendType, setLegendType] = useState(field.value.style?.icon ? "custom" : "groupSet");

  const onEnableToggle = useCallback(
    ({ checked }) => {
      field.onChange({
        ...value,
        enabled: checked
      });
    },
    []
  );

  const onLegendTypeChange = useCallback(
    (value: string) => () => {
      if (value === "groupSet") {
        setValue(`${name}.style.icon`, undefined);
      } else {
        setValue(`${name}.style.groupSet`, undefined);
      }
      setLegendType(value);
    },
    []
  );

  const { error } = fieldState;
  const { value } = field ?? {};

  return (
    <div className="w-100">
      <Field label={i18n.t("Facility layer")} fullWidth error={!!error} validationText={error?.message}>
        <div style={error ? { borderColor: colors.red600 } : {}} className="thematic-config-card">
          <div className="row space-between align-center">
            <h4 className="thematic-config-card-header"></h4>
            <CheckboxField checked={value?.enabled} onChange={onEnableToggle} />
          </div>
          {value?.enabled && (
            <div className="column gap-16">
              <div className="row gap-16">
                <Radio checked={legendType === "groupSet"} label={i18n.t("Group set icons")} name="groupSet" value="groupSet"
                       onChange={onLegendTypeChange("groupSet")} />
                <Radio checked={legendType === "custom"} label={i18n.t("Custom icon")} name="custom" value="custom"
                       onChange={onLegendTypeChange("custom")} />
              </div>
              {
                legendType === "groupSet" && (<Controller
                  name={`${name}.style.groupSet`}
                  rules={{
                    required: i18n.t("Group set is required")
                  }}
                  render={({ field, fieldState }) => (
                    <GroupSetSelector onChange={field.onChange} required selected={field.value} error={fieldState.error} />)}

                />)
              }
              {
                legendType === "custom" && (<Controller

                  rules={{
                    required: i18n.t("Icon is required")
                  }}
                  name={`${name}.style.icon`}
                  render={({ field, fieldState }) => (
                    <IconSelector onChange={field.onChange} required selected={field.value} error={fieldState.error} />)}
                />)
              }
            </div>
          )}
        </div>
      </Field>
    </div>
  );
}
