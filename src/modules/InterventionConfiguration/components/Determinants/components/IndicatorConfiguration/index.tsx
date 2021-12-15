import i18n from "@dhis2/d2-i18n";
import { InputField } from "@dhis2/ui";
import { CustomInput } from "@hisptz/react-ui";
import { filter, findIndex } from "lodash";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import "./SelectedItemComponent.css";
import { useRecoilValue } from "recoil";
import { Legend } from "../../../../../../shared/interfaces/interventionConfig";
import { SelectedDeterminantIndex, SelectedIndicatorIndex } from "../../../../state/edit";

export default function IndicatorConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const selectedItemIndex = useRecoilValue(SelectedIndicatorIndex(id));
  const selectedGroupIndex = useRecoilValue(SelectedDeterminantIndex(id));
  const { watch, setValue } = useFormContext();
  const selectedIndicator = watch(`dataSelection.groups[${selectedGroupIndex}].items[${selectedItemIndex}]`);
  const legendDefinitions = watch("dataSelection.legendDefinitions");
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
    setValue(`dataSelection.groups[${selectedGroupIndex}].items[${selectedItemIndex}].${key}`, value);
  };

  return (
    <div className="indicator-configuration-area">
      <div className="selected-item-header">
        <h3>{selectedIndicator?.name}</h3>
      </div>
      <div className="selected-item-body pt-8">
        <InputField
          error={Boolean(labelError)}
          validationText={labelError}
          value={selectedIndicator?.label}
          onChange={({ value }: { value: string }) => {
            onChange("label", value);
          }}
          label={i18n.t("Display Label")}
          required
          name={"label"}
        />
        <p>{i18n.t("Legends (Only applicable to sub level analysis)")}</p>
        {filteredLegendDefinitions?.map((legendDefinition: any | undefined) => {
          const legendIndex = findIndex(selectedIndicator?.legends, (legend: Legend) => legend.id === legendDefinition.id);
          const legend = {
            ...selectedIndicator?.legends[legendIndex],
            legendDefinitionId: legendDefinition?.id,
            id: legendDefinition?.id,
            startValue: `${selectedIndicator?.legends[legendIndex]?.startValue}`,
            endValue: `${selectedIndicator?.legends[legendIndex]?.endValue}`,
          };
          return (
            <CustomInput
              key={`${selectedIndicator?.id}-${legendDefinition?.id}`}
              input={{
                onChange: (value: any) => {
                  const modifiedLegendList = [...(selectedIndicator?.legends ?? [])];
                  modifiedLegendList[legendIndex] = {
                    id: value.id,
                    startValue: parseInt(value?.startValue),
                    endValue: parseInt(value?.endValue),
                  };
                  onChange("legends", modifiedLegendList);
                },
                value: legend,
                name: "",
                label: "Legend",
              }}
              valueType={"LEGEND_MIN_MAX"}
              legendDefinition={legendDefinition}
            />
          );
        })}
      </div>
    </div>
  );
}
