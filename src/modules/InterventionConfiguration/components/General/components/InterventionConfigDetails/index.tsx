import i18n from "@dhis2/d2-i18n";
import { CheckboxField, InputField, NoticeBox, SingleSelectField, SingleSelectOption, TextAreaField } from "@dhis2/ui";
import React from "react";
import "./InterventionConfigDetails.css";

export default function InterventionConfigDetails() {
  return (
    <div className="interventionConfig">
      <InputField name={"name"} label={"Intervention Name"} />
      <TextAreaField label={i18n.t("Description")} name="description" onBlur={() => {}} onChange={() => {}} onFocus={() => {}} placeholder="Content" />

      <SingleSelectField name={"periodType"} label={i18n.t("Bottleneck Period Type")} onChange={() => {}} placeholder="Yearly">
        <SingleSelectOption label="2021" value="1" />
        <SingleSelectOption label="2022" value="2" />
        <SingleSelectOption label="2023" value="3" />
      </SingleSelectField>
      <div className={"pt-16"}>
        <NoticeBox title={i18n.t("Sub level analysis notice")}>
          {i18n.t(
            "By Default sub level analysis will display data for the immediate user sub organisation unit, however given implementation this may not be the case and\n" +
              "        specific level can be selected instead."
          )}
        </NoticeBox>
      </div>
      <CheckboxField label={i18n.t("Set specific level for sub level analysis")} name={"specific-sub-level-check"} />

      <SingleSelectField label={i18n.t("Sub level analysis level")} className="select" onChange={() => {}} placeholder="Facility">
        <SingleSelectOption label="MOH" value="1" />
        <SingleSelectOption label="HHIS" value="2" />
        <SingleSelectOption label="CIR" value="3" />
      </SingleSelectField>
    </div>
  );
}
