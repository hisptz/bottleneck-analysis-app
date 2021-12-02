import i18n from "@dhis2/d2-i18n";
import { CustomInput } from "@hisptz/react-ui";
import React from "react";
import { useParams } from "react-router-dom";
import "./SelectedItemComponent.css";
import { useRecoilValue } from "recoil";
import { SelectedIndicator } from "../../../../state/edit";

export default function IndicatorConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const selectedIndicator = useRecoilValue(SelectedIndicator(id));
  return (
    <div className="indicator-configuration-area">
      <div className="selected-item-header">
        <h3>{selectedIndicator?.name}</h3>
      </div>
      <div className="selected-item-body">
        <CustomInput
          input={{
            onChange: function (payload: { value: any; name: string }): void {
              throw new Error("Function not implemented.");
            },
            value: selectedIndicator?.label,
            name: "label",
            label: "Display Label",
          }}
          valueType={"TEXT"}
        />
        <p>{i18n.t("Legends (Only applicable to sub level analysis)")}</p>
        <CustomInput
          input={{
            onChange: function (payload: { value: any; name: string }): void {
              throw new Error("Function not implemented.");
            },
            value: {
              id: "legend-id",
              legendDefinitionId: "legend-definition-id",
              startValue: 1,
              endValue: 100,
            },
            name: "legend-definition",
            label: "Legend",
          }}
          valueType={"LEGEND_MIN_MAX"}
          legendDefinition={{ name: "Target Achieved/ on Track", id: "legend-defn-id", color: "#147e14" }}
        />
        <CustomInput
          input={{
            onChange: function (payload: { value: any; name: string }): void {
              throw new Error("Function not implemented.");
            },
            value: {
              id: "legend-id",
              legendDefinitionId: "legend-definition-id",
              startValue: 1,
              endValue: 100,
            },
            name: "legend-definition",
            label: "Legend",
          }}
          valueType={"LEGEND_MIN_MAX"}
          legendDefinition={{ name: "Progress ,but more effort required", id: "legend-defn-id", color: "#fcef72" }}
        />
        <CustomInput
          input={{
            onChange: function (payload: { value: any; name: string }): void {
              throw new Error("Function not implemented.");
            },
            value: {
              id: "legend-id",
              legendDefinitionId: "legend-definition-id",
              startValue: 1,
              endValue: 100,
            },
            name: "legend-definition",
            label: "Legend",
          }}
          valueType={"LEGEND_MIN_MAX"}
          legendDefinition={{ name: "Not on Track", id: "legend-defn-id", color: "#f21a02" }}
        />
      </div>
    </div>
  );
}
