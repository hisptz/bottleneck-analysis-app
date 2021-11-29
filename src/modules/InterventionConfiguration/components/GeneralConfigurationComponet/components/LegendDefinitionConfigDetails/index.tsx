import React from "react";
import "./LegendDefinitionConfig.css";
import { CustomInput } from "@hisptz/react-ui";

export function LegendDefinitionConfigDetails() {
  return (
    <div className="legendDefinitonConfig">
      <p>Legend Definitions(Applicable across all indicators)</p>
      <CustomInput
        input={{
          onChange: function (payload: { value: any; name: string }): void {
            throw new Error("Function not implemented.");
          },
          value: {
            name: "Target achieved/ on track",
            color: "#147e14",
          },
          name: "legend-definition",
          label: "",
        }}
        valueType={"LEGEND_DEFINITION"}
      />
      <CustomInput
        input={{
          onChange: function (payload: { value: any; name: string }): void {
            throw new Error("Function not implemented.");
          },
          value: {
            name: "Progress, but more effort required",
            color: "#fafa75",
          },
          name: "legend-definition",
          label: "",
        }}
        valueType={"LEGEND_DEFINITION"}
      />
      <CustomInput
        input={{
          onChange: function (payload: { value: any; name: string }): void {
            throw new Error("Function not implemented.");
          },
          value: {
            name: "Not on track",
            color: "#ff0303",
          },
          name: "legend-definition",
          label: "",
        }}
        valueType={"LEGEND_DEFINITION"}
      />
      <CustomInput
        input={{
          onChange: function (payload: { value: any; name: string }): void {
            throw new Error("Function not implemented.");
          },
          value: {
            name: "Not Applicable",
            color: "#838c80",
          },
          name: "legend-definition",
          label: "",
        }}
        valueType={"LEGEND_DEFINITION"}
      />
      <CustomInput
        input={{
          onChange: function (payload: { value: any; name: string }): void {
            throw new Error("Function not implemented.");
          },
          value: {
            name: "No data",
            color: "#cfd4cd",
          },
          name: "legend-definition",
          label: "",
        }}
        valueType={"LEGEND_DEFINITION"}
      />
    </div>
  );
}
