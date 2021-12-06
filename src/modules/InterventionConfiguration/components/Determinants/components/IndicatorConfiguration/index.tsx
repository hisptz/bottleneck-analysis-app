import i18n from "@dhis2/d2-i18n";
import { CustomInput } from "@hisptz/react-ui";
import { filter, findIndex } from "lodash";
import React from "react";
import { useParams } from "react-router-dom";
import "./SelectedItemComponent.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { uid } from "../../../../../../shared/utils/generators";
import { InterventionDirtySelector } from "../../../../state/data";
import { SelectedIndicator } from "../../../../state/edit";

export default function IndicatorConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [selectedIndicator, setSelectedIndicator] = useRecoilState(SelectedIndicator(id));
  const legendDefinitions = useRecoilValue(
    InterventionDirtySelector({
      id,
      path: ["dataSelection", "legendDefinitions"],
    })
  );
  const filteredLegendDefinitions = filter(legendDefinitions, (legendDefinition) => {
    return !legendDefinition.default;
  });

  const onChange = (key: string, value: any) => {
    setSelectedIndicator((prevValue) => {
      if (prevValue) {
        return {
          ...prevValue,
          id: prevValue?.id ?? uid(),
          [key]: value,
        };
      }
    });
  };

  return (
    <div className="indicator-configuration-area">
      <div className="selected-item-header">
        <h3>{selectedIndicator?.name}</h3>
      </div>
      <div className="selected-item-body">
        <CustomInput
          input={{
            onChange: (value) => {
              onChange("label", value);
            },
            value: selectedIndicator?.label,
            name: "label",
            label: "Display Label",
          }}
          valueType={"TEXT"}
        />
        <p>{i18n.t("Legends (Only applicable to sub level analysis)")}</p>
        {filteredLegendDefinitions?.map((legendDefinition: any | undefined) => {
          const legendIndex = findIndex(selectedIndicator?.legends, (legend) => legend.id === legendDefinition.id);
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
