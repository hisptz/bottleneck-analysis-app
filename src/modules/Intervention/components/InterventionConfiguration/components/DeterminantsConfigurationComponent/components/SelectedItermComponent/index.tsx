import { CustomInput } from "@hisptz/react-ui";
import React from "react";
import "./SelectedItemComponent.css";

export default function SelectedItermComponent() {
  return (
    <div className="selected-item">
      <div className="selected-item-header">
        <h3>Availability of Iron Follic Acid</h3>
      </div>
      <div className="selected-item-body">
        <CustomInput
          input={{
            onChange: function (payload: { value: any; name: string }): void {
              throw new Error("Function not implemented.");
            },
            value: "Enter Display Label",
            name: "inputName",
            label: "Display Label",
          }}
          valueType={"TEXT"}
        />
        <p>Legends(Only applicable to sub level anaalysis)</p>
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
