import { CustomInput } from "@hisptz/react-ui";
import React from "react";
import "./InterventionConfigDetails.css";
import { TextArea, SingleSelect, SingleSelectOption, IconInfo24 } from "@dhis2/ui";

export default function InterventionConfigDetails() {
  return (
    <div className="interventionConfig">
      <CustomInput
        input={{
          onChange: function (payload: { value: any; name: string }): void {
            throw new Error("Function not implemented.");
          },
          value: "Content",
          name: "inputName",
          label: "Intervention name",
        }}
        valueType={"TEXT"}
      />
      <p>Description</p>
      <TextArea name="textAreaName" onBlur={() => {}} onChange={() => {}} onFocus={() => {}} placeholder="Content" />
      <p>Bottleneck Period type</p>
      <SingleSelect className="select" onChange={() => {}} placeholder="Yearly">
        <SingleSelectOption label="2021" value="1" />
        <SingleSelectOption label="2022" value="2" />
        <SingleSelectOption label="2023" value="3" />
      </SingleSelect>
      <div className="subLevelAnalysisInfo">
        <IconInfo24 />
        <div className="subLevelAnalysis-info-summary">
          <p
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "0.3%",
            }}>
            Sub level analysis notice
          </p>
          <p>
            By Default sub level analysis will display data for the immediate user sub organisation unit, however given implementation this may not be the case
            and specific level can be selected instead.
          </p>
        </div>
      </div>
      <p>Sub level analysis level</p>
      <SingleSelect className="select" onChange={() => {}} placeholder="Facility">
        <SingleSelectOption label="MOH" value="1" />
        <SingleSelectOption label="HHIS" value="2" />
        <SingleSelectOption label="CIR" value="3" />
      </SingleSelect>
    </div>
  );
}
