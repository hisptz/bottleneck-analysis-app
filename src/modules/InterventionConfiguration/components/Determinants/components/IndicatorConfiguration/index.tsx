import i18n from "@dhis2/d2-i18n";
import { CustomInput } from "@hisptz/react-ui";
import { filter, findIndex, get, set } from "lodash";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import "./SelectedItemComponent.css";
import { useRecoilValue } from "recoil";
import { Legend } from "../../../../../../shared/interfaces/interventionConfig";
import { SelectedDeterminantIndex, SelectedIndicatorIndex, UseShortName } from "../../../../state/edit";
import { Field, InputField } from "@dhis2/ui";


function autoSetAdjacentValues(data: any, index: number) {
  const newData = [...data];
  const updatedValue = newData[index];
  const previousValueIndex = index - 1;
  const nextValueIndex = index + 1;

  if (previousValueIndex >= 0) {
    set(newData, `${previousValueIndex}.startValue`, updatedValue?.endValue);
  }
  if (nextValueIndex < newData.length) {
    set(newData, `${nextValueIndex}.endValue`, updatedValue?.startValue);
  }
  return newData;
}

function editAtIndex(index: number, value: any, data: any) {
  const newData = [...data];
  set(newData, index, value);
  return autoSetAdjacentValues(newData, index);
}

export default function IndicatorConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const selectedItemIndex = useRecoilValue(SelectedIndicatorIndex(id));
  const selectedGroupIndex = useRecoilValue(SelectedDeterminantIndex(id));
  const useShortName = useRecoilValue(UseShortName(id));
  const formName = `dataSelection.groups.${selectedGroupIndex}.items.${selectedItemIndex}`;
  const { watch, setValue, formState, register, control } = useFormContext();
  const selectedIndicator = watch(formName);
  const legendDefinitions = watch("dataSelection.legendDefinitions");
  const watchLabel = watch(`${formName}.label`);
  const filteredLegendDefinitions = filter(legendDefinitions, (legendDefinition) => {
    return !legendDefinition.isDefault;
  });


  useEffect(() => {
    register(`${formName}.label`, {
      required: i18n.t("Label is required")
    });

  }, [watchLabel]);

  const onChange = (key: string, value: any) => {
    setValue(`${formName}.${key}`, value);
  };

  const hasError = get(formState?.errors, `${formName}.label`);
  const errorMessage = hasError?.message;

  return (
    <div className="indicator-configuration-area">
      <div className="selected-item-header">
        <h3>{selectedIndicator?.name}</h3>
      </div>
      <div className="selected-item-body pt-8 column gap-16">
        <InputField
          disabled={useShortName}
          label={i18n.t("Label")}
          error={hasError}
          validationText={errorMessage}
          name={`${formName}.label`}
          value={selectedIndicator?.label}
          onChange={({ value }: { value: string }) => onChange("label", value)}
        />
        <Field label={i18n.t("Legends (Only applicable to sub level analysis)")}>
          {filteredLegendDefinitions?.map((legendDefinition: any | undefined) => {
            const legendIndex = findIndex(selectedIndicator?.legends, (legend: Legend) => legend.id === legendDefinition.id);
            const legend = {
              ...selectedIndicator?.legends[legendIndex],
              legendDefinitionId: legendDefinition?.id,
              id: legendDefinition?.id,
              startValue: `${selectedIndicator?.legends[legendIndex]?.startValue}`,
              endValue: `${selectedIndicator?.legends[legendIndex]?.endValue}`
            };
            return (
              <CustomInput
                key={`${selectedIndicator?.id}-${legendDefinition?.id}`}
                input={{
                  onChange: (value: any) => {
                    const modifiedLegendList = [...(selectedIndicator?.legends ?? [])];
                    onChange("legends", [...editAtIndex(legendIndex, value, modifiedLegendList)]);
                  },
                  value: legend,
                  name: `legend-${legendDefinition?.id}`,
                  label: "Legend"
                }}
                valueType={"LEGEND_MIN_MAX"}
                legendDefinition={legendDefinition}
              />
            );
          })}
        </Field>
      </div>
    </div>
  );
}
