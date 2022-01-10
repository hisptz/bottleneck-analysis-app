import i18n from "@dhis2/d2-i18n";
import { filter, findIndex } from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import "./SelectedItemComponent.css";
import { useRecoilValue } from "recoil";
import { Legend } from "../../../../../../shared/interfaces/interventionConfig";
import { SelectedDeterminantIndex, SelectedIndicatorIndex, UseShortName } from "../../../../state/edit";
import { InputField } from "@dhis2/ui";
import { CustomInput } from "@hisptz/react-ui";

export default function IndicatorConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const selectedItemIndex = useRecoilValue(SelectedIndicatorIndex(id));
  const selectedGroupIndex = useRecoilValue(SelectedDeterminantIndex(id));
  const useShortName = useRecoilValue(UseShortName(id));

  const { watch, setValue } = useFormContext();
  const selectedIndicator = watch(`groups[${selectedGroupIndex}].items[${selectedItemIndex}]`);
  const form = useForm({
    defaultValues: {
      ...selectedIndicator,
    },
  });

  const legendDefinitions = watch("legendDefinitions");
  const watchLabel = watch(`dataSelection.groups[${selectedGroupIndex}].items[${selectedItemIndex}].label`);
  const filteredLegendDefinitions = filter(legendDefinitions, (legendDefinition) => {
    return !legendDefinition.isDefault;
  });

  const [labelError, setLabelError] = useState("");

  useEffect(() => {
    if (!watchLabel) {
      setLabelError(i18n.t("Indicator label is required"));
    } else {
      setLabelError("");
    }
  }, [watchLabel]);

  const onChange = (key: string, value: any) => {
    setValue(`groups[${selectedGroupIndex}].items[${selectedItemIndex}].${key}`, value);
  };

  useEffect(() => {
    form.reset(selectedIndicator);
    return () => {
      form.handleSubmit((data) => {
        setValue(`groups[${selectedGroupIndex}].items[${selectedItemIndex}]`, data);
      })();
    };
  }, [form, selectedGroupIndex, selectedIndicator, selectedItemIndex, setValue]);

  return (
    <FormProvider {...form}>
      <div className="indicator-configuration-area">
        <div className="selected-item-header">
          <h3>{selectedIndicator?.name}</h3>
        </div>
        <div className="selected-item-body pt-8">
          <Controller
            name={`label`}
            render={({ field, fieldState, formState }) => {
              return (
                <InputField
                  disabled={useShortName}
                  error={fieldState.error}
                  validationText={fieldState?.error?.message}
                  value={field.value}
                  onChange={({ value }: { value: string }) => {
                    field.onChange(value);
                  }}
                  label={i18n.t("Display Label")}
                  required
                />
              );
            }}
          />
          <p>{i18n.t("Legends (Only applicable to sub level analysis)")}</p>
          {filteredLegendDefinitions?.map((legendDefinition: any | undefined) => {
            const legendIndex = findIndex(selectedIndicator?.legends, (legend: Legend) => legend.id === legendDefinition.id);
            return (
              <Controller
                key={`${selectedIndicator?.id}-${legendDefinition?.id}`}
                render={({ field, fieldState }) => {
                  const legend = {
                    ...field.value,
                    legendDefinitionId: legendDefinition?.id,
                    id: legendDefinition?.id,
                    startValue: `${field.value?.startValue}`,
                    endValue: `${field.value?.endValue}`,
                  };
                  return (
                    <CustomInput
                      input={{
                        onChange: (value: any) => {
                          field.onChange({
                            id: value.id,
                            startValue: parseInt(value?.startValue),
                            endValue: parseInt(value?.endValue),
                          });
                        },
                        value: legend,
                        label: "Legend",
                        name: "",
                      }}
                      valueType={"LEGEND_MIN_MAX"}
                      legendDefinition={legendDefinition}
                    />
                  );
                }}
                name={`legends[${legendIndex}]`}
              />
            );
          })}
        </div>
      </div>
    </FormProvider>
  );
}
